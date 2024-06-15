import React, { ChangeEventHandler, FormEventHandler, ReactChild } from "react";

type Props = {
  onSubmit: FormEventHandler;
  fields: {
    label: string;
    type: "text" | "password" | "textarea";
    value: string | number;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    errors: string[];
  }[];
  buttons: ReactChild;
};
export const Form: React.FC<Props> = (props) => {
  console.log(`props.fields`, props.fields);
  const { fields, onSubmit } = props || {};
  return (
    <form onSubmit={props.onSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea onChange={field.onChange}>{field.value}</textarea>
          ) : (
            <input
              type={field.type}
              value={field.value}
              onChange={field.onChange}
            />
          )}

          {field?.errors?.length > 0 && <div>{field?.errors.join(",")}</div>}
        </div>
      ))}
      {props.buttons}
    </form>
  );
};
