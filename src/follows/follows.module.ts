import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follows } from './entities/follows.entity';
import { Users } from '../users/entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Follows, Users])],
    controllers: [FollowsController],
    providers: [FollowsService],
    exports: [FollowsService],
})
export class FollowsModule {}
