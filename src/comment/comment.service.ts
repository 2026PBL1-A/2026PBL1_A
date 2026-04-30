import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    
    // 投稿IDに基づいて全てのコメントを取得する
    async findAll(id: string) {
        return this.commentRepository.find({ 
            relations: {'post': true},
            where: { 
                post: { 
                    id: id 
                }
            }
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
        const samplecomment: CreateCommentDto[] = [
            { comment: 'これはサンプルコメント1です' },
            { comment: 'これはサンプルコメント2です' },
            { comment: 'これはサンプルコメント3です' },
        ];
        return this.commentRepository.save(samplecomment);
    }
    
}