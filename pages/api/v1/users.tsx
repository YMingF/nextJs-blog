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
  user.username = username.trim();
  user.password = password;
  user.passwordConfirmation = passwordConfirmation;
  await user.validate();
  if (user.hasErrors()) {
    statusCode = 422;
    responseData = user.errors;
  } else {
    // 调用manager将数据存储到数据库中。
    await connection.manager.save(user);
    responseData = user;
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(responseData));
  res.end();
};
export default Users;
