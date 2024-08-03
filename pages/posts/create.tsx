import React, { useEffect, useState } from "react";
import eventEmitter from "../../emitter/eventEmitter";
import { message } from "antd";
import { useRouter } from "next/router";
import { KeyValString } from "@/common-type";
import axios from "axios";
import { UseMarkdown } from "@/hooks/useMarkdown";

const CreatePost = () => {
  const router = useRouter();
  const [form, setForm] = useState({});

  const [messageApi, contextHolder] = message.useMessage();
  const syncForm = (data: any) => {
    setForm(data);
  };
  const saveMarkdown = () => {
    axios.post("/api/v1/posts", form).then(async ({ data }: KeyValString) => {
      await messageApi.success({ content: "发布成功", duration: 0.8 });
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
      {UseMarkdown({
        onFormChange: syncForm,
      })}
    </div>
  );
};

export default CreatePost;
