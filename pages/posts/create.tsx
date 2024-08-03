import React, { useEffect } from "react";
import MarkdownEditor from "../../components/MarkdownEditor";
import eventEmitter from "../../emitter/eventEmitter";
import { Form, Input, message } from "antd";
import { useRouter } from "next/router";
import { KeyValString } from "@/common-type";
import axios from "axios";

const CreatePost = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const handleMarkdownChange = (data: any) => {
    form.setFieldValue("content", data);
  };
  const saveMarkdown = () => {
    console.log(`form.getFieldsValue`, form.getFieldsValue());
    axios
      .post("/api/v1/posts", form.getFieldsValue())
      .then(({ data }: KeyValString) => {
        messageApi.success("发布成功");
        router.replace(`/posts/${data.uuid}`);
      });
  };
  useEffect(() => {
    eventEmitter.on("publishPostEvt", saveMarkdown);
    return () => {
      eventEmitter.off("publishPostEvt", saveMarkdown);
    };
  }, [form]);

  return (
    <div>
      {contextHolder}
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
    </div>
  );
};

export default CreatePost;
