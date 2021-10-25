const AddressModel = require("../model/address.model");

class AddressService {
  /**
   * 添加收货地址
   */
  async createAddress({ userId, consignee, phone, address }) {
    const res = await AddressModel.create({
      userId,
      consignee,
      phone,
      address,
    });
    return res;
  }

  /**
   * 查询收货地址
   */
  async findAddress(userId) {
    const res = await AddressModel.findAll({
      where: { userId },
      attributes: ["id", "consignee", "phone", "address", "isDefault"],
    });
    return res;
  }

  /**
   * 更新地址
   */
  async updateAddress(id, address) {
    const res = await AddressModel.update(address, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 删除地址
   */
  async removeAddress(id) {
    const res = await AddressModel.destroy({ where: { id } });
    return res > 0 ? true : false;
  }

  /**
   * 设置默认地址
   */
  async setDefaultAddr(id, userId) {
    // 先把所有地址设置为false
    await AddressModel.update({ isDefault: false }, { where: { userId } });
    // 再把要设置的地址作为默认
    const res = await AddressModel.update({ isDefault: true }, { where: { id, userId } });
    return res[0] > 0 ? true : false;
  }
}

module.exports = new AddressService();
