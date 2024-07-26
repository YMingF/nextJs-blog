import { NextPage } from "next";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./header-nav.module.scss";

const HeaderNav: NextPage = () => {
  const [current, setCurrent] = useState("home");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };
  const navItems = [
    {
      label: <Link href={"/"}>首页</Link>,
      key: "home",
      icon: <MailOutlined />,
    },
  ];
  return (
    <div className={`${styles.navWrapper}`}>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={navItems}
      />
    </div>
  );
};
export default HeaderNav;
