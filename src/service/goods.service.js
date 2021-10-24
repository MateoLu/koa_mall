const GoodsModel = require("../model/goods.model");

class GoodsService {
  /**
   * 创建商品
   */
  async createGoods(goods) {
    const res = await GoodsModel.create(goods);
    return res ? res.dataValues : null;
  }

  /**
   * 更新商品数据
   */
  async updateGoods(id, goods) {
    const res = await GoodsModel.update(goods, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 硬删除商品
   */
  async removeGoods(id) {
    const res = await GoodsModel.destroy({ where: { id }, force: true });
    return res > 0 ? true : false;
  }

  /**
   * 软删除(下架)商品
   */
  async offGoods(id) {
    const res = await GoodsModel.destroy({ where: { id } });
    return res > 0 ? true : false;
  }

  /**
   * 上架商品
   */
  async restoreGoods(id) {
    const res = await GoodsModel.restore({ where: { id } });
    return res > 0 ? true : false;
  }

  /**
   * 查找数据
   */
  async findGoodsByPagenation(pageNum, pageSize) {
    // 因为我们加了偏执表，所以总数是没有被软删除的数量（数据总量）
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await GoodsModel.findAndCountAll({
      attributes: [
        "id",
        "goodsName",
        "goodsNum",
        "goodsPrice",
        "goodsImg",
        "createdAt",
        "updatedAt",
      ],
      offset,
      limit: pageSize * 1,
    });

    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }
}

module.exports = new GoodsService();
