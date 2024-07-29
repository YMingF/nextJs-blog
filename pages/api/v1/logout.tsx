import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../common-type";
import { withSession } from "../../../lib/withSession";

const Logout = async (req: customNextApiRequest, res: NextApiResponse) => {
  req.session.set("currentUser", null);
  await req.session.save();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write("");
  res.end();
};

export default withSession(Logout);
