import path from 'path';
import fs, { promises as fsPromise } from 'fs';
import matter from 'gray-matter';

const markdownDir = path.join(process.cwd(), "markdown");

export const getPosts = async () => {
  const fileNames = await fsPromise.readdir(markdownDir);
  const fileData: { id: string; content: string }[] = fileNames.map(
    (fileName) => {
      const id = fileName.replace(/\.md$/g, "");
      const fullPath = path.join(markdownDir, fileName);
      const text = fs.readFileSync(fullPath, "utf-8");
      const { content } = matter(text);
      return {
        id,
        content,
      };
    }
  );
  return fileData;
};

export const getPost = async (id: string) => {
  const fullPath = path.join(markdownDir, `${id}.md`);
  const text = fs.readFileSync(fullPath, "utf-8");
  const { content } = matter(text);
  return content;
};

export const getPostIds = async () => {
  const fileNames = await fsPromise.readdir(markdownDir);
  return fileNames.map((fileName) => {
      return fileName.replace(/\.md$/g, "");
  });
};
