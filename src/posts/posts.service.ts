import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { PostTag } from '../post-tags/entities/post-tags.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
        @InjectRepository(PostTag)
        private postTagRepository: Repository<PostTag>,
    ) {}

//新規作成
    async createPost(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const post = this.postsRepository.create({
            user_id: userId,
            title: createPostDto.title,
            content: createPostDto.content,
        });
        const savedPost = await this.postsRepository.save(post);

        // タグがあれば関連付ける
        if (createPostDto.tag_ids && createPostDto.tag_ids.length > 0) {
            const postTags = createPostDto.tag_ids.map(tag_id =>
                this.postTagRepository.create({
                    post_id: savedPost.id,
                    tag_id: tag_id,
                })
            );
            await this.postTagRepository.save(postTags);
        }

        return savedPost;
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

    //文字列検索（タイトル・本文・タグ名で部分一致, OR, 大文字小文字区別なし）
    async searchPosts(query: string): Promise<Posts[]> {
        const keyword = query.trim();

        // キーワードが空の場合は全件取得
        if (!keyword) {
            return [];
        }

        // 検索キーワードを小文字に変換し、部分一致のためにワイルドカードを追加
        const likeKeyword = `%${keyword.toLowerCase()}%`;

        // タイトル、本文、タグ名のいずれかにキーワードが部分一致する投稿を取得
        return this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.postTags', 'postTag')      // 投稿とタグの中間テーブルを結合して、タグIDを取得
            .leftJoinAndSelect('postTag.tag', 'tag')        // タグの詳細情報も結合

            // タイトル、本文、タグ名のいずれかにキーワードが部分一致する投稿を検索（LOWER関数で小文字化して大文字小文字区別なしに）
            .where('LOWER(post.title) LIKE :keyword', { keyword: likeKeyword })     // タイトルに部分一致
            .orWhere('LOWER(post.content) LIKE :keyword', { keyword: likeKeyword })     // 本文に部分一致
            .orWhere('LOWER(tag.tag) LIKE :keyword', { keyword: likeKeyword })      // タグ名に部分一致
            
            .distinct(true)     // 重複排除
            .orderBy('post.created_at', 'DESC')     // 作成日時の降順でソート
            .getMany();     // 結果を取得
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