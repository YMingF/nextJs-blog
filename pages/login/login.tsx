import { MESSAGES } from "@/constants/messages";
import { useLogin } from "@/hooks/useLogin";
import { Button, Divider } from "antd";
import { NextPage } from "next";

interface LoginProps {}

const App_Login: NextPage<LoginProps> = (props: any) => {
  const { showAuthModal } = useLogin();
  return (
    <div className={"tw-flex tw-justify-between tw-items-center"}>
      <Button type="primary" onClick={() => showAuthModal("sign_in")}>
        {MESSAGES.COMMON.SIGN_IN}
      </Button>
      <Divider type="vertical" />
      <Button onClick={() => showAuthModal("sign_up")}>
        {MESSAGES.COMMON.SIGN_UP}
      </Button>
    </div>
  );
};
export default App_Login;
