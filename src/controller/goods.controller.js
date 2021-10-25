const path = require("path");
const fs = require("fs");
const {
  Controller,
  Post,
  Middlewares,
  Put,
  Delete,
  Get,
} = require("../common/decorator");
const { ResponseSuccess, EmitError, ResponseFail } = require("../common/utils");
const {
  adminPermission,
  auth,
  verifyUpload,
  uploadOnlyImage,
  validator,
} = require("../middlewares");
const goodsService = require("../service/goods.service");

/**
 * 商品管理控制层
 */
@Controller("/goods")
class GoodsController {
  /**
   * 分页查询商品数据
   * @param {*} ctx
   */
  @Get()
  async findAllByPage(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;
    const res = await goodsService.findGoodsByPagenation(pageNum, pageSize);
    ctx.body = ResponseSuccess("商品数据查询成功", res);
  }

  /**
   * 上传图片
   * @param {*} ctx
   * @returns
   */
  @Post("/upload")
  @Middlewares([auth, adminPermission, verifyUpload, uploadOnlyImage])
  async uploadImage(ctx) {
    const { file } = ctx.request.files;
    const reader = fs.createReadStream(file.path); // 创建可读流
    const ext = file.name.split(".").pop(); // 获取上传文件扩展名
    const fileName = "image_" + Date.now();
    const upStream = fs.createWriteStream(
      // 创建可写流
      `${path.resolve(
        __dirname,
        "../static/upload/pictures"
      )}/${fileName}.${ext}`
    );
    reader.pipe(upStream); // 可读流通过管道写入可写流

    ctx.body = ResponseSuccess("商品图片上传成功", {
      goods_img: `${ctx.origin}/upload/pictures/${fileName}.${ext}`,
    });
  }

  /**
   * 创建商品
   * @param {*} ctx
   */
  @Post()
  @Middlewares([
    auth,
    adminPermission,
    validator({
      goodsName: { type: "string", required: true },
      goodsPrice: { type: "number", required: true },
      goodsNum: { type: "number", required: true },
      goodsImg: { type: "string", required: true },
    }),
  ])
  async create(ctx) {
    try {
      const { createdAt, updatedAt, ...res } = await goodsService.createGoods(
        ctx.request.body
      );
      ctx.body = ResponseSuccess("发布商品成功", res);
    } catch (error) {
      EmitError(ResponseFail(400, "发布商品出现异常"), ctx);
    }
  }

  /**
   * 修改商品
   */
  @Put("/:id")
  @Middlewares([
    auth,
    adminPermission,
    validator({
      goodsName: { type: "string", required: true },
      goodsPrice: { type: "number", required: true },
      goodsNum: { type: "number", required: true },
      goodsImg: { type: "string", required: true },
    }),
  ])
  async update(ctx) {
    try {
      const id = ctx.params.id;
      const formValue = ctx.request.body;
      const res = await goodsService.updateGoods(id, formValue);
      if (res) {
        ctx.body = ResponseSuccess("更新商品数据成功");
      } else {
        EmitError(ResponseFail(400, "修改的商品不存在"), ctx);
      }
    } catch (error) {
      EmitError(ResponseFail(500, "更新商品数据出现异常", ctx));
    }
  }

  /**
   * 删除商品
   * @param {*} ctx
   */
  @Delete("/:id")
  @Middlewares([auth, adminPermission])
  async destory(ctx) {
    try {
      const res = await goodsService.removeGoods(ctx.params.id);
      if (res) {
        ctx.body = ResponseSuccess("删除商品成功");
      } else {
        EmitError(ResponseFail(400, "无效的商品ID"), ctx);
      }
    } catch (error) {
      EmitError(ResponseFail(500, "删除商品出现异常"), ctx);
    }
  }

  /**
   * 下架商品
   */
  @Post("/:id/off")
  @Middlewares([auth, adminPermission])
  async offGoods(ctx) {
    try {
      const res = await goodsService.offGoods(ctx.params.id);
      if (res) {
        ctx.body = ResponseSuccess("商品下架成功");
      } else {
        EmitError(ResponseFail(400, "无效的商品ID"), ctx);
      }
    } catch (error) {
      EmitError(ResponseFail(500, "商品下架出现异常"), ctx);
    }
  }

  /**
   * 上架商品
   */
  @Post("/:id/on")
  @Middlewares([auth, adminPermission])
  async onGoods(ctx) {
    try {
      const res = await goodsService.restoreGoods(ctx.params.id);
      if (res) {
        ctx.body = ResponseSuccess("商品上架成功");
      } else {
        EmitError(ResponseFail(400, "无效的商品ID"), ctx);
      }
    } catch (error) {
      EmitError(ResponseFail(500, "商品上架出现异常"), ctx);
    }
  }
}

module.exports = GoodsController;
