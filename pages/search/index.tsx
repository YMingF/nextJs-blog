import SearchPosts from "@/components/search/posts";
import SearchUsers from "@/components/search/users";
import { MESSAGES } from "@/constants/messages";
import { withSession } from "@/lib/withSession";
import styles from "@/pages/search/styles/searchIndex.module.scss";
import { Tabs, TabsProps } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";

const SearchPage: NextPage = () => {
  const router = useRouter();

  const tabItems: TabsProps["items"] = [
    {
      key: "posts",
      label: MESSAGES.POST.TITLE,
      children: <SearchPosts />,
    },
    {
      key: "users",
      label: MESSAGES.USER.TITLE,
      children: <SearchUsers />,
    },
  ];

  const onTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, type: key },
    });
  };

  return (
    <div className={`${styles.searchPageBox} tw-w-5/6`}>
      <Tabs
        defaultActiveKey={(router.query.type as string) || "posts"}
        items={tabItems}
        onChange={onTabChange}
      />
    </div>
  );
};

export default SearchPage;
export const getServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    return {
      props: {},
    };
  }
);
