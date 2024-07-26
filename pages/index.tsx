import { NextPage } from "next";
import { fetchArticles } from "../lib/fetchArticles";
import ArticleCard from "../components/article/articleCard";
import { KeyValString } from "../common-type";
import styles from "../styles/index.module.scss";

const Home: NextPage = (props: any) => {
  const { posts } = props;
  return (
    <>
      <div
        className={`${styles.homeArticleBox} tw-mt-5 tw-mx-auto tw-relative tw-bg-white tw-rounded`}
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
      </div>
    </>
  );
};
export default Home;

export const getServerSideProps = async (context: any) => {
  const { props } = await fetchArticles(context);
  return {
    props: { ...props },
  };
};
