import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";
import marked from "marked";
import { withSession } from "../../lib/withSession";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { customNextApiRequest, User } from "../../common-type";
import styles from "./styles/post-detail.module.scss";
import BoringAvatars from "boring-avatars";
import { useGlobalState } from "@/context/globalStateContext";
import { CommentSvg } from "@/lib/customPic";
import { Button, message, Modal, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";

type Props = {
  post: Post;
  uuid: string;
  currentUser: User | null;
};
const postsShow: NextPage<Props> = (props) => {
  const { post, currentUser, uuid } = props;

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useGlobalState();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!post) {
      router.push("/");
    }
  }, [post]);
  const handleDelPost = useCallback(() => {
    axios.delete(`/api/v1/posts/${uuid}`).then(
      async () => {
        await messageApi.open({
          type: "success",
          content: "删除成功",
          duration: 1,
        });
        router.push("/");
      },
      async () => {
        await messageApi.open({
          type: "error",
          content: "删除失败",
          duration: 500,
        });
        setOpen(false);
      }
    );
  }, [uuid]);

  const editPost = useCallback(() => {
    router.push(`/posts/${uuid}/edit`);
  }, []);

  const content = (
    <div className={`tw-flex tw-flex-col tw-items-start`}>
      <Button type="link" onClick={editPost}>
        编辑
      </Button>
      <Button type="link" danger onClick={() => setOpen(true)}>
        删除
      </Button>
      <Modal
        title="注意"
        open={open}
        onOk={handleDelPost}
        okText={"确定"}
        cancelText={"取消"}
        onCancel={() => setOpen(false)}
      >
        删除是不可逆转的，此文章将被完全删除！
      </Modal>
    </div>
  );
  return (
    <>
      {contextHolder}

      <div
        className={`${styles.postDetailBox} tw-my-0 tw-mx-auto tw-bg-white tw-flex tw-flex-col tw-items-center`}
      >
        <div className={`${styles.postDetailInnerBox}`}>
          <div className="titleLabel">
            <h1>{post.title}</h1>
          </div>
          <div
            className={`${styles.userBaseInfo} tw-flex tw-gap-2.5 tw-items-center`}
          >
            <BoringAvatars size={20} name={user?.username}></BoringAvatars>
            <span className={"tw-text-xs tw-text-slate-300"}>
              {user?.username}
            </span>
          </div>
          <div className={`${styles.headerActions} tw-flex tw-items-center `}>
            <div className={`tw-flex tw-items-center ${styles.comments}`}>
              <CommentSvg></CommentSvg>
              <span className={`commentNum`}></span>
            </div>
            <div className={`${styles.moreAction}`}>
              <Popover content={content} trigger="click" placement={"bottom"}>
                <Button type="link">
                  <MoreOutlined />
                </Button>
              </Popover>
            </div>
          </div>
          <article
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          ></article>
        </div>
      </div>
    </>
  );
};
export default postsShow;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // 拿到连接，从连接中去获取数据。
    const connection = await getDatabaseConnection();
    const { uuid = "" } = context.params;
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    //  用context.params.id去获取你路由跳转时传过来的id值
    // @ts-ignore
    const post =
      (await connection.manager.findOne(Post, { where: { uuid } })) || "''";
    return {
      props: {
        currentUser,
        uuid,
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
