import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { QuestionImagesService } from './question-images.service';

@Controller('question-images')
export class QuestionImagesController {
    constructor(
        private readonly questionImagesService: QuestionImagesService,
    ) {}

    /**
     * 画像ファイルをアップロードして保存
     * POST /question-images/upload/:questionId
     */
    @Post('upload/:questionId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/questions',
                filename: (req, file, callback) => {
                    const uniqueName =
                        randomUUID() + extname(file.originalname);
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async upload(
        @Param('questionId') questionId: string,

        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    // 最大5MB
                    new MaxFileSizeValidator({
                        maxSize: 5 * 1024 * 1024,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        // DBに保存するURL
        const imageUrl = `/uploads/questions/${file.filename}`;

        return await this.questionImagesService.create(
            questionId,
            imageUrl,
        );
    }

    // 手動でURLを登録
    @Post()
    async create(
        @Body()
        body: {
            questionId: string;
            imageUrl: string;
            sortOrder?: number 
        },
    ) {
        return await this.questionImagesService.create(
            body.questionId,
            body.imageUrl,
            body.sortOrder,
        );
    }

    // 質問の画像一覧取得
    @Get('question/:questionId')
    async findByQuestionId(
        @Param('questionId') questionId: string
    ) {
        return await this.questionImagesService.findByQuestionId(
            questionId,
        );
    }

    // 画像削除
    @Delete(':id')
    async remove(
        @Param('id') id: string
    ) {
        return await this.questionImagesService.remove(id);
    }
}