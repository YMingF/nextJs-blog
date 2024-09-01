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

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  content: string;
  @Column("varchar")
  postId: string;
  @Column("varchar")
  userId: string;
  @Column("varchar")
  uuid: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne("User", "comments", { onDelete: "CASCADE" })
  user: User;

  @ManyToOne("Post", "comments")
  post: Post;
}
