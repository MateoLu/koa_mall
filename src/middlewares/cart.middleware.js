const { EmitError, ResponseFail } = require("../common/utils");
const GoodsModel = require("../model/goods.model");

/**
 * 校验参数
 * @param {*} ctx
 * @param {*} next
 */
const valideCartFormValue = (rules) => async (ctx, next) => {
  try {
    ctx.verifyParams(rules);

    await next();
  } catch (error) {
    const { field, message } = error.errors[0];
    EmitError(ResponseFail(412, `${field} ${message}`), ctx);
  }
};

/**
 * 校验商品id是否合法
 */
const verifyGoodsId = async (ctx, next) => {
  try {
    const goodsId = ctx.request.body.goods_id;
    const res = await GoodsModel.findByPk(goodsId);
    if (!res) {
      EmitError(ResponseFail(400, "暂无该商品或该商品未上架"), ctx);
      return;
    }
    await next();
  } catch (error) {
    EmitError(ResponseFail(500, "查询出现错误"), ctx);
  }
};

module.exports = {
  valideCartFormValue,
  verifyGoodsId,
};
