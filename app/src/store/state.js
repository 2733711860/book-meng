const state = {
	isShowMenu: false, // 是否显示侧边目录
	bookSourceId: null, // 当前小说源id
	historyList: [], // 搜索历史
	cacheBooks: [], // 已缓存书籍列表
	setting: { // 页面设置信息
		dayNight: 'day', // day:日间模式  night:夜间模式,
		bookSource: '', // 当前小说源(换源)
		brightness: 0.9, // 亮度
		defaultBrightness: 0.9, // 默认亮度
		fontSize: 18, // 字体大小
		defaultFontSize: 18, // 默认字体大小
		lineHeight: 35, // 30:紧凑  35:舒适  40:松散  35:默认
		defaultLineHeight: 30, // 默认行间距
		turnPageMode: 1, // 翻页模式 0:整页   1:平滑   2:点滑   3:无   4:仿真
		backgroundColor: 'rgba(236, 216, 179, 1)', // 阅读背景颜色
		shelfTheme: '1', // 书架布局  0：经典书架  1：简约列表
	},
}

export default state
