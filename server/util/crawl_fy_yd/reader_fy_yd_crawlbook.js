/*
* 风雨小说网移动端
* 爬取书籍
* 参数：start：开始页数
* end：结束页数
* type：类别1,2,3,4,5,6
* */

const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { addData, findData, deleData } = require('../../mysql/mysql');

// https://m.44pq.cc/wapsort/1_1.html
module.exports = {
  fyYdCrawlBook(type, start, end) {
    return new Promise(async (resolve, reject) => {
      try {
        start = Number(start);
        end = Number(end);
        if (start < 1 || end < 1 || end < start) {
          resolve({
            status: 500,
            data: null,
            res: '参数不正确'
          });
          return
        }
        let url = `https://m.44pq.cc/wapsort/${type}_1.html`;
        let links = await getPages(url, type, start, end); // 获取小说列表总url
        async.mapLimit(links, 30, (item, callback) => {
          getItemPageBooks(item, callback, type)
        }, async (err, results) => {
          if (err) {
            resolve({
              status: 500,
              data: err,
              msg: "爬取数据出错"
            })
          } else {
            let bookList = [].concat(...results);

            if (bookList.length == 0) {
              resolve({
                status: 500,
                data: null,
                msg: '获取小说信息失败'
              });
              return
            }

            let data = await saveBooks(bookList);
            resolve({
              status: 200,
              data: {
                saveResult: data,
                linkPages: links
              },
              msg: '保存成功'
            })
          }
        });
      } catch (e) {
        let result = {
          status: 500,
          data: e,
          msg: "爬取数据出错"
        };
        resolve(result)
      }
    })
  }
};

// https://m.44pq.cc/wapsort/1_1.html
function getPages(url, type, start, end) { // 获取小说列表总url
  return new Promise(((resolve, reject) => {
    try {
      superagent.get(url)
        .charset('gbk')
        .buffer(true)
        .end((err, res) => {
          if (err) {
            reject(err);
            return
          };
          if (res && res.text) {
            let $ = cheerio.load(res.text);
            let str = $(".page-book-turn").text();
            let pages = str.slice(3, str.indexOf('页['));
            let links = [];
            for (var i=(start>=1 ? start : 1); i<= (end <= pages ? end : pages); i++) {
              links.push(`https://m.44pq.cc/wapsort/${type}_${i}.html`);
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

function getItemPageBooks(url, callback, type) { // 获取每页小说
  superagent.get(url)
    .charset('gbk')
    .buffer(true)
    .end((err, res) => {
      if (err) callback(err);
      if (res && res.text) {
        let $ = cheerio.load(res.text);
        let pageBooks = [];
        $("table.list-item").each((i, v) => {
          let oneBook = {};
          oneBook.bookType = type; // 书籍分类
          oneBook.bookImg = $(v).find("tr:first-child").find("td:first-child").find("a img").attr("src"); // 书籍封面
          let str = $(v).find("tr:first-child").find("td:first-child").find("a").attr("href");
          oneBook.bookId = str.slice(6, str.length - 1); // 书籍Id
          oneBook.bookName = $(v).find("tr:first-child").find("td:last-child").find(".article").find("a:first-child").text(); // 书名
          let str_2 = $(v).find("tr:first-child").find("td:last-child").find(".article").find("p.gray").find("span.mr15").text();
          oneBook.bookAuthor = str_2.slice(3, str_2.length); // 作者
          let str_3 = $(v).find("tr:first-child").find("td:last-child").find(".article").find("p.gray").find("span.count").text();
          oneBook.latelyFollower = Number(str_3); // 人气
          let str_4 = $(v).find("tr:first-child").find("td:last-child").find(".article").find("span.fs12.red").text();
          oneBook.isSerial = str_4.indexOf('完') != -1 ? '1' : '2';
          oneBook.bookRate = 5.0; // 评分
          oneBook.bookDesc = $(v).find("tr:first-child").find("td:last-child").find(".article").find("a:last-child").find("span").text(); // 书籍简介
          oneBook.detailUrl = `https://m.44pq.cc${$(v).find("tr:first-child").find("td:last-child").find(".article").find("a:first-child").attr("href")}`; // 详情页链接
          oneBook.source = 'fy_yd'; // 书籍来源，风雨小说移动端
          pageBooks.push(oneBook);
        });
        callback(null, pageBooks);
      }
    })
}

function saveBooks(bookList) {
  return new Promise(async (resolve, reject) => {
    bookList = bookList.map(item => {
      return [
        item.bookId, item.bookName, item.bookAuthor, item.bookType, item.latelyFollower, item.bookImg, item.isSerial, item.bookRate, item.bookDesc, item.detailUrl, item.source
      ]
    });
    let addSql = `replace into book (bookId, bookName, bookAuthor, bookType, latelyFollower, bookImg, isSerial, bookRate, bookDesc, detailUrl, source) values ?`;
    await addData(addSql, [bookList]).then(data => {
      resolve(data)
    }, (err) => {
      reject(err)
    });
  })
}
