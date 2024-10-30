import { Empty } from "antd";
import axios from "axios";
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
      // 有内容的时候，再去调接口搜索。避免筛选出全部的文章
      if (router.query?.q && router.query.q !== prevQuery) {
        const encodedQuery = router.query.q as string;
        const res = await axios.get(
          `/api/v1/search_api/search?q=${encodedQuery}`
        );
        const data = res.data;
        setPostsData(data || []);
        setPrevQuery(router.query.q as string);
      }
    };
    fetchPosts();
  }, [router.query.q, prevQuery]);
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
