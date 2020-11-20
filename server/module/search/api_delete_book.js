/*
 删除书籍
 参数：bookIds：书籍id列表
 */

const { deleData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        bookIds = []
      } = ctx.query;

      let bookIdList = [];
      if (Array.isArray(bookIds)) {
        bookIdList = bookIds;
      } else {
        bookIdList.push(bookIds);
      }

      if (bookIdList == []) {
        resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }

      let deleteSql = `delete from book where bookId in (${bookIdList})`;
      deleData(deleteSql).then(res => { // 删除book表中数据
        let tableNames = bookIdList.map(item => {
          return `book_${item}`
        });
        let deleteTable = `drop table if exists ${tableNames}`;
        deleData(deleteTable).then(result => { // 删除对应书籍表
          resolve({
            status: 200,
            data: result,
            msg: '删除成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: '删除对应书籍表失败'
          })
        })
      }).catch(err => {
        resolve({
          status: 500,
          data: err,
          msg: '删除user表数据失败'
        })
      });
    } catch (e) {
      resolve({
        status: 500,
        data: e,
        msg: '服务器异常'
      })
    }
  })
};
