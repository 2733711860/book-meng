/*
 多条件查询
 参数：keyWord：搜索关键字
 bookType: 书籍类型 1, 2, 3, 4, 5, 6  默认空，即全部
 bookAuthor：作者，默认空
 isSerial：连载状态 1， 2， 默认空
 source：书籍来源 默认空
 page：页码
 pageSize：每页数量
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        page = 1,
        pageSize = 10,
        keyWord = '',
        bookType = '',
        bookAuthor = '',
        isSerial = '',
        source = ''
      } = ctx.query;
      page = Number(page);
      pageSize = Number(pageSize);

      if (page < 1 || pageSize < 1) {
        resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }

      let searchSql = `select sql_calc_found_rows * from book where
        (instr(bookName, '${keyWord}') > 0) and
        (instr(bookType, '${bookType}') > 0) and
        (instr(bookAuthor, '${bookAuthor}') > 0) and
        (instr(isSerial, '${isSerial}') > 0) and
        (instr(source, '${source}') > 0)
        order by latelyFollower desc limit ${(page-1) * (pageSize)}, ${pageSize}`;
      let result = await findData(searchSql);
      let total = await findData(`SELECT FOUND_ROWS() as total;`);
      resolve({
        status: 200,
        data: {
          list: result,
          total: total[0].total
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
