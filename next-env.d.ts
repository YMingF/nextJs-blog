/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// declare global {
//   namespace Next {
//     interface NextApiRequest {
//       session: Session;
//     }
//   }
// }

import { NextApiRequest } from "next";
import { Session } from "next-iron-session";

export interface customNextApiRequest extends NextApiRequest {
  session: Session;
}
