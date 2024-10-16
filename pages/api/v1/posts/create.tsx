import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../common-type";
import { generateUid } from "../../../../lib/uid";
import { withSession } from "../../../../lib/withSession";

const CreatePost = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { title = "", content } = req.body;
      const user = req.session?.get("currentUser");

      const post = await globalPrisma.post.create({
        data: {
          title,
          content,
          uuid: generateUid(),
          userId: user.id,
          likesAmt: 0,
          likesUserId: [],
        },
      });
      if (!user) {
        res.statusCode = 401;
        res.end("unauthorized");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(post);
    }
  }
);
export default CreatePost;
