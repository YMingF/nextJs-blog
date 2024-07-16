import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Form, Input, Modal } from "antd";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  const openModal = useCallback((modalType) => {
    Modal.info({
      title: "登录",
      content: (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      ),
    });
  }, []);
  return (
    <>
      <div className={"tw-flex tw-justify-between"}>
        <p>博客</p>
        <div>
          <button onClick={() => openModal("sign_in")}>登录|</button>
          <button onClick={() => openModal("sign_up")}> 注册</button>
        </div>
      </div>
      <Component {...pageProps} />;
    </>
  );
}
