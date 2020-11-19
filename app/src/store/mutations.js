import * as types from './mutation-types'

const mutations = {
	// 是否显示侧边目录
  [types.SET_ISSHOWMENU](state, isShowMenu) {
    state.isShowMenu = isShowMenu
  },
	
	// 当前小说源Id
	[types.SET_BOOKSOURCEID](state, bookSourceId) {
	  state.bookSourceId = bookSourceId
	},
	
	// 搜索历史
	[types.SET_HISTORYLIST](state, historyList) {
	  state.historyList = historyList
	},
	
	// 已缓存书籍列表
	[types.SET_CACHEBOOKS](state, cacheBooks) {
	  state.cacheBooks = cacheBooks
	},
	
	// 页面设置信息
	[types.SET_SETTING](state, setting) {
	  state.setting = setting
	},
}

export default mutations
