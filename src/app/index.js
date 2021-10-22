const Koa = require("koa");
const KoaBody = require("koa-body");
const compress = require("koa-compress");
const KoaRouter = require("koa-router");
const KoaLogger = require('koa-logger');
const config = require("../common/config");
const initRoutes = require("../router");
const { connectDB } = require('../db/sequelize');

const app = new Koa();
const router = new KoaRouter();
const PORT = config.server.port;

connectDB();

app.use(KoaLogger());
app.use(compress());
app.use(KoaBody());

initRoutes(app, router);

// 统一错误处理
app.on('error', (err, ctx) => {
  ctx.status = err.code;
  ctx.body = err;
})

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
