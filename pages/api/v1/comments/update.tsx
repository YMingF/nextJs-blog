import { customNextApiRequest } from "@/common-type";
import { withSession } from "@/lib/withSession";
import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";

const UpdateComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { comment } = req.body;
    const updatedComment = await globalPrisma.comment.update({
      where: { id: comment.id },
      data: { content: comment.content },
    });
    const user = req.session.get("currentUser");
    if (!user) {
      res.statusCode = 401;
      res.end();
      return;
    }
    res.json(updatedComment);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write("");
    res.end();
  }
);

export default UpdateComment;
