import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCommentDto} from './dto/create-comment.dto';
import { Comment } from './entity/comment.entity';

//commentテーブルに対するデータ操作を担当するサービス
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    // DTOをCommentエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createCommentDto: CreateCommentDto) {
        const comment = this.commentRepository.create(createCommentDto);
        return this.commentRepository.save(comment);
    }
    
    // すべてのコメントを取得する
    async findAll() {
        return this.commentRepository.find();
    }

    // IDで1件取得する
    async findOne(id: string) {
        return this.commentRepository.findOneBy({ id });
    }
    
}