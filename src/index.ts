import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

createConnection().then(async connection => {
    // 查询当前post数据库中有的数据
    const posts=await connection.manager.find(Post)
    console.log(`posts`, posts) ;
    //新建一个记录。用于存到数据库中。
    const p=new Post();
    p.title='post 1';
    p.content='第一个文章';
    // 往数据库中存储记录。
    await connection.manager.save(p);
    
    //再次查询当前posts数据库中的数据。
    const newPost=await connection.manager.find(Post)
    console.log(`newPost`, newPost);
    
    connection.close()
}).catch(error => console.log(error));
