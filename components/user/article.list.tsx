import { KeyValMap } from "@/constants/common-type";
import { NextPage } from "next";

type Props = {
  posts: KeyValMap;
};
const ArticleList: NextPage<Props> = (props) => {
  const { posts: postsData } = props;
  console.log("postsData", postsData);
  return (
    <div>
      {postsData.map((post: KeyValMap) => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
};

export default ArticleList;
