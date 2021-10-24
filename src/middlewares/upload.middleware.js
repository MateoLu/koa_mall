const { EmitError, ResponseFail } = require("../common/utils");

/**
 * 只能上传图片类型的文件
 * @param {*} ctx 
 * @param {*} next 
 */
const uploadOnlyImage = async (ctx, next) => {
  const { file } = ctx.request.files;
  const fileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!fileTypes.includes(file.type)) {
    EmitError(ResponseFail(400, "不支持上传该文件"), ctx);
    return;
  }
  await next();
}

/**
 * 校验是否有上传的文件
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyUpload = async (ctx, next) => {
  const { file } = ctx.request.files;
  if (!file.name) {
    EmitError(ResponseFail(400, "上传文件失败"), ctx);
    return 
  }
  await next();
}

module.exports = {
  uploadOnlyImage,
  verifyUpload
}