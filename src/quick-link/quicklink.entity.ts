import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class QuickLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actualLink: string;

  @Column()
  shortLink: string;

  @Column({ select: false, nullable: true })
  redirectLink?: string;

  @ManyToOne(() => User, (user) => user.quickLinks)
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @BeforeLoad()
  // generateRedirectLink() {
  //   this.redirectLink = `https://quicklinks.com/${this.shortLink}`;
  // }
}
