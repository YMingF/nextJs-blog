import { GetServerSideProps, NextPage } from "next";
import UAParser from "ua-parser-js";
import { getDatabaseConnection } from "../lib/getDatabaseConnection";
import { Post } from "../src/entity/Post";
import Link from "next/link";

type Props = {
  posts: Post[];
};
const Index: NextPage<Props> = (props) => {
  const { posts } = props;
  console.log(`posts1 `, posts);

  return (
    <main>
      <h1>文章列表</h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <a>{post.title}</a>
        </Link>
      ))}
    </main>
  );
};
export default Index;
export const getServerSideProps: GetServerSideProps = async (context) => {
  // 拿到连接，从连接中去获取数据。
  const connection = await getDatabaseConnection();
  const posts = await connection.manager.find(Post);

  const ua = context.req.headers["user-agent"];
  /*
   * to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data with relatively small footprint
   * (~17KB minified, ~6KB gzipped) that can be used either in browser (client-side) or node.js (server-side).
   * */
  const result = new UAParser(ua).getResult();
  return {
    props: {
      browser: result.browser,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
