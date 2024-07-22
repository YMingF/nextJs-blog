import { NextPage } from "next";
import { Form, Input, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { NamePath, StoreValue } from "rc-field-form/lib/interface";
import { get } from "lodash";

const App_Login: NextPage = (props: any) => {
  const [form] = Form.useForm();
  const titleMap = {
    sign_in: "登录",
    sign_up: "注册",
  };
  const [serverErrors, setServerErrors] = useState(
    {} as { [key: string]: string[] }
  );
  const handleErrors = (errors: any) => {
    setServerErrors(errors);
  };
  useEffect(() => {
    if (Object.keys(serverErrors)?.length > 0) {
      const fields = Object.keys(serverErrors).map((key) => ({
        name: key,
        errors: serverErrors[key],
      }));
      form.setFields(fields);
    }
  }, [serverErrors, form]);
  const validateConfirmPass = ({
    getFieldValue,
  }: {
    getFieldValue: (name: NamePath) => StoreValue;
  }) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("前后密码不一致！"));
    },
  });
  const openModal = useCallback((modalType: "sign_in" | "sign_up") => {
    Modal.confirm({
      title: titleMap[modalType],
      closable: true,
      centered: true,
      okText: titleMap[modalType],
      cancelText: null,
      content: (
        <>
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
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Input.Password />
            </Form.Item>
            {modalType === "sign_up" && (
              <Form.Item
                label="确认密码"
                dependencies={["password"]}
                name="passwordConfirmation"
                rules={[
                  { required: true, message: "请确认密码!" },
                  validateConfirmPass,
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}
          </Form>
        </>
      ),
      onCancel() {
        form.resetFields();
      },
      onOk: () => {
        return new Promise((resolve, reject) => {
          form.validateFields().then(() => {
            const formData = form.getFieldsValue();
            axios
              .post(`/api/v1/users`, formData)
              .then(() => {
                window.alert("注册成功");
                form.resetFields();
                setServerErrors({});
                resolve(true);
              })
              .catch((errors) => {
                const { response } = errors || {};
                setServerErrors(get(response, "data", {}));
                reject(false);
              });
          });
        });
      },
    });
  }, []);

  return (
    <div className={"tw-flex tw-justify-between"}>
      <p>博客</p>
      <div>
        <button onClick={() => openModal("sign_in")}>登录|</button>
        <button onClick={() => openModal("sign_up")}> 注册</button>
      </div>
    </div>
  );
};
export default App_Login;
