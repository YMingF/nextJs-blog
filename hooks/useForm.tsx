import React, { FormEvent, ReactChild, useCallback, useState } from "react";
import { AxiosResponse } from "axios";

type Field<T> = {
  label: string;
  type: "text" | "password" | "textarea";
  key: keyof T;
};
type useFormOptions<T> = {
  initFormData: T;
  fields: Field<T>[];
  buttons: ReactChild;
  submit: {
    request: (formData: T) => Promise<AxiosResponse<T>>;
    success: () => void;
  };
};
export function useForm<T>(options: useFormOptions<T>) {
  const { initFormData, fields, buttons, submit } = options;
  const [formData, setFormData] = useState(initFormData);
  const [errors, setErrors] = useState(() => {
    const e: { [key in keyof T]?: string[] } = {};
    for (let key in initFormData) {
      if (initFormData.hasOwnProperty(key)) {
        e[key] = [];
      }
    }
    return e;
  });
  const onChanged = useCallback(
    (key: keyof T, value: any) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  const _onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit.request(formData).then(submit.success, (err) => {
        if (err.response) {
          const response: AxiosResponse = err.response;
          if (response.status === 422) {
            setErrors(response.data);
          } else if (response.status === 401) {
            window.alert("请重新登录");
            window.location.href = `/sign_in?return_to=${encodeURIComponent(
              window.location.pathname
            )}`;
          }
        }
      });
    },
    [submit, formData]
  );

  const form = (
    <form onSubmit={_onSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              onChange={(e) => onChanged(field.key, e.target.value)}
              value={formData[field.key].toString()}
            ></textarea>
          ) : (
            <input
              type={field.type}
              value={formData[field.key].toString()}
              onChange={(e) => onChanged(field.key, e.target.value)}
            />
          )}

          {errors[field.key]?.length > 0 && (
            <div>{errors[field.key].join(",")}</div>
          )}
        </div>
      ))}
      {buttons}
    </form>
  );
  return {
    form,
    setErrors,
  };
}
