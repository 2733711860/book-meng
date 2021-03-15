/**
 * @description: 笔趣阁书籍详情
 * @author: 86183
 * @param: bookId
 * @date: 2021/3/4
 */
const { getDetail } = require('../../../util/crawl_biquge/common');

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
    getDetail(bookId).then(oneBook => {
      resolve({
        status: 200,
        data: oneBook,
        msg: '成功'
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: err,
        msg: '获取书籍基本信息失败'
      })
    })
  })
};
