import { NextPage } from "next";
import { Form } from "../../components/Form";
import { useCallback, useState } from "react";
import axios from "axios";

const PostNew: NextPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const onChanged = useCallback(
    (key, value) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  const [errors, setErrors] = useState({
    title: [],
    content: [],
  });
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      axios.post(`/api/v1/posts`, formData).then(
        () => {
          window.alert("登录成功");
        },
        (err) => {
          console.log(`err`, err.response);
          if (err.response.status === 422) {
            setErrors(err.response.data);
          }
        }
      );
    },
    [formData]
  );
  return (
    <Form
      fields={[
        {
          label: "title",
          type: "text",
          value: formData.title,
          errors: errors.title,
          onChange: (e) => onChanged("title", e.target.value),
        },
        {
          label: "content",
          type: "textarea",
          value: formData.content,
          errors: errors.content,
          onChange: (e) => onChanged("content", e.target.value),
        },
      ]}
      onSubmit={submited}
      buttons={<button type="submit">submit</button>}
    ></Form>
  );
};
export default PostNew;

const submited = () => {
  console.log("debug");
};
