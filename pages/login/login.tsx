import { NextPage } from "next";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { NamePath, StoreValue } from "rc-field-form/lib/interface";
import { get } from "lodash";
import { useGlobalState } from "../../context/globalStateContext";

interface App_LoginProps {}

function generateFocusErrorField(
  form: FormInstance<any>,
  fieldRefs: React.MutableRefObject<any>
) {
  return useCallback(() => {
    const errors = form.getFieldsError();
    const firstError = errors?.find((err) => err.errors.length > 0);
    if (firstError) {
      const fieldName = firstError.name;
      const errorField = fieldRefs.current[fieldName.toString()];
      errorField && errorField.focus();
    }
  }, [form]);
}

const App_Login: NextPage<App_LoginProps> = (props: any) => {
  const { user, storeUser } = useGlobalState();
  const fieldRefs = useRef<any>({});
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState(
    {} as { [key: string]: string[] }
  );
  updateErrors(serverErrors, form);

  const titleMap = {
    sign_in: "登录",
    sign_up: "注册",
  };

  const [messageApi, contextHolder] = message.useMessage();
  const focusErrorField = generateFocusErrorField(form, fieldRefs);
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
                <Input.Password
                  ref={(el) => {
                    fieldRefs.current["passwordConfirmation"] = el;
                  }}
                />
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
          form
            .validateFields()
            .then(() => {
              const formData = form.getFieldsValue();
              const api = modalType === "sign_in" ? "sessions" : "users";
              axios
                .post(`/api/v1/${api}`, formData)
                .then(async (successData) => {
                  if (modalType === "sign_in") {
                    messageApi.success({
                      content: "登录成功",
                      duration: 1,
                      onClose: () => {
                        storeUser(get(successData, "data"));
                        resolve(true);
                        setServerErrors({});
                        form.resetFields();
                      },
                    });
                  } else {
                    messageApi.success({
                      content: "注册成功，即将跳转到登录界面",
                      duration: 2,
                      onClose: () => {
                        resolve(false);
                        openModal("sign_in");
                        setServerErrors({});
                        form.resetFields();
                      },
                    });
                  }
                })
                .catch((errors) => {
                  const { response } = errors || {};
                  setServerErrors(get(response, "data", {}));
                  reject(true);
                });
            })
            .catch((errs) => {
              focusErrorField();
              reject(true);
            });
        });
      },
    });
  }, []);

  return (
    <div className={"tw-flex tw-justify-between tw-items-center"}>
      <Button type="primary" onClick={() => openModal("sign_in")}>
        登录
      </Button>
      <Divider type="vertical" />
      <Button onClick={() => openModal("sign_up")}> 注册</Button>
    </div>
  );
};
export default App_Login;
function updateErrors(
  serverErrors: { [p: string]: string[] },
  form: FormInstance<any>
) {
  useEffect(() => {
    if (Object.keys(serverErrors)?.length > 0) {
      const fields = Object.keys(serverErrors).map((key) => ({
        name: key,
        errors: serverErrors[key],
      }));
      form.setFields(fields);
    }
  }, [serverErrors, form]);
}
