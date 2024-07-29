import React, { useEffect, useRef, useState } from "react";
import MarkdownEditor from "../../components/MarkdownEditor";
import axios from "axios";
import eventEmitter from "../../emitter/eventEmitter";
import { Input, message } from "antd";
import { KeyValString } from "../../common-type";
import { useRouter } from "next/router";

const Home = () => {
  const [markdownData, setMarkdownData] = useState({ title: "", content: "" });
  const markdownDataRef = useRef(markdownData);
  useEffect(() => {
    markdownDataRef.current = markdownData;
  }, [markdownData]);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const handleMarkdownChange = (data: any) => {
    setMarkdownData((prevState) => ({
      ...prevState,
      content: data,
    }));
  };
  const saveMarkdown = () => {
    axios
      .post("/api/v1/posts", markdownDataRef.current)
      .then(({ data }: KeyValString) => {
        messageApi.success("发布成功");
        router.replace(`/posts/${data.uuid}`);
      });
  };
  useEffect(() => {
    eventEmitter.on("publishMarkdownEvt", saveMarkdown);
    return () => {
      eventEmitter.off("publishMarkdownEvt", saveMarkdown);
    };
  }, [markdownDataRef]);

  return (
    <div>
      {contextHolder}
      <Input
        placeholder="请输入标题"
        required
        value={markdownData["title"]}
        onChange={(e) =>
          setMarkdownData((prevState) => ({
            ...prevState,
            title: e.target.value,
          }))
        }
      />
      <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
    </div>
  );
};

export default Home;
