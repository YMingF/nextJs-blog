import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import UAParser from "ua-parser-js";
import Link from "next/link";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";
import qs from "querystring";
import { usePager } from "../../hooks/userPager";
import { withSession } from "../../lib/withSession";
import { customNextApiRequest, User } from "../../common-type";

type Props = {
  posts?: Post[];
  count?: number;
  page?: number;
  currentUser?: User | null;
  totalPage?: number;
};
const PostsIndex: NextPage<Props> = (props) => {
  const { posts, currentUser } = props;
  const { pager } = usePager({
    page: props.page,
    totalPage: props.totalPage,
  });
  return (
    <main>
      <section>
        <h1>文章列表</h1>
        {currentUser && <a href="/posts/new">新增文章</a>}
      </section>
      {posts.map((post, index) => (
        <div key={index}>
          <Link key={post.id} href={`/posts/${post.id}`}></Link>
        </div>
      ))}
      <footer>{pager}</footer>
    </main>
  );
};
export default PostsIndex;
export const getServerSideProps: GetServerSideProps = withSession(
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
    const [posts, totalNum] = await connection.manager.findAndCount(Post, {
      skip: (page - 1) * perPage,
      take: perPage,
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
      },
    };
  }
);
