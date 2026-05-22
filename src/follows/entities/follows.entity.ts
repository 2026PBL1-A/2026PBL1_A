import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';

// Followsテーブルに対応するエンティティクラス
@Entity('FOLLOWS')
export class Follows {
	@PrimaryColumn({ type: 'varchar', length: 36 })
	follower_id!: string;

	@PrimaryColumn({ type: 'varchar', length: 36 })
	following_id!: string;

	@ManyToOne(() => Users, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'follower_id' })
	follower!: Users;

	@ManyToOne(() => Users, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'following_id' })
	following!: Users;
}