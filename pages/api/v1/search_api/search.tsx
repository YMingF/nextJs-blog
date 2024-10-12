import { globalPrisma } from "@/utils/prisma.utils";
import { get } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

const Search = async (req: NextApiRequest, res: NextApiResponse) => {
  let searchRes = [];
  const queryContent = get(req, "query.content", "").toString();

  if (!queryContent) {
    searchRes = await globalPrisma.post.findMany();
  } else {
    searchRes = await globalPrisma.post.findMany({
      where: {
        OR: [
          { content: { contains: queryContent, mode: "insensitive" } },
          { title: { contains: queryContent, mode: "insensitive" } },
        ],
      },
    });
  }

  res.status(200).json(searchRes);
};

export default Search;
