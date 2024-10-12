import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../common-type";
import { getDatabaseConnection } from "../../../../lib/getDatabaseConnection";
import { generateUid } from "../../../../lib/uid";
import { withSession } from "../../../../lib/withSession";
import { Post } from "../../../../src/entity/Post";

const CreatePost = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { title, content } = req.body;
      const post = new Post();
      post.title = title;
      post.content = content;
      post.uuid = generateUid();
      const connection = await getDatabaseConnection();
      const user = req.session?.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end("unauthorized");
        return;
      }
      post.authorId = user.id;
      // 保存你所新建的post到数据库

      await connection.manager.save(post);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(post);
    }
  }
);
export default CreatePost;
