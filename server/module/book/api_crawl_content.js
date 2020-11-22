/*
* 爬取书籍正文
* 参数：source：小说来源
* chapterId, bookId
*
* */
const { fyPcCrawlContent } = require('../../util/crawl_fy_pc/reader_fy_pc_crawlcontent');
const { fyYdCrawlContent } = require('../../util/crawl_fy_yd/reader_fy_yd_crawlcontent');

module.exports = async (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      source = 'fy_pc',
      chapterId = '',
      bookId = ''
    } = ctx.query;

    if (source == 'fy_pc') {
      fyPcCrawlContent(chapterId, bookId).then(res => {
        resolve(res)
      })
    } else if (source == 'fy_yd') {
      fyYdCrawlContent(link).then(res => {
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
