import { FormInstance } from "antd";
import { useEffect } from "react";

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
