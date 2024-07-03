import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

createConnection()
  .then(async (connection) => {
    const { manager } = connection;
    const u1 = new User();
    u1.username = "asda";
    u1.passwordDigest = "123";
    await manager.save(u1);
    //
    const p1 = new Post();
    p1.title = "title1";
    p1.content = "简单的内容";
    p1.author = u1;
    await manager.save(p1);

    connection.close();
  })
  .catch((error) => console.log(error));
