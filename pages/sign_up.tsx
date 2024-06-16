import { NextPage } from "next";
import axios from "axios";
import { useForm } from "../hooks/useForm";

const signUpPage: NextPage = () => {
  const { form, setErrors } = useForm({
    initFormData: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    fields: [
      {
        label: "name",
        type: "text",
        key: "username",
      },
      {
        label: "pass",
        type: "password",
        key: "password",
      },
      {
        label: "passwordConfirmation",
        type: "password",
        key: "passwordConfirmation",
      },
    ],
    buttons: <button type="submit">register</button>,
    submit: {
      request: (formData) => axios.post(`/api/v1/users`, formData),
      success: () => window.alert("注册成功"),
    },
  });
  return (
    <>
      <h1>注册页面</h1>
      {form}
    </>
  );
};
export default signUpPage;
