const OrderModel = require("../model/order.model");

class OrderService {
  /**
   * 生成订单
   * @param {*} orderObj 
   * @returns 
   */
  async createOrder(orderObj) {
    return await OrderModel.create(orderObj);
  }

  /**
   * 按照状态分页查询订单列表
   * @param {*} pageNum 
   * @param {*} pageSize 
   * @param {*} status 
   * @returns 
   */
  async findOrders(pageNum, pageSize, status) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await OrderModel.findAndCountAll({
      attributes: ["goodsInfo", "total", "orderNumber", "status"],
      where: { status },
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

  /**
   * 更新订单的状态
   * @param {*} id 
   * @param {*} status 
   * @returns 
   */
  async updateOrderStatus(id, status) {
    const res = await OrderModel.update({ status }, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 根据订单号删除订单
   * @param {*} orderNumber 
   * @returns 
   */
  async removeOrder(orderNumber) {
    const res = await OrderModel.destroy({ where: { orderNumber } });
    return res > 0 ? true : false;
  }
}

module.exports = new OrderService();
