import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

createConnection().then(async connection => {
    const posts=await connection.manager.find(Post)
    console.log(`posts`, posts) ;
    connection.close()
}).catch(error => console.log(error));
