import { generateUid } from "@/lib/uid";
import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiRequest, NextApiResponse } from "next";

const Users = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, passwordConfirmation } = req.body;

  let statusCode = 200;
  let responseData;
  let errors: { [key: string]: string[] } = {
    username: [],
    password: [],
    passwordConfirmation: [],
  };
  const user = await globalPrisma.user.create({
    data: {
      username: username.trim(),
      password: password,
      uuid: generateUid(),
    },
  });
  user.username = username.trim();
  user.password = password;
  responseData = user;

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(responseData));
  res.end();
};
export default Users;
