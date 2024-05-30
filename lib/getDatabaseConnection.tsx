import { createConnection, getConnectionManager } from "typeorm";

const connectionPromise = (() => {
  const manager = getConnectionManager();
  if (!manager.has("default")) {
    // 若无默认connection，就创建新的
    return createConnection();
  } else {
    // 复用之前已有的connection
    const current = manager.get("default");
    if (current.isConnected) {
      return current;
    } else {
      return createConnection();
    }
  }
})();
export const getDatabaseConnection = async () => {
  return connectionPromise;
};
