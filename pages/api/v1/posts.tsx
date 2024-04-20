import { NextApiRequest, NextApiResponse } from 'next';
import { getPosts } from '@/lib/posts';


const Posts = async (req: NextApiRequest, res: NextApiResponse) => {
    const fileData = await getPosts();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(fileData));
    res.end();
    
};
export default Posts;
