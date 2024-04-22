import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
  .then(async (connection: { close: () => void }) => {
    console.log(connection);
    connection.close();
  })
  .catch((error: any) => console.log(error));
