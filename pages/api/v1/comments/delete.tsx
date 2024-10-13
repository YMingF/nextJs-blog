import { customNextApiRequest } from "@/common-type";
import { withSession } from "@/lib/withSession";
import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";

const DeleteComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { id } = req.body;
    try {
      const deletedComment = await globalPrisma.comment.delete({
        where: { id: Number(id) },
      });
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      res.json(deletedComment);
      res.status(200);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write("");
    res.end();
  }
);

export default DeleteComment;
