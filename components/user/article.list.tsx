import { KeyValMap } from "@/constants/common-type";
import { sanitizeContent } from "@/lib/img";
import { formatDate } from "@/utils/date.utils";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "./styles/articleList.module.scss";
type Props = {
  posts: KeyValMap;
};
const ArticleList: NextPage<Props> = (props) => {
  const { posts: postsData } = props;
  const router = useRouter();

  const navToPostDetail = (uuid: string) => {
    router.push(`/posts/${uuid}`);
  };
  return (
    <div className={`tw-flex tw-flex-col tw-gap-4 ${styles.articleList}`}>
      {postsData.map((post: KeyValMap) => (
        <div key={post.id} className={styles.postWrapper}>
          <div
            className={`${styles.postCard} tw-flex tw-flex-col tw-cursor-pointer `}
            onClick={() => navToPostDetail(post.uuid)}
          >
            <div className={styles.mainInfo}>
              <h2 className={`${styles.postTitle} tw-m-0`}>{post.title}</h2>
              <div className={`${styles.postContent}`}>
                {sanitizeContent(post.content)}
              </div>
            </div>
            <div
              className={`${styles.subInfo} tw-flex tw-items-center tw-gap-4`}
            >
              <div className="createdAt">{formatDate(post.createdAt)}</div>
              <p className="likeCount tw-m-0">
                <LikeOutlined />
                {post.likesAmt}
              </p>
              <p className="commentCount tw-m-0 tw-flex tw-items-center tw-gap-1">
                <CommentOutlined />
                {post?.commentsNum}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
