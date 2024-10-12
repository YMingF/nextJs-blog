import { KeyValMap } from "@/constants/common-type";
import { User } from "@/src/entity/User";
import { GetServerSidePropsContext } from "next";
import qs from "querystring";
import UAParser from "ua-parser-js";
import { customNextApiRequest } from "../common-type";
import { Post } from "../src/entity/Post";
import { getDatabaseConnection } from "./getDatabaseConnection";
import { withSession } from "./withSession";

export const fetchArticles = withSession(
  async (context: GetServerSidePropsContext) => {
    const ua = context.req.headers["user-agent"];
    const index = context.req.url.indexOf("?");
    const search = context.req.url.substr(index + 1);
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;

    const query = qs.parse(search);
    const page = +query.page || 1;
    const perPage = 1;
    // 拿到连接，从连接中去获取数据。
    const connection = await getDatabaseConnection();
    const userInfoMapping = await generateUserInfoMapping(connection);
    // totalNum表示数据库数据总数
    const [posts, totalNum] = await connection.manager.findAndCount(Post, {
      relations: ["author"],
    });
    const result = new UAParser(ua).getResult();
    return {
      props: {
        browser: result.browser,
        currentUser,
        posts: JSON.parse(JSON.stringify(posts)),
        count: totalNum,
        page,
        totalPage: Math.ceil(totalNum / perPage),
        userInfoMapping,
      },
    };
  }
);
async function generateUserInfoMapping(connection: any) {
  const users = await connection.manager.find(User);
  const userInfoMapping = users.reduce((acc: KeyValMap, user: KeyValMap) => {
    acc[user.id.toString()] = JSON.parse(JSON.stringify(user));
    return acc;
  }, {});
  return userInfoMapping;
}
