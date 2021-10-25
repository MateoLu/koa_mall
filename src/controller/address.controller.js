const {
  Controller,
  Post,
  Middlewares,
  Get,
  Put,
  Delete,
  Patch,
} = require("../common/decorator");
const { EmitError, ResponseFail, ResponseSuccess } = require("../common/utils");
const { validator, auth } = require("../middlewares");
const addressService = require("../service/address.service");

/**
 * 收货地址控制层
 */
@Controller("/address")
class AddressController {
  /**
   * 添加收货地址接口
   * @param {*} ctx
   * @returns
   */
  @Post()
  @Middlewares([
    auth,
    validator({
      consignee: "string",
      phone: {
        type: "string",
        format:
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      },
      address: "string",
    }),
  ])
  async add(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { consignee, phone, address } = ctx.request.body;
      const res = await addressService.createAddress({
        userId,
        consignee,
        phone,
        address,
      });
      if (!res) {
        EmitError(ResponseFail(400, "添加收货地址失败"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("添加收货地址成功");
    } catch (error) {
      EmitError(ResponseFail(500, "添加收货地址出现异常"), ctx);
    }
  }

  /**
   * 查询收货地址接口
   * @param {*} ctx
   */
  @Get()
  @Middlewares([auth])
  async findAll(ctx) {
    try {
      const uid = ctx.state.user.id;
      const res = await addressService.findAddress(uid);
      ctx.body = ResponseSuccess("获取收货地址列表成功", res);
    } catch (error) {
      EmitError(ResponseFail(500, "获取收货地址列表出现异常"), ctx);
    }
  }

  /**
   * 修改地址
   * @param {} ctx 
   * @returns 
   */
  @Put("/:id")
  @Middlewares([
    auth,
    validator({
      consignee: "string",
      phone: {
        type: "string",
        format:
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      },
      address: "string",
    }),
  ])
  async update(ctx) {
    try {
      const { id } = ctx.request.params;
      const res = await addressService.updateAddress(id, ctx.request.body);
      if (!res) {
        EmitError(ResponseFail(400, '修改地址出错'), ctx);
        return;
      } 
      ctx.body = ResponseSuccess('修改成功');
    } catch (error) {
      EmitError(ResponseFail(500, "修改收货地址出现异常"), ctx);
    }
  }

  /**
   * 根据id删除收货地址
   * @param {*} ctx 
   * @returns 
   */
  @Delete('/:id')
  @Middlewares([auth])
  async remove(ctx) {
    try {
      const { id } = ctx.request.params;
      const res = await addressService.removeAddress(id);
      if (!res) {
        EmitError(ResponseFail(400, '删除地址出错'), ctx);
        return;
      }
      ctx.body = ResponseSuccess('删除成功');
    } catch (error) {
      EmitError(ResponseFail(500, "删除收货地址出现异常"), ctx);
    }
  }

  /**
   * 设置默认地址
   * @param {*} ctx 
   * @returns 
   */
  @Patch('/:id')
  @Middlewares([auth])
  async setDefault(ctx) {
    try {
      const { id } = ctx.request.params;
      const uid = ctx.state.user.id;
      const res = await addressService.setDefaultAddr(id, uid);
      if (!res) {
        EmitError(ResponseFail(400, '设置默认地址出错'), ctx);
        return;
      }
      ctx.body = ResponseSuccess('设置默认地址成功');
    } catch (error) {
      EmitError(ResponseFail(500, "设置默认地址出现异常"), ctx);
    }
  }
}

module.exports = AddressController;
