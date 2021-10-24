const { EmitError, ResponseFail } = require("../common/utils");

const verifyGoodsFormValue = async (ctx, next) => {
  try {
    // 参数校验
    ctx.verifyParams({
      goodsName: { type: "string", required: true },
      goodsPrice: { type: "number", required: true },
      goodsNum: { type: "number", required: true },
      goodsImg: { type: "string", required: true },
    });

    await next();
  } catch (error) {
    const { field, message } = error.errors[0];
    EmitError(ResponseFail(412, `${field} ${message}`), ctx);
  }
};

module.exports = {
  verifyGoodsFormValue,
};
