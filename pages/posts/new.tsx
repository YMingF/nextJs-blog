import { NextPage } from "next";
import axios from "axios";
import { useForm } from "../../hooks/useForm";

const PostNew: NextPage = () => {
  const { form, setErrors } = useForm({
    initFormData: {
      title: "",
      content: "",
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
      request: (finalFormData) => axios.post(`/api/v1/posts`, finalFormData),
      message: "创建成功",
    },
  });
  return <div>{form}</div>;
};
export default PostNew;
