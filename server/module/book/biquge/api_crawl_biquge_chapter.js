/**
 * @description: 书籍章节
 * @author: 86183
 * @param: bookId
 * @date: 2021/3/4
 */
const { getChapterByCrawlBiquge } = require('../../../util/crawl_biquge/common');

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      bookId = ''
    } = ctx.query;
    if (!bookId) {
      resolve({
        status: 500,
        data: null,
        msg: '参数不正确'
      });
      return
    }
    getChapterByCrawlBiquge(bookId).then(res => {
      resolve({
        status: 200,
        data: res,
        msg: '成功'
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '获取书籍章节信息失败'
      })
    })
  })
};


