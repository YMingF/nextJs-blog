import { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { User } from "../../../src/entity/User";

const Users = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, passwordConfirmation } = req.body;
  const connection = await getDatabaseConnection();
  const user = new User();
  user.username = username;
  let statusCode = 200;
  let responseData;
  if (password !== passwordConfirmation) {
    responseData = { passwordConfirmation: ["密码不一致"] };
    statusCode = 422;
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(responseData));
  res.end();
};
export default Users;
