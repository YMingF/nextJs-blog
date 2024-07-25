import { NextPage } from "next";
import App_Login from "../../pages/login/login";
import styles from "./main-header.module.scss";
import App_Avatar from "../../pages/avatar/avatar";
import { useGlobalState } from "../../context/globalStateContext";

const MainHeader: NextPage = () => {
  const { user, storeUser } = useGlobalState();

  return (
    <>
      <div
        className={`${styles.mainHeaderBox} tw-flex tw-justify-between tw-items-center`}
      >
        <p>博客</p>
        {user && <App_Avatar></App_Avatar>}
        {!user && <App_Login></App_Login>}
      </div>
    </>
  );
};
export default MainHeader;
