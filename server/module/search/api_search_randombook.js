/*
 猜你喜欢（随机返回几本书）
 参数：bookNum：数量
 bookType：书籍类别
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
			let {
				bookNum = 1,
				bookType = '1'
			} = ctx.query;
      bookNum = Number(bookNum);
			if (bookNum < 1) {
			  resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }
			let searchSql = `select sql_calc_found_rows * from book where bookType = ${bookType} order by rand() limit 0, ${bookNum}`;
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
      reject({
				status: 500,
				data: e,
				msg: '服务器异常'
			})
    }
  })
};
