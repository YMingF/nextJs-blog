import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
import { useGlobalState } from "@/context/globalStateContext";
import { generateFocusErrorField, updateErrors } from "@/utils/form.utils";
import { Form, FormInstance, Input, message, Modal } from "antd";
import { NamePath, StoreValue } from "antd/es/form/interface";
import axios from "axios";
import { get } from "lodash";
import { useCallback, useRef, useState } from "react";

let activeModelType: "sign_in" | "sign_up" | null = null;
const titleMap = {
  sign_in: MESSAGES.COMMON.SIGN_IN,
  sign_up: MESSAGES.COMMON.SIGN_UP,
};
export function useLogin() {
  const { storeUser } = useGlobalState();
  const fieldRefs = useRef<any>({});
  const [form] = Form.useForm();
  const [serverErrors, setServerErrors] = useState(
    {} as { [key: string]: string[] }
  );
  const [messageApi, contextHolder] = message.useMessage();

  updateErrors(serverErrors, form);

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
      if (getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(MESSAGES.ERRORS.PASSWORD_IS_NOT_SAME));
    },
  });
  const handleModalOk = async (close: Function) => {
    try {
      await form.validateFields();
      await handleLoginConfirm(
        form,
        activeModelType,
        messageApi,
        storeUser,
        setServerErrors
      );
      close();
    } catch (err) {
      focusErrorField();
      // 返回 reject 就不会自动关闭弹窗
      return Promise.reject();
    }
  };

  const showAuthModal = useCallback((modalType: "sign_in" | "sign_up") => {
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
      onOk: handleModalOk,
    });
  }, []);
  return { showAuthModal };
}
async function handleLoginConfirm(
  form: FormInstance<any>,
  modalType: string,
  messageApi: any,
  storeUser: any,
  setServerErrors: any
) {
  const formData = form.getFieldsValue();
  const api = modalType === "sign_in" ? "sessions" : "users";

  try {
    const response = await axios.post(`/api/v1/${api}`, formData);

    if (modalType === "sign_in") {
      await showSuccessMessage(messageApi, MESSAGES.USER.LOGIN_SUCCESS);
      storeUser(get(response, "data"));
    } else {
      await showSuccessMessage(messageApi, MESSAGES.USER.REGISTER_SUCCESS);
      storeUser(get(response, "data"));
      await handleSignIn({
        username: formData.username,
        password: formData.password,
      });
    }

    setServerErrors({});
    form.resetFields();
    return true;
  } catch (errors) {
    const errorCode = get(errors, "response.data.errorCode");
    // username 和 password 是表单对应的属性名
    const errorMap = {
      USER_NOT_FOUND: { username: [MESSAGES.ERRORS.USER_NOT_FOUND] },
      PASSWORD_INCORRECT: { password: [MESSAGES.ERRORS.PASSWORD_INCORRECT] },
    } as KeyValMap;
    setServerErrors(errorMap[errorCode] || {});
    throw new Error(errorMap[errorCode] || MESSAGES.ERRORS.SERVER_ERROR);
  }
}
// Helper function for showing messages
function showSuccessMessage(messageApi: any, content: string): Promise<void> {
  return new Promise((resolve) => {
    messageApi.success({
      content,
      duration: 1,
      onClose: resolve,
    });
  });
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
