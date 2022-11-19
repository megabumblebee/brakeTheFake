import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const databaseOptions: TypeOrmModuleOptions = {
  type: "mysql",
  logging: false,
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  entities: ["dist/**/**.entity{.ts,.js}"],
  bigNumberStrings: false,
};