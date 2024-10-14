import eventEmitter from "@/emitter/eventEmitter";
import { Form, Input, message, Modal } from "antd";
import axios from "axios";
import { get } from "lodash";
import { useCallback, useRef, useState } from "react";
import { useGlobalState } from "../context/globalStateContext";
import { generateFocusErrorField, updateErrors } from "../pages/login/login";

export function useSignIn() {
  const [form] = Form.useForm();
  const fieldRefs = useRef<any>({});
  const [serverErrors, setServerErrors] = useState(
    {} as { [key: string]: string[] }
  );
  updateErrors(serverErrors, form);

  const [messageApi, contextHolder] = message.useMessage();
  const focusErrorField = generateFocusErrorField(form, fieldRefs);
  const { user, storeUser } = useGlobalState();

  const openSignIn = useCallback(() => {
    Modal.confirm({
      title: "登录",
      closable: true,
      centered: true,
      okText: "确定",
      cancelText: null,
      content: (
        <>
          {contextHolder}
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
              <Input
                ref={(el) => {
                  fieldRefs.current["username"] = el;
                }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Input.Password
                ref={(el) => {
                  fieldRefs.current["password"] = el;
                }}
              />
            </Form.Item>
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
              .post(`/api/v1/sessions`, formData)
              .then(async ({ data }) => {
                messageApi.success({
                  content: "登录成功",
                  duration: 1,
                  onClose: () => {
                    storeUser(data);
                    resolve(true);
                    setServerErrors({});
                    form.resetFields();
                    eventEmitter.emit("userChanged", data);
                  },
                });
              })
              .catch((errors) => {
                const { response } = errors || {};
                setServerErrors(get(response, "data", {}));
                setTimeout(() => {
                  focusErrorField();
                }, 100);

                reject(true);
              });
          });
        });
      },
    });
  }, []);
  return {
    openSignIn,
  };
}
