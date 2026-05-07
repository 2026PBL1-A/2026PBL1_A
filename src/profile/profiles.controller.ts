import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profiles.service';

// userIdを取得するためのインターフェース
interface AuthenticatedRequest extends Request {
	user: { userId: string };
}

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

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
}
