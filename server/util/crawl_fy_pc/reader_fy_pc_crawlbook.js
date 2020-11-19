/*
* 风雨小说网PC端
* 爬取书籍
* 参数：start：开始页数
* end：结束页数
* */

const superagent = require('_superagent@5.3.1@superagent');
require('_superagent-charset@1.2.0@superagent-charset')(superagent);
const cheerio = require('_cheerio@1.0.0-rc.3@cheerio');
const async = require('_async@3.2.0@async');
const { addData, findData } = require('../../mysql/mysql');

let typeObj = {
  '[玄幻小说]': '1',
  '[仙侠修真]': '2',
  '[都市言情]': '3',
  '[历史军事]': '4',
  '[网游竞技]': '5',
  '[科幻灵异]': '6'
};
let stateObj = {
  '已完成': '1',
  '连载中': '2'
};

// https://www.44pq.cc/allvisit-1.html
module.exports = {
  fyPcCrawlBook(start, end) {
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
        getFYBookPages(Number(start), Number(end)).then(links => { // 获取小说列表每页url列表
          getFYbooks(links).then(books => { // 获取所有小说基本信息
            let bookList = [].concat(...books);

            if (bookList.length == 0) {
              resolve({
                status: 500,
                data: null,
                msg: '获取小说信息失败'
              });
              return
            }

            saveBooks(bookList).then(res => {
              resolve({
                status: 200,
                data: {
                  saveResult: res,
                  linkPages: links
                },
                msg: '保存成功'
              })
            }).catch(err => {
              resolve({
                status: 500,
                data: err,
                msg: '保存失败'
              })
            })
          }).catch(err => {
            resolve({
              status: 500,
              data: err,
              msg: '获取所有小说基本信息失败'
            })
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: '获取小说url列表失败'
          })
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

function getFYBookPages(start, end) { // 获取小说列表每页url列表
  return new Promise(((resolve, reject) => {
    try {
      superagent.get('https://www.44pq.cc/allvisit-1.html')
        .charset('gbk')
        .buffer(true)
        .end((err, res) => {
          if (err) {
            reject(err);
            return
          };
          var $ = cheerio.load(res.text);
          let pages = 1;
          pages = $("#pagelink").find("a.last").text(); // 获取小说列表总页数
          let links = [];
          for (var i=(start>=1 ? start : 1); i<=(end <= pages ? end : pages); i++) {
            links.push(`https://www.44pq.cc/allvisit-${i}.html`)
          }
          resolve(links);
        })
    } catch (e) {
      reject(e)
    }
  }))
}

function getFYbooks(links) { // 便利所有小说链接，获取详细信息
  return new Promise(((resolve, reject) => {
    async.mapLimit(links, 10, (item, callback) => {
      getFYBookItem(item, callback); // 小说列表每页url列表获取所有小说信息
    }, (err, results) => {
      if (err) reject(err);
      resolve(results)
    });
  }))
}

function getFYBookItem(url, callback) { // 风雨小说网  https://www.44pq.cc/monthvisit-1.html
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
          var $ = cheerio.load(res.text);
          let pageBooks = []; // 书籍列表
          $(".content .inner .details").find("ul li").each((i, v) => {
            let oneBook = {};
            oneBook.bookType = typeObj[$(v).find(".s1").text()]; // 书籍类型
            oneBook.bookName = $(v).find(".s2").children("a:first-child").text(); // 书籍名称
            oneBook.detailUrl = 'https://www.44pq.cc' + $(v).find(".s2").children("a:first-child").attr('href'); // 书籍详情页链接
            oneBook.bookId = $(v).find(".s2").children("a:first-child").attr('href').slice(5, $(v).find(".s2").children("a:first-child").attr('href').length - 1); // 书籍ID
            oneBook.lastChapter = $(v).find(".s2 i a").text(); // 书籍最新章节
            oneBook.bookAuthor = $(v).find(".s3").text(); // 书籍作者
            oneBook.updatedTime = $(v).find(".s4").text(); // 最近更新时间
            oneBook.isSerial = stateObj[$(v).find(".s5").text()]; // 书籍状态
            oneBook.latelyFollower = 1000;
            oneBook.bookRate = 5.0; // 评分
            oneBook.source = 'fy_pc'; // 书籍来源，风雨小说PC端
            pageBooks.push(oneBook);
          });
          callback(null, pageBooks);
        }
      })
  } catch (e) {
    callback(e)
  }
}

function saveBooks(bookList) {
  return new Promise(async (resolve, reject) => {
    bookList = bookList.map(item => {
      return [
        item.bookType, item.bookName, item.detailUrl, item.bookId, item.lastChapter, item.bookAuthor, item.updatedTime, item.isSerial, item.latelyFollower, item.bookRate, item.source
      ]
    });
    let addSql = `replace into book (bookType, bookName, detailUrl, bookId, lastChapter, bookAuthor, updatedTime, isSerial, latelyFollower, bookRate, source) values ?`;
    await addData(addSql, [bookList]).then(data => {
      resolve(data)
    }, (err) => {
      reject(err)
    });
  })
}
