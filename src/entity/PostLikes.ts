// 暂时废弃
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity("postLikes")
export class PostLikes {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @PrimaryColumn("varchar")
  userId: string;

  @PrimaryColumn("varchar")
  postId: string;

  @Column("varchar")
  uuid: string;

  @ManyToOne("User", "postLikes")
  user: User;

  @ManyToOne("Post", "postLikes")
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
