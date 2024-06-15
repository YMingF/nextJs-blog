import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useCallback, useState } from "react";
import axios from "axios";
import { withSession } from "../lib/withSession";
import { User } from "../src/entity/User";
import { Form } from "../components/Form";

const signInPage: NextPage<{ user: User }> = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState({
    username: [],
    password: [],
    passwordConfirmation: [],
  });
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      axios.post(`/api/v1/sessions`, formData).then(
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
  const onChanged = useCallback(
    (key, value) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  return (
    <>
      {props.user && <div>当前登录用户为：{props.user.username}</div>}

      <h1>登录页面</h1>
      <Form
        fields={[
          {
            label: "name",
            type: "text",
            value: formData.username,
            errors: errors.username,
            onChange: (e) => onChanged("username", e.target.value),
          },
          {
            label: "pass",
            type: "password",
            value: formData.password,
            errors: errors.password,
            onChange: (e) => onChanged("password", e.target.value),
          },
        ]}
        onSubmit={onSubmit}
        buttons={<button type="submit">submit</button>}
      ></Form>
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
