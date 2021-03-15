/**
 * @description: 书籍正文
 * @author: 86183
 * @param: chapterId , bookId
 * @date: 2021/3/4
 */
const { crawlBookContent } = require('./utils/common');

module.exports = (ctx) => {
  return new Promise((resolve, reject) => {
    let {
      chapterId = '',
      bookId = ''
    } = ctx.query;
    if (!chapterId || !bookId) {
      resolve({
        status: 500,
        data: null,
        msg: '参数不正确'
      });
      return
    }
    crawlBookContent(bookId, chapterId).then(res => {
      resolve({
        status: 200,
        data: res,
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



// 去除内容的两端空格和&nbsp;
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
}
