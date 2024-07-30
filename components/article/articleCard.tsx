// 用来完成展示文章梗概的卡片

import { NextPage } from "next";
import { KeyValString } from "../../common-type";
import { NextRouter, useRouter } from "next/router";
import BoringAvatars from "boring-avatars";
import styles from "./articleCard.module.scss";

interface ArticleCardProps {
  articleData: KeyValString;
}

const ArticleCard: NextPage<ArticleCardProps> = (props: ArticleCardProps) => {
  const { articleData } = props || {};
  const { title, content, uuid, author } = articleData || {};
  const router = useRouter();
  return (
    <>
      <div className={`article-card-box tw-bg-white tw-rounded `}>
        <div className="contentMain tw-p-4 tw-flex tw-flex-col">
          {/*题图*/}
          <div
            className={`${styles.articleTitleImg} tw-min-w-48 tw-cursor-pointer`}
            onClick={() => navToDetail(router, uuid)}
          >
            <img src="/assets/pic/default_blog_pic.png" alt="" />
          </div>
          {/*纯分隔符*/}
          <div className={`${styles.spacer}`}></div>
          <div className="article-info">
            <div className={`${styles.articleCategory}`}></div>
            {/*标题和简介*/}
            <div
              className={"tw-cursor-pointer"}
              onClick={() => navToDetail(router, uuid)}
            >
              <h3
                className={
                  "article-title tw-text-lg tw-m-0 tw-p-0  tw-font-bold"
                }
              >
                {title}
              </h3>
              <div className="article-abstract  tw-mt-2 tw-mb-2.5 tw-overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden">
                {content}
              </div>
            </div>
            {/*  作者附加信息*/}
            <div className={"article-meta tw-mt-auto tw-mt-5"}>
              <div className="article-meta-user tw-flex tw-items-center tw-gap-2.5">
                <BoringAvatars
                  size={20}
                  name={author?.username}
                ></BoringAvatars>
                <span className={"tw-text-xs tw-text-slate-300"}>
                  {author?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ArticleCard;

function navToDetail(router: NextRouter, uuid: string) {
  router.push(`/posts/${uuid.toString()}`);
}
