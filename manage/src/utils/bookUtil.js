/* 
	获取小说篇封面url
 */
export function getCoverUrl (url) {
	if (url.search(/agent/i) === -1) {
		return 'http://api.zhuishushenqi.com' + url;
	} else {
		return decodeURIComponent(url.replace(/\/agent\//, ''));
	}
}

/* 
	返回小说
 */
export function getBook (book) {
	return {
		bookId: book._id,
		bookName: book.title,
		bookAuthor: book.author,
		bookType: book.cat ? book.cat : (book.majorCate + ',' + book.minorCate),
		bookRate: book.rating ? book.rating : '6.0', // 评分
		bookDesc: book.shortIntro ? book.shortIntro : book.longIntro, // 简介
		latelyFollower: book.latelyFollower, // 人气
		retentionRatio: book.retentionRatio, // 留存率
		bookImg: getCoverUrl(book.cover), // 封面
		wordCount: book.wordCount ? wordCount2Str(book.wordCount) : '0', // 字数
		lastChapter: book.lastChapter ? book.lastChapter : '', // 最新章节
		chaptersCount: book.chaptersCount ? book.chaptersCount : 0, // 章节数
		isSerial: book.isSerial ? book.isSerial : true, // 是否连载
		updatedTime: book.updated ? book.updated : new Date() // 更新时间
	}
}

/* 
	将字数带上单位 如12345 转化为1.2万字
 */
export function wordCount2Str (wordCount) {
  if (Array.from(String(wordCount)).length > 4) {
    let arr = Array.from(String(wordCount));
    arr.length -= 4;
    wordCount = arr.join('') + '万';
  }
  if (wordCount<=0){
    wordCount= 0 ;
  }
  return wordCount + '字';
}

export class Book {
  constructor({title, content}) {
    this.title = title;
    this.content = content;
  }
}

export function bookChaptersBody (books) { // 字符串解析
	if (books) {
		let c = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
		let _book = JSON.stringify(books).replace(/^"|"$/g, '')
		if (c.test(_book)) {
			_book = '<p>' + _book.replace(/\s*/g, '').replace(/\\n/g, '</p><p>').replace(/\\r/g, '') + '</p>'
			return _book
		} else {
			return 'vip章节，请购买或者换源阅读！' // 换源功能已经实现
		}
	}
}

export function _nromalBook (title, content) { // 构建book类
	let book = new Book({
		title: title,
		content: bookChaptersBody(content)
	});
	return book
}

export function get_cache_size (t) { // 获取localStorage或者sessionStorage已缓存的大小
	var storageSize = '' // 缓存大小
	t = t == undefined ? "l" : t
	var obj = ""
	if (t === 'l') {
		obj = window.localStorage
	} else {
		obj = window.sessionStorage
	}
	if (obj !== "") {
		var size = 0
		for (var item in obj) {
			if (obj.hasOwnProperty(item)) {
				size += obj.getItem(item).length
			}
		}
		storageSize = (size / 1024).toFixed(2) + 'KB'
	} else {
		storageSize = '0KB'
	}
	return storageSize
}

export const typeObj = {
	'1': '玄幻小说',
	'2': '仙侠修真',
	'3': '都市言情',
	'4': '历史军事',
	'5': '网游竞技',
	'6': '科幻灵异'
}

export const stateObj = {
	'1': '已完成',
	'2': '连载中'
}

// 男频分类
export const maleTypeObj = {
	'B1': '玄幻',
	'B2': '奇幻',
	'B3': '武侠',
	'B4': '仙侠',
	'B5': '都市',
	'B6': '职场',
	'B7': '历史',
	'B8': '军事',
	'B9': '游戏',
	'B10': '竞技',
	'B11': '科幻',
	'B12': '灵异',
	'B13': '同人',
	'B14': '轻小说'
}

// 女频分类
export const femaleTypeObj = {
	'G1': '古代言情',
	'G2': '现代言情',
	'G3': '青春校园',
	'G4': '玄幻奇幻',
	'G5': '武侠仙侠',
	'G6': '科幻',
	'G7': '游戏竞技',
	'G8': '悬疑灵异',
	'G9': '同人',
	'G10': '女尊'
}

// 男频排行榜类型
export const maleRankTypeObj = {
	'BR1': '人气榜', // 根据点击量(每调一次获取章节接口，后台点击量自动+1)
	'BR2': '热评榜', // 根据评分人数(评分接口，每评分一次+1)
	'BR3': '好评榜', // 根据评分(初始全为5分，增加评分功能)
	'BR4': '留存榜', // 根据留存率(加入书架，自动+1)
	'BR5': '连载榜', // 连载中、点击量
	'BR6': '完结榜', // 完本、点击量
	'BR7': '字数榜'
}

// 女频排行榜类型
export const femaleRankTypeObj = {
	'GR1': '人气榜',
	'GR2': '热评榜',
	'GR3': '好评榜',
	'GR4': '留存榜',
	'GR5': '连载榜',
	'GR6': '完结榜',
	'GR7': '字数榜'
}
