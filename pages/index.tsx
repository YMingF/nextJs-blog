import { NextPage } from "next";
import { fetchArticles } from "../lib/fetchArticles";
import ArticleCard from "../components/article/articleCard";
import { KeyValString } from "../common-type";
import styles from "../styles/index.module.scss";
import { useEffect, useState } from "react";
import eventEmitter from "../emitter/eventEmitter";
import { get } from "lodash";
import { Empty } from "antd";

const Home: NextPage = (props: any) => {
  const [posts, setPosts] = useState(props.posts || []);
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
      className={`${styles.homeArticleBox} tw-h-full tw-max-h-full  tw-mt-5 tw-mx-auto tw-relative tw-bg-white tw-rounded`}
    >
      {posts?.map((post: KeyValString) => {
        return (
          <ArticleCard
            key={post.id}
            title={post.title}
            content={post.content}
          ></ArticleCard>
        );
      })}
      {posts?.length === 0 && (
        <div className={`${styles.emptyWrapper}`}>
          <Empty />
        </div>
      )}
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
