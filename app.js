
const os = require('os');
const path = require('path');
const Koa = require('koa');
const staticServer = require('koa-static');
const koaBody = require('koa-body');
const render = require('koa-ejs');
const session = require('koa-session');

require('./global');
const login = require('./middlewares/login');
const router = require('./routes');

const app = new Koa();

app.use(staticServer(path.join(__dirname, 'public')));
app.use(staticServer(path.join(os.homedir(), 'teamup/uploads')));

app.use(koaBody({
  multipart: true,
  maxFieldsSize: '2mb',
}));

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

// app.use(login());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running...')
});

// TODO 账号系统。包含注册、登录、密码找回。可以使用邮箱注册
// 文档系统。浏览、修改、更新
// 文档层级结构
// 图片上传服务，支持ctrl+v粘贴
// TODO sessionStorage储存用户状态