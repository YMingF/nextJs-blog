import { NextPage } from "next";
import { useGlobalState } from "../../context/globalStateContext";
import { Avatar, Button, Card, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { useSignIn } from "../../hooks/useSignIn";

interface App_Avatar_Props {}

const App_Avatar: NextPage<App_Avatar_Props> = (props) => {
  const { user: userInfo, storeUser } = useGlobalState();
  const { openSignIn } = useSignIn();
  const logOut = useCallback(() => {
    storeUser(null);
  }, []);
  const content = (
    <Card
      title={"账号：" + userInfo?.username}
      bordered={false}
      className={"tw-px-12"}
    >
      <div className={"tw-flex tw-flex-col tw-gap-5"}>
        <Button onClick={openSignIn}>切换账户</Button>
        <Button onClick={logOut}>退出账号</Button>
      </div>
    </Card>
  );
  return (
    <div className={"avatar-box tw-pr-20"}>
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
