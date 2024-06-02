import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
// @ts-ignore
import { omit } from "lodash";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column("varchar")
  username: string;
  @Column("varchar")
  passwordDigest: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment;
  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  };
  password: string;
  passwordConfirmation: string;
  async validate() {
    if (this.username.trim() === "") {
      this.errors.username.push("this field is required");
    }
    if (!/[a-zA-Z0-9]/.test(this.username.trim())) {
      this.errors.username.push("格式不对");
    }
    const found = await (
      await getDatabaseConnection()
    ).manager.find(User, {
      username: this.username,
    });
    if (found?.length > 0) {
      this.errors.username.push("不能重复创建");
    }
    if (this.password === "") {
      this.errors.passwordConfirmation.push("不能为空");
    }
    if (this.password !== this.passwordConfirmation) {
      this.errors.passwordConfirmation.push("密码不一致");
    }
  }
  hasErrors() {
    return !!Object.values(this.errors).find((item) => item.length > 0);
  }
  @BeforeInsert()
  generatePasswordDigest() {
    this.passwordDigest = this.password;
  }
  toJSON() {
    return omit(this, ["password", "passwordConfirmation", "passwordDigest"]);
  }
}
