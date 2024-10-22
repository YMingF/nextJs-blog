import { globalPrisma } from "@/utils/prisma.utils";
import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../../common-type";
import { withSession } from "../../../../lib/withSession";

const Posts = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    if (req.method === "PATCH") {
      const { uuid } = req.query || {};
      const { title, content } = req.body;
      const post = await globalPrisma.post.update({
        where: { uuid: uuid as string },
        data: { title, content },
      });
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      res.json(post);
    } else if (req.method === "DELETE") {
      const { uuid } = req.query;
      await globalPrisma.post.delete({
        where: { uuid: uuid as string },
      });
      const user = req.session.get("currentUser");
      if (!user) {
        res.statusCode = 401;
        res.end();
        return;
      }
      res.end();
    }
  }
);
export default Posts;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
