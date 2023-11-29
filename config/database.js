import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const { MYSQL_URI, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const sequelize = new Sequelize(
  'myAPI',
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: MYSQL_URI,
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

export default sequelize;