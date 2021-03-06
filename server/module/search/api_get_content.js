/*
 获取书籍正文
 参数：bookId：书籍id
 chapterId：章节Id
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        bookId = '',
        chapterId = ''
      } = ctx.query;
      if (bookId == '' || chapterId == '') {
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

      let searchSql = `select title, cpContent from book_${bookId} where chapterId = ${chapterId}`;
      let result = await findData(searchSql);
      if (result && result[0] && result [0].cpContent && result [0].cpContent != '') {
        resolve({
          status: 200,
          data: {
            title: result[0].title,
            cpContent: result[0].cpContent
          },
          msg: '查询成功'
        })
      } else {
        resolve({
          status: 1001,
          data: null,
          msg: '暂无本章信息'
        })
      }
    } catch (e) {
      resolve({
        status: 500,
        data: e,
        msg: '服务器异常'
      })
    }
  })
};
