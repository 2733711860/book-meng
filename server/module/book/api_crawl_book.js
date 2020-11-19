/*
* 爬取书籍
* 参数：source：小说来源
* start：开始页
* end：结束页
* type：书籍类型：1,2,3,4,5,6  风雨小说移动端时需要（但默认为1）
*
* */
const { fyPcCrawlBook } = require('../../util/crawl_fy_pc/reader_fy_pc_crawlbook');
const { fyYdCrawlBook } = require('../../util/crawl_fy_yd/reader_fy_yd_crawlbook');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      source = 'fy_pc',
      start = 1,
      end = 1,
      type = '1'
    } = ctx.query;

    if (source == 'fy_pc') {
      fyPcCrawlBook(start, end).then(res => {
        resolve(res)
      })
    } else if (source == 'fy_yd') {
      fyYdCrawlBook(type, start, end).then(res => {
        resolve(res)
      })
    } else {
      resolve({
        status: 500,
        data: null,
        msg: '参数错误'
      })
    }
  });
};
