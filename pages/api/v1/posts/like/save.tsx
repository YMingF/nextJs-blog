import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../../common-type";
import { getDatabaseConnection } from "../../../../../lib/getDatabaseConnection";
import { withSession } from "../../../../../lib/withSession";
import { Post } from "../../../../../src/entity/Post";

const LikePost = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { uuid, userId } = req.query;
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
    if (!Array.isArray(post.likesUserId)) {
      post.likesUserId = [];
    }
    if (!post.likesUserId.includes(userId as string)) {
      post.likesUserId.push(userId as string);
    }
    await connection.manager.save(post);
    res.json({ likesUserId: post.likesUserId });
  }
);
export default LikePost;
