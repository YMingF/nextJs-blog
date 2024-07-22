import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Form, Input, Modal } from "antd";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  const [form] = Form.useForm();
  const openModal = useCallback((modalType: "sign_in" | "sign_up") => {
    const titleMap = {
      sign_in: "登录",
      sign_up: "注册",
    };
    Modal.confirm({
      title: titleMap[modalType],
      closable: true,
      centered: true,
      okText: titleMap[modalType],
      cancelText: null,
      onCancel() {
        form.resetFields();
      },
      onOk: () => {
        return new Promise((resolve, reject) => {
          let shouldClose = true;
          form
            .validateFields()
            .then(
              () => {
                const formData = form.getFieldsValue();
                axios.post(`/api/v1/users`, formData).then(
                  () => {
                    window.alert("注册成功");
                    shouldClose = true;

                    resolve(true);
                  },
                  (err) => {
                    window.alert("注册失败");
                    shouldClose = false;
                    reject();
                  }
                );
              },
              (err) => {
                shouldClose = false;
                reject();
              }
            )
            .finally(() => {
              if (shouldClose) {
                form.resetFields();
              }
            });
        });
      },
      content: (
        <Form
          form={form}
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
          {modalType === "sign_up" && (
            <Form.Item
              label="确认密码"
              name="passwordConfirmation"
              rules={[{ required: true, message: "请确认密码!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
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
