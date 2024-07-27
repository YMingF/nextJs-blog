import React, { useEffect, useRef, useState } from "react";
import MarkdownEditor from "../../components/MarkdownEditor";
import axios from "axios";
import eventEmitter from "../../emitter/eventEmitter";
import { Input, message } from "antd";

const Home = () => {
  const [markdownData, setMarkdownData] = useState({ title: "", content: "" });
  const handleMarkdownChange = (data: any) => {
    setMarkdownData((prevState) => ({
      ...prevState,
      content: data,
    }));
  };
  const markdownDataRef = useRef(markdownData);
  useEffect(() => {
    markdownDataRef.current = markdownData;
  }, [markdownData]);

  const [messageApi, contextHolder] = message.useMessage();
  const saveMarkdown = () => {
    axios.post("/api/v1/posts", markdownDataRef.current).then((data) => {
      messageApi.success("发布成功");
    });
  };
  useEffect(() => {
    eventEmitter.on("publishMarkdownEvt", saveMarkdown);
    return () => {
      eventEmitter.off("publishMarkdownEvt", saveMarkdown);
    };
  }, []);

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
