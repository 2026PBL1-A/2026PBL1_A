import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { OneToMany } from 'typeorm';
import { PostTags } from '../../post-tags/entities/post-tags.entity';
import { QuestionTags } from '../../question-tags/entities/question-tags.entity';
import { ProfileTags } from '../../profile-tags/entities/profile-tags.entity';

@Entity('TAGS')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    tag!: string;

    @OneToMany(() => PostTags, (postTags) => postTags.tag)
    postTags!: PostTags[];

    @OneToMany(() => QuestionTags, (questionTags) => questionTags.tag)
    questionTags!: QuestionTags[];

    @OneToMany(() => ProfileTags, (profileTags) => profileTags.tag)
    profileTags!: ProfileTags[];
}