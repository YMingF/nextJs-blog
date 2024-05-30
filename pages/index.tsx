import { GetServerSideProps, NextPage } from "next";
import UAParser from "ua-parser-js";
import { getDatabaseConnection } from "../lib/getDatabaseConnection";

type Props = {
  browser: {
    name: string;
    version: string;
    major: string;
  };
};
const Index: NextPage<Props> = (props) => {
  const { browser } = props;
  return (
    <main>
      <h1>你的浏览器是{browser.name}</h1>
    </main>
  );
};
export default Index;
export const getServerSideProps: GetServerSideProps = async (context) => {
  // 拿到连接，从连接中去获取数据。
  const connect = await getDatabaseConnection();
  console.log(`connect`, connect);

  const ua = context.req.headers["user-agent"];
  /*
   * to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data with relatively small footprint
   * (~17KB minified, ~6KB gzipped) that can be used either in browser (client-side) or node.js (server-side).
   * */
  const result = new UAParser(ua).getResult();
  return {
    props: {
      browser: result.browser,
    },
  };
};
