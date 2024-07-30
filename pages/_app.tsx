import "styles/globals.scss";
import type { AppProps } from "next/app";
import { GlobalStateProvider } from "../context/globalStateContext";
import MainHeader from "../components/main-header/main-header";
import { ConfigProvider } from "antd";
import generateThemeToken from "@/styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ConfigProvider theme={generateThemeToken()}>
        <MainHeader></MainHeader>
        <main className={"home-content-container tw-top-20 tw-relative"}>
          <Component {...pageProps} />;
        </main>
      </ConfigProvider>
    </GlobalStateProvider>
  );
}
