/*
* 风雨小说网PC端
* 根据url爬取书籍详情
* 参数：links：书籍链接列表
*
* */
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { addData } = require('../../mysql/mysql');

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
  fyPcCrawlDetail(links) {
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

// https://www.44pq.cc/kan/150/
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
          oneBook.bookName = $(".bookinfo .panel-intro .btitle").text(); // 书名
          oneBook.bookAuthor = $(".bookinfo .panel-intro .infos").children("span").eq(0).find("a").text(); // 作者
          let str_1 = $(".bookinfo .panel-intro .infos").children(".item:first-child").text();
          oneBook.isSerial = str_1.indexOf('连载中') > -1 ? '2' : '1'; // 连载状态
          oneBook.bookImg = $(".bookinfo .pic").find("img").attr("src"); // 书籍封面
					oneBook.bookId = url.slice(url.indexOf('cc/kan/') + 8, url.length - 1); // 书籍Id
          oneBook.bookDesc = trim($(".bookinfo .panel-intro .intro").text()); // 书籍简介
          let str = $(".bookinfo .panel-intro .infos").text();
          oneBook.wordCount = Number(str.slice(str.indexOf('(共') + 2, str.indexOf('万字)'))) * 10000; // 书籍字数
          let str2 = $(".bookinfo .panel-intro .infos").children(".item:last-child").text();
          oneBook.updatedTime = str2.slice(str2.indexOf("(更新时间：") + 6, str2.length - 1); // 更新时间
          oneBook.lastChapter = $(".bookinfo .panel-intro .infos").children(".item:last-child").find("a").text(); // 最新章节
          oneBook.bookType = typeObj[$(".crumbs .fl").children("a:last-child").text()];
          oneBook.detailUrl = url; // 详情页链接
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
