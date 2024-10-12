import { KeyValMap } from "@/constants/common-type";
import eventEmitter from "@/emitter/eventEmitter";
import { UseMarkdown } from "@/hooks/useMarkdown";
import { message } from "antd";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection";
import { Post } from "../../../src/entity/Post";

type Props = {
  uuid: number;
  post: Post;
};
const PostEdit: NextPage<Props> = (props) => {
  const { uuid, post } = props;
  const [form, setForm] = useState({});
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const syncForm = (data: any) => {
    setForm(data);
  };
  const updateMarkdown = () => {
    axios.patch(`/api/v1/posts/${uuid}`, form).then(
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
  }, [form]);
  return (
    <section>
      {contextHolder}
      {UseMarkdown({
        title: post.title,
        content: post.content,
        onFormChange: syncForm,
      })}
    </section>
  );
};
export default PostEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uuid } = context.params;
  const connection = await getDatabaseConnection();
  const post =
    (await connection.manager.findOne("Post", { where: { uuid } })) || "''";
  return {
    props: {
      uuid: uuid,
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
