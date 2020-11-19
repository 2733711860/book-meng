/*
* 根据数据库批量爬取书籍详情
* 参数：source：小说来源
* page：页码
* pageSize：每页多少条
*
* */
const { fyPcCrawlAllDetail } = require('../../util/crawl_fy_pc/reader_fy_pc_crawlAlldetail');
const  { fyYdCrawlAllDetail } = require('../../util/crawl_fy_yd/reader_fy_yd_crawlAlldetail');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      source = 'fy_pc',
      page = 1,
      pageSize = 30
    } = ctx.query;

    if (source == 'fy_pc') {
      fyPcCrawlAllDetail(page, pageSize).then(res => {
        resolve(res)
      })
    } else if (source == 'fy_yd') {
      fyYdCrawlAllDetail(page, pageSize).then(res => {
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
