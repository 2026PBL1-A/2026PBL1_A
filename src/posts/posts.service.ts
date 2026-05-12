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

//全件取得
    async findAll(): Promise<Posts[]> {
        return this.postsRepository.find({
            order: { created_at: 'DESC' },
        });
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