import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { OneToMany } from 'typeorm';
import { PostTag } from '../../post-tags/entities/post-tags.entity';
import { QuestionTag } from '../../question-tags/entities/question-tags.entity';
import { ProfileTag } from '../../profile-tags/entities/profile-tags.entity';

@Entity('TAGS')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    tag!: string;

    @OneToMany(() => PostTag, (postTag) => postTag.tag)
    postTags!: PostTag[];

    @OneToMany(() => QuestionTag, (questionTag) => questionTag.tag)
    questionTags!: QuestionTag[];

    @OneToMany(() => ProfileTag, (profileTag) => profileTag.tag)
    profileTags!: ProfileTag[];
}