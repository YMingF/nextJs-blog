import MilkdownEditorWrapper from "@/components/markdownEditor/MilkdownEditor";
import { KeyValMap } from "@/constants/common-type";
import eventEmitter from "@/emitter/eventEmitter";
import { globalPrisma } from "@/utils/prisma.utils";
import { message } from "antd";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles/edit.post.module.scss";
type Props = {
  uuid: number;
  post: KeyValMap;
};
const PostEdit: NextPage<Props> = (props) => {
  const { uuid, post } = props;
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [markdownData, setMarkdownData] = useState(post.content);
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue !== post.content) {
        setMarkdownData(newValue);
      }
    },
    [post.content]
  );
  const updateMarkdown = () => {
    axios.patch(`/api/v1/posts/${uuid}`, { content: markdownData }).then(
      async ({ data }: KeyValMap) => {
        await messageApi.success("更新成功");
        router.push(`/posts/${data.uuid}`);
      },
      async () => {
        await messageApi.error("更新失败");
      }
    );
  };
  useEffect(() => {
    eventEmitter.on("updatePostEvt", updateMarkdown);
    return () => {
      eventEmitter.off("updatePostEvt", updateMarkdown);
    };
  }, [markdownData]);
  return (
    <section className={styles.editPostBox}>
      {contextHolder}
      <MilkdownEditorWrapper
        defaultValue={post.content}
        onValueChange={handleValueChange}
      />
    </section>
  );
};
export default PostEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uuid } = context.params;
  const post = await globalPrisma.post.findUnique({
    where: { uuid: uuid as string },
  });
  return {
    props: {
      uuid: uuid,
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
