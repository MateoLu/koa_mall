const Koa = require("koa");
const KoaBody = require("koa-body");
const compress = require("koa-compress");
const KoaRouter = require("koa-router");
const KoaLogger = require("koa-logger");
const cors = require("koa2-cors");
const KoaJwt = require("koa-jwt");
const config = require("../common/config");
const initRoutes = require("../router");
const { connectDB } = require("../db/sequelize");
const { unAuthHandler } = require("../common/utils");

const app = new Koa();
const router = new KoaRouter();
const PORT = config.server.port;
const GLOBAL_PREFIX = config.server.prefix;

connectDB();

// Custom 401 handling (first middleware)
app.use(unAuthHandler);

app.use(cors());
app.use(
  KoaJwt({ secret: config.jwt.secret }).unless({
    path: [/^\/auth\/login/, /^\/auth\/regist/],
  })
);
app.use(KoaLogger());
app.use(compress());
app.use(KoaBody());

initRoutes({app, router, globalPrefix: GLOBAL_PREFIX});

// 统一错误处理
app.on("error", (err, ctx) => {
  console.error(`【错误提示信息】==> ${err.message}`);
  ctx.status = err.code;
  ctx.body = err;
});

exports.executeApp = () => {
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}${GLOBAL_PREFIX}`);
  });
};
