import { NextApiRequest, NextApiResponse } from "next";
import { SignIn } from "../../../src/model/SignIn";

const Sessions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, passwordConfirmation } = req.body;
  let statusCode = 200;
  let response = "";
  const signIn = new SignIn(username, password);
  await signIn.validate();
  if (signIn.hasErrors()) {
    statusCode = 422;
    response = JSON.stringify(signIn.errors);
  } else {
    response = JSON.stringify(signIn.user);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.write(response);
  res.end();
};

export default Sessions;
