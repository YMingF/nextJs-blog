// 用来完成展示文章梗概的卡片

import { NextPage } from "next";
import { useGlobalState } from "../../context/globalStateContext";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface ArticleCardProps {
  title: string;
  content: string;
}

const ArticleCard: NextPage<ArticleCardProps> = (props: ArticleCardProps) => {
  const { title, content } = props;
  const { user, storeUser } = useGlobalState();
  return (
    <div className={"article-card-box tw-bg-white tw-rounded"}>
      <div className="content-main tw-p-4">
        <div className="article-title-img tw-min-w-48"></div>
        <div className="article-info">
          <div className="article-category"></div>
          <div className={"article-title tw-text-lg tw-mr-4 tw-mb-3 "}>
            {title}
          </div>
          <div className="article-abstract tw-overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden">
            {content}
          </div>
          {/*  附加信息*/}
          <div className={"article-meta tw-mt-auto tw-mt-5"}>
            <div className="article-meta-user tw-flex tw-items-center tw-gap-4">
              <Avatar className={"tw-w-6 tw-h-6"} icon={<UserOutlined />} />
              <span className={"tw-text-xs tw-text-slate-300"}>
                {user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArticleCard;
