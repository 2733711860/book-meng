/*
* 爬取书籍详情
* 参数：source：小说来源
* links：书籍详情页url列表
*
* */
const { fyPcCrawlDetail } = require('../../util/crawl_fy_pc/reader_fy_pc_crawldetail');
const { fyYdCrawlDetail } = require('../../util/crawl_fy_yd/reader_fy_yd_crawldetail');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      source = 'fy_pc',
      links = []
    } = ctx.query;

    if (source == 'fy_pc') {
      fyPcCrawlDetail(links).then(res => {
        resolve(res)
      })
    } else if (source == 'fy_yd') {
      fyYdCrawlDetail(links).then(res => {
        resolve(res)
      })
    } else {
      resolve({
        status: 500,
        data: null,
        msg: '参数错误'
      })
    }
  })
};
