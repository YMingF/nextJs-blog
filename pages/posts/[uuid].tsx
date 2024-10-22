import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
import { useGlobalState } from "@/context/globalStateContext";
import AppComment from "@/pages/comment";
import { formatDate } from "@/utils/date.utils";
import { globalPrisma } from "@/utils/prisma.utils";
import { LikeFilled, MessageFilled, MoreOutlined } from "@ant-design/icons";
import { Button, Drawer, message, Modal, Popover } from "antd";
import axios from "axios";
import BoringAvatars from "boring-avatars";
import marked from "marked";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { customNextApiRequest } from "../../common-type";
import { withSession } from "../../lib/withSession";
import styles from "./styles/post-detail.module.scss";

type Props = {
  postData: KeyValMap;
  uuid: string;
  postAuthorInfo: KeyValMap;
  currentUser: KeyValMap | null;
  comments: KeyValMap[] | null;
};
const postsShow: NextPage<Props> = (props) => {
  const { postData, postAuthorInfo, uuid } = props;
  const [post, setPost] = useState<KeyValMap>(postData);
  const [commentData, setCommentData] = useState<KeyValMap[]>(props.comments);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useGlobalState();
  const userId = user?.id?.toString();
  const [actionPopoverOpen, setActionPopoverOpen] = useState(false);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      messageApi.error("请先登录");
      return;
    }
    setActionPopoverOpen(newOpen);
  };

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
          content: MESSAGES.DELETE.SUCCESS,
          duration: 1,
        });
        router.push("/");
      },
      async () => {
        await messageApi.open({
          type: "error",
          content: MESSAGES.DELETE.ERROR,
          duration: 500,
        });
      }
    );
  }, [uuid]);

  const editPost = useCallback(() => {
    router.push(`/posts/${uuid}/edit`);
  }, []);
  const [delModalOpen, setDelModalOpen] = useState<boolean>(false);

  const context = (
    <>
      <div className={`tw-flex tw-flex-col tw-items-start`}>
        <Button type="link" onClick={editPost}>
          {MESSAGES.COMMON.EDIT}
        </Button>
        <Button
          type="link"
          danger
          onClick={() => {
            setDelModalOpen(true);
            setTimeout(() => {
              setActionPopoverOpen(false);
            }, 100);
          }}
        >
          {MESSAGES.COMMON.DELETE}
        </Button>
      </div>
    </>
  );

  const toggleComment = useCallback((val: boolean, user: any) => {
    if (val && !user) {
      messageApi.error(MESSAGES.ERRORS.LOGIN_ERROR);
      return;
    }
    setCommentDrawerOpen(val);
  }, []);
  const handleLike = (post: KeyValMap, userId: string) => {
    axios
      .post(`/api/v1/posts/toggleLike?uuid=${post.uuid}&userId=${userId}`)
      .then((res) => {
        setPost({
          ...res.data.post,
        });
      });
  };

  return (
    <>
      {contextHolder}
      <div
        className={`${styles.postDetailBox} tw-my-0 tw-mx-auto tw-bg-white tw-flex tw-flex-col tw-items-center`}
      >
        <div className={`${styles.postDetailInnerBox}`}>
          {/* 文章标题 */}
          <div className="titleLabel">
            <h1>{post.title}</h1>
          </div>
          {/* 文章作者信息 */}
          <div
            className={`${styles.userBaseInfo} tw-flex tw-gap-2.5 tw-items-center`}
          >
            <BoringAvatars
              size={20}
              name={postAuthorInfo?.username}
            ></BoringAvatars>
            <p className="tw-text-slate-500 tw-flex tw-gap-2.5 tw-items-center">
              <span className="tw-text-sm">{postAuthorInfo?.username}</span>
              <span className="tw-text-sm">{formatDate(post?.updatedAt)}</span>
            </p>
          </div>
          <div
            className={`${styles.headerActions} tw-flex tw-items-center tw-gap-4  `}
          >
            {/* 点赞按钮 */}
            <div
              className={`tw-flex tw-items-center  tw-cursor-pointer ${
                post.likesUserId?.includes(userId) ? styles.isLiked : ""
              }`}
            >
              <div
                className="tw-flex tw-items-center tw-cursor-pointer"
                onClick={() => handleLike(post, userId)}
              >
                <LikeFilled />
                <span className={`tw-text-sm tw-ml-1`}>{post.likesAmt}</span>
              </div>
            </div>
            {/* 评论按钮 */}
            <div
              className={`tw-flex tw-items-center tw-gap-1 tw-cursor-pointer ${styles.comments}`}
              onClick={() => toggleComment(true, user)}
            >
              <MessageFilled />
              <span className={`commentNum ${styles.commentCount}`}>
                {commentData?.length}
              </span>
            </div>
            {/* 更多操作按钮 */}
            <div>
              <Popover
                open={actionPopoverOpen}
                onOpenChange={handleOpenChange}
                content={context}
                trigger="click"
                placement={"bottom"}
              >
                <MoreOutlined />
              </Popover>
            </div>
          </div>
          <article
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          ></article>
        </div>
      </div>
      <Modal
        title={MESSAGES.COMMON.ATTENTION}
        open={delModalOpen}
        onCancel={() => {
          setDelModalOpen(false);
        }}
        onOk={handleDelPost}
        closable={false}
        okText={MESSAGES.COMMON.CONFIRM}
        cancelText={MESSAGES.COMMON.CANCEL}
      >
        {MESSAGES.DELETE.CONFIRM}
      </Modal>
      {/*  展示评论内容*/}
      <Drawer
        width={"35%"}
        title={MESSAGES.COMMENT.TITLE}
        onClose={() => toggleComment(false, user)}
        open={commentDrawerOpen}
      >
        <AppComment
          postId={post.id}
          userId={userId}
          commentData={commentData}
          syncCommentData={setCommentData}
        ></AppComment>
      </Drawer>
    </>
  );
};
export default postsShow;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const { uuid = "" } = context.params;
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    //  用context.params.id去获取你路由跳转时传过来的id值
    const post = await globalPrisma.post.findUnique({
      where: { uuid: uuid as string },
    });
    const author = await globalPrisma.user.findUnique({
      where: { id: Number(post?.userId) },
    });
    const comments = await globalPrisma.comment.findMany({
      where: { postId: post.id },
    });
    return {
      props: {
        currentUser,
        uuid,
        comments: JSON.parse(JSON.stringify(comments)),
        postData: JSON.parse(JSON.stringify({ ...post })),
        postAuthorInfo: JSON.parse(JSON.stringify(author)),
      },
    };
  }
);
