import MilkdownEditorWrapper from "@/components/markdownEditor/MilkdownEditor";
import { KeyValMap } from "@/constants/common-type";
import { message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import eventEmitter from "../../emitter/eventEmitter";
import styles from "./styles/create.post.module.scss";
const CreatePost = () => {
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [markdownData, setMarkdownData] = useState("");
  const syncMarkdown = useCallback(
    (data: any) => {
      setMarkdownData(data);
    },
    [""]
  );

  const saveMarkdown = () => {
    axios
      .post("/api/v1/posts/create", { content: markdownData })
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
    <div className={`${styles.editorWrapper}`}>
      {contextHolder}
      <div className={"tw-mt-2 tw-h-full tw-flex tw-flex-col"}>
        <MilkdownEditorWrapper defaultValue={""} onValueChange={syncMarkdown} />
      </div>
    </div>
  );
};

export default CreatePost;
