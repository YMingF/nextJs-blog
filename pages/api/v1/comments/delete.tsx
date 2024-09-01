import { NextApiResponse } from "next";
import { withSession } from "@/lib/withSession";
import { customNextApiRequest } from "@/common-type";
import { getDatabaseConnection } from "@/lib/getDatabaseConnection";

const DeleteComment = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    console.log(`req`, req);
    const { id } = req.query;
    try {
      const connection = await getDatabaseConnection();
      // await connection
      //   .createQueryBuilder()
      //   .delete()
      //   .from(Comment)
      //   .where("id = :id", { id })
      //   .execute();
      res.status(200);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write("");
    res.end();
  }
);

export default DeleteComment;
