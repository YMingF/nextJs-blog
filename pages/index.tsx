import { KeyValMap } from "@/constants/common-type";
import { useGlobalState } from "@/context/globalStateContext";
import { Empty } from "antd";
import { get } from "lodash";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import ArticleCard from "../components/article/articleCard";
import eventEmitter from "../emitter/eventEmitter";
import { fetchArticles } from "../lib/fetchArticles";
import styles from "../styles/index.module.scss";

const Home: NextPage = (props: any) => {
  const [posts, setPosts] = useState(props.posts || []);
  const { storeUserInfoMap } = useGlobalState();
  storeUserInfoMap(props.userInfoMapping);
  useEffect(() => {
    const handleSearchChanged = (data: any) => {
      const articleData = get(data, "data", []);
      setPosts(articleData);
    };
    eventEmitter.on("searchFilterDataChanged", handleSearchChanged);
    return () => {
      eventEmitter.off("searchFilterDataChanged", handleSearchChanged);
    };
  }, []);
  return (
    <div
      className={`${styles.homeArticleBox}  homeArticleBox tw-flex tw-flex-wrap tw-h-full tw-max-h-full  tw-mt-5 tw-mx-auto tw-relative tw-bg-white tw-rounded`}
    >
      {posts?.map((post: KeyValMap, index: number) => {
        return (
          <ArticleCard
            key={post.uuid}
            articleData={{ ...post, userInfo: props.userInfoMapping }}
          ></ArticleCard>
        );
      })}
      {posts?.length === 0 && (
        <div className={`${styles.emptyWrapper}`}>
          <Empty description={"无数据"} />
        </div>
      )}
      <style jsx>{`
        :global(.article-card-box) {
          width: 50%;
          flex-basis: 50%;
        }
      `}</style>
    </div>
  );
};
export default Home;

export const getServerSideProps = async (context: any) => {
  const { props } = await fetchArticles(context);
  return {
    props: { ...props },
  };
};
