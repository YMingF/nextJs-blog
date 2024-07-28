import { NextApiResponse } from "next";
import { Post } from "../../../src/entity/Post";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { withSession } from "../../../lib/withSession";
import { customNextApiRequest } from "../../../common-type";
import { generateUid } from "../../../lib/uid";

const Posts = withSession(
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
      post.author = user;
      // 保存你所新建的post到数据库
      await connection.manager.save(post);

      res.json(post);
    }
  }
);
export default Posts;
