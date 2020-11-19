/*
 风雨小说网PC端
 获取小说正文
 参数：page, pageSize
 */

const superagent = require('_superagent@5.3.1@superagent');
require('_superagent-charset@1.2.0@superagent-charset')(superagent);
const cheerio = require('_cheerio@1.0.0-rc.3@cheerio');
const async = require('_async@3.2.0@async');
const { addData, findData } = require('../../mysql/mysql');

// https://www.44pq.cc/kan/152711/58536407.html
module.exports = {
  fyPcCrawlContent(page, pageSize, bookId) {
    return new Promise(async (resolve, reject) => {
      page = Number(page);
      pageSize = Number(pageSize);

      if (page < 1 || pageSize < 1 || bookId == '') {
        resolve({
          status: 500,
          data: null,
          msg: '参数不正确'
        });
        return
      }

      let sql = `select sql_calc_found_rows chapterId from book_${bookId} limit ${(page-1) * (pageSize)}, ${pageSize}`;
      let linkList = await findData(sql);
      let total = await findData(`SELECT FOUND_ROWS() as total;`);

      if (linkList.length == 0) {
        resolve({
          status: 500,
          data: null,
          msg: "本次查询为空"
        })
      }

      let links = linkList.map(item => {
        return `https://www.44pq.cc/kan/${bookId}/${item.chapterId}.html`
      });

      async.mapLimit(links, 10, (item, callback) => {
        getBookContent(item, callback, bookId)
      }, async (err, results) => {
        if (err) {
          resolve({
            status: 500,
            data: err,
            msg: '正文爬取失败'
          })
        } else {
          saveContents(results, bookId).then(res => {
            resolve({
              status: 200,
              data: {
                saveResult: res,
                chapters: total[0].total
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
        }
      });
    })
  }
};

// https://www.44pq.cc/kan/11881/6596708.html
function getBookContent(url, callback, bookId) { // 爬取正文
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .charset('gbk')
      .buffer(true)
      .end((err, res) => {
        if (err) {
          callback(url);
        } else if (res && res.text) {
          var $ = cheerio.load(res.text);
          let contents = {};
          contents.cpContent = trim($("#BookText").text()).replace('一秒记住【风雨小说网 www.44pq.cc】，精彩小说无弹窗免费阅读！', ''); // 正文
          contents.chapterId = url.slice(url.indexOf(bookId) + bookId.length + 1, url.length - 5);
          callback(null, contents);
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





