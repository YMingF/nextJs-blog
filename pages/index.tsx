import { NextPage } from "next";
import { fetchArticles } from "../lib/fetchArticles";
import ArticleCard from "../components/article/articleCard";
import { KeyValString } from "../common-type";
import styles from "../styles/index.module.scss";
import { useEffect, useState } from "react";
import eventEmitter from "../emitter/eventEmitter";
import { get } from "lodash";
import { Empty } from "antd";
import "../styles/index.module.scss";

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
      className={`${styles.homeArticleBox}  homeArticleBox tw-flex tw-flex-wrap tw-h-full tw-max-h-full  tw-mt-5 tw-mx-auto tw-relative tw-bg-white tw-rounded`}
    >
      {posts?.map((post: KeyValString, index: number) => {
        return <ArticleCard key={index} articleData={post}></ArticleCard>;
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
