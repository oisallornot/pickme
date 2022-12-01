const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-pickme",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port":"3306"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-pickme",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "react-pickme",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
