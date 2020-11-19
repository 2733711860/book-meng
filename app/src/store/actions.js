import * as types from './mutation-types'

// 是否显示侧边目录
export const setIsShowMenu = function({ commit }, isShowMenu) {
  commit(types.SET_ISSHOWMENU, isShowMenu)
}

// 当前小说Id
export const setBookSourceId = function({ commit }, bookSourceId) {
  commit(types.SET_BOOKSOURCEID, bookSourceId)
}

// 搜索历史
export const setHistory = function({ commit, state }, history) {
	if (history.deleteType) {
		commit(types.SET_HISTORYLIST, [])
		return
	}
	let copyList = [...state.historyList] // 拷贝一份
	let haveIndex = copyList.findIndex(val => val.bookName == history)
	let isHave = haveIndex == -1 ? false : true // 历史中是否有这个记录
	if (isHave) { // 有这个记录则删除它
		copyList.splice(haveIndex, 1)
	}
	if (copyList.length == 20) { // 最多保存20条历史记录
		copyList.pop()
	}
	copyList.unshift({bookName: history})
	commit(types.SET_HISTORYLIST, copyList)
}

// 已缓存书籍列表
export const setCacheBooks = function({ commit, state }, books) {
	let copyBooks = [...state.cacheBooks] // 拷贝一份
	let thisBook = copyBooks.find(item => item.bookId == books.bookId) // 当前操作的书籍
	if (!thisBook) { // 新书(进入详情页)
		thisBook = Object.assign({}, books, {
			isOnShelf: books.isOnShelf ? books.isOnShelf : '0', // 0:未放入书架，1:已放入
			chapters: books.chapters ? books.chapters : [],
			currentChapterIndex: 0,
			cacheStartOrigin: -1,
			cacheStart: -1,
			cacheEnd: -1,
			cacheState: '2', // 1：正在缓存，2：缓存暂停，3：缓存完成
			hasReadChapterList: []
		})
		copyBooks.push(thisBook)
	} else {
		copyBooks.forEach(item => {
			if (item.bookId == books.bookId) {
				if (books.newReadChapter) { // 如果是缓存章节
					item.hasReadChapterList.push(books.newReadChapter)
					item.hasReadChapterList.sort((a, b) => {
						return a.chapterIndex < b.chapterIndex ? '-1' : '1'
					})
				}
				item.chaptersCount = books.chaptersCount ? books.chaptersCount : item.chaptersCount
				item.isOnShelf = books.isOnShelf ? books.isOnShelf : item.isOnShelf
				item.chapters = books.chapters ? books.chapters : item.chapters
				item.cacheStartOrigin = (books.cacheStartOrigin || books.cacheStartOrigin == 0) ? books.cacheStartOrigin : item.cacheStartOrigin
				item.cacheStart = (books.cacheStart || books.cacheStart == 0) ? books.cacheStart : item.cacheStart
				item.cacheEnd = (books.cacheEnd || books.cacheEnd == 0) ? books.cacheEnd : item.cacheEnd,
				item.cacheState = books.cacheState ? books.cacheState : item.cacheState
				item.currentChapterIndex = (books.currentChapterIndex || books.currentChapterIndex == 0) ? books.currentChapterIndex : item.currentChapterIndex
			}
		})
	}
	commit(types.SET_CACHEBOOKS, copyBooks)
}

// 不加入书架，则删除当前书籍
export const deleteCasheBooks = ({ commit, state }, bookId) => {
	let copyBooks = [...state.cacheBooks] // 拷贝一份
	let thisIndex = copyBooks.findIndex(item => item.bookId == bookId) // 当前操作的书籍
	copyBooks.splice(thisIndex, 1)
	commit(types.SET_CACHEBOOKS, copyBooks)
}

// 加入、移除书架
export const inOutShelf = ({ commit, state }, bookId) => {
	let copyBooks = [...state.cacheBooks] // 拷贝一份
	let thisBook = copyBooks.find(item => item.bookId == bookId.bookId) // 当前操作的书籍
	if (thisBook.isOnShelf == '0') { // 还未放入书架，此时的操作是加入书架
		copyBooks.forEach(item => {
			if (item.bookId == bookId.bookId) {
				item.isOnShelf = '1'
			}
		})
	} else { // 已经在书架，此时的操作是移除书架（缓存中删除本书）
		let thisIndex = copyBooks.findIndex(item => item.bookId == bookId.bookId)
		copyBooks.splice(thisIndex, 1)
	}
	commit(types.SET_CACHEBOOKS, copyBooks)
}



// 页面设置信息
export const setSetting = function({ commit, state }, settings) {
	let copySetting = state.setting // 拷贝一份
	copySetting.brightness = settings.brightness ? settings.brightness : copySetting.brightness
	copySetting.fontSize = settings.fontSize ? settings.fontSize : copySetting.fontSize
	copySetting.lineHeight = settings.lineHeight ? settings.lineHeight : copySetting.lineHeight
	copySetting.turnPageMode = (settings.turnPageMode || settings.turnPageMode == 0) ? settings.turnPageMode : copySetting.turnPageMode
	copySetting.backgroundColor = settings.backgroundColor ? settings.backgroundColor : copySetting.backgroundColor
	copySetting.dayNight = settings.dayNight ? settings.dayNight : copySetting.dayNight
	copySetting.bookSource = settings.bookSource ? settings.bookSource : copySetting.bookSource,
	copySetting.shelfTheme = settings.shelfTheme ? settings.shelfTheme : copySetting.shelfTheme
  commit(types.SET_SETTING, copySetting)
}
