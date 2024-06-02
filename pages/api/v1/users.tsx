import { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { User } from "../../../src/entity/User";

const Users = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, passwordConfirmation } = req.body;

  let statusCode = 200;
  let responseData;
  let errors: { [key: string]: string[] } = {
    username: [],
    password: [],
    passwordConfirmation: [],
  };
  const connection = await getDatabaseConnection();
  const user = new User();
  if (username.trim() === "") {
    errors.username.push("this field is required");
    statusCode = 422;
  }
  if (!/[a-zA-Z0-9]/.test(username.trim())) {
    errors.username.push("格式不对");
    statusCode = 422;
  }
  if (password !== passwordConfirmation) {
    errors.passwordConfirmation.push("密码不一致");
    statusCode = 422;
  }
  const hasError = Object.values(errors).find((item) => item.length > 0);
  if (hasError) {
    responseData = errors;
  } else {
    user.username = username.trim();
    user.passwordDigest = password;
    await connection.manager.save(user);
    responseData = user;
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(responseData));
  res.end();
};
export default Users;
