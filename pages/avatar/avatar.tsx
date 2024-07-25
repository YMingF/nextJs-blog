import { NextPage } from "next";
import { useGlobalState } from "../../context/globalStateContext";

interface App_Avatar_Props {}

const App_Avatar: NextPage<App_Avatar_Props> = (props) => {
  const { user: userInfo } = useGlobalState();

  return <div className={"avatar-box tw-pr-10"}>{userInfo.username}</div>;
};
export default App_Avatar;
