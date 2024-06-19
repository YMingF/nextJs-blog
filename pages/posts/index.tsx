import { GetServerSideProps, NextPage } from "next";
import UAParser from "ua-parser-js";
import Link from "next/link";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";
import qs from "querystring";

type Props = {
  posts: Post[];
  count: number;
  page: number;
};
const PostsIndex: NextPage<Props> = (props) => {
  const { posts } = props;
  console.log(`posts1 `, posts);

  return (
    <main>
      <h1>文章列表()</h1>
      {posts.map((post) => (
        <div>
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </div>
      ))}
      <footer>
        共{props.count}篇文章，当前为第{props.page}页
        <Link href={`?page=${props.page - 1}`}>上一页</Link>
        <Link href={`?page=${props.page + 1}`}>下一页</Link>
      </footer>
    </main>
  );
};
export default PostsIndex;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const ua = context.req.headers["user-agent"];
  const index = context.req.url.indexOf("?");
  const search = context.req.url.substr(index + 1);
  const query = qs.parse(search);
  const page = +query.page || 1;
  const perPage = 2;
  // 拿到连接，从连接中去获取数据。
  const connection = await getDatabaseConnection();
  // totalNum表示数据库数据总数
  const [posts, totalNum] = await connection.manager.findAndCount(Post, {
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const result = new UAParser(ua).getResult();
  return {
    props: {
      browser: result.browser,
      posts: JSON.parse(JSON.stringify(posts)),
      count: totalNum,
      page,
    },
  };
};
