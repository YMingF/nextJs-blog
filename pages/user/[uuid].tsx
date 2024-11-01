import { customNextApiRequest } from "@/common-type";
import ArticleList from "@/components/user/article.list";
import FolloweeList from "@/components/user/followee.list";
import { KeyValMap } from "@/constants/common-type";
import { MESSAGES } from "@/constants/messages";
import { useGlobalState } from "@/context/globalStateContext";
import { userService } from "@/services/userService";
import { globalPrisma } from "@/utils/prisma.utils";
import { Button, Skeleton, Tabs } from "antd";
import BoringAvatars from "boring-avatars";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { withSession } from "../../lib/withSession";
import { useUserChangeListener } from "./hooks/useUserChangeListener";
import styles from "./styles/userDetail.module.scss";

type Props = {
  posts: KeyValMap;
  userInfo: KeyValMap;
  followed: boolean;
};

const userDetailPage: NextPage<Props> = (props) => {
  const { posts, userInfo, followed } = props;
  const [isFollowing, setIsFollowing] = useState(followed);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useGlobalState();

  useUserChangeListener(router);

  useEffect(() => {
    setIsFollowing(followed);
    setIsLoading(false);
  }, [followed, router.query.uuid]);

  const userDetailTabs = [
    {
      key: "posts",
      label: MESSAGES.POST.TITLE,
      children: <ArticleList posts={posts} />,
    },
  ];

  const handleFollow = async (followType: "follow" | "unfollow") => {
    if (followType === "follow") {
      const res = await userService.follow(user?.id, userInfo.id);
      if (res.data.success) {
        setIsFollowing(true);
      }
    } else {
      const res = await userService.unfollow(user?.id, userInfo.id);
      if (res.data.success) {
        setIsFollowing(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
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
            {user?.id !== userInfo?.id && !isLoading && (
              <div className="tw-flex tw-gap-2 tw-mt-3">
                {isFollowing ? (
                  <Button onClick={() => handleFollow("unfollow")}>
                    已关注
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => handleFollow("follow")}>
                    关注
                  </Button>
                )}
                <Button>私信</Button>
              </div>
            )}
            {/* 关注列表 */}
            <div
              className={`${styles.followListBox} tw-flex tw-flex-col tw-gap-1`}
            >
              <h4 className="tw-text-sm tw-text-slate-800 tw-leading-5 tw-font-medium">
                Ta 关注的
              </h4>
              <FolloweeList followerId={userInfo.id} />
              <div
                className={`${styles.followList} tw-flex tw-flex-wrap tw-gap-2`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default userDetailPage;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const { uuid = "" } = context.params;
    const loginedUser =
      (context.req as customNextApiRequest).session.get("currentUser") || null;
    const posts = await globalPrisma.post.findMany({
      where: { User: { uuid: String(uuid) } },
      include: { User: true },
    });
    const userInfo = await globalPrisma.user.findUnique({
      where: { uuid: String(uuid) },
    });

    let followed = await getIsFollowed(loginedUser, userInfo);
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
        followed,
      },
    };
  }
);

const onTabChange = (key: string) => {};
async function getIsFollowed(loginedUser: KeyValMap, userInfo: KeyValMap) {
  let followed = false;
  if (loginedUser) {
    const followRecord = await globalPrisma.follow.findFirst({
      where: {
        followerId: loginedUser.id,
        followingId: Number(userInfo.id),
      },
    });
    followed = !!followRecord;
  }
  return followed;
}
