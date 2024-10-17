import PostEditor from "@/components/post/postEditor/PostEditor";
import { KeyValMap } from "@/constants/common-type";
import eventEmitter from "@/emitter/eventEmitter";
import { message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
const CreatePost = () => {
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [title, setTitle] = useState("");
  const [markdownData, setMarkdownData] = useState("");

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setMarkdownData(newContent);
  }, []);

  const saveMarkdown = () => {
    axios
      .post("/api/v1/posts/create", { content: markdownData, title })
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
  }, [markdownData]);

  return (
    <>
      {contextHolder}
      <PostEditor
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
      />
    </>
  );
};

export default CreatePost;
