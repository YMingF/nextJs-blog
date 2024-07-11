import { NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../../lib/getDatabaseConnection";
import { customNextApiRequest } from "../../../../next-env";
import { withSession } from "../../../../lib/withSession";
import { Post } from "../../../../src/entity/Post";

const Posts = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    if (req.method === "PATCH") {
      console.log(`req`, req);
      const id = req.query.id;
      const { title, content } = req.body;
      const connection = await getDatabaseConnection();
      const post = await connection.manager.findOne<Post>(
        "Post",
        id.toString()
      );
      post.title = title;
      post.content = content;
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      await connection.manager.save(post);
      res.json(post);
    }
  }
);
export default Posts;
