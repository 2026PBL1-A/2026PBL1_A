import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ProfilesService } from './profiles.service';

// userIdを取得するためのインターフェース
interface AuthenticatedRequest extends Request {
	user: { userId: string };
}

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profileService: ProfilesService) {}

	@UseGuards(JwtAuthGuard)
	@Post()//新規作成
	create(
		@Req() req: AuthenticatedRequest,
		@Body() dto: CreateProfileDto,
	) {
		const userId = req.user.userId;
		return this.profileService.create(dto, userId);
	}

	@UseGuards(JwtAuthGuard)
	@Patch()//プロフィール更新
	update(
		@Req() req: AuthenticatedRequest,
		@Body() dto: UpdateProfileDto,
	) {
		const userId = req.user.userId;
		return this.profileService.update(userId, dto);
	}

	@Get()//全件取得
	findAll() {
		return this.profileService.findAll();
	}

	@Get(':id')//指定したプロフィールを取得
	findOne(@Param('id') id: string) {
		return this.profileService.findOne(id);
	}

	// 指定したプロフィールに紐づく投稿一覧を取得
	@Get(':id/posts')
	getPosts(@Param('id') id: string) {
		return this.profileService.findPostsByProfileId(id);
	}

	// 指定したプロフィールに紐づく質問一覧を取得
	@Get(':id/questions')
	getQuestions(@Param('id') id: string) {
		return this.profileService.findQuestionsByProfileId(id);
	}

	// パスワードを更新
	@UseGuards(JwtAuthGuard)
	@Patch('password')
	updatePassword(
		@Req() req: AuthenticatedRequest,
		@Body() dto: UpdatePasswordDto,
	) {
		const userId = req.user.userId;
		return this.profileService.updatePassword(userId, dto);
	}
}
