import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profiles } from '../../profiles/entities/profiles.entity';
import { Tags } from '../../tags/entities/tags.entity';

@Entity('PROFILE_TAGS')
export class ProfileTags {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  profile_id: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  tag_id: string;

  @ManyToOne(() => Profiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profiles;

  @ManyToOne(() => Tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tags;
}