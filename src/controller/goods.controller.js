const path = require("path");
const { Controller, Post, Middlewares } = require("../common/decorator");
const { ResponseSuccess, EmitError, ResponseFail } = require("../common/utils");
const { adminPermission } = require("../middlewares/auth.middleware");

/**
 * 商品管理控制层
 */
@Controller("/goods")
class GoodsController {
  @Post("/upload")
  @Middlewares([adminPermission])
  async uploadImage(ctx) {
    const { file } = ctx.request.files;
    if (file) {
      ctx.body = ResponseSuccess("商品图片上传成功", {
        goods_img: `${ctx.origin}/upload/${path.basename(file.path)}`,
      });
    } else {
      EmitError(ResponseFail(400, "文件上传错误"), ctx);
    }
  }
}

module.exports = GoodsController;
