import entities from 'src/entities/index';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { dbConfig } from './config';

export const config: MysqlConnectionOptions = {
  type: 'mysql',
  ...dbConfig,
  entities,
  synchronize: true,
};
