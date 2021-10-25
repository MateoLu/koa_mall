const Koa = require("koa");
const KoaBody = require("koa-body");
const compress = require("koa-compress");
const KoaLogger = require("koa-logger");
const cors = require("koa2-cors");
const KoaStatic = require('koa-static');
const KoaParameter = require('koa-parameter');
const path = require('path');
const config = require("../common/config");
const initRoutes = require("../router");
const { connectDB } = require("../db/sequelize");
const { unAuthHandler, errorHandler } = require("../common/utils");

const app = new Koa();
const PORT = config.server.port;
const GLOBAL_PREFIX = config.server.prefix;

connectDB();

// Custom 401 handling (first middleware)
app.use(unAuthHandler);
app.use(compress());
app.use(KoaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
  },
  parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}));
app.use(KoaLogger());
app.use(KoaStatic(path.join(__dirname, '..', 'static')));
app.use(cors());
app.use(KoaParameter(app));

// 初始化路由
initRoutes({app, globalPrefix: GLOBAL_PREFIX});

// 统一错误处理
app.on("error", errorHandler);

exports.executeApp = () => {
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}${GLOBAL_PREFIX}`);
  });
};
