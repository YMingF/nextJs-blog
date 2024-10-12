import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../common-type";
import { withSession } from "../../../../lib/withSession";

const toggleLike = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { uuid, userId } = req.query;

    const post = await globalPrisma.post.findUnique({
      where: { uuid: uuid as string },
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
    post.likesAmt = post.likesUserId.length;

    await globalPrisma.post.update({
      where: { uuid: uuid as string },
      data: post,
    });
    res.json({ post: JSON.parse(JSON.stringify(post)) });
  }
);
export default toggleLike;
