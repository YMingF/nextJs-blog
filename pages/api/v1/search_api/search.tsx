import { globalPrisma } from "@/utils/prisma.utils";
import { get } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

const Search = async (req: NextApiRequest, res: NextApiResponse) => {
  let searchRes = [];
  const queryContent = decodeURIComponent(get(req, "query.q", "").toString());

  if (!queryContent) {
    searchRes = await globalPrisma.post.findMany();
  } else {
    searchRes = await globalPrisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: queryContent,
              mode: "insensitive",
              not: {
                contains: "data:image",
              },
            },
          },
          {
            title: {
              contains: queryContent,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 20,
    });
  }

  res.status(200).json(searchRes);
};

export default Search;
