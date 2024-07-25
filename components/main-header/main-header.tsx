import { NextPage } from "next";
import App_Login from "../../pages/login/login";
import styles from "./main-header.module.scss";
import App_Avatar from "../../pages/avatar/avatar";
import { useGlobalState } from "../../context/globalStateContext";
import { useCallback } from "react";
import { useRouter } from "next/router";

const MainHeader: NextPage = () => {
  const { user, storeUser } = useGlobalState();
  const router = useRouter();
  const backToHome = useCallback(() => {
    router.push("/");
  }, []);
  return (
    <>
      <div className={`${styles.mainHeaderBox} tw-flex tw-justify-center `}>
        <div className="innerWrapper tw-flex tw-justify-between tw-items-center tw-w-3/4">
          <div className="header-banner-left">
            <p className={"tw-cursor-pointer"} onClick={backToHome}>
              博客
            </p>
          </div>
          <div className="header-banner-right">
            {user && <App_Avatar></App_Avatar>}
            {!user && <App_Login></App_Login>}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainHeader;
