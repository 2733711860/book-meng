/*
 获取搜索热词
 参数：num：热词数量，默认15
  */

const { findData } = require('../../mysql/mysql');

module.exports = async (ctx) =>{
  return new Promise(async (resolve, reject) => {
		try{
			let { num = 15 } = ctx.query;
			num = Number(num);
			if (num < 1) {
			  resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
			  return
      }
			let sql = `select bookName from book order by latelyFollower desc limit 0, ${num}`;
			let result = await findData(sql);
			resolve({
			  status: 200,
			  data: {
					list: result
				},
				msg: '搜索热词获取成功'
			})
		} catch(e) {
			resolve({
				status: 500,
				data: e,
				msg: '数据获取失败'
			})
		}
  })
};
