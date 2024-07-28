import { NextPage } from "next";
import App_Login from "../../pages/login/login";
import styles from "./main-header.module.scss";
import App_Avatar from "../../pages/avatar/avatar";
import { useGlobalState } from "../../context/globalStateContext";
import { useCallback, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Button, Input } from "antd";
import HeaderNav from "./header-nav/header-nav";
import axios from "axios";
import eventEmitter from "../../emitter/eventEmitter";
import { FormOutlined } from "@ant-design/icons";

const MainHeader: NextPage = () => {
  const { Search } = Input;
  const { user, storeUser } = useGlobalState();
  const router = useRouter();
  const [prevScrollTop, setPreviousScrollTop] = useState(0);
  const backToHome = useCallback(() => {
    router.push("/");
  }, []);
  const jumpToWrite = useCallback(() => {
    router.push("/posts/create");
  }, []);
  let isCreateRoute = subscribeRouterChange(router);
  const onSearch = (value: any, _e: any, info: { source: any }) => {
    axios.post(`/api/v1/search_api/search?content=${value}`).then((data) => {
      eventEmitter.emit("searchFilterDataChanged", data);
    });
  };
  // todo 监听滚动效果的笔记
  useEffect(() => {
    window.onscroll = function () {
      let navbar = document.querySelector(".home-header-box") as HTMLElement;
      if (!navbar) {
        return;
      }
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      console.log(`scrollTop,prevScrollTop`, scrollTop, prevScrollTop);
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
            <div>{!isCreateRoute && <HeaderNav></HeaderNav>}</div>
          </div>
          <div className="header-btns tw-flex tw-items-center tw-gap-5">
            <div className="search-btn">
              {!isCreateRoute && (
                <Search
                  placeholder="input search text"
                  allowClear
                  enterButton
                  onSearch={onSearch}
                  style={{
                    width: 200,
                  }}
                />
              )}
            </div>
            <div className={"write-btn"}>
              {!isCreateRoute && (
                <Button
                  type="primary"
                  icon={<FormOutlined />}
                  onClick={jumpToWrite}
                >
                  写文章
                </Button>
              )}
              {isCreateRoute && (
                <Button type="primary" onClick={savePost}>
                  发布
                </Button>
              )}
            </div>
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
  eventEmitter.emit("publishMarkdownEvt", null);
}
function subscribeRouterChange(router: NextRouter) {
  const [isCreateRoute, setIsCreateRoute] = useState(false);

  useEffect(() => {
    // 监听路由变化
    const handleRouteChange = (url: string) => {
      setIsCreateRoute(url.includes("posts/create"));
    };

    // 初始化时设置
    handleRouteChange(router.pathname);

    // 添加路由变化事件监听
    router.events.on("routeChangeComplete", handleRouteChange);

    // 清理事件监听器
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return isCreateRoute;
}
