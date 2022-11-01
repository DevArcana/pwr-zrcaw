import "reflect-metadata";
import { DataSource } from "typeorm";
import { Scoreboard } from "./entity/Scoreboard";

const create_data_source = () => {
  while (true) {
    try {
      const source = new DataSource({
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        logging: false,
        entities: [ Scoreboard ],
        migrations: [],
        subscribers: [],
      });

      console.log("database connection established")

      return source
    }
    catch {
      // waiting for database
    }
  }
}

export const AppDataSource = create_data_source();