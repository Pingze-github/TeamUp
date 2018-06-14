
const fs = require('fs');

const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'index'
});

router.get('/123', (ctx) => {
  ctx.body = '123'
});

router.get('/write', async (ctx) => {
  await ctx.render('write');
});

router.post('/upload', async (ctx) => {

  const files = ctx.request.files || {};
  const file = files.file;
  if (file) {
    // TODO 利用目录分发机制，获取一个本地path和其对应的网络url
    const toPath = './uploads/img.jpg';
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(toPath);
    reader.pipe(writer);
    return ctx.body = {succeed: true, path: toPath};
  }
  ctx.body = {succeed: false};
});

module.exports = router;