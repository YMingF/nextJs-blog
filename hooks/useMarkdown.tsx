import { Form, Input } from "antd";
import MarkdownEditor from "@/components/markdownEditor/MarkdownEditor";
import React, { useCallback } from "react";
import styles from "./markdown.module.scss";

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
        <div className={`${styles.inputItem}`}>
          <Form.Item
            name="title"
            className={"tw-flex tw-items-center"}
            rules={[{ required: true }]}
          >
            <Input
              className={"tw-border-0"}
              placeholder="请输入标题"
              required
              onChange={(e) => {
                form.setFieldValue("title", e.target.value);
              }}
            />
          </Form.Item>
        </div>

        <Form.Item name="content" rules={[{ required: true }]}>
          <MarkdownEditor
            initialValue={props.content}
            onMarkdownChange={handleMarkdownChange}
          />
        </Form.Item>
      </Form>
    </>
  );
}
