import { GetServerSideProps, NextPage } from "next";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { Post } from "../../../src/entity/Post";

type Props = {
  id: number;
  post: Post;
};
const PostEdit: NextPage<Props> = (props) => {
  const { id, post } = props;
  return <div></div>;
};
export default PostEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;
  const connection = await getDatabaseConnection();
  const post = (await connection.manager.findOne("Post", id)) || "''";
  return {
    props: {
      id: parseInt(id.toString()),
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
