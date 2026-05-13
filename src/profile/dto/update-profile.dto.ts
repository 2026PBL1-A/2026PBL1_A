import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

// プロフィール更新時に受け取る項目を定義するDTO
// username は USERS.username、bio は PROFILES.bio を更新する
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tag_ids?: string[];
}