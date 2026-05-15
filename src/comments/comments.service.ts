import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateCommentDto} from './dto/create-comment.dto';
import { Comments } from './entities/comments.entity';
import { Users } from '../users/entities/users.entity';
import { Posts } from '../posts/entities/posts.entity';

//commentテーブルに対するデータ操作を担当するサービス
@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments)
        private readonly commentRepository: Repository<Comments>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
    ) {}

    // DTOをCommentエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createCommentDto: CreateCommentDto) {
        const post = await this.postsRepository.findOneBy({ id: createCommentDto.postId });
        const user = await this.userRepository.findOneBy({ id: createCommentDto.userId });

        if (!post || !user) {
            throw new Error('指定された投稿IDまたはユーザーIDが存在しません');
        }

        const comment = this.commentRepository.create({ comment: createCommentDto.comment, postId: post, userId: user  });
        return await this.commentRepository.save(comment);
    }
    
    //投稿IDに基づいて取得する
    async findByPostId(postId: string) {
        return this.commentRepository.find({ 
            relations: { postId: true, userId: true },
            where: { postId: { id: postId } },
            order: { created_at: 'ASC' }
        });
    }

    // コメントIDで1件取得する
    async findOne(id: string) {
        return this.commentRepository.findOneBy({ id });
    }

    // 必要なら。指定IDのコメント情報を更新し、その後最新の状態を取得して返す
    /*async update(id: string, updateCommentDto: CreateCommentDto) {
        await this.commentRepository.update(id, updateCommentDto);
        return this.findOne(id);
    }*/

    // 必要なら。指定IDのコメントを削除する
    /*async remove(id: string) {
        await this.commentRepository.delete(id);
    }*/

    // コメントのシードデータを作成する
    async seed() {
        const users = await this.userRepository.find({ take: 2 });
        const posts = await this.postsRepository.find({ take: 2 });

        if (users.length === 0 || posts.length === 0) {
            throw new Error('User または Post のデータが存在しないため、先に作ってください。');
        }

        const samplecomment: DeepPartial<Comments>[] = [
            { comment: 'これは投稿1のサンプルコメント1です', postId: { id: posts[0].id }, userId: { id: users[0].id }},
            { comment: 'これは投稿1のサンプルコメント2です', postId: { id: posts[0].id }, userId: { id: users[1].id }},
            { comment: 'これは投稿2のサンプルコメント1です', postId: { id: posts[1].id }, userId: { id: users[0].id }},
        ];
        return this.commentRepository.save(samplecomment);
    }
    
}