import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne("User", "comments")
  user: User;

  @ManyToOne("Post", "comments")
  post: Post;
}
