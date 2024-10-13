import { KeyValMap } from "@/constants/common-type";
import { UserOutlined } from "@ant-design/icons";
import { Button, Card, notification, Popover, Space } from "antd";
import axios from "axios";
import BoringAvatars from "boring-avatars";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { useCallback } from "react";
import { useGlobalState } from "../../context/globalStateContext";
import { useSignIn } from "../../hooks/useSignIn";

interface App_Avatar_Props {}

const App_Avatar: NextPage<App_Avatar_Props> = (props) => {
  const { user: userInfo, storeUser } = useGlobalState();
  const { openSignIn } = useSignIn();
  const router = useRouter();
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
        <Button
          type="text"
          icon={<UserOutlined />}
          onClick={() => navigateToUser(userInfo, router)}
        >
          个人主页
        </Button>
        <Button type="text" onClick={openSignIn}>
          切换账户
        </Button>
        <Button type="text" onClick={openLogoutNotification}>
          退出账号
        </Button>
      </div>
    </Card>
  );
  return (
    <div className={"avatar-box "}>
      {contextHolder}
      <Popover
        content={content}
        trigger="click"
        className={"tw-cursor-pointer"}
      >
        <div>
          <BoringAvatars
            size={40}
            name={userInfo?.id?.toString()}
          ></BoringAvatars>
        </div>
      </Popover>
    </div>
  );
};
export default App_Avatar;

function navigateToUser(userInfo: KeyValMap, router: NextRouter) {
  router.push(`/user/${userInfo?.uuid}`);
}
