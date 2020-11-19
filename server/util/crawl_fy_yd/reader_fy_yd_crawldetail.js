/*
* 风雨小说网移动端
* 根据url爬取书籍详情
* 参数：links：书籍链接列表
*
* */
const superagent = require('_superagent@5.3.1@superagent');
require('_superagent-charset@1.2.0@superagent-charset')(superagent);
const cheerio = require('_cheerio@1.0.0-rc.3@cheerio');
const async = require('_async@3.2.0@async');
const { addData, findData, deleData } = require('../../mysql/mysql');

let typeObj = {
  '玄幻小说': '1',
  '仙侠修真': '2',
  '都市言情': '3',
  '历史军事': '4',
  '网游竞技': '5',
  '科幻灵异': '6'
};
let stateObj = {
  '已完成': '1',
  '连载中': '2'
};


module.exports = {
  fyYdCrawlDetail(links) {
    return new Promise(async (resolve, reject) => {
      try {
        let linkList = [];
        if (Array.isArray(links)) {
          linkList = links;
        } else {
          linkList.push(links);
        }
        beforGetDetail(linkList).then(results => {
          resolve({
            status: 200,
            data: {
              books: results
            },
            msg: '获取成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: "从小说网站爬取书籍出错，请检查链接是否正确"
          })
        })
      } catch (e) {
        resolve({
          status: 500,
          data: e,
          msg: "爬取数据出错"
        })
      }
    })
  }
};

function beforGetDetail(links) {
	return new Promise((resolve, reject) => {
		try{
			async.mapLimit(links, 5, (item, callback) => {
			  getDetail(item, callback)
			}, async (err, results) => {
			  if (err) {
			    reject(err)
			  } else {
					saveBooks(results).then(res => {
						resolve(results)
					}).catch(err => {
						reject(err)
					})
			  }
			});
		} catch (e) {
			reject(e)
		}
	})
}

// https://m.44pq.cc/book_${bookId}/
function getDetail(url, callback) { // 获取小说详情
	try {
		superagent.get(url)
			.charset('gbk')
			.buffer(true)
			.end((err, res) => {
				if (err) {
          callback(err);
          return
        };
				if (res && res.text) {
					let $ = cheerio.load(res.text);
					let oneBook = {};
					oneBook.bookImg = $(".bookinfo table tr").find("td:first-child").find("img").attr("src"); // 书籍封面
					oneBook.bookId = url.slice(url.indexOf('cc/book_') + 8, url.length - 1); // 书籍Id
					let str = $(".bookinfo table tr").find("td:last-child").children("p").eq(1).text();
					str = str.slice(3, str.length);
					oneBook.bookType = typeObj[str]; // 分类
					oneBook.bookName = $(".bookinfo table tr").find("td:last-child").find("h1").text(); // 书名
					let str_2 = $(".bookinfo table tr").find("td:last-child").children("p").eq(0).text();
					oneBook.bookAuthor = str_2.slice(3, str_2.length); // 作者
					let str_3 = $(".bookinfo table tr").find("td:last-child").children("p").eq(2).text();
					str_3 = str_3.slice(3, str_3.length);
					oneBook.isSerial = stateObj[str_3];
					let str_4 = $(".bookinfo table tr").find("td:last-child").children("p").eq(3).text();
					str_4 = str_4.slice(3, str_4.length);
					oneBook.updatedTime = str_4 == '' ? '2020-01-01 12:12' : str_4; // 更新时间
					let str_5 = $(".bookinfo table tr").find("td:last-child").children("p").eq(4).text();
					str_5 = str_5.slice(3, str_5.length);
					oneBook.lastChapter = str_5; // 最新章节
					oneBook.bookRate = 5.0; // 评分
					oneBook.bookDesc = $(".intro").text(); // 简介
					oneBook.retentionRatio = 0; // 留存率
					oneBook.commentNum = 1000; // 评分人数
					oneBook.detailUrl = url; // 详情页链接
          oneBook.source = 'fy_yd'; // 书籍来源，风雨小说移动端
					callback(null, oneBook);
				}
			})
	} catch (e) {
		callback(e)
	}
}

function saveBooks(results) {
  return new Promise(async (resolve, reject) => {
    try {
			let keysList = Object.keys(results[0]);
			let str1 = keysList.join(',');

			let updates = keysList.map(item => {
				return `${item} = values(${item})`
			});
			updates = updates.join(',');

			let valueList = results.map(item => {
				return Object.values(item)
			});

			var editSql = `insert into book (${str1}) values ? on duplicate key update ${updates}`;

      await addData(editSql, [valueList]).then(data => {
        resolve(data)
      }, (err) => {
        reject(err)
      });
    } catch (e) {
      reject(e)
    }
  })
}


