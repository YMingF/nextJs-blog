import { useGlobalState } from "@/context/globalStateContext";
import AppComment from "@/pages/comment";
import { Comment } from "@/src/entity/Comment";
import { formatDate } from "@/utils/date.utils";
import { LikeFilled, MessageFilled, MoreOutlined } from "@ant-design/icons";
import { Button, Drawer, message, Modal, Popover } from "antd";
import axios from "axios";
import BoringAvatars from "boring-avatars";
import marked from "marked";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { customNextApiRequest, User } from "../../common-type";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { withSession } from "../../lib/withSession";
import { Post } from "../../src/entity/Post";
import styles from "./styles/post-detail.module.scss";

type Props = {
  postData: Post;
  uuid: string;
  currentUser: User | null;
  comments: Comment[] | null;
};
const postsShow: NextPage<Props> = (props) => {
  const { postData, currentUser, uuid } = props;
  const [post, setPost] = useState<Post>(postData);
  const [commentData, setCommentData] = useState<Comment[]>(props.comments);
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
          编辑
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
          删除
        </Button>
      </div>
    </>
  );

  const toggleComment = useCallback((val: boolean, user: any) => {
    if (val && !user) {
      messageApi.error("请先登录");
      return;
    }
    setCommentDrawerOpen(val);
  }, []);
  const handleLike = (post: Post, userId: string) => {
    if (post.likesUserId?.includes(userId)) {
      axios
        .post(`/api/v1/posts/like/cancel?uuid=${post.uuid}&userId=${userId}`)
        .then((res) => {
          setPost({ ...post, likesUserId: res.data.likesUserId });
        });
    } else {
      axios
        .post(`/api/v1/posts/like/save?uuid=${post.uuid}&userId=${userId}`)
        .then((res) => {
          setPost({ ...post, likesUserId: res.data.likesUserId });
        });
    }
  };

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
            <BoringAvatars size={20} name={userId}></BoringAvatars>
            <p className="tw-text-slate-500 tw-flex tw-gap-2.5 tw-items-center">
              <span className="tw-text-sm">{user?.username}</span>
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
                <span className={`tw-text-sm tw-ml-1`}>
                  {post.likesUserId?.length}
                </span>
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
        title="注意"
        open={delModalOpen}
        onCancel={() => {
          setDelModalOpen(false);
        }}
        onOk={handleDelPost}
        closable={false}
        okText={"确定"}
        cancelText={"取消"}
      >
        删除是不可逆转的，此文章将被完全删除！
      </Modal>
      {/*  展示评论内容*/}
      <Drawer
        title="评论"
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
    // 拿到连接，从连接中去获取数据。
    const connection = await getDatabaseConnection();
    const { uuid = "" } = context.params;
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    //  用context.params.id去获取你路由跳转时传过来的id值
    // @ts-ignore
    const post = await connection.manager.findOne(Post, { where: { uuid } });
    const comments = await connection.manager.find(Comment, {
      where: { postId: post.id },
    });
    return {
      props: {
        currentUser,
        uuid,
        comments: JSON.parse(JSON.stringify(comments)),
        postData: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
