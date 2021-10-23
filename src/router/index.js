const { controllersMap } = require("../common/decorator/index");
const path = require('path');
const fs = require('fs');

// 自动读取controller文件夹下的文件
fs.readdirSync(path.resolve(__dirname, '../controller')).forEach(file => {
  require(`${path.resolve(__dirname, '../controller')}/${file}`);
})

module.exports = ({ app, router, globalPrefix }) => {
  for (let item of controllersMap.values()) {
    const prefix = item.constructor.prefix || '';
    const path = item.path || '';
    const method = item.method;
    const handler = item.handler;
    const middlewares = item.middlewares || [];
    let url = prefix ? `${prefix}${path}` : `${path}`;
    url = globalPrefix ? `${globalPrefix}${url}` : `${url}`;
    router[method](url, ...middlewares, handler);
  }
  app.use(router.routes()).use(router.allowedMethods()); // 路由装箱
};
