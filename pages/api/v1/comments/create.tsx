import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { Comment } from "@/src/entity/Comment";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";
import { Post } from "@/src/entity/Post";

const CreateComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { content, userId, postId } = req.body;
    const comment = new Comment();
    const connection = await getDatabaseConnection();

    comment.content = content;

    // store user info
    const user = req.session?.get("currentUser");
    if (!user) {
      res.statusCode = 401;
      res.end("unauthorized");
      return;
    }
    comment.user = user;
    // store post info
    const post = await connection.manager.findOne(Post, {
      where: { id: postId },
    });
    if (!post) {
      res.statusCode = 401;
      res.end("无对应文章");
      return;
    }

    comment.post = post;
    await connection.manager.save(comment);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(comment));
    res.end();
  }
);

export default CreateComment;
