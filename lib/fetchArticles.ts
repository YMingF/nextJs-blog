import { withSession } from "./withSession";
import { GetServerSidePropsContext } from "next";
import { customNextApiRequest } from "../common-type";
import qs from "querystring";
import { getDatabaseConnection } from "./getDatabaseConnection";
import { Post } from "../src/entity/Post";
import UAParser from "ua-parser-js";

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
    // totalNum表示数据库数据总数
    const [posts, totalNum] = await connection.manager.findAndCount(Post, {});

    const result = new UAParser(ua).getResult();
    return {
      props: {
        browser: result.browser,
        currentUser,
        posts: JSON.parse(JSON.stringify(posts)),
        count: totalNum,
        page,
        totalPage: Math.ceil(totalNum / perPage),
      },
    };
  }
);
