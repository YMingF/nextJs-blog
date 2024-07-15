import "styles/output.css";
import type { AppProps } from "next/app";
import { useCallback } from "react";
import { useRouter } from "next/router";

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
      <div className={"tw-flex tw-justify-between"}>
        <p>博客</p>
        <div>
          <button onClick={() => navigate("/sign_in")}>登录|</button>
          <button onClick={() => navigate("/sign_up")}> 注册</button>
        </div>
      </div>
      <Component {...pageProps} />;
    </>
  );
}
