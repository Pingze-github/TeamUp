
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const staticServer = require('koa-static');
const koaBody = require('koa-body');
const render = require('koa-ejs');
const session = require('koa-session');
const login = require('./middlewares/login');

const app = new Koa();
const router = new Router();

app.use(staticServer(path.join(__dirname, 'public')));
app.use(koaBody());
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false
});
app.keys = ['bWFya2Rvd250ZWFtdXA='];
app.use(session({
  key: 'teamup:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
}, app));

app.use(login());

router.get('/', (ctx) => {
  ctx.body = 'index'
});

router.get('/123', (ctx) => {
  ctx.body = '123'
});

router.get('/write', async (ctx) => {
  await ctx.render('write');
});

// router.get('/login', (ctx) => {
//   ctx.session.logined = true;
//   console.log(ctx.url, ctx.session)
//   ctx.body = 'login'
// });

app
  .use(router.routes())
  .use(router.allowedMethods());

// app.on('error', (err, ctx) => {
//   console.log(err);
// });

app.listen(3000, () => {
  console.log('Server running...')
});

// TODO 账号系统
// TODO 文档系统
// TODO 图片上传服务