import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
    ) {}

//新規作成
    async createPost(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const post = this.postsRepository.create({
            user_id: userId,
            ...createPostDto,
        });
        return await this.postsRepository.save(post);
    }

//全件取得
    async findAll(): Promise<Posts[]> {
        return this.postsRepository.find({
            order: { created_at: 'DESC' },
        });
    }

//IDで取得
    async findOne(id: string): Promise<Posts> {
        const post = await this.postsRepository.findOneBy({  id  });
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
                content: 'This is the first post.',
                tag: 'sample'
            },
            {
                title: 'second Post',
                content: 'This is the second post',
                tag: 'sample2'
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