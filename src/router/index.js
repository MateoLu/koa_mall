const { controllersMap } = require("../common/decorator/index");
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

// 自动读取controller文件夹下的文件
fs.readdirSync(path.resolve(__dirname, '../controller')).forEach(file => {
  require(`${path.resolve(__dirname, '../controller')}/${file}`);
})

module.exports = ({ app, globalPrefix }) => {
  const router = new Router({ prefix: globalPrefix })
  for (let item of controllersMap.values()) {
    const prefix = item.constructor.prefix || '';
    const path = item.path || '';
    const method = item.method;
    const handler = item.handler;
    const middlewares = item.middlewares || [];
    let url = prefix ? `${prefix}${path}` : `${path}`;
    router[method](url, ...middlewares, handler);
  }
  app.use(router.routes()).use(router.allowedMethods()); // 路由装箱
};
