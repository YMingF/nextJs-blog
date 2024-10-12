import { customNextApiRequest } from "@/common-type";
import { withSession } from "@/lib/withSession";
import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";

const CreateComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { content, postId } = req.body;

    // store user info
    const user = req.session?.get("currentUser");
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const comment = await globalPrisma.comment.create({
        data: {
          content,
          user: { connect: { id: user.id } },
          post: { connect: { id: postId } },
        },
        include: {
          user: true,
          post: true,
        },
      });

      res.status(200).json(comment);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "无对应文章" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } finally {
      await globalPrisma.$disconnect();
    }
  }
);

export default CreateComment;
