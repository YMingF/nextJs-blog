import { NextPage } from "next";
import { useGlobalState } from "../../context/globalStateContext";
import { Avatar, Button, Card, notification, Popover, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { useSignIn } from "../../hooks/useSignIn";
import axios from "axios";

interface App_Avatar_Props {}

const App_Avatar: NextPage<App_Avatar_Props> = (props) => {
  const { user: userInfo, storeUser } = useGlobalState();
  const { openSignIn } = useSignIn();
  const [api, contextHolder] = notification.useNotification();

  const logOut = useCallback(() => {
    api.destroy("logout");
    storeUser(null);
    axios.post("/api/v1/logout");
  }, []);

  const openLogoutNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => api.destroy()}>
          取消
        </Button>
        <Button type="primary" size="small" onClick={() => logOut()}>
          确定
        </Button>
      </Space>
    );
    api.warning({
      message: "注意",
      description: "确定要退出？",
      placement: "top",
      closable: false,
      btn,
      key,
    });
  };
  const content = (
    <Card
      title={"账号：" + userInfo?.username}
      bordered={false}
      className={"tw-px-12"}
    >
      <div className={"tw-flex tw-flex-col tw-gap-5"}>
        <Button onClick={openSignIn}>切换账户</Button>
        <Button onClick={openLogoutNotification}>退出账号</Button>
      </div>
    </Card>
  );
  return (
    <div className={"avatar-box "}>
      {contextHolder}
      <Popover content={content} trigger="click">
        <Avatar
          className={"tw-cursor-pointer"}
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
      </Popover>
    </div>
  );
};
export default App_Avatar;
