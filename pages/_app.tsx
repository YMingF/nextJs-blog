import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback, useState } from "react";
import App_Login from "./login/login";
import App_Avatar from "./avatar/avatar";

export default function App({ Component, pageProps }: AppProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const handleLogin = useCallback(
    (value: boolean) => {
      setIsLogin(value);
    },
    [isLogin]
  );
  const updateUserInfo = useCallback(
    (val: any) => {
      setUserInfo(val);
    },
    [userInfo]
  );

  return (
    <>
      <App_Login
        onLogin={handleLogin}
        updateUserInfo={updateUserInfo}
      ></App_Login>
      {isLogin && <App_Avatar userInfo={userInfo}></App_Avatar>}
      <Component {...pageProps} />;
    </>
  );
}
