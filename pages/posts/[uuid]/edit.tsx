import PostEditor from "@/components/post/postEditor/PostEditor";
import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
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
  const [postTitle, setTitle] = useState(post.title);

  const updateMarkdown = useCallback(() => {
    axios
      .patch(`/api/v1/posts/${uuid}`, {
        content: markdownData,
        title: postTitle,
      })
      .then(
        async ({ data }: KeyValMap) => {
          await messageApi.success(MESSAGES.POST.UPDATE_SUCCESS);
          router.push(`/posts/${data.uuid}`);
        },
        async () => {
          await messageApi.error(MESSAGES.POST.UPDATE_ERROR);
        }
      );
  }, [uuid, markdownData, postTitle, messageApi, router]);

  useEffect(() => {
    eventEmitter.on("updatePostEvt", updateMarkdown);
    return () => {
      eventEmitter.off("updatePostEvt", updateMarkdown);
    };
  }, [updateMarkdown]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
    },
    [post.title]
  );
  const handleContentChange = useCallback(
    (newContent: string) => {
      setMarkdownData(newContent);
    },
    [post.content]
  );
  return (
    <section className={`${styles.editPostBox} tw-w-full`}>
      {contextHolder}
      <PostEditor
        initialTitle={post.title}
        initialContent={post.content}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
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
