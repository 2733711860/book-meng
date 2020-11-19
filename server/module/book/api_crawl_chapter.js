/*
* 爬取书籍章节
* 参数：source：小说来源
* bookId：书籍id
*
* */
const { fyPcCrawlChapter } = require('../../util/crawl_fy_pc/reader_fy_pc_crawlchapter');
const { fyYdCrawlChapter } = require('../../util/crawl_fy_yd/reader_fy_yd_crawlchapter');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      source = 'fy_pc',
      bookId = ''
    } = ctx.query;

    if (source == 'fy_pc') {
      fyPcCrawlChapter(bookId).then(res => {
        resolve(res)
      })
    } else if (source == 'fy_yd') {
      fyYdCrawlChapter(bookId).then(res => {
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
