import { createConnection, Connection } from "typeorm";

async function getConnection(): Promise<Connection> {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "bas_db",
    entities: [__dirname + "/entities/*.ts"], // Specify the path to your entity files
    migrations: [__dirname + "/migrations/*.ts"], // Specify the path to your migration files
    synchronize: false, // Set to true to automatically synchronize your database schema with your entities (not recommended for production)
  });

  return connection;
}

export default getConnection;
