var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

process.on('unhandledRejection', (rej) => {
  console.error(rej);
})

~async function () {
  let ret;
  ret = await esclient.bulk({
    body: [
      { index: { _index: 'myindex', _type: 'mytype', _id: 1 } },
      { title: '王者荣耀是一款moba手游' },
      { index: { _index: 'myindex', _type: 'mytype', _id: 2 } },
      { title: '荒野求生是一款吃鸡手游'},
      { index: { _index: 'myindex', _type: 'mytype', _id: 3 } },
      { title: '中国手游市场火热超前，王者荣耀领跑'},
    ]
  });
  console.log('批量操作', ret);
  console.log('查出一个', await esclient.get({ index: 'myindex', type: 'mytype', id: 1 }));
  ret = await esclient.search({
    index: 'myindex',
    body: {
      query: {
        match: {
          title: '手游王者荣耀'
        }
      }
    }
  });
  console.log('搜索', ret, '\n', ret.hits.hits);

  // console.log('删除', await esclient.delete({index: 'teamup', type: 'judicial', id: 'rTkZSWQB3EzILMDXzqmX'}));

  // console.log('删除索引', await esclient.indices.delete({index: 'teamup'}))

  // console.log('查看索引', await esclient.indices.stats({index: '_all'}))

  ret = await esclient.search({
    index: 'documents',
    body: {
      query: {
        match: {
          title: '3'
        }
      }
    }
  });
  console.log('documents搜索', ret, '\n', ret.hits.hits);

  console.log('COUNT', await esclient.count({index: 'documents'}))

  ret = await esclient.msearch({
    body: [
      { index: 'documents', type: 'default' },
      // { query: { match_all: {} } },
      { query: { match: { title: '西红柿'} } },
    ]
  });
  console.log('搜索结果', ret.responses[0].hits.hits)
}();