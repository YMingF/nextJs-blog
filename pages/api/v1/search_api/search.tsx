import { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../../lib/getDatabaseConnection";
import { Post } from "../../../../src/entity/Post";
import { get } from "lodash";
import { Like } from "typeorm";

const Search = async (req: NextApiRequest, res: NextApiResponse) => {
  let searchRes = [];
  const queryContent = get(req, "query.content", "").toString();
  const connection = await getDatabaseConnection();
  const postRepo = connection.getRepository(Post);
  if (!queryContent) {
    searchRes = await postRepo.find();
  } else {
    searchRes = await postRepo.find({
      where: {
        content: Like(`%${queryContent}%`) || Like(`%${queryContent}`),
      },
    });
  }
  console.log(`searchRes`, searchRes);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(searchRes));
  res.end();
};

export default Search;
