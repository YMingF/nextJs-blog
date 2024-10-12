import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiRequest, NextApiResponse } from "next";

const IsDuplicateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username } = req.query;

  let statusCode = 200;
  let responseData;

  const user = await globalPrisma.user.findFirst({
    where: {
      username: (username as string)?.trim(),
    },
  });
  responseData = user ? true : false;

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(responseData));
  res.end();
};
export default IsDuplicateUser;
