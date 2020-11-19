/*
 通过关键字查询
 参数：keyWord：搜索关键字
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
			let {
				page = 1,
				pageSize = 10,
				keyWord = ''
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

			let searchSql = `select sql_calc_found_rows * from book where (instr(bookName, '${keyWord}') > 0) or (instr(bookAuthor, '${keyWord}') > 0) order by latelyFollower desc limit ${(page-1) * (pageSize)}, ${pageSize}`;
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
