import { NextPage } from "next";
import App_Login from "../../pages/login/login";
import styles from "./main-header.module.scss";
import App_Avatar from "../../pages/avatar/avatar";
import { useGlobalState } from "../../context/globalStateContext";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Input, Menu, MenuProps } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";

const MainHeader: NextPage = () => {
  const { Search } = Input;
  const { user, storeUser } = useGlobalState();
  const router = useRouter();
  const backToHome = useCallback(() => {
    router.push("/");
  }, []);
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  const items = [
    {
      label: <Link href={"/"}>首页</Link>,
      key: "home",
      icon: <MailOutlined />,
    },
  ];
  const onSearch = (value: any, _e: any, info: { source: any }) =>
    console.log(info?.source, value);
  return (
    <>
      <div className={`${styles.mainHeaderBox} tw-flex tw-justify-center `}>
        <div className="innerWrapper tw-flex tw-justify-between tw-items-center tw-w-3/4">
          <div className="header-banner-left tw-flex tw-items-center">
            <p className={"tw-cursor-pointer"} onClick={backToHome}>
              vvv
            </p>
            <div className="navigation">
              <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
              />
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
