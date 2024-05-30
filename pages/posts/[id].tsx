import { GetServerSideProps, NextPage } from "next";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";

type Props = {
  post: Post;
};
const postsShow: NextPage<Props> = (props) => {
  const { post } = props;
  return (
    <div>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
    </div>
  );
};
export default postsShow;

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async (context) => {
  // 拿到连接，从连接中去获取数据。
  const connection = await getDatabaseConnection();
  //  用context.params.id去获取你路由跳转时传过来的id值
  const post = await connection.manager.findOne(Post, context.params.id);
  console.log(`post`, post);
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
