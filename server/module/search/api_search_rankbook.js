/*
 通过排行榜查询
 参数：rankType：排行榜类型
 page：当前页
 pageSize：每页多少条
 */

const { findData } = require('../../mysql/mysql');

let rankObj = {
  'BR1': 'latelyFollower', // 人气榜，根据点击量(每调一次获取章节接口，后台点击量自动+1)
  'BR2': 'commentNum', // 热评榜，根据评分人数(评分接口，每评分一次+1)
  'BR3': 'bookRate', // 好评榜，根据评分(初始全为5分，增加评分功能)
  'BR4': 'retentionRatio', // 留存榜，根据留存率(加入书架，自动+1)
  'BR5': 'isSerial', // 连载榜，连载中、点击量
  'BR6': 'isSerial', // 完结榜，完本、点击量
  'BR7': 'wordCount', // 字数榜
  'GR1': 'latelyFollower', // 人气榜
  'GR2': 'commentNum', // 热评榜
  'GR3': 'bookRate', // 好评榜
  'GR4': 'retentionRatio', // 留存榜
  'GR5': 'isSerial', // 连载榜
  'GR6': 'isSerial', // 完结榜
  'GR7': 'wordCount' // 字数榜
};

module.exports = async (ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
			let {
				page = 1,
				pageSize = 10,
				rankType = 'BR1'
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

			let searchSql = '';
			if (rankType) { // 根据排行榜来查询
			  if (rankObj[rankType] == 'isSerial') {
			    searchSql = `select sql_calc_found_rows * from book where 
						isSerial = ${rankType == 'GR5' || rankType == 'BR5' ? '2' : '1'} 
						order by latelyFollower desc 
						limit ${(page-1) * (pageSize)}, ${pageSize}`
			  } else {
			    searchSql = `select sql_calc_found_rows * from book 
						order by ${rankObj[rankType]} desc 
						limit ${(page-1) * (pageSize)}, ${pageSize}`
			  }
			}
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
