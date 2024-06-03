import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { User } from "../entity/User";

export class SignIn {
  constructor(private username: string, private password: string) {}
  user: User;
  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  };
  async validate() {
    if (this.username.trim() === "") {
      this.errors.username.push("请填写用户名");
    }
    const connection = await getDatabaseConnection();
    const user = await connection.manager.findOne(User, {
      where: { username: this.username.trim() },
    });
    this.user = user;
    if (user) {
      if (user.passwordDigest !== this.password) {
        this.errors.password.push("密码不匹配");
      }
    } else {
      this.errors.username.push("不存在");
    }
  }
  hasErrors() {
    return !!Object.values(this.errors).find((item) => item.length > 0);
  }
}
