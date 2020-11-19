/*
 风雨小说网移动端
 获取小说章节
 参数：书籍id：bookId
 */

const superagent = require('_superagent@5.3.1@superagent');
require('_superagent-charset@1.2.0@superagent-charset')(superagent);
const cheerio = require('_cheerio@1.0.0-rc.3@cheerio');
const async = require('_async@3.2.0@async');


module.exports = {
  fyYdCrawlChapter(bookId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (bookId == '') {
          resolve({
            status: 500,
            data: null,
            msg: '参数错误'
          });
          return
        }

        getChapterPages(bookId).then(links => { // 获取章节列表总url
          async.mapLimit(links, 5, (item, callback) => {
            getChapters(item, callback)
          }, async (err, results) => {
            if (err) {
              resolve({
                status: 500,
                data: err,
                msg: "获取失败"
              })
            } else {
              let chapterList = [].concat(...results); // 章节列表
              resolve({
                status: 200,
                data: {
                  list: chapterList
                },
                msg: '获取成功'
              })
            }
          });
        }).catch((e) => {
          resolve({
            status: 500,
            data: e,
            msg: "获取失败"
          })
        })
      } catch (e) {
        let result = {
          status: 500,
          data: e,
          msg: "获取失败"
        };
        resolve(result)
      }
    })
  }
};

function getChapterPages(bookId) { // 获取小说章节列表总url
  return new Promise(((resolve, reject) => {
    try {
      superagent.get(`https://m.44pq.cc/chapters_${bookId}/`)
        .charset('gbk')
        .buffer(true)
        .end((err, res) => {
          if (err) {
            reject(err);
            return
          };
          if (res && res.text) {
            let $ = cheerio.load(res.text);
            let str = $(".page-crawl_fy_pc-turn").text();
            let pages = str.slice(3, str.indexOf('页['));
            let links = [];
            for (var i=1; i<=pages; i++) {
              links.push(`https://m.44pq.cc/chapters_${bookId}/${i}`);
            };
            resolve(links);
          } else {
            reject()
          }
        })
    } catch (e) {
      reject(e)
    }
  }))
}

function getChapters(url, callback) { // 获取小说章节
	superagent.get(url)
		.charset('gbk')
		.buffer(true)
		.end((err, res) => {
			if (err) callback(err);
			if (res && res.text) {
				let $ = cheerio.load(res.text);
				let links = [];
				$(".lb_mulu .last9").find("li").each((i, v) => {
					if (!$(v).hasClass('title')) {
						links.push({
							title: $(v).find("a").text(), // 章节名称
							link: `https://m.44pq.cc${$(v).find("a").attr("href")}` // 章节link
						})
					}
				});
				callback(null, links);
			}
		})
}
