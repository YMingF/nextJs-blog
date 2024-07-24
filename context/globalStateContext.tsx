import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

const GlobalStateContext = createContext(undefined);
interface UserProviderProps {
  children: any;
}
export const GlobalStateProvider: React.FC<UserProviderProps> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [user, storeUser] = useState({});
  getUserInfo(storeUser, messageApi);
  return (
    <>
      {contextHolder}
      <GlobalStateContext.Provider value={{ user, storeUser }}>
        {children}
      </GlobalStateContext.Provider>
    </>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

function getUserInfo(
  storeUser: Dispatch<SetStateAction<any>>,
  messageApi: MessageInstance
) {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/getUserInfo");
        console.log(`response`, response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();
        storeUser(userData);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "请先登录",
          duration: 1,
        });
      }
    };

    fetchUser();
  }, []);
}
