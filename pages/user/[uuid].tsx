import { globalPrisma } from "@/utils/prisma.utils";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { withSession } from "../../lib/withSession";

type Props = {};
const userDetailPage: NextPage<Props> = (props) => {
  return <div>userDetailPage</div>;
};
export default userDetailPage;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const { uuid = "" } = context.params;
    const user = await globalPrisma.user.findUnique({
      where: { uuid: uuid as string },
    });
    return {
      props: {},
    };
  }
);
