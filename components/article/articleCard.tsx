// 用来完成展示文章梗概的卡片

import { NextPage } from "next";
import { KeyValString } from "../../common-type";
import { NextRouter, useRouter } from "next/router";
import BoringAvatars from "boring-avatars";

interface ArticleCardProps {
  articleData: KeyValString;
}

const ArticleCard: NextPage<ArticleCardProps> = (props: ArticleCardProps) => {
  const { articleData } = props || {};
  const { title, content, uuid, author } = articleData || {};
  const router = useRouter();
  return (
    <>
      <div
        className={"article-card-box tw-bg-white tw-rounded tw-cursor-pointer"}
        onClick={() => navToDetail(router, uuid)}
      >
        <div className="content-main tw-p-4 tw-flex tw-flex-col">
          <div className="article-title-img tw-min-w-48">
            <img src="/assets/pic/default_blog_pic.png" alt="" />
          </div>
          <div className={"spacer"}></div>
          <div className="article-info">
            <div className="article-category"></div>
            <h3
              className={
                "article-title tw-text-lg tw-m-0 tw-p-0  tw-font-bold "
              }
            >
              {title}
            </h3>
            <div className="article-abstract  tw-mt-2 tw-mb-2.5 tw-overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden">
              {content}
            </div>
            {/*  附加信息*/}
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
      <style jsx>
        {`
          .article-title-img {
            position: relative;
            border-radius: 0.375rem;
            overflow: hidden;
            aspect-ratio: 1200 / 630;
          }
          .article-title-img img {
            position: absolute;
            height: 100%;
            width: 100%;
            inset: 0px;
            color: transparent;
            object-fit: cover;
            object-position: top;
          }
          .article-title:hover {
            color: #0a85d1;
          }
          .spacer {
            min-height: 8px;
          }
          .article-abstract {
            color: #0009;
            text-decoration: none;
          }
        `}
      </style>
    </>
  );
};
export default ArticleCard;

function navToDetail(router: NextRouter, uuid: string) {
  router.push(`/posts/${uuid.toString()}`);
}
