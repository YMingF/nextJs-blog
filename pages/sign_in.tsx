import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import axios from "axios";
import { withSession } from "../lib/withSession";
import { User } from "../src/entity/User";
import { useForm } from "../hooks/useForm";

const signInPage: NextPage<{ user: User }> = (props) => {
  const { form, setErrors } = useForm({
    initFormData: {
      username: "",
      password: "",
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
    ],
    buttons: <button type="submit">submit</button>,
    submit: {
      request: (formData) => axios.post(`/api/v1/sessions`, formData),
      message: "登录成功",
    },
  });
  return (
    <>
      <h1>登录页面</h1>

      {form}
    </>
  );
};
export default signInPage;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const user = context.req.session.get("currentUser") ?? "";
    return {
      props: {
        user,
      },
    };
  }
);
