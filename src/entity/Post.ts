import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column("varchar")
  title: string;
  @Column("text")
  content: string;
  @Column("varchar")
  uuid: string;
  @Column("varchar")
  authorId: string;
  @Column("varchar", { array: true, nullable: true })
  likesUserId: string[] = []; // 初始化为一个空数组
  @Column("int", { nullable: true })
  likesAmt: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne("User", "posts")
  author: User;
  @OneToMany("Comment", "posts")
  comments: Comment[];

  updateLikesAmt() {
    this.likesAmt = this.likesUserId.length; // 自动设置 likesAmt 为 likesUserId 的长度
  }
}
