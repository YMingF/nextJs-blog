import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../common-type";
import { getDatabaseConnection } from "../../../../lib/getDatabaseConnection";
import { withSession } from "../../../../lib/withSession";
import { Post } from "../../../../src/entity/Post";

const toggleLike = withSession(
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
    // 已点赞，则取消。未点赞，则添加。
    if (post.likesUserId.includes(userId as string)) {
      post.likesUserId = post.likesUserId.filter((id) => id !== userId);
    } else {
      post.likesUserId.push(userId as string);
    }
    // 更新点赞数
    post.updateLikesAmt();

    await connection.manager.save(post);
    res.json({ post: JSON.parse(JSON.stringify(post)) });
  }
);
export default toggleLike;
