import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";
import marked from "marked";
import Link from "next/link";
import { withSession } from "../../lib/withSession";
import { customNextApiRequest } from "../../next-env";
import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type Props = {
  post: Post;
  id: number;
  currentUser: User | null;
};
const postsShow: NextPage<Props> = (props) => {
  const { post, currentUser, id } = props;
  const router = useRouter();
  const handleDel = useCallback(() => {
    axios.delete(`/api/v1/posts/${id}`).then(
      () => {
        window.alert("删除成功");
        router.push("/posts");
      },
      () => {
        window.alert("删除失败");
      }
    );
  }, [id]);
  return (
    <div>
      <h1>{post.title}</h1>
      <section>
        {currentUser && (
          <>
            <Link href="/posts/[id]/edit" as={`/posts/${post.id}/edit`}>
              编辑
            </Link>
            <button onClick={handleDel}>删除</button>
          </>
        )}
      </section>

      <article
        dangerouslySetInnerHTML={{ __html: marked(post.content) }}
      ></article>
    </div>
  );
};
export default postsShow;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // 拿到连接，从连接中去获取数据。
    const connection = await getDatabaseConnection();
    const id = context.params.id;
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    //  用context.params.id去获取你路由跳转时传过来的id值
    // @ts-ignore
    const post = (await connection.manager.findOne(Post, id)) || "''";
    return {
      props: {
        currentUser,
        id: parseInt(id.toString()),
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
