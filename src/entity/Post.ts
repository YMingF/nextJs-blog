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
  likesUserId: string[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne("User", "posts")
  author: User;
  @OneToMany("Comment", "posts")
  comments: Comment[];
}
