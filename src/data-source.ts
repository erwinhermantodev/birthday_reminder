import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "bas_db",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
