import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useCallback, useState } from "react";
import axios from "axios";
import { withSession } from "../lib/withSession";
import { User } from "../src/entity/User";

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
  return (
    <>
      {props.user && <div>当前登录用户为：{props.user.username}</div>}

      <h1>登录页面</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            用户名
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </label>
          {JSON.stringify(errors)}
          {errors && errors?.username?.length > 0 && (
            <div>{errors.username.join(",")}</div>
          )}
        </div>
        <div>
          <label>
            密码
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </label>
          {errors && errors?.password?.length > 0 && (
            <div>{errors.password.join(",")}</div>
          )}
        </div>
        <div>
          <button type={"submit"}>登录</button>
        </div>
      </form>
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
