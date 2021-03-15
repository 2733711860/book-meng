/**
 * @description: 搜索书籍
 * @author: 86183
 * @param: keyWord
 * @param: searchType(
 *        0：笔趣阁；
 *        1：新笔趣阁；
 * )
 * @date: 2021/3/11
 */

const { findData } = require('../../../mysql/mysql');
const { crawlSearch } = require('../biquge_new/utils/common');
const { getSearchList } = require('../../../util/crawl_biquge/common');

module.exports = (ctx) => {
  return new Promise(async (resolve, reject) => {
    let {
      keyWord = '',
      searchType = '0'
    } = ctx.query;
    if (!keyWord) {
      resolve({
        status: 500,
        data: null,
        msg: '参数不正确'
      });
      return
    }

    let tableName = searchType == '0' ? 'book_biquge' : 'book_xinbiquge';
    let searchSql = `select * from ${tableName} where (instr(bookName, '${keyWord}') > 0) or (instr(bookAuthor, '${keyWord}') > 0)`;
    let result = await findData(searchSql);
    if (result.length == 0) { // 没有查询到则去爬取
      if (searchType == '0') { // 笔趣阁
        getSearchList(keyWord).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: '搜索失败'
          })
        })
      } else { // 新笔趣阁
        crawlSearch(keyWord).then(res => {
          resolve({
            status: 200,
            data: res,
            msg: '查询成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: null,
            msg: err
          })
        })
      }
    } else {
      resolve({
        status: 200,
        data: result,
        msg: '查询成功'
      })
    }
  })
};
