import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

type Post = {
  id: string;

  content: string;
};

type User = {
  id: string;
};
interface KeyValString {
  [key: string]: any;
}
export interface customNextApiRequest extends NextApiRequest {
  session: Session;
}
