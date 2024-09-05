import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";
import { Comment } from "@/src/entity/Comment";

const UpdateComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { comment } = req.body;
    const connection = await getDatabaseConnection();
    const finedComment = await connection.manager.findOne<Comment>("Comment", {
      where: { id: comment.id },
    });
    finedComment.content = comment.newContent;
    const user = req.session.get("currentUser");
    if (!user) {
      res.statusCode = 401;
      res.end();
      return;
    }
    await connection.manager.save(finedComment);
    res.json(finedComment);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write("");
    res.end();
  }
);

export default UpdateComment;
