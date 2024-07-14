import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      test something
      <div className="cover">
        <img src="/logo.png" alt="" />
        <p>
          <a href="/posts">你点击看看?</a>
        </p>
      </div>
      <style jsx>{`
        .cover {
        }
      `}</style>
    </>
  );
};
export default Home;
