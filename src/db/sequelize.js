const { Sequelize } = require("sequelize");
const config = require("../common/config/index");

const { db } = config;

const sequelize = new Sequelize(db.database, db.user, db.password, {
  port: db.port,
  host: db.host,
  dialect: db.dialect,
  logging: function(sql) {
    console.log(sql)
  },
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  timezone: db.timezone
});

exports.connectDB = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

exports.sequelize = sequelize;