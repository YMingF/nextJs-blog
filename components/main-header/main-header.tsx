import { FormOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useGlobalState } from "../../context/globalStateContext";
import eventEmitter from "../../emitter/eventEmitter";
import App_Avatar from "../../pages/avatar/avatar";
import App_Login from "../../pages/login/login";
import HeaderNav from "./header-nav/header-nav";
import styles from "./main-header.module.scss";

const MainHeader: NextPage = () => {
  const { Search } = Input;
  const { user } = useGlobalState();
  const router = useRouter();
  const [prevScrollTop, setPreviousScrollTop] = useState(0);
  const [routeStatus, setRouteStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const backToHome = useCallback(() => {
    router.push("/");
  }, []);

  const jumpToWrite = useCallback(() => {
    if (user) {
      router.push("/posts/create");
    } else {
      messageApi.error("请先登录");
    }
  }, [user]);

  const pathname = usePathname();

  useEffect(() => {
    // 监听路由变化
    const handleRouteChange = (url: string) => {
      const editPostRegx = /\/posts\/[\s\S]+\/edit/;
      const detailPostRegx = /\/posts\/[^\/]+$/;
      if (url.includes("posts/create")) {
        setRouteStatus("addPost");
      } else if (editPostRegx.test(url)) {
        setRouteStatus("editPost");
      } else if (detailPostRegx.test(url)) {
        setRouteStatus("detailPost");
      } else {
        setRouteStatus("");
      }
    };

    // 初始化时设置
    handleRouteChange(pathname);
  }, [pathname]);

  const onSearch = (value: any, _e: any, info: { source: any }) => {
    axios.post(`/api/v1/search_api/search?content=${value}`).then((data) => {
      eventEmitter.emit("searchFilterDataChanged", data);
    });
  };

  useEffect(() => {
    window.onscroll = function () {
      let navbar = document.querySelector(".home-header-box") as HTMLElement;
      if (!navbar) {
        return;
      }
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop < prevScrollTop) {
        navbar.style.top = "0";
      } else if (scrollTop > 80) {
        navbar.style.top = "-100px";
      }

      setPreviousScrollTop(scrollTop);
    };
  }, [prevScrollTop]);

  return (
    <>
      {contextHolder}
      <div
        className={`${styles.mainHeaderBox} home-header-box tw-flex tw-justify-center `}
      >
        <div
          className={`${styles.innerWrapper} tw-flex tw-justify-between tw-items-center tw-w-3/4`}
        >
          <div className="header-banner-left tw-flex tw-items-center">
            <p className={"tw-cursor-pointer"} onClick={backToHome}>
              vvv
            </p>
            <div>{!isEditMode(routeStatus) && <HeaderNav></HeaderNav>}</div>
          </div>
          <div className="header-btns tw-flex tw-items-center tw-gap-5">
            <div className={`${styles.searchBtn}`}>
              {!isEditMode(routeStatus) && routeStatus !== "detailPost" && (
                <Search
                  placeholder="请输入搜索内容"
                  size="middle"
                  allowClear
                  onSearch={onSearch}
                  enterButton
                />
              )}
            </div>
            <div className={"write-btn"}>
              {!isEditMode(routeStatus) && (
                <Button
                  type="primary"
                  icon={<FormOutlined />}
                  onClick={jumpToWrite}
                >
                  写文章
                </Button>
              )}
              {routeStatus === "addPost" && (
                <Button type="primary" onClick={savePost}>
                  发布
                </Button>
              )}
              {routeStatus === "editPost" && (
                <Button type="primary" onClick={updatePost}>
                  更新
                </Button>
              )}
            </div>
            {/* 登录注册 */}
            <div className="user-btn">
              {user && <App_Avatar></App_Avatar>}
              {!user && <App_Login></App_Login>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MainHeader;
function savePost() {
  eventEmitter.emit("publishPostEvt", null);
}
function updatePost() {
  eventEmitter.emit("updatePostEvt", null);
}

function isEditMode(routeStatus: string | undefined) {
  return ["addPost", "editPost"].includes(routeStatus);
}
