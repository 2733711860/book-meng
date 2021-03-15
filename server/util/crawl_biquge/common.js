const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const async = require('async');
const { addData, findData } = require('../../mysql/mysql');

/**************************** 获取书籍基本信息开始 ************************************/
function getDetail(bookId) {
  return new Promise((resolve, reject) => {
    let url = `https://www.qu.la/book/${bookId}/`;
    getBookBaisc(url).then(oneBook => {
      let list = [];
      list.push(oneBook);
      saveBooks(list).then(res => {
        resolve(oneBook)
      }).catch(err => {
        reject('获取书籍基本信息失败')
      })
    }).catch(err => {
      reject('获取书籍基本信息失败')
    })
  })
}

// 获取书籍基本信息
function getBookBaisc(url) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('获取书籍基本信息失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let oneBook = {};
          oneBook.bookName = $('.detail-box .info .top h1').text();
          oneBook.bookAuthor = $('.detail-box .info .top .fix p:nth-child(1)').text().replace('作者：', '');
          oneBook.bookImg = $('.detail-box .imgbox').find("img").attr("src");
          oneBook.bookId = url.slice(url.indexOf('la/book/') + 8, url.length - 1); // 书籍Id
          oneBook.bookDesc = trim($(".detail-box .m-desc").text()); // 书籍简介
          let timeStr = $('.detail-box .info .top .fix p:nth-child(5)').text();
          oneBook.updatedTime = trim(timeStr.replace('最后更新：', ''));
          oneBook.source = '笔趣阁'; // 书籍来源，风雨小说PC端
          resolve(oneBook)
        } else {
          reject('获取书籍基本信息失败！');
        }
      })
  })
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

      var editSql = `insert into book_biquge (${str1}) values ? on duplicate key update ${updates}`;

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

/**************************** 获取书籍基本信息结束 ************************************/





/**************************** 获取书籍章节信息开始 ************************************/

// 爬取章节
function getChapterByCrawlBiquge(bookId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.qu.la/book/${bookId}/`;
    getChpterPage(url).then(selectCon => {
      let num = selectCon.length > 100 ? 10 :
        (selectCon.length > 20 ? 5 : (selectCon.length > 10 ? 3 : 2));
      async.mapLimit(selectCon, num, (item, callback) => {
        getChapters(item, bookId, callback);
      }, async (err, results) => {
        if (err) {
          resolve('获取书籍章节信息失败')
        } else {
          results = results.filter(item => item != undefined);
          let list = [];
          results.forEach(ites => {
            list.push(...ites)
          });
          // 创建书籍数据库
          let createSql = `create table if not exists book_biquge_${bookId}(
            bookId varchar(255),
            bookName varchar(255),
            title varchar(255),
            chapterId int(255) not null,
            cpContent longtext,
            primary key (chapterId)
          )charset=utf8`;
          await addData(createSql);
          saveChapters(list, bookId).then(async res => {
            let searchSql = `select title, chapterId from book_biquge_${bookId}`;
            let searchResult = await findData(searchSql);
            resolve(searchResult)
          }).catch(e => {
            resolve('获取书籍章节信息失败')
          });
        };
      })
    }).catch(err => {
      resolve('获取书籍章节信息失败')
    })
  });
}

// 获取章节页面列表列表
function getChpterPage(url) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('获取书籍章节页面列表失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let selectCon = [];
          $('.row .layout .listpage .middle select option').each((i, v) => {
            selectCon.push(`https://www.qu.la${$(v).attr('value')}`);
          });
          resolve(selectCon)
        } else {
          reject('获取书籍章节页面列表失败！');
        }
      })
  })
}

// 获取章节列表
function getChapters(url, bookId, callback) {
  try {
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          callback(null);
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let chapters = [];
          $('.container .row-section .layout .section-box').eq(1).find('.section-list li').each((i, v) => {
            if ($(v).find("a").css('color') != 'Gray') {
              let oneChapter = {};
              oneChapter.title = $(v).find("a").text();
              let link = `https://www.qu.la${$(v).find("a").attr('href')}`; // 章节url
              oneChapter.chapterId = link.slice(link.indexOf(bookId) + bookId.length + 1, link.length - 5);
              oneChapter.bookId = bookId;
              oneChapter.bookName = $('.detail-box .info .top h1').text();
              chapters.push(oneChapter)
            }
          });
          callback(null, chapters);
        } else {
          callback(null)
        }
      })
  } catch (e) {
    callback(null)
  }
}

