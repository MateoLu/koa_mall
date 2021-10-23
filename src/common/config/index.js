const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  server: {
    port: parseInt(process.env.SERVER_PORT),
    prefix: process.env.SERVER_PREFIX
  },
  db: {
    port: parseInt(process.env.SEQUELIZE_PORT),
    host: process.env.SEQUELIZE_HOST,
    dialect: process.env.SEQUELIZE_DIALECT,
    timezone: process.env.SEQUELIZE_TIMEZONE,
    user: process.env.SEQUELIZE_USER,
    password: process.env.SEQUELIZE_PASSWORD,
    database: process.env.SEQUELIZE_DATABASE
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expireTime: process.env.JWT_EXPIRE_TIME
  }
};
