import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";
import { Comment } from "@/src/entity/Comment";

const DeleteComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { uuid } = req.body;
    try {
      const connection = await getDatabaseConnection();
      const comment = await connection.manager.findOne<Comment>("Comment", {
        where: { uuid },
      });
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      await connection.manager.remove(comment);
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