// 保存章节
function saveChapters(chapters, bookId) {
  return new Promise(async (resolve, reject) => {
    let keysList = Object.keys(chapters[0]);
    let str1 = keysList.join(',');

    let updates = keysList.map(item => {
      return `${item} = values(${item})`
    });
    updates = updates.join(',');

    let valueList = chapters.map(item => {
      return Object.values(item)
    });

    let editSql = `insert into book_biquge_${bookId} (${str1}) values ? on duplicate key update ${updates}`;

    await addData(editSql, [valueList]).then(data => {
      resolve(data)
    }, (err) => {
      reject(err)
    });
  })
}

/**************************** 获取书籍章节信息结束 ************************************/





/**************************** 获取书籍正文信息开始 ************************************/
function getContent(bookId, chapterId) {
  return new Promise((resolve, reject) => {
    let link = `https://www.qu.la/book/${bookId}/${chapterId}.html`;
    getBookContent(link, chapterId).then(content => {
      saveContents([content], bookId).then(res => {
        resolve({
          title: content.title,
          cpContent: content.cpContent
        })
      }).catch(err => {
        reject('正文保存失败')
      })
    }).catch(err => {
      reject('正文获取失败');
    })
  })
}

// 获取正文
function getBookContent(url, chapterId, alContent) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('正文获取失败');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          if ($(".reader-main .section-opt.m-bottom-opt a").eq(2).text() == '下一页') {
            let otherUrl = `https://www.qu.la${$(".reader-main .section-opt.m-bottom-opt a").eq(2).attr('href')}`;
            let str1 = trim($(".reader-main #content").text());
            let noStr = trim($('#content .posterror').text());
            let cpContent = alContent ? `${alContent}${str1.replace(noStr, '')}` : str1.replace(noStr, '');
            getBookContent(otherUrl, chapterId, cpContent).then(res => {
              resolve(res)
            }).catch(e => {
              reject(e)
            })
          } else {
            let contents = {};
            contents.title = $(".reader-main .title").text();
            contents.chapterId = chapterId;
            let str1 = trim($(".reader-main #content").text());
            let noStr = trim($('#content .posterror').text());
            contents.cpContent = alContent ? `${alContent}${str1.replace(noStr, '')}` : str1.replace(noStr, '');
            contents.cpContent = contents.cpContent.replace(/\s+/g,"\r\n\r\n")
            resolve(contents);
          }
        } else {
          reject('正文获取失败')
        }
      })
  })
}

// 保存正文
function saveContents(results, bookId) {
  return new Promise(async (resolve, reject) => {
    try {
      let keysList = Object.keys(results[0]);
      let str1 = keysList.join(',');

      let valueList = results.map(item => {
        return Object.values(item)
      });

      let editSql = `insert into book_biquge_${bookId} (${str1}) values ? on duplicate key update cpContent = values(cpContent)`;

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


// 爬取搜索列表
function getSearchList(keyWord) {
  let url = `https://www.qu.la/ar.php?keyWord=${encodeURI(keyWord)}`;
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .buffer(true)
      .end((err, res) => {
        if (err) {
          reject('搜索列表获取失败！');
          return
        };
        if (res && res.text) {
          let $ = cheerio.load(res.text);
          let searchList = [];
          $('.container .row .layout.layout2 ul').eq(0).find('li').each((i, v) => {
            if ($(v).find('.s2').find('a').attr('href')) {
              let oneBook = {
                bookType: $(v).find('.s1').text().replace('[', '').replace(']', ''),
                bookName: $(v).find('.s2 a').text(),
                bookId: $(v).find('.s2 a').attr('href').replace('/book/', '').replace('/', '')
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


module.exports = {
  getDetail,
  getChapterByCrawlBiquge,
  getContent,
  getSearchList
};
