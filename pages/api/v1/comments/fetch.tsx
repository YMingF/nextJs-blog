import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";
import { Comment } from "src/entity/Comment";

const FetchComments = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const { postId } = req.query;
    try {
      const connection = await getDatabaseConnection();
      const comments = await connection.manager.find(Comment, {
        where: { postId },
      });
      comments.sort((a, b) => a.id - b.id);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }
);

export default FetchComments;
