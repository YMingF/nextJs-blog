import { customNextApiRequest } from "@/common-type";
import { withSession } from "@/lib/withSession";
import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";

const FetchComments = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { postId } = req.query;
    try {
      const comments = await globalPrisma.comment.findMany({
        where: { postId: Number(postId) },
        orderBy: { id: "asc" },
      });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }
);

export default FetchComments;
