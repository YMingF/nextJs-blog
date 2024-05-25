import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

createConnection()
  .then(async (connection) => {
    // 查询当前post数据库中有的数据
    const posts = await connection.manager.find(Post);
      console.log(`posts.length`, posts.length);
    if (posts.length === 0) {
      // 新建一个记录。并存到数据库中
      await connection.manager.save(
        new Array(10).fill(1).map((i,index) => {
          return new Post({ title: `post ${index+1}`, content: `第${index+1}个文章` });
        })
      );
    }

    //再次查询当前posts数据库中的数据。
    const newPost = await connection.manager.find(Post);
    console.log(`newPost`, newPost);

    connection.close();
  })
  .catch((error) => console.log(error));
