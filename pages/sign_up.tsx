import { NextPage } from "next";
import { useCallback, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Form } from "../components/Form";

const signUpPage: NextPage = () => {
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
      axios.post(`/api/v1/users`, formData).then(
        () => {
          window.alert("注册成功");
          window.location.href = "/sign_in";
        },
        (err) => {
          if (err.response) {
            const response: AxiosResponse = err.response;
            if (response.status === 422) {
              setErrors(response.data);
            }
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
      <h1>注册页面</h1>
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
          {
            label: "passwordConfirmation",
            type: "password",
            value: formData.passwordConfirmation,
            errors: errors.passwordConfirmation,
            onChange: (e) => onChanged("passwordConfirmation", e.target.value),
          },
        ]}
        onSubmit={onSubmit}
        buttons={<button type="submit">register</button>}
      ></Form>
    </>
  );
};
export default signUpPage;
