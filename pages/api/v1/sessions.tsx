import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../common-type";
import { withSession } from "../../../lib/withSession";

const prisma = new PrismaClient();

const Sessions = async (req: customNextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || password !== user.password) {
      res.status(401).json({ error: "用户名或密码不正确" });
      return;
    }

    req.session.set("currentUser", { ...user });
    await req.session.save();

    res.status(200).json({ ...user });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ error: "服务器错误" });
  } finally {
    await prisma.$disconnect();
  }
};

export default withSession(Sessions);
