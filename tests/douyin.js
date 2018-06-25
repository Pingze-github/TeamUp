const rp = require('request-promise');

~async function main() {

  const res = await rp.get({
    uri: 'http://v.douyin.com/EGs4t/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
    }
  });

  console.log(res);
}();