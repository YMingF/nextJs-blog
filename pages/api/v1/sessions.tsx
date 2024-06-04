import { SignIn } from "../../../src/model/SignIn";
import { withSession } from "../../../lib/withSession";
import { NextApiResponse } from "next";
import { customNextApiRequest } from "../../../next-env";

const Sessions = async (req: customNextApiRequest, res: NextApiResponse) => {
  const { username, password, passwordConfirmation } = req.body;
  let statusCode = 200;
  let response = "";
  const signIn = new SignIn(username, password);
  await signIn.validate();
  if (signIn.hasErrors()) {
    statusCode = 422;
    response = JSON.stringify(signIn.errors);
  } else {
    req.session.set("currentUser", signIn.user);
    await req.session.save();
    response = JSON.stringify(signIn.user);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(response);
  res.end();
};

export default withSession(Sessions);
