/**
 * @description: 获取书籍详情
 * @author: 86183
 * @param: bookId
 * @param: searchType(
 *        0：笔趣阁；
 *        1：新笔趣阁
 * )
 * @date: 2021/3/11
 */

const { findData } = require('../../../mysql/mysql');
const { getDetail } = require('../../../util/crawl_biquge/common');
const { crawlBookDetail } = require('../biquge_new/utils/common');

module.exports = (ctx) => {
  return new Promise(async (resolve, reject) => {
    let {
      bookId = '',
      searchType = '0'
    } = ctx.query;
    if (!bookId) {
      resolve({
        status: 500,
        data: null,
        msg: '参数不正确'
      });
      return
    }

    let tableName = searchType == '0' ? 'book_biquge' : 'book_xinbiquge';
    let searchSql = `select * from ${tableName} where (instr(bookId, '${bookId}') > 0)`;
    let result = await findData(searchSql);
    if (result.length == 0) { // 数据库没有则爬取
      if (searchType == '0') { // 笔趣阁
        getDetail(bookId).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '查询成功'
          })
        }).catch(err => {
          resolve({
            status: 400,
            data: null,
            msg: err
          })
        })
      } else { // 新笔趣阁
        crawlBookDetail(bookId).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '查询成功'
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
