import { GetServerSideProps, NextPage } from "next";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { Post } from "../../../src/entity/Post";
import { UseMarkdown } from "@/hooks/useMarkdown";

type Props = {
  uuid: number;
  post: Post;
};
const PostEdit: NextPage<Props> = (props) => {
  const { uuid, post } = props;
  console.log(`props`, props);
  const { form, context } = UseMarkdown();

  return (
    <section>
      <p>{`${JSON.stringify(form)}`}sasdasd</p>

      {context}
    </section>
  );
};
export default PostEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uuid } = context.params;
  console.log(`context.params`, context.params);
  const connection = await getDatabaseConnection();
  const post =
    (await connection.manager.findOne("Post", { where: { uuid } })) || "''";
  return {
    props: {
      uuid: uuid,
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
