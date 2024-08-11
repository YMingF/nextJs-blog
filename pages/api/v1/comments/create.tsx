import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { Comment } from "@/src/entity/Comment";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";

const CreateComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { content, userId, postId } = req.body;
    const comment = new Comment();
    comment.content = content;
    comment.userId = userId;
    comment.postId = postId;
    const connection = await getDatabaseConnection();
    await connection.manager.save(comment);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(comment));
    res.end();
  }
);

export default CreateComment;
