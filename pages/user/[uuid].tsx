import ArticleList from "@/components/user/article.list";
import { KeyValMap } from "@/constants/common-type";
import { globalPrisma } from "@/utils/prisma.utils";
import { Tabs } from "antd";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { withSession } from "../../lib/withSession";
import { useUserChangeListener } from "./hooks/useUserChangeListener";
import styles from "./styles/userDetail.module.scss";

type Props = {
  posts: KeyValMap;
};

const userDetailPage: NextPage<Props> = (props) => {
  const { posts } = props;
  const router = useRouter();

  useUserChangeListener(router);

  const userDetailTabs = [
    {
      key: "posts",
      label: "文章",
      children: <ArticleList posts={posts} />,
    },
  ];

  return (
    <div className={`${styles.userDetailBox} tw-mx-auto`}>
      <Tabs
        defaultActiveKey="posts"
        items={userDetailTabs}
        onChange={onTabChange}
      />
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
    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
      },
    };
  }
);

const onTabChange = (key: string) => {
  console.log(key);
};
