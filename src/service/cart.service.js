const { Op } = require("sequelize");
const CartModel = require("../model/cart.model");
const GoodsModel = require("../model/goods.model");

class CartService {
  /**
   * 购物车添加商品或更新商品数据
   * @param {*} userId
   * @param {*} goodsId
   * @returns
   */
  async createOrUpdate(userId, goodsId) {
    // 查找商品是否存在
    const res = await CartModel.findOne({
      where: { [Op.and]: { userId, goodsId } },
    });

    if (res) {
      // 已存在购物车中，商品数量 number + 1
      await res.increment("number");
      return await res.reload();
    } else {
      // 不存在商品则在购物车添加商品
      return await CartModel.create({ userId, goodsId });
    }
  }

  /**
   * 根据用户id查找用户的购物车商品数据
   * @param {*} userId
   * @returns
   */
  async findByUserId(userId, pageNum, pageSize) {
    const offset = (pageNum - 1) * pageSize;
    // 分页查询以及表的关联查询
    const { count, rows } = await CartModel.findAndCountAll({
      where: { userId },
      attributes: ["id", "number", "selected"],
      offset,
      limit: pageSize * 1,
      include: {
        model: GoodsModel,
        as: "goodsInfo",
        attributes: ["id", "goodsName", "goodsImg", "goodsPrice"],
      },
    });
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }
}

module.exports = new CartService();
