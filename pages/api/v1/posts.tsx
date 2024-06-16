import { NextApiResponse } from "next";
import { Post } from "../../../src/entity/Post";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { withSession } from "../../../lib/withSession";
import { customNextApiRequest } from "../../../next-env";

const Posts = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    // const fileData = await getPosts();
    //

    if (req.method === "POST") {
      const { title, content } = req.body;
      const post = new Post();
      post.title = title;
      post.content = content;
      const connection = await getDatabaseConnection();
      post.author = req.session?.get("currentUser");
      // 保存你所新建的post到数据库
      await connection.manager.save(post);

      res.json(post);
    }
  }
);
export default Posts;
