import { withIronSession } from "next-iron-session";
import { GetServerSideProps, NextApiHandler } from "next";

export function withSession(handler: NextApiHandler | GetServerSideProps) {
  return withIronSession(handler, {
    password: "5Q2xex018m3emjS0BA9zkudxjbFK55Jl",
    cookieName: "blog",
    cookieOptions: { secure: false },
  });
}
