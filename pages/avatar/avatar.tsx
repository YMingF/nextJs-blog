import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { withSession } from "../../lib/withSession";
import { customNextApiRequest } from "../../next-env";

interface App_Avatar_Props {
  userInfo: any;
}
const App_Avatar: NextPage<App_Avatar_Props> = (props) => {
  console.log(`App_Avatar props`, props);
  const { userInfo } = props;
  return <div className={"avatar-box"}>{userInfo.username}</div>;
};
export default App_Avatar;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const user =
      (context.req as customNextApiRequest).session.get("currentUser") ?? "";
    console.log(`user`, user);
    return {
      props: {
        user,
      },
    };
  }
);
