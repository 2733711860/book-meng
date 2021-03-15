/**
 * @description: 章节
 * @author: 86183
 * @param: bookId
 * @param: searchType(
 *        0：笔趣阁；
 *        1：新笔趣阁
 * )
 * @date: 2021/3/12
 */
const { findData } = require('../../../mysql/mysql');
const { crawlChapters } = require('../biquge_new/utils/common');
const { getChapterByCrawlBiquge } = require('../../../util/crawl_biquge/common');

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

    let tableName = searchType == '0' ? `book_biquge_${bookId}` : `book_xinbiquge_${bookId}`;
    // 判断数据库中是否存在这本书籍对应的表
    let sqls = `select count(*) from information_schema.TABLES t where t.TABLE_SCHEMA = 'book' and t.TABLE_NAME = '${tableName}'`;
    let res = await findData((sqls));
    if (res[0]['count(*)'] == 0) { // 不存在，则爬取
      if (searchType == '0') { // 笔趣阁
        getChapterByCrawlBiquge(bookId).then(res => {
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
      } else { // 新笔趣阁
        crawlChapters(bookId).then(res => {
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
      let searchSql = `select title, chapterId from ${tableName}`;
      let result = await findData(searchSql);
      resolve({
        status: 200,
        data: result,
        msg: '查询章节成功'
      })
    }
  })
};
