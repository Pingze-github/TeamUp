
const fs = require('fs');
const os = require('os');
const path = require('path');

const filePathSpawner = require('./tools/filePathSpawner');
const fpSpawner = filePathSpawner({
  'dirPath': path.join(os.homedir(), 'teamup/uploads')
});

const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'index'
});

// 文档树
router.get('/docs', async (ctx) => {
  return await ctx.render('docs');
});

router.get('/api/docs', async (ctx) => {
  return ctx.body = (await Models.document.find({}));
});


// 编辑器
router.get('/write', async (ctx) => {
  const title = '这是一个标题';
  const markdown = '# ' + title;
  const needPublish = true;
  const crumbs = [{ name:'根', path:'/docs' }];
  return await ctx.render('write', {_id: '', markdown, title, needPublish, crumbs: crumbs});
});

// 编辑文档页面
router.get('/write/:_id', async (ctx) => {
  const _id = ctx.params._id;
  const doc = await Models.document.findOne({_id: _id});
  const needPublish = doc.needPublish || false;
  let crumbs = [{ name:'根', path:'/docs' }];
  const lineNodes = [];
  let thisNode = doc;
  while (true) {
    lineNodes.push({ name: thisNode.title, path: '/docs#' + thisNode._id});
    if (!thisNode.parentId || thisNode.parentId === '#') break;
    thisNode = await Models.document.findOne({_id: thisNode.parentId});
  }
  lineNodes.reverse();
  crumbs = crumbs.concat(lineNodes);
  if (doc) {
    return await ctx.render('write', {_id: ctx.params._id, markdown: doc.markdown, title: doc.title, needPublish, crumbs: crumbs});
  }
  return ctx.body = '<p>不存在此文档</p><script>setTimeout(function(){location.href="/write"}, 2000)</script>';
});

// 文档页面
router.get('/doc/:_id', async (ctx) => {
  try {
    const doc = await Models.document.findOne({_id: ctx.params._id.toString()});
    const html = doc.html || '';
    const title = doc.title || '';
    return await ctx.render('doc', {html, title});
  } catch (e) {
    return ctx.body = '不存在此文档';
  }
});

// 获取文档数据
router.get('/api/doc/:_id', async (ctx) => {
  try {
    const doc = await Models.document.findOne({_id: ctx.params._id.toString()});
    return ctx.body = doc;
  } catch (e) {
    return ctx.body = '不存在此文档';
  }
});


// 删除文档
router.delete('/api/doc/:_id', async (ctx) => {
  async function findChildrenIds(ids) {
    const children = await Models.document.find({parentId: {$in: ids}}, {_id: 1});
    return children.map((doc) => doc._id);
  }

  let deleteIds = [];
  let ids = [ctx.params._id];
  while (true) {
    deleteIds = deleteIds.concat(ids);
    ids = await findChildrenIds(ids);
    if (ids.length === 0) break;
  }
  deleteIds = deleteIds.map(v => Models.Types.ObjectId(v));

  console.log('deleting', deleteIds);

  console.log(await Models.document.deleteMany({_id: {$in: deleteIds}}));

  return ctx.body = {succeed: true};
});

// 图片上传
router.post('/api/upload', async (ctx) => {
  const files = ctx.request.files || {};
  const file = files.file;
  const base = ctx.request.body.base;
  if (file) {
    const {all: toPath, relative: url} = fpSpawner();
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(toPath);
    reader.pipe(writer);
    return ctx.body = {succeed: true, path: toPath, url};
  } else if (base) {
    const {all: toPath, relative: url} = fpSpawner();
    const baseNoPrefix = base.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = new Buffer(baseNoPrefix, 'base64');
    try {
      fs.writeFileSync(toPath, dataBuffer);
    } catch (e) {
      console.error(e);
      return ctx.body = {succeed: false};
    }
    return ctx.body = {succeed: true, path: toPath, url};
  }
  return ctx.body = {succeed: false};
});

// 发布
router.post('/publish', async (ctx) => {
  // 如果有效id，则认为是更新；没有则新建
  if (ctx.request.body._id && await Models.document.findOne({_id: ctx.request.body._id})) {
    await Models.document.update(
      {_id: ctx.request.body._id},
      {$set: ctx.request.body}
    );
    return ctx.body = {succeed: true, isNew: false, _id: ctx.request.body._id}
  }
  const ret = await Models.document.create(ctx.request.body);
  return ctx.body = {succeed: true, isNew: true, _id: ret._id};
});

// 快速保存，只影响markdown
router.post('/save', async (ctx) => {
  // 如果有效id，则认为是更新；没有则新建
  if (ctx.request.body._id && await Models.document.findOne({_id: ctx.request.body._id})) {
    await Models.document.update(
      {_id: ctx.request.body._id},
      {$set: ctx.request.body}
    );
    return ctx.body = {succeed: true, isNew: false, _id: ctx.request.body._id}
  }
  const ret = await Models.document.create(ctx.request.body);
  return ctx.body = {succeed: true, isNew: true, _id: ret._id};
});

module.exports = router;