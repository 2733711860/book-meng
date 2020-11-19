<template>
	<div class="read-page" 
		:style="{fontSize: setting.fontSize + 'px', 
			backgroundColor: setting.dayNight == 'day' ? setting.backgroundColor : '#000',
			color: setting.dayNight == 'day' ? '#535353' : '#c1c1c1',
			filter: 'brightness(' + setting.brightness + ')'}"
	>
		<div ref="wrapper" class="content-page" @click="setRead($event)">
			<!-- 整页 -->
			<div class="book-contents" ref="content" v-if="pagingPattern===0">
			  <h1 class="book-title" :style="{fontSize: (setting.fontSize + 4) + 'px'}">{{bookContent.title}}</h1>
			  <div class="book-inner" :style="{lineHeight: setting.lineHeight + 'px'}" v-html="bookContent.content"></div>
				<div class="book-button">
					<div @click="prevChapter" :style="{fontSize: (setting.fontSize + 1) + 'px'}">上一章</div>
					<div @click="nextChapter" :style="{fontSize: (setting.fontSize + 1) + 'px'}">下一章</div>
				</div>
			</div>
			
			<!-- 平滑 -->
			<v-touch 
				v-on:panleft="panleft($event)" 
				v-on:panright="panright($event)" 
				v-on:panend="panend($event)"
				class="read-content" 
				v-if="pagingPattern==1 || pagingPattern==2 || pagingPattern==3"
			>
				<p class="book-title1" style="padding: 15px;">{{bookContent.title}}</p>
				<div class="read-article" style="padding: 0 15px;">
				  <section class="read-section" :style="styleObject">
				    <div class="read-section-inner" :style="{columns: clWidth-30+'px', columnGap: 15+'px'}" ref="bookInner" id="bookInner">
				      <h1 class="book-title" :style="{fontSize: (setting.fontSize + 4) + 'px'}">{{bookContent.title}}</h1>
				      <div class="book-inner" :style="{lineHeight: setting.lineHeight + 'px'}" v-html="bookContent.content"></div>
				    </div>
				  </section>
				</div>
				<p class="article-page">{{currentPaging + '/' + resultPaging}}</p>
			</v-touch>
		</div>
		
		<reader-tool-page-top v-model="showTool"></reader-tool-page-top>
		<reader-tool-page-bottom
			v-model="showTool"
			:resultPaging="resultPaging"
			:currentPaging="currentPaging"
			@prevChapter="prevChapter"
			@nextChapter="nextChapter"
			@openSetting="openSetting"
			@openDownload="openDownload"
			@openMenu="openMenu"></reader-tool-page-bottom>
		<reader-setting v-model="showSetting"></reader-setting>
		<readerDownload v-model="showDownload"></readerDownload>
		<reader-chapter-two v-model="showMenu" @getThisContent="getThisContent"></reader-chapter-two>
	</div>
</template>

