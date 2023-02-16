import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @BeforeLoad()
  // generateRedirectLink() {
  //   this.redirectLink = `https://quicklinks.com/${this.shortLink}`;
  // }
}
