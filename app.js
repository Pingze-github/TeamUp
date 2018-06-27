
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

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    if (ctx.url.startsWith('/api')) {
      return ctx.body = {succeed: false};
    }
    return ctx.body = 'Internal Server Error';
  }
});

app.use(staticServer(path.join(__dirname, 'public')));
app.use(staticServer(path.join(os.homedir(), 'teamup/uploads')));

app.use(koaBody({
  formLimit: '2mb'
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

app.listen(1000, () => {
  console.log('Server running...')
});

// TODO 账号系统。包含注册、登录、密码找回。可以使用邮箱注册
// 文档系统。浏览、修改、更新
// 文档层级结构
// 图片上传服务，支持ctrl+v粘贴
// TODO localStorage储存用户操作状态，包括鼠标指针停留位置
// TODO 定时保存
// write页面布局优化
// codemirror 实现快捷键
// TODO 题目更改也影响发布状态
// TODO 支持修改父节点