<script>
// 护眼：rgb(200, 232, 200)；默认：rgb(238, 230, 221)；rgba(50,51,52,0.9)
import { _nromalBook } from '../../../utils/bookUtil.js'
import { getBookContent } from '../../../api/index.js'
import { Toast, Dialog } from 'vant'
import readerToolPageTop from '../components/reader-tool-page-top.vue'
import readerToolPageBottom from '../components/reader-tool-page-bottom.vue'
import readerSetting from '../components/reader-setting.vue'
import readerDownload from '../components/reader-download.vue'
import readerChapterTwo from '../components/reader-chapter-two.vue'
export default {
	components: {
		readerToolPageTop, readerToolPageBottom, readerSetting, readerDownload, readerChapterTwo
	},
	
	data () {
		return {
			bookContent: {
			  title: '',
			  content: ''
			},
			styleObject: '',
			clWidth: document.documentElement.clientWidth || document.body.clientWidth,
			currentPaging: 1, // 当前页
			resultPaging: 1, // 总页数
			offsetX: 0,
			bookSourceLinks: [], // 书籍link列表
			currentIndex: -1, // 当前章节索引
			isPrevChapter: false, // 是否上一章
			showTool: false, // 是否显示工具栏
			showSetting: false, // 是否显示设置页
			showDownload: false, // 是否显示下载页面
			showMenu: false, // 是否显示目录
		}
	},
	
	computed: {
		pagingPattern () { // 翻页模式 0:整页   1:平滑   2:点滑   3:无   4:仿真
			return this.$store.getters.setting.turnPageMode
		},
		thisBook () { // 当前书籍
			let nowBook = this.$store.getters.cacheBooks.find(item => item.bookId == this.$route.query.bookId)
			return nowBook ? nowBook : {}
		},
		setting () {
			return this.$store.getters.setting
		}
	},
	
	mounted () {
		this.currentIndex = this.thisBook.currentChapterIndex
	},
	
	watch: {
		bookContent () {
			this.$refs.wrapper.scrollTop = 0
			if (this.pagingPattern == 1 || this.pagingPattern == 2 || this.pagingPattern == 3) {
				this.$nextTick(function () {
				  let scrollW = this.$refs.bookInner.scrollWidth
				  let clientW = this.$refs.bookInner.clientWidth
				  this.resultPaging = Math.floor(scrollW / clientW)
					if (this.isPrevChapter) { // 上一章，默认最后一页
						this.isPrevChapter = false
						this.currentPaging = this.resultPaging
						this.styleObject = {
							transform: 'translateX(' + (-(this.currentPaging - 1) * (this.clWidth - 10)) + 'px' + ')'
						}
					} else {
						this.currentPaging = 1
						this.styleObject = {
							transform: 'translateX(' + '0px' + ')'
						}
					}
				})
			}
		},
		currentIndex () {
			this.getChapterDetail()
		}
	},
	
	methods: {
		getThisContent (index) { // 从目录点击章节
			this.currentIndex = index
		},
		getChapterDetail () { // 只要当前章节index发生变化，就获取数据
			let hasThisChapter = this.thisBook.hasReadChapterList.find(item => item.chapterIndex == this.currentIndex)
			if (hasThisChapter) { // 如果本章已经缓存过了
				this.bookContent = _nromalBook(hasThisChapter.chapterName, hasThisChapter.chapterContent)
				this.$store.dispatch('setCacheBooks', { // 保存章节信息
					bookId: this.$route.query.bookId,
					currentChapterIndex: this.currentIndex
				})
			} else { // 本章没有缓存
				let currentLink = this.thisBook.chapters[this.currentIndex].link // 当前章节链接
				this.$loading.show()
				getBookContent({
					source: this.thisBook.source,
					link: currentLink
				}).then(res => {
					this.$loading.hide()
					if (res.data.cpContent) {
						this.bookContent = _nromalBook(res.data.title, res.data.cpContent)
					} else {
						this.bookContent = _nromalBook(res.data.title, '正文获取失败！')
					}
					this.$store.dispatch('setCacheBooks', { // 保存章节信息
						bookId: this.$route.query.bookId,
						currentChapterIndex: this.currentIndex,
						newReadChapter: {
							chapterIndex: this.currentIndex,
							chapterName: res.data.title,
							chapterContent: res.data.cpContent ? res.data.cpContent : '正文获取失败！'
						}
					})
				})
			}
		},
		
		nextChapter () { // 下一章
			if (this.currentIndex == this.thisBook.chapters.length -1) { // 最后一章
				Toast('最后一章')
			} else {
				this.currentIndex++
			}
		},
		
		prevChapter (isTool) { // 上一章
			if (this.currentIndex == 0) { // 第一章
				Toast('第一章')
			} else {
				this.currentIndex--
				if (this.pagingPattern == 1 || this.pagingPattern == 2 || this.pagingPattern == 3) {
					let hasThisChapter = this.thisBook.hasReadChapterList.find(item => item.chapterIndex == this.currentIndex)
					if (hasThisChapter) { // 如果上一章已经缓存过，则显示上一章最后一页
						this.isPrevChapter = isTool ? false : true
					}
				}
			}
		},
		
		setRead (e) { // 点击操作
			let currentX = e.pageX
			let offsetX = this.clWidth / 3
			if (offsetX <= currentX && currentX <= offsetX * 2) { // 用户点击中间1/3，弹出选择框
				if (this.showSetting) {
					this.showSetting = false
				} else {
					this.showTool = !this.showTool
				}
			}
			if (this.pagingPattern == 2 || this.pagingPattern == 3) { // 点滑/无
				if (currentX <= offsetX) { // 用户点击左边1/3，上一章
					if (this.currentPaging != 1) { // 不是第一页
						this.currentPaging--
						if (this.pagingPattern == 2) {
							this.styleObject = {
								transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')',
								transitionDuration: '0.5s'
							}
						} else if (this.pagingPattern == 3) {
							this.styleObject = {
								transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')'
							}
						}
					} else {
						this.prevChapter()
					}
				} else if (offsetX <= currentX && currentX <= offsetX * 2) { // 用户点击中间1/3，弹出选择框
				} else { // 用户点击右边1/3，下一章
					if (this.resultPaging == this.currentPaging) { // 最后一页
						this.nextChapter()
					} else { // 不是最后一页，则平滑下一页
						this.currentPaging++
						if (this.pagingPattern == 2) {
							this.styleObject = {
								transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')',
								transitionDuration: '0.5s'
							}
						} else if (this.pagingPattern == 3) {
							this.styleObject = {
								transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')'
							}
						}
					}
				}
			}
		},
		
		panleft (e) { // 左滑
			if (this.pagingPattern === 1) {
				this.offsetX = e.deltaX
				if (this.resultPaging > this.currentPaging) { // 不是最后一页
					if (Math.abs(this.offsetX) < this.clWidth) {
						this.styleObject = {
							transform: 'translateX(' + (this.offsetX + (1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')'
						}
					}
				}
			}
		},
		
		panend (e) { // 滑动结束
			if (this.pagingPattern === 1) {
				if (this.offsetX < 0) { // 左滑
					if (this.resultPaging == this.currentPaging) { // 最后一页
						this.nextChapter()
					} else {
						if (Math.abs(this.offsetX) > this.clWidth/6) { // 左滑距离小于六分之一，则不翻页
							this.currentPaging++
						}
						this.styleObject = {
							transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')',
							transitionDuration: '0.5s'
						}
					}
				} else { // 右滑
					if (this.currentPaging != 1) { // 不是第一页
						if (Math.abs(this.offsetX) > this.clWidth/6) { // 右滑距离小于六分之一，则翻页
							this.currentPaging--
						}
						this.styleObject = {
							transform: 'translateX(' + ((1 - this.currentPaging) * (this.clWidth - 15)) + 'px' + ')',
							transitionDuration: '0.5s'
						}
					} else {
						this.prevChapter()
					}
				}
				this.offsetX = 0
			}
		},
		
		panright (e) { // 右滑
			if (this.pagingPattern == 1) {
				if (this.currentPaging > 1) {
					this.offsetX = e.deltaX
					if (Math.abs(this.offsetX) < this.clWidth) {
						this.styleObject = {
							transform: 'translateX(' + (this.offsetX - (this.currentPaging - 1) * (this.clWidth - 15)) + 'px' + ')'
						}
					}
				}
			}
		},
		
		openSetting () { // 打开设置
			this.showTool = false
			this.showSetting = true
		},
		
		openDownload () { // 打开下载页面
			this.showTool = false
			this.showDownload = true
		},
		
		openMenu () { // 打开目录
			this.showTool = false
			this.showMenu = true
		}
	},
	
	// beforeRouteLeave (to, from, next) {
	// 	if (this.thisBook.isOnShelf == '0' && to.name != 'book/download') { // 还没有加入书架，则离开页面时删除缓存书籍
	// 		this.$store.dispatch('deleteCasheBooks', {
	// 			bookId: this.$route.query.bookId
	// 		})
	// 		next()
	// 	} else {
	// 		next()
	// 	}
	// }
}
</script>

<style scoped="scoped" lang="less">
	.read-page{
		height: 100%;
		position: relative;
		overflow-y: hidden;
	}
	.content-page{
		overflow-y: auto;
		height: 100%;
	}
	.book-contents{
		padding: 30px 15px 50px 15px;
		.book-inner{
			text-align: justify;
			text-indent: 2em;
		}
		.book-title{
			line-height: 30px;
			font-weight: 400;
			margin-bottom: 25px;
		}
		.book-button{
			display: flex;
			justify-content: space-around;
			margin-top: 30px;
			div{
				padding: 7px 20px;
				border-radius: 5px;
				border: 1px solid #999999;
			}
		}
	}
	    
	.read-content{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.book-title1{
			line-height: 20px;
			font-size: 12px;
			text-align: center;
		}
		.read-article{
			position: absolute;
			overflow: hidden;
			text-align: justify;
			bottom: 25px;
			top: 40px;
			.read-section{
				height: 100%;
				.read-section-inner{
					overflow: visible;
					height: 100%;
					.book-inner{
						text-indent: 2em;
					}
				}
				.book-title{
					line-height: 30px;
					font-weight: 400;
					margin-bottom: 25px;
				}
			}
		}
		.article-page{
			position: absolute;
			left: 15px;
			bottom: 10px;
			font-size: 12px;
		}
	}
	    
	   
	    
</style>

<style lang="less">
	.read-page{
		p{
			margin-bottom: 10px;
		}
	}
</style>
