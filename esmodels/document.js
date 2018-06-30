
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({ host: 'localhost:9200' });

function _prune(obj) {
  const obj1 = {};
  for (const k of Object.keys(obj)) {
    if (obj[k]) {
      obj1[k] = obj[k];
    }
  }
  return obj1;
}

Document = {};

Document.create = async (body) => {
  const ret = await Models.document.create(body);
  if (ret._id) {
    await esclient.update({
      index: 'documents',
      type: 'default',
      id: ret._id.toString(),
      body: {
        doc: {
          id: ret._id.toString(),
          title: ret.title,
          markdown: ret.markdown,
        },
        upsert : {
          title: ret.title,
          markdown: ret.markdown,
        }
      }
    });
  }
  return ret;
};

Document.update = async (_id, body) => {
  const ret = await Models.document.update(
    {_id: _id},
    {$set: body},
  );
  if (ret.nModified) {
    await esclient.update({
      index: 'documents',
      type: 'default',
      id: _id,
      body: {
        doc: _prune({
          id: _id,
          title: body.title,
          markdown: body.markdown,
        })
      }
    });
  }
  return ret;
};

Document.delete = async (_id) => {
  const ret = await Models.document.remove({ _id: _id });
  if (ret.n) {
    await esclient.delete({
      index: 'documents',
      type: 'default',
      id: _id.toString(),
    });
  }
  return ret;
};

Document.deleteMany = async (ids) => {
  const ret = await Models.document.remove({ _id: { $in: ids } });
  if (ret.n) {
    const opBody = ids.map(id => {
      return { delete: {_index: 'documents', _type: 'default', _id: id.toString()} }
    });
    await esclient.bulk({
      body: opBody
    });
  }
  return ret;
};

module.exports = Document;