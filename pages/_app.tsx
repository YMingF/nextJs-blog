import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback } from "react";
import { useRouter } from "next/router";
import App_Login from "./login/login";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
  return (
    <>
      <App_Login></App_Login>
      <Component {...pageProps} />;
    </>
  );
}
