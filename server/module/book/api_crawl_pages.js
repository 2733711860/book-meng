/*
* 爬取页码
* 参数：source：小说来源
*
* */
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');

const sourceObj = {
  'fy_pc': 'https://www.44pq.cc/allvisit-1.html'
};

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let {
        source = 'fy_pc',
      } = ctx.query;

      superagent.get(sourceObj[source])
        .charset('gbk')
        .buffer(true)
        .end((err, res) => {
          if (err) {
            resolve({
              status: 500,
              data: err,
              msg: '获取出错'
            });
            return
          };
          var $ = cheerio.load(res.text);
          let pages = $("#pagelink").find("a.last").text(); // 获取小说列表总页数
          resolve({
            status: 200,
            data: {
              allPages: pages
            },
            msg: '总页码获取成功！'
          });
        })
    } catch (e) {
      resolve({
        status: 500,
        data: e,
        msg: '获取出错'
      })
    }
  });
};
