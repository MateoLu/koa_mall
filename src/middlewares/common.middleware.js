const { EmitError, ResponseFail } = require("../common/utils");

/**
 * 校验前端表单参数公共中间件
 * @param {*} rules
 * @returns
 */
const validator = (rules) => async (ctx, next) => {
  try {
    ctx.verifyParams(rules);
    await next();
  } catch (error) {
    const { field, message } = error.errors[0];
    EmitError(ResponseFail(412, `${field} ${message}`), ctx);
  }
};

module.exports = {
  validator,
};
