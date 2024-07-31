import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getDatabaseConnection } from "../../lib/getDatabaseConnection";
import { Post } from "../../src/entity/Post";
import marked from "marked";
import { withSession } from "../../lib/withSession";
import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { customNextApiRequest, User } from "../../common-type";
import styles from "./styles/post-detail.module.scss";
import BoringAvatars from "boring-avatars";
import { useGlobalState } from "@/context/globalStateContext";
import { CommentSvg } from "@/lib/customPic";
import { Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";

type Props = {
  post: Post;
  id: number;
  currentUser: User | null;
};
const postsShow: NextPage<Props> = (props) => {
  const { post, currentUser, id } = props;
  const router = useRouter();
  const { user } = useGlobalState();
  const handleDel = useCallback(() => {
    axios.delete(`/api/v1/posts/${id}`).then(
      () => {
        window.alert("删除成功");
        router.push("/posts");
      },
      () => {
        window.alert("删除失败");
      }
    );
  }, [id]);

  const content = (
    <div className={`tw-flex tw-flex-col tw-items-start`}>
      <Button type="link">编辑</Button>
      <Button type="link" danger>
        删除
      </Button>
    </div>
  );
  return (
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
          <div className="comments">
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
  );
};
export default postsShow;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // 拿到连接，从连接中去获取数据。
    const connection = await getDatabaseConnection();
    const id = context.params.id;
    const currentUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    //  用context.params.id去获取你路由跳转时传过来的id值
    // @ts-ignore
    const post =
      (await connection.manager.findOne(Post, { where: { uuid: id } })) || "''";
    return {
      props: {
        currentUser,
        id: parseInt(id.toString()),
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
