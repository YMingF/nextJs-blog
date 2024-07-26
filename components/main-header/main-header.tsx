import { NextPage } from "next";
import App_Login from "../../pages/login/login";
import styles from "./main-header.module.scss";
import App_Avatar from "../../pages/avatar/avatar";
import { useGlobalState } from "../../context/globalStateContext";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Input } from "antd";
import HeaderNav from "./header-nav/header-nav";

const MainHeader: NextPage = () => {
  const { Search } = Input;
  const { user, storeUser } = useGlobalState();
  const router = useRouter();
  const backToHome = useCallback(() => {
    router.push("/");
  }, []);

  const onSearch = (value: any, _e: any, info: { source: any }) =>
    console.log(info?.source, value);
  return (
    <>
      <div className={`${styles.mainHeaderBox} tw-flex tw-justify-center `}>
        <div
          className={`${styles.innerWrapper} tw-flex tw-justify-between tw-items-center tw-w-3/4`}
        >
          <div className="header-banner-left tw-flex tw-items-center">
            <p className={"tw-cursor-pointer"} onClick={backToHome}>
              vvv
            </p>
            <div>
              <HeaderNav></HeaderNav>
            </div>
          </div>
          <div className="header-btns tw-flex tw-items-center tw-gap-5">
            <div className="search-btn">
              <Search
                placeholder="input search text"
                allowClear
                enterButton
                onSearch={onSearch}
                style={{
                  width: 200,
                }}
              />
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
