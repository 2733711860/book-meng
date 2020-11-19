/*
 风雨小说网PC端
 获取小说章节
 参数：书籍id：bookId
 */

const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { findData, addData } = require('../../mysql/mysql');

// https://www.44pq.cc/kan/152711/
module.exports = {
  fyPcCrawlChapter(bookId) {
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
        let crawlUrl = `https://www.44pq.cc/kan/${bookId}/`; // 爬取书籍的链接
        getBookChapters(crawlUrl, bookId).then(async chapters => {

          // 创建书籍数据库
          let createSql = `create table if not exists book_${bookId}(
            bookId varchar(255),
            bookName varchar(255),
            title varchar(255),
            chapterId varchar(255) not null,
            cpContent longtext,
            primary key (chapterId)
          )charset=utf8`;
          await addData(createSql);

          // 保存到数据库
          saveChapter(chapters, bookId).then(res => {
            resolve({
              status: 200,
              data: {
                list: res
              },
              msg: '章节保存成功'
            })
          }).catch(err => {
            resolve({
              status: 500,
              data: err,
              msg: "章节保存失败"
            })
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: "获取章节失败"
          })
        })
      } catch (e) {
        resolve({
          status: 500,
          data: e,
          msg: "获取章节失败"
        })
      }
    })
  }
};

// https://www.44pq.cc/kan/14223/
function getBookChapters(url, bookId) { // 爬取章节列表
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .charset('gbk')
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject(url);
          return
        };
        if (res && res.text) {
          var $ = cheerio.load(res.text);
          let chapters = [];
          $(".inner .chapterlist").find("dd").each((i, v) => {
            if ($(v).find("a").length > 0) {
              let oneChapter = {};
              oneChapter.title = $(v).find("a").text();
              let link = `${url}${$(v).find("a").attr('href')}`; // 章节url
              oneChapter.chapterId = link.slice(link.indexOf(bookId) + bookId.length + 1, link.length - 5);
              oneChapter.bookId = bookId;
              oneChapter.bookName = $(".bookinfo .panel-intro .btitle").text();
              chapters.push(oneChapter)
            }
          });
          resolve(chapters);
        } else {
          reject()
        }
      })
  })
}

function saveChapter(chapters, bookId) { // 保存章节
  return new Promise(async (resolve, reject) => {
    try {
      let keysList = Object.keys(chapters[0]);
      let str1 = keysList.join(',');

      let updates = keysList.map(item => {
        return `${item} = values(${item})`
      });
      updates = updates.join(',');

      let valueList = chapters.map(item => {
        return Object.values(item)
      });

      var editSql = `insert into book_${bookId} (${str1}) values ? on duplicate key update ${updates}`;

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

