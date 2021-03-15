/**
 * @description: 正文
 * @author: 86183
 * @param: bookId
 * @param: chapterId
 * @param: searchType(
 *        0：笔趣阁；
 *        1：新笔趣阁
 * )
 * @date: 2021/3/12
 */
const { findData } = require('../../../mysql/mysql');
const { crawlBookContent } = require('../biquge_new/utils/common');
const { getContent } = require('../../../util/crawl_biquge/common');

module.exports = (ctx) => {
  return new Promise(async (resolve, reject) => {
    let {
      bookId = '',
      chapterId = '',
      searchType = '0'
    } = ctx.query;
    if (!bookId || !chapterId) {
      resolve({
        status: 500,
        data: null,
        msg: '参数不正确'
      });
      return
    }

    let tableName = searchType == '0' ? `book_biquge_${bookId}` : `book_xinbiquge_${bookId}`;
    let searchSql = `select * from ${tableName} where chapterId = '${chapterId}'`;
    let result = await findData(searchSql);
    if (!result || result.length == 0 || !result[0].cpContent) { // 数据库没有则爬取
      if (searchType == '0') { // 笔趣阁
        getContent(bookId, chapterId).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '成功'
          })
        }).catch(err => {
          resolve({
            status: 400,
            data: err,
            msg: '失败'
          })
        })
      } else { // 新笔趣阁
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
      }
    } else {
      resolve({
        status: 200,
        data: result[0],
        msg: '查询成功'
      })
    }
  })
};
