/**
 * 请求方法
 */
const RequestMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
};

/**
 * 定义注册的路由map
 */
const controllersMap = new Map();

/**
 * 给controller添加装饰
 * @param {*} path
 */
function Controller(path = "") {
  return function (target) {
    // 给controller类添加路由前缀
    target.prefix = path;
  };
}

/**
 * 路由装饰器工厂
 */
const createRouteDecorator =
  (method) => (path) => (target, property, descriptor) => {
    const res = controllersMap.get(target[property]);
    if (res) {
      controllersMap.set(target[property], {
        ...res,
        method,
        path,
        handler: target[property],
        constructor: target.constructor,
      });
    } else {
      controllersMap.set(target[property], {
        method,
        path,
        handler: target[property],
        constructor: target.constructor,
      });
    }
  };

// 路由装饰器
const Post = createRouteDecorator(RequestMethod.POST);
const Get = createRouteDecorator(RequestMethod.GET);
const Put = createRouteDecorator(RequestMethod.PUT);
const Delete = createRouteDecorator(RequestMethod.DELETE);
const Patch = createRouteDecorator(RequestMethod.PATCH);

// 中间件装饰器
const Middlewares =
  (middlewares = []) =>
  (target, property, descriptor) => {
    const res = controllersMap.get(target[property]);
    if (res) {
      controllersMap.set(target[property], {
        ...res,
        middlewares,
      });
    } else {
      controllersMap.set(target[property], {
        middlewares,
      });
    }
  };

module.exports = {
  Controller,
  controllersMap,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Middlewares,
};
