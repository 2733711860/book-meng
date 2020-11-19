/*
 通过类型查询
 参数：bookType：书籍类型
 page：当前页
 pageSize：每页多少条
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
			let {
				page = 1,
				pageSize = 10,
				bookType = '1'
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

			let searchSql = `select sql_calc_found_rows * from book where bookType = ${bookType} order by latelyFollower desc limit ${(page-1) * (pageSize)}, ${pageSize}`;
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
