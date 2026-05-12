import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from './entities/questions.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionTag } from '../question-tags/entities/question-tags.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Questions, QuestionTag]),
    ],
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService],
})
export class QuestionsModule {}