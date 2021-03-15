const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { saveBooks } = require('./mysql_func');
const { addData, findData } = require('../../../../mysql/mysql');

// 爬取搜索列表
function crawlSearch(keyWord) {
  return new Promise((resolve, reject) => {
    let searchUrl = `http://www.xbiquge.la/modules/article/waps.php?searchkey=${encodeURI(keyWord)}`;
    superagent.get(searchUrl)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('搜索列表获取失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let searchList = [];
          $("#checkform table.grid tbody tr").each((i, v) => {
            if ($(v).find('.even').eq(0).find('a').text()) {
              let str = $(v).find('.even').eq(0).find('a').attr('href').replace('http://www.xbiquge.la/', '');
              let index = str.indexOf('/');
              str = str.substring(index + 1, str.length - 1);
              let oneBook = {
                bookAuthor: $(v).find('.even').eq(1).text(),
                bookName: $(v).find('.even').eq(0).find('a').text(),
                bookId: str
              };
              searchList.push(oneBook);
            }
          });
          resolve(searchList)
        } else {
          reject('搜索列表获取失败！');
        }
      })
  })
}


// 爬取书籍详情
function crawlBookDetail(bookId) {
  return new Promise((resolve, reject) => {
    let str = bookId.substring(0, 1);
    let url = `http://www.xbiquge.la/1/${bookId}/`;
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('爬取书籍基本信息失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let oneBook = {};
          oneBook.bookName = $('#info h1').eq(0).text();
          oneBook.bookAuthor = trim($('#info p').eq(0).text().replace('者：', '').replace('作', ''));
          oneBook.bookImg = $('#fmimg').find("img").attr("src");
          oneBook.bookId = bookId; // 书籍Id
          oneBook.bookDesc = trim($("#intro p:last-child").text()); // 书籍简介
          let timeStr = $('#info p').eq(2).text();
          oneBook.updatedTime = trim(timeStr.replace('最后更新：', ''));
          oneBook.source = '新笔趣阁'; // 书籍来源
          let list = [];
          list.push(oneBook);
          saveBooks(list, 'book_xinbiquge').then(res => {
            resolve(oneBook);
          }).catch(err => {
            reject('保存书籍基本信息失败！')
          });
        } else {
          reject('爬取书籍基本信息失败！');
        }
      })
  })
}


// 爬取书籍章节
function crawlChapters(bookId) {
  return new Promise((resolve, reject) => {
    let str = bookId.substring(0, 1);
    let url = `http://www.xbiquge.la/${str}/${bookId}/`;
    superagent.get(url)
      .buffer(true)
      .end(async(err, res) => {
        if (err) {
          reject('爬取书籍章节失败！');
          return
        };
        if (res && res.text) {
          var $ = cheerio.load(res.text);
          let chapters = [];
          $('#list dl dd').each((i, v) => {
            let link = `http://www.xbiquge.la${$(v).find("a").attr('href')}`; // 章节url
            let oneChapter = {
              title: $(v).find("a").text(),
              bookId: bookId,
              bookName: $('#info h1').text(),
              chapterId: link.slice(link.indexOf(bookId) + bookId.length + 1, link.length - 5)
            };
            chapters.push(oneChapter)
          });
          if (chapters.length == 0) {
            reject('爬取书籍章节失败！');
            return ;
          }

          // 创建书籍数据库
          let createSql = `create table if not exists book_xinbiquge_${bookId}(
            bookId varchar(255),
            bookName varchar(255),
            title varchar(255),
            chapterId int(255) not null,
            cpContent longtext,
            primary key (chapterId)
          )charset=utf8`;
          await addData(createSql);
          saveBooks(chapters, `book_xinbiquge_${bookId}`).then(async res => {
            let searchSql = `select title, chapterId from book_xinbiquge_${bookId}`;
            let result = await findData(searchSql);
            resolve(result);
          }).catch(err => {
            console.log(err)
            reject('保存书籍章节失败！')
          });
        } else {
          reject('爬取书籍章节失败！');
        }
      });
  })
}


// 爬取书籍正文
function crawlBookContent(bookId, chapterId) {
  return new Promise((resolve, reject) => {
    let str = bookId.substring(0, 1);
    let url = `http://www.xbiquge.la/${str}/${bookId}/${chapterId}.html`;
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('爬取书籍正文失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let contents = {};
          contents.chapterId = chapterId;
          let str1 = $("#content").text();
          let str2 = $("#content").find('p').text();
          str1 = str1.replace(str2, '');
          contents.cpContent = str1;
          contents.title = $("#wrapper").find(".box_con .bookname h1").text();
          let list = [];
          list.push(contents);
          saveBooks(list, `book_xinbiquge_${bookId}`).then(res => {
            resolve({
              title: contents.title,
              cpContent: contents.cpContent
            });
          }).catch(err => {
            reject('保存书籍正文失败！')
          });
        } else {
          reject('爬取书籍正文失败！');
        }
      })
  })
}


// 去除内容的两端空格和&nbsp;
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
}


module.exports = {
  crawlSearch,
  crawlBookDetail,
  crawlChapters,
  crawlBookContent
};
