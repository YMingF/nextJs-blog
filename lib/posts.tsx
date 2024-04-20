import path from 'path';
import fs, { promises as fsPromise } from 'fs';
import matter from 'gray-matter';

export const getPosts = async () => {
    const markdownDir = path.join(process.cwd(), 'markdown');
    const fileNames = await fsPromise.readdir(markdownDir);
    const fileData: { id: string; content: string }[] = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/g, '');
        const fullPath = path.join(markdownDir, fileName);
        const text = fs.readFileSync(fullPath, 'utf-8');
        const { content } = matter(text);
        return {
            id, content
        };
    });
    return fileData;
};
