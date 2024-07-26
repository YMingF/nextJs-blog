import { NextApiResponse } from "next";
import { withSession } from "../../../lib/withSession";
import { customNextApiRequest } from "../../../common-type";

const GetUserInfo = withSession(
  async (req: customNextApiRequest, res: NextApiResponse) => {
    const user = req.session.get("currentUser");
    if (!user) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write("user is not found");
      res.end();
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(user));
    res.end();
  }
);

export default GetUserInfo;
