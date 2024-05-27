import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  content: string;
  @CreateDateColumn("time")
  createdAt: Date;
  @UpdateDateColumn("time")
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (user) => user.comments)
  post: Post;
}
