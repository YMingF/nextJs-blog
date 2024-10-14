import generateThemeToken from "@/styles/theme";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import "styles/globals.scss";
import MainHeader from "../components/main-header/main-header";
import { GlobalStateProvider } from "../context/globalStateContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ConfigProvider theme={generateThemeToken()}>
        <MainHeader></MainHeader>
        <main className={"home-content-container tw-top-20 tw-relative"}>
          <Component {...pageProps} />
        </main>
      </ConfigProvider>
    </GlobalStateProvider>
  );
}
