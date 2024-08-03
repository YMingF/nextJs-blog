import { Form, Input } from "antd";
import MarkdownEditor from "@/components/MarkdownEditor";
import React, { useCallback } from "react";

interface UseMarkdownProps {
  title?: string;
  content?: string;
  onFormChange?: (data: any) => void;
}
export function UseMarkdown<T extends UseMarkdownProps>(props?: T) {
  const [form] = Form.useForm();

  const handleMarkdownChange = useCallback((data: any) => {
    form.setFieldsValue({ content: data });
    handleFormChange({ title: form.getFieldValue("title"), content: data });
  }, []);

  const handleFormChange = useCallback((data: any) => {
    if (props.onFormChange) {
      props.onFormChange(data);
    }
  }, []);
  return (
    <>
      <Form
        form={form}
        initialValues={{ title: props?.title, content: props.content }}
        onValuesChange={handleFormChange}
      >
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
  );
}
