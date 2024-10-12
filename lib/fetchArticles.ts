import { KeyValMap } from "@/constants/common-type";
import { globalPrisma } from "@/utils/prisma.utils";
import { GetServerSidePropsContext } from "next";
import qs from "querystring";
import UAParser from "ua-parser-js";
import { customNextApiRequest } from "../common-type";
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
    // 拿到连接，从连接中去获取数据。
    const userInfoMapping = await generateUserInfoMapping();
    // totalNum表示数据库数据总数
    const [posts, totalNum] = await globalPrisma.post
      .findMany()
      .then((posts) => [posts, posts.length]);
    const result = new UAParser(ua).getResult();
    return {
      props: {
        browser: result.browser,
        currentUser,
        posts: JSON.parse(JSON.stringify(posts)),
        totalNum,
        page,
        userInfoMapping,
      },
    };
  }
);
async function generateUserInfoMapping() {
  const users = await globalPrisma.user.findMany();
  const userInfoMapping = users.reduce((acc: KeyValMap, user: KeyValMap) => {
    acc[user.id.toString()] = JSON.parse(JSON.stringify(user));
    return acc;
  }, {});

  return userInfoMapping;
}
