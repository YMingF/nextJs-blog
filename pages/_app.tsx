import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback, useState } from "react";
import App_Login from "./login/login";
import App_Avatar from "./avatar/avatar";
import { GlobalStateProvider } from "../context/globalStateContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = useCallback(
    (value: boolean) => {
      setIsLogin(value);
    },
    [isLogin]
  );

  return (
    <GlobalStateProvider>
      {!isLogin && <App_Login onLogin={handleLogin}></App_Login>}
      {isLogin && <App_Avatar></App_Avatar>}
      <Component {...pageProps} />;
    </GlobalStateProvider>
  );
}
