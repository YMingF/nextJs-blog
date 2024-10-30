import { Empty } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleList from "../user/article.list";

interface Props {}

const SearchPosts: NextPage<Props> = () => {
  const router = useRouter();
  const [postsData, setPostsData] = useState([]);
  const [prevQuery, setPrevQuery] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      if (router.query?.q !== prevQuery) {
        const encodedQuery = router.query.q as string;
        const res = await fetch(`/api/v1/search_api/search?q=${encodedQuery}`);
        const data = await res.json();
        setPostsData(data || []);
        setPrevQuery(router.query.q as string);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      {postsData?.length > 0 ? (
        <ArticleList posts={postsData} />
      ) : (
        <Empty description="暂无数据" />
      )}
    </div>
  );
};

export default SearchPosts;
