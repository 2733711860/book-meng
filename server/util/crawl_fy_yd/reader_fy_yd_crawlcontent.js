/*
 风雨小说网移动端
 获取小说正文
 参数：link
 */

const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');


module.exports = {
  fyYdCrawlContent(link) {
    return new Promise(async (resolve, reject) => {
      if (link == '') {
        resolve({
          status: 500,
          data: null,
          msg: '参数错误'
        });
        return
      }

      getBookContent(link).then(res => {
        resolve({
          status: 200,
          data: res,
          msg: '获取成功'
        })
      }).catch(err => {
        resolve({
          status: 500,
          data: err,
          msg: '获取失败'
        })
      })
    })
  }
};

// https://m.44pq.cc/book_152205/57429121.html
function getBookContent(url) { // 爬取正文
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .charset('gbk')
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject(err);
          return
        };
        if (res && res.text) {
          var $ = cheerio.load(res.text);
          let contents = {};
          contents.title = $("#nr_title").text(); // 章节名称
          contents.cpContent = $("#nr1").text(); // 章节内容
          if ($("#nr1").find(".red").text() != '') { // 本章未完结，还有下一页
            let nextUrl = `https://m.44pq.cc${$("#pb_next").attr("href")}`;
            getNextPageContent(nextUrl).then(res => {
              contents.cpContent = contents.cpContent + res;
              resolve(contents)
            });
          } else {
            resolve(contents)
          }
        } else {
          reject()
        }
      })
  })
}

function getNextPageContent(url) { // 获取下一页内容
	return new Promise((resolve, reject) => {
	  superagent.get(url)
	    .charset('gbk')
	    .buffer(true)
	    .end(async (err, res) => {
	      if (err) {
          reject(err);
          return
        };
	      if (res && res.text) {
          var $ = cheerio.load(res.text);
          let strs = $("#nr1").text();
          if ($("#nr1").find(".red").text() != '') { // 本章未完结，还有下一页
            let nextUrl = `https://m.44pq.cc${$("#pb_next").attr("href")}`;
            getNextPageContent(nextUrl).then(res => {
              strs = strs + res;
              resolve(strs);
            })
          } else {
            resolve(strs);
          }
        } else {
	        reject()
        }
	    })
	})
}
