import { KeyValMap } from "@/constants/common-type";
import { UseMarkdown } from "@/hooks/useMarkdown";
import { message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import eventEmitter from "../../emitter/eventEmitter";

const CreatePost = () => {
  const router = useRouter();
  const [form, setForm] = useState({});

  const [messageApi, contextHolder] = message.useMessage();
  const syncForm = (data: any) => {
    setForm(data);
  };
  const saveMarkdown = () => {
    axios
      .post("/api/v1/posts/create", form)
      .then(async ({ data }: KeyValMap) => {
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
      <div className={"tw-mt-2"}>
        {UseMarkdown({
          onFormChange: syncForm,
        })}
      </div>
    </div>
  );
};

export default CreatePost;
