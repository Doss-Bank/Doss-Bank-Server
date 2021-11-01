import 'dotenv/config';

export const PORT = process.env.PORT;

export const JWT_SECRET = process.env.JWT_SECRET;

export const dbConfig = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DB,
  port: parseInt(process.env.DB_PORT),
};

export const ENDPOINT = {
  SERVER: 'http://34.64.79.162:8080/',
  JBSERVER: `http://34.64.251.169:8081/`,
};
