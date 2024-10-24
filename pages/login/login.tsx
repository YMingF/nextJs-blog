import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
} from "antd";
import axios from "axios";
import { get } from "lodash";
import { NextPage } from "next";
import { NamePath, StoreValue } from "rc-field-form/lib/interface";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalState } from "../../context/globalStateContext";

interface LoginProps {}

export function generateFocusErrorField(
  form: FormInstance<any>,
  fieldRefs: React.MutableRefObject<any>
) {
  return () => {
    const errors = form.getFieldsError();
    const firstError = errors?.find((err) => err.errors.length > 0);
    if (firstError) {
      const fieldName = firstError.name;
      const errorField = fieldRefs.current[fieldName.toString()];
      errorField?.focus();
    }
  };
}

let activeModelType: "sign_in" | "sign_up" | null = null;
const App_Login: NextPage<LoginProps> = (props: any) => {
  const { user, storeUser } = useGlobalState();
  const fieldRefs = useRef<any>({});
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState(
    {} as { [key: string]: string[] }
  );
  updateErrors(serverErrors, form);

  const titleMap = {
    sign_in: MESSAGES.COMMON.SIGN_IN,
    sign_up: MESSAGES.COMMON.SIGN_UP,
  };

  const [messageApi, contextHolder] = message.useMessage();
  const focusErrorField = useCallback(
    generateFocusErrorField(form, fieldRefs),
    [form]
  );
  const validateConfirmPass = ({
    getFieldValue,
  }: {
    getFieldValue: (name: NamePath) => StoreValue;
  }) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(MESSAGES.ERRORS.PASSWORD_IS_NOT_SAME));
    },
  });
  const openModal = useCallback((modalType: "sign_in" | "sign_up") => {
    activeModelType = modalType;
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
              rules={[
                { required: true, message: MESSAGES.COMMON.CANNOT_BE_EMPTY },
                validateUsername,
              ]}
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
              rules={[
                { required: true, message: MESSAGES.COMMON.CANNOT_BE_EMPTY },
              ]}
            >
              <Input.Password
                ref={(el) => {
                  fieldRefs.current["password"] = el;
                }}
              />
            </Form.Item>
            {modalType === "sign_up" && (
              <Form.Item
                label={MESSAGES.USER.CONFIRM_PASSWORD}
                dependencies={["password"]}
                name="passwordConfirmation"
                rules={[
                  {
                    required: true,
                    message: MESSAGES.USER.RE_CONFIRM_PASSWORD,
                  },
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
                      content: MESSAGES.USER.LOGIN_SUCCESS,
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
                      content: MESSAGES.USER.REGISTER_SUCCESS,
                      duration: 2,
                      onClose: async () => {
                        resolve(true);
                        storeUser(get(successData, "data"));
                        await handleSignIn({
                          username: formData.username,
                          password: formData.password,
                        });
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
        {MESSAGES.COMMON.SIGN_IN}
      </Button>
      <Divider type="vertical" />
      <Button onClick={() => openModal("sign_up")}>
        {MESSAGES.COMMON.SIGN_UP}
      </Button>
    </div>
  );
};
export default App_Login;
export function updateErrors(
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

function handleSignIn(userData: KeyValMap) {
  return axios.post("/api/v1/sessions", userData);
}

const validateUsername = () => ({
  async validator(_: any, value: any) {
    if (activeModelType !== "sign_up" || !value) {
      return Promise.resolve();
    }
    try {
      const response = await axios.get(
        `/api/v1/user/isDuplicate?username=${value}`
      );
      if (JSON.parse(response.data)) {
        return Promise.reject(new Error(MESSAGES.USER.USERNAME_EXISTS));
      }
    } catch (error) {
      console.error("Username validation error:", error);
      return Promise.reject(new Error("验证用户名时出错"));
    }
  },
});
