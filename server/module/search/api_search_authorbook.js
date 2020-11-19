/*
 查询作者的书籍
 参数：bookAuthor：作者名字
 */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
			let {
				bookAuthor = ''
			} = ctx.query;
			let searchSql = `select * from book where bookAuthor like '%${bookAuthor}%' order by latelyFollower desc`;
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
