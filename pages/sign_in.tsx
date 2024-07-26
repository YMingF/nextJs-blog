import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import axios from "axios";
import { withSession } from "../lib/withSession";
import { User } from "../src/entity/User";
import { useForm } from "../hooks/useForm";
import { useRouter } from "next/router";
import { customNextApiRequest } from "../common-type";

const signInPage: NextPage<{ user: User }> = (props) => {
  const router = useRouter();
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
      success: () => {
        window.alert("登录成功");
        const queryStr = window.location.search;
        const returnUrl = new URLSearchParams(queryStr).get("return_to");
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          router.push("/posts");
        }
      },
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
    const user =
      (context.req as customNextApiRequest).session.get("currentUser") ?? "";
    return {
      props: {
        user,
      },
    };
  }
);
