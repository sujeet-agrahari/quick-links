import { Auth } from 'src/auth/auth.entity';
import { QuickLink } from 'src/quick-link/quicklink.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  /* Creating a one to one relationship between the User and Auth entities. */
  @OneToOne(() => Auth, (auth) => auth.user)
  @JoinColumn()
  auth: Auth;

  @OneToMany(() => QuickLink, (quickLink) => quickLink.user)
  quickLinks: QuickLink[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
