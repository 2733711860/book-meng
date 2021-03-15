/**
 * @description: 笔趣阁书籍详情
 * @author: 86183
 * @param: bookId
 * @date: 2021/3/4
 */
const { crawlBookDetail } = require('./utils/common');

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
    crawlBookDetail(bookId).then(oneBook => {
      resolve({
        status: 200,
        data: oneBook,
        msg: '成功'
      })
    }).catch(err => {
      resolve({
        status: 400,
        data: null,
        msg: err
      })
    })
  })
};
