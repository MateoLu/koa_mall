const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');

const Goods = sequelize.define('goods', {
  goodsName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称'
  },
  goodsPrice: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    comment: '商品价格'
  },
  goodsNum: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品数量'
  },
  goodsImg: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品图片的URL地址'
  }
}, {
  paranoid: true
});

// Goods.sync({force: true})

module.exports = Goods;

