import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { PostTags } from '../post-tags/entities/post-tags.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
        @InjectRepository(PostTags)
        private postTagsRepository: Repository<PostTags>,
    ) {}

    //新規作成
    async createPost(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const post = this.postsRepository.create({
            user_id: userId,
            title: createPostDto.title,
            content: createPostDto.content,
            work_url: createPostDto.work_url,
        });
        const savedPost = await this.postsRepository.save(post);

        // タグがあれば関連付ける
        if (createPostDto.tag_ids && createPostDto.tag_ids.length > 0) {
            const postTags = createPostDto.tag_ids.map(tag_id =>
                this.postTagsRepository.create({
                    post_id: savedPost.id,
                    tag_id: tag_id,
                })
            );
            await this.postTagsRepository.save(postTags);
        }

        return savedPost;
    }

    // 🌝投稿編集
    async updatePost(
        id: string,
        updatePostDto: CreatePostDto,
        userId: string,
    ): Promise<Posts> {

    // ☃️投稿取得
        const post = await this.postsRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new NotFoundException('投稿が見つかりません');
        }

    // 🕒投稿者本人か確認
        if (post.user_id !== userId) {
            throw new ForbiddenException();
        }

        post.title = updatePostDto.title;
        post.content = updatePostDto.content;
        post.work_url = updatePostDto.work_url;

        await this.postsRepository.save(post);
    // 🦧タグ更新（既存タグ削除→新規タグ追加）
        await this.postTagsRepository.delete({
            post_id: id,
        });

        if (updatePostDto.tag_ids && updatePostDto.tag_ids.length > 0) {

            const postTags = updatePostDto.tag_ids.map(tag_id =>
                this.postTagsRepository.create({
                    post_id: id,
                    tag_id,
                })
            );

            await this.postTagsRepository.save(postTags);
        }

        return this.findOne(id);
    }

    // 🚨投稿削除
    async deletePost(
        id: string,
        userId: string,
    ): Promise<{ message: string }> {

    // 投稿取得
    const post = await this.postsRepository.findOne({
        where: { id },
    });

    // 投稿が存在しない
    if (!post) {
        throw new NotFoundException('投稿が見つかりません');
    }

    // 投稿者本人か確認
    if (post.user_id !== userId) {
        throw new ForbiddenException();
    }

    // 投稿削除
    await this.postsRepository.delete({
        id,
    });

    return {
        message: '投稿を削除しました',
    };
}

    //全件取得（オプション: タグで絞り込み可能）
    async findAll(tagIds: string[] = []): Promise<Posts[]> {
        // 重複排除と空文字列をフィルタリング
        const uniqueTagIds = [...new Set(tagIds.filter(Boolean))];

        // タグ指定なし: 全投稿をタグ情報付きで返す（降順）
        if (!uniqueTagIds.length) {
            return this.postsRepository.find({
                order: { created_at: 'DESC' },
                relations: {
                    postTags: {
                        tag: true,
                    },
                },
            });
        }

        // 指定タグを「いずれか1つでも含む」投稿IDをサブクエリで抽出
        const subQuery = this.postsRepository
            .createQueryBuilder('filteredPost')     // サブクエリのエイリアスを `filteredPost` に変更
            .select('DISTINCT filteredPost.id')     // 重複排除し、投稿IDだけ取得
            .innerJoin('filteredPost.postTags', 'filteredPostTag')      // 投稿とタグの中間テーブルを結合
            .where('filteredPostTag.tag_id IN (:...tagIds)', { tagIds: uniqueTagIds });     // 指定タグのいずれかを持つ投稿を抽出

        // サブクエリの投稿をすべて取得し、タグ情報も結合（降順）
        return this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.postTags', 'postTag')  // 投稿とタグの中間テーブルを結合してタグIDを取得（タグなし投稿も取得するため、LEFT JOIN）
            .leftJoinAndSelect('postTag.tag', 'tag')        // タグの詳細情報も結合
            .where(`post.id IN (${subQuery.getQuery()})`)   // サブクエリで抽出された投稿IDをもとに投稿を取得
            .setParameters(subQuery.getParameters())        // サブクエリのパラメータを引き継ぐ
            .orderBy('post.created_at', 'DESC')             // 作成日時の降順でソート
            .getMany();                                     // 結果を取得
    }

    // 文字列検索（複数キーワード対応、空白区切り / タイトル・本文・タグ名で部分一致 / AND / 大文字小文字区別なし）
    async searchPosts(keyword: string): Promise<Posts[]> {
        const keywords = keyword
            .trim()     // 前後の空白を削除
            .split(/\s+/)       // 空白で分割（複数キーワード対応）
            .filter(Boolean);       // 空文字列を除外

        // キーワードが空の場合は空配列を返す
        if (keywords.length === 0) {
            return [];
        }

        // クエリビルダーを使用して、キーワードがタイトル・本文・タグ名のいずれかに部分一致する投稿を検索
        let queryBuilder = this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.postTags', 'postTag')      // 投稿とタグの中間テーブルを結合してタグIDを取得
            .leftJoinAndSelect('postTag.tag', 'tag');       // タグの詳細情報も結合

        // 各キーワードについて、タイトル・本文・タグ名のいずれかに部分一致する条件を AND で繋ぐ
        keywords.forEach((keyword, index) => {
            const likeKeyword = `%${keyword.toLowerCase()}%`;       // キーワードを小文字化
            
            // タイトル・本文・タグ名のいずれかに部分一致する条件を追加
            queryBuilder = queryBuilder
                .andWhere(
                    `(LOWER(post.title) LIKE :keyword${index} OR LOWER(post.content) LIKE :keyword${index} OR LOWER(tag.tag) LIKE :keyword${index})`
                )
                .setParameter(`keyword${index}`, likeKeyword);      // パラメータ名にインデックスを付与して重複を避ける
        });

        return queryBuilder
            .distinct(true)
            .orderBy('post.created_at', 'DESC')
            .getMany();
    }

    //IDで取得
    async findOne(id: string): Promise<Posts> {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: {
                postTags: {
                    tag: true,
                },
            },
        });
        if (!post) {
            throw new NotFoundException('投稿が見つかりません');
        }
        return post;
    }

    //仮データ
    async seed(): Promise<Posts[]> {
        const userId = '51c4f76f-8a97-4fba-a634-ccd56444640e'; // 仮のユーザーID
        const samples: CreatePostDto[] = [
            {
                title: 'first Post',
                content: 'This is the first post.'
            },
            {
                title: 'second Post',
                content: 'This is the second post'
            },
        ];
        const posts = samples.map(sample => 
            this.postsRepository.create({
                user_id: userId,
                ...sample,
            })
        );
        return this.postsRepository.save(posts);
    }
}