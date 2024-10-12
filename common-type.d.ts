import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export interface customNextApiRequest extends NextApiRequest {
  session: Session;
}
