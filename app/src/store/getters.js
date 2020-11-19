export const isShowMenu = state => state.isShowMenu // 是否显示侧边目录

export const bookSourceId = state => state.bookSourceId // 当前小说源

export const historyList = state => state.historyList // 搜索历史

export const cacheBooks = state => state.cacheBooks // 已缓存书籍列表

export const shelfBooks = state => { // 已放入书架书籍列表
	return state.cacheBooks.filter(item => item.isOnShelf == '1')
}

export const setting = state => state.setting // 页面设置信息
