import { createConnection, getConnectionManager } from "typeorm";
import { Post } from "src/entity/Post";
import { User } from "src/entity/User";
import { Comment } from "src/entity/Comment";
import "reflect-metadata";
import config from "ormconfig.json";

const create = async () => {
  // @ts-ignore
  return createConnection({
    ...config,
    entities: [Post, User, Comment],
  });
};
const connectionPromise = (async () => {
  const manager = getConnectionManager();
  // 复用之前已有的connection
  const current = manager.has("default") && manager.get("default");
  if (current?.isConnected) {
    await current.close();
  }
  return create();
})();
export const getDatabaseConnection = async () => {
  return connectionPromise;
};
