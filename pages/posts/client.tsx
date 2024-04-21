import { GetStaticProps } from 'next';
import { getPosts } from '@/lib/posts';

type Props = {
  posts: Post[];
};
export default function ClientPage(props: Props) {
  const { posts } = props;
  return (
    <div>
      <h1>静态内容</h1>
      { posts.map((p: Post) => (
          <div key={ p.id }></div>
      )) }
    </div>
  );
}
// export一定不能漏
export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts,
    },
  };
};
