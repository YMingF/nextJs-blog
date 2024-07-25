import "styles/globals.scss";
import type { AppProps } from "next/app";
import { GlobalStateProvider } from "../context/globalStateContext";
import MainHeader from "../components/main-header/main-header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <MainHeader></MainHeader>
      <main className={"main-container tw-top-20 tw-relative"}>
        <Component {...pageProps} />;
      </main>
    </GlobalStateProvider>
  );
}
