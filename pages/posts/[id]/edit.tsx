import { GetServerSideProps, NextPage } from "next";
import { useForm } from "../../../hooks/useForm";
import axios from "axios";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { Post } from "../../../src/entity/Post";

type Props = {
  id: number;
  post: Post;
};
const PostEdit: NextPage<Props> = (props) => {
  const { id, post } = props;
  console.log(`post`, post);
  const { form, setErrors } = useForm({
    initFormData: {
      title: post.title,
      content: post.content,
    },
    fields: [
      {
        label: "title",
        type: "text",
        key: "title",
      },
      {
        label: "content",
        type: "textarea",
        key: "content",
      },
    ],
    buttons: <button type="submit">submit</button>,
    submit: {
      request: (finalFormData) =>
        axios.patch(`/api/v1/posts/${id}`, { ...finalFormData }),
      success: () => {
        window.alert("提交成功");
        window.location.href = "/posts";
      },
    },
  });
  return <div>{form}</div>;
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
