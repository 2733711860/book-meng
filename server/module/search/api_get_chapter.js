/*
 获取书籍章节
 参数：bookId：书籍id
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        bookId = ''
      } = ctx.query;
      if (bookId == '') {
        resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }

      // 判断数据库中是否存在这本书籍对应的表
      let sqls = `select count(*) from information_schema.TABLES t where t.TABLE_SCHEMA = 'book' and t.TABLE_NAME = 'book_${bookId}' `
      let res = await findData((sqls));
      if (res[0]['count(*)'] == 0) { // 不存在
        resolve({
          status: 1001,
          data: null,
          msg: '暂无本书信息'
        });
        return
      }

      let searchSql = `select title, chapterId from book_${bookId}`;
      let result = await findData(searchSql);
      resolve({
        status: 200,
        data: {
          list: result
        },
        msg: '查询成功'
      })
    } catch (e) {
      resolve({
        status: 500,
        data: e,
        msg: '服务器异常'
      })
    }
  })
};
