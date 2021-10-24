const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const Goods = require('./goods.model');

const Cart = sequelize.define('carts', {
  goodsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户id'
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品数量'
  },
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否选中'
  }
});

// Cart.sync({force: true})
// 表的关联查询出，一对一
Cart.belongsTo(Goods, { foreignKey: 'goodsId', as: 'goodsInfo'})

module.exports = Cart;

