/*
* 风雨小说网PC端
* 直接从数据库获取所有书籍id，查询详情
* 参数：page：当前页，默认1
* pageSize：每页条数，默认100
* */
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { addData, findData, deleData } = require('../../mysql/mysql');

let typeObj = {
  '玄幻小说': '1',
  '仙侠修真': '2',
  '都市言情': '3',
  '历史军事': '4',
  '网游竞技': '5',
  '科幻灵异': '6'
};


module.exports = {
  fyPcCrawlAllDetail(page, pageSize) {
    return new Promise(async (resolve, reject) => {
      try {
        page = Number(page);
        pageSize = Number(pageSize);

        if (page < 1 || pageSize < 1) {
          resolve({
            status: 500,
            data: null,
            msg: '参数不正确'
          });
          return
        }
        let sql = `select sql_calc_found_rows bookId from book order by bookId desc limit ${(page-1) * (pageSize)}, ${pageSize}`;
        let bookList = await findData(sql);
        let total = await findData(`SELECT FOUND_ROWS() as total;`);

        if (bookList.length == 0) {
          resolve({
            status: 500,
            data: null,
            msg: "本次查询为空"
          })
        }

        let bookIds = bookList.map(item => {
          return item.bookId
        });

        beforGetDetail(bookIds).then(results => {
          resolve({
            status: 200,
            data: {
              books: results,
              total: total[0].total
            },
            msg: '获取成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: "获取出错"
          })
        })
      } catch (err) {
        resolve({
          status: 500,
          data: err,
          msg: "爬取数据出错"
        })
      }
    })
  }
};

function beforGetDetail(bookIds) {
	return new Promise((resolve, reject) => {
		try{
			async.mapLimit(bookIds, 30, (item, callback) => {
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

// https://www.44pq.cc/kan/14223/
function getDetail(bookId, callback) { // 获取小说详情
	try {
		superagent.get(`https://www.44pq.cc/kan/${bookId}/`)
			.charset('gbk')
			.buffer(true)
			.end((err, res) => {
				if (err) {
					callback(err)
          return
				};
				if (res && res.text) {
					let $ = cheerio.load(res.text);
					let oneBook = {};
          oneBook.bookName = $(".bookinfo .panel-intro .btitle").text(); // 书名
          oneBook.bookId = bookId; // 书籍Id
          oneBook.bookAuthor = $(".bookinfo .panel-intro .infos").children("span").eq(0).find("a").text(); // 作者
          let str_1 = $(".bookinfo .panel-intro .infos").children("span").eq(1).text();
          oneBook.isSerial = str_1.indexOf('连载中') > -1 ? '2' : '1'; // 连载状态
          oneBook.bookImg = $(".bookinfo .pic").find("img").attr("src"); // 书籍封面
          oneBook.bookDesc = trim($(".bookinfo .panel-intro .intro").text()); // 书籍简介
          let str = $(".bookinfo .panel-intro .infos").text();
          oneBook.wordCount = Number(str.slice(str.indexOf('(共') + 2, str.indexOf('万字)'))) * 10000; // 书籍字数
          let str2 = $(".bookinfo .panel-intro .infos").children(".item:last-child").text();
          oneBook.updatedTime = str2.slice(str2.indexOf("(更新时间：") + 6, str2.length - 1); // 更新时间
          oneBook.lastChapter = $(".bookinfo .panel-intro .infos").children(".item:last-child").find("a").text(); // 最新章节
          oneBook.bookType = typeObj[$(".crumbs .fl").children("a:last-child").text()];
          oneBook.detailUrl = `https://www.44pq.cc/kan/${bookId}/`; // 详情页链接
          oneBook.bookRate = 5.0; // 评分
          oneBook.latelyFollower = 1000; // 人气
          oneBook.retentionRatio = 0; // 留存率
          oneBook.commentNum = 1000; // 评分人数
          oneBook.source = 'fy_pc'; // 书籍来源，风雨小说PC端
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

// 去除内容的两端空格和&nbsp;
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
}


