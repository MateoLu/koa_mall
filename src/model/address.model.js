const { sequelize } = require("../db/sequelize");
const { DataTypes } = require("sequelize");

const Address = sequelize.define("addresses", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "用户id",
  },
  consignee: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "收货人姓名",
  },
  phone: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    comment: "收货人电话",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "收货地址",
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为默认地址'
  }
});


// Address.sync({force:true})

module.exports = Address;