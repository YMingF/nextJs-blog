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
      success: () => {
        window.alert("提交成功");
        window.location.href = "/posts";
      },
    },
  });
  return <div>{form}</div>;
};
export default PostNew;
