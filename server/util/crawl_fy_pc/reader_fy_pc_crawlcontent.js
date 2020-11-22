/*
 风雨小说网PC端
 获取小说正文
 参数：page, pageSize
 */

const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { addData, findData } = require('../../mysql/mysql');

// https://www.44pq.cc/kan/152711/58536407.html
module.exports = {
  fyPcCrawlContent(chapterId, bookId) {
    return new Promise(async (resolve, reject) => {

      if (chapterId == '' || bookId == '') {
        resolve({
          status: 500,
          data: null,
          msg: '参数不正确'
        });
        return
      }

      let link = `https://www.44pq.cc/kan/${bookId}/${chapterId}.html`;
      getBookContent(link, chapterId).then(content => {
        saveContents([content], bookId).then(res => {
          resolve({
            status: 200,
            data: {
              title: content.title,
              cpContent: content.cpContent
            },
            msg: '正文保存成功'
          })
        }).catch(err => {
          resolve({
            status: 500,
            data: err,
            msg: '正文保存失败'
          })
        })
      }).catch(err => {

      })
    })
  }
};

// https://www.44pq.cc/kan/11881/6596708.html
function getBookContent(url, chapterId) { // 爬取正文
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .charset('gbk')
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject(url);
        } else if (res && res.text) {
          var $ = cheerio.load(res.text);
          let contents = {};
          contents.title = $("#BookCon").find("h1").text();
          contents.cpContent = trim($("#BookText").text()).replace('一秒记住【风雨小说网 www.44pq.cc】，精彩小说无弹窗免费阅读！', ''); // 正文
          contents.chapterId = chapterId;
          resolve(contents);
        }
      })
  })
}

function saveContents(results, bookId) { // 保存正文
  return new Promise(async (resolve, reject) => {
    try {
      let keysList = Object.keys(results[0]);
      let str1 = keysList.join(',');

      let valueList = results.map(item => {
        return Object.values(item)
      });

      var editSql = `insert into book_${bookId} (${str1}) values ? on duplicate key update cpContent = values(cpContent)`;

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





