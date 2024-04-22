import { getPost, getPostIds } from '@/lib/posts';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

type Props = {
  post: string;
};
const postsShow: NextPage<Props> = (props) => {
  const { post } = props;
  return (
    <div>
      <article dangerouslySetInnerHTML={ { __html: post } }></article>
    </div>
  );
};
export default postsShow;

export const getStaticPaths: GetStaticPaths = async () => {
  const idList = await getPostIds();
  const paths = idList.map((id) => {
    return { params: { id } };
  });
  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps: GetStaticProps = async (x: any) => {
  const id = x.params.id;
  const post = await getPost(id);
  return {
    props: {
      post,
    },
  };
};
