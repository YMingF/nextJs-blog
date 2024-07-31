import { NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../../lib/getDatabaseConnection";
import { withSession } from "../../../../lib/withSession";
import { Post } from "../../../../src/entity/Post";
import { customNextApiRequest } from "../../../../common-type";

const Posts = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    if (req.method === "PATCH") {
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
    } else if (req.method === "DELETE") {
      const { uuid } = req.query;
      const connection = await getDatabaseConnection();
      const post = await connection.manager.findOne<Post>("Post", {
        where: { uuid },
      });
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      await connection.manager.remove(post);
      res.end();
    }
  }
);
export default Posts;
