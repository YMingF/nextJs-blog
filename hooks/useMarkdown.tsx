import { Form, Input } from "antd";
import MarkdownEditor from "@/components/MarkdownEditor";
import React, { createContext } from "react";

const FormContext = createContext(null);
export function UseMarkdown() {
  const [form] = Form.useForm();
  const handleMarkdownChange = (data: any) => {
    form.setFieldValue("content", data);
  };
  return {
    form: form.getFieldsValue(),
    context: (
      <>
        <Form form={form}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input
              placeholder="请输入标题"
              onChange={(e) => {
                form.setFieldValue("title", e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item name="content" rules={[{ required: true }]}>
            <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
          </Form.Item>
        </Form>
      </>
    ),
  };
}
