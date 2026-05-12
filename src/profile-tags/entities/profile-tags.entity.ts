import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../../profile/entities/profiles.entity';
import { Tag } from '../../tags/entities/tags.entity';

@Entity('PROFILE_TAGS')
export class ProfileTag {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  profile_id: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  tag_id: string;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}