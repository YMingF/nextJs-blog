import { withIronSession } from "next-iron-session";
import { NextApiHandler } from "next";

export function withSession(handler: NextApiHandler) {
  return withIronSession(handler, {
    password: "5c887ce7-d7a8-4c6d-a0d2-b6270f4950c3",
    cookieName: "blog",
  });
}
