import ArticleList from "@/components/user/article.list";
import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
import { useGlobalState } from "@/context/globalStateContext";
import { globalPrisma } from "@/utils/prisma.utils";
import { Button, Tabs } from "antd";
import BoringAvatars from "boring-avatars";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { withSession } from "../../lib/withSession";
import { useUserChangeListener } from "./hooks/useUserChangeListener";
import styles from "./styles/userDetail.module.scss";

type Props = {
  posts: KeyValMap;
  userInfo: KeyValMap;
};

const userDetailPage: NextPage<Props> = (props) => {
  const { posts, userInfo } = props;
  const router = useRouter();
  const { user } = useGlobalState();
  useUserChangeListener(router);

  const userDetailTabs = [
    {
      key: "posts",
      label: MESSAGES.POST.TITLE,
      children: <ArticleList posts={posts} />,
    },
  ];

  return (
    <div className={`tw-flex tw-gap-4 ${styles.userDetailBox}  tw-mx-auto`}>
      <div className={`${styles.userDetailTabs}`}>
        <Tabs
          defaultActiveKey="posts"
          items={userDetailTabs}
          onChange={onTabChange}
        />
      </div>
      <div className={`${styles.userDetailInfo}`}>
        <div className="tw-flex tw-gap-2 tw-w-fit">
          <BoringAvatars
            size={40}
            name={userInfo?.id?.toString()}
          ></BoringAvatars>
          <span className="tw-text-center">{userInfo?.username}</span>
        </div>
        {/* 操作按钮 */}
        {user?.id !== userInfo?.id && (
          <div className="tw-flex tw-gap-2 tw-mt-3">
            <Button type="primary">关注</Button>
            <Button>私信</Button>
          </div>
        )}
        {/* 关注列表 */}
        <div className={`${styles.followListBox} tw-flex tw-flex-col tw-gap-2`}>
          <p className="tw-text-xs tw-text-slate-800 tw-leading-5 tw-font-medium">
            Ta 关注的
          </p>
          <div
            className={`${styles.followList} tw-flex tw-flex-wrap tw-gap-2`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default userDetailPage;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const { uuid = "" } = context.params;
    const posts = await globalPrisma.post.findMany({
      where: { User: { uuid: String(uuid) } },
      include: { User: true },
    });
    const userInfo = await globalPrisma.user.findUnique({
      where: { uuid: String(uuid) },
    });
    let postData = JSON.parse(JSON.stringify(posts));
    for (const element of postData) {
      const post: KeyValMap = element;
      const commentsCount = await globalPrisma.comment.count({
        where: { postId: Number(post.id) },
      });
      post.commentsNum = commentsCount;
    }
    return {
      props: {
        posts: postData,
        userInfo: JSON.parse(JSON.stringify(userInfo)),
      },
    };
  }
);

const onTabChange = (key: string) => {};
