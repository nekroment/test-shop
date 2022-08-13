// eslint-disable-next-line @typescript-eslint/no-var-requires
//import { ConnectionOptions } from "typeorm";

/**
  @type ConnectionOptions
*/
const config = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: process.env.BUILD
    ? [__dirname + '/dist/src/entities/*.entity.js']
    : [__dirname + '/src/entities/*.entity.ts'],
  // eslint-disable-next-line prettier/prettier
  migrations: process.env.BUILD
    ? [__dirname + '/dist/migrations/*.js']
    : [__dirname + '/migrations/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'migrations/',
  },
};
module.exports = config;
