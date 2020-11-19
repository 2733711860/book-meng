<template>
	<div class="detail-page" @scroll="onScrollChange($event)">
		<reader-header-two :navBarStyle="navBarStyle" :title="title"></reader-header-two>
		
		<div class="detail-top">
			<img :src="bookDetail.bookImg" />
			<div class="detail-top-content">
				<div class="book-title">{{bookDetail.bookName}}</div>
				<div class="book-author">作者：{{bookDetail.bookAuthor}}</div>
				<div class="book-type">类型：{{bookDetail.bookType | getType}}</div>
				<!-- <div class="book-type">{{bookDetail.wordCount}}  |  {{bookDetail.isSerial ? '连载' : '完结'}}</div> -->
				<div class="book-type">状态：{{bookDetail.isSerial ? '连载' : '完结'}}</div>
			</div>
		</div>
		
		<div class="like-div">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>故事简介</div>
				</div>
				<div class="module-top-right" @click="showAll = !showAll">
					<van-icon :name="showAll ? 'arrow-up' : 'arrow-down'" />
				</div>
			</div>
			<div class="detail-brief">
				<div :class="{'moreClass' : !showAll}">{{bookDetail.bookDesc}}</div>
			</div>
		</div>
		
		<div class="chapter-msg">
			<span class="chapter-title" @click="getChapter">查看目录</span>
			<span class="newest" @click="goLastChapter">
				<span class="chapter-name">最新：{{bookDetail.lastChapter}}</span>
				<span class="chapter-btn">{{bookDetail.updatedTime | changeTime}}<van-icon name="arrow" /></span>
			</span>
		</div>
		
		<div class="chapter-msg-two">
			<div class="book-rate">
				<div>读者留存率</div>
				<div class="book-rate-value">{{bookDetail.retentionRatio}}%</div>
			</div>
			<div class="book-rate">
				<div>评分</div>
				<div class="book-rate-value">{{bookDetail.bookRate}}</div>
			</div>
		</div>
		
		<div class="like-div">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>热门书评</div>
				</div>
				<div class="module-top-right">
					<van-icon name="edit" />
					<span>写书评</span>
				</div>
			</div>
			
			<div class="book-comment">
				<reader-comment></reader-comment>
				<reader-comment></reader-comment>
				<div class="book-comment-btn">全部书评22条</div>
			</div>
		</div>
		
		<div class="like-div">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>作者的其他作品</div>
				</div>
			</div>
			
			<div class="book-list">
				<reader-item-book-two
					class="item-book"
					v-for="(item, index) in authorBooks"
					:key="index + 'author'"
					:bookDetail="item"
					@click="getThis(item)"></reader-item-book-two>
			</div>
		</div>
		
		<div class="like-div">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>猜你喜欢</div>
				</div>
				<div class="module-top-right" @click="getLikeList">
					<span>换一换</span>
				</div>
			</div>
			
			<div class="book-list">
				<reader-item-book-two
					class="item-book"
					v-for="(item, index) in likeBooks"
					:key="index + 'like'"
					:bookDetail="item"
					@click="getThis(item)"></reader-item-book-two>
			</div>
		</div>
		
		<div class="detail-bottm">
			<div class="btn-one" @click="shelfFunc">{{isOnShelf == '0' ? '放入书架' : '移除书架'}}</div>
			<div class="btn-two" @click="goTxt">开始阅读</div>
		</div>
	</div>
</template>

<script>
import readerHeaderTwo from '../components/reader-header-two.vue'
import readerItemBookTwo from '../components/reader-item-book-two.vue'
import readerComment from '../components/reader-comment.vue'
import { getBookChapter, getBookByAuthor, getBookByRandom } from '../../../api/index.js'
import { typeObj } from '../../../utils/bookUtil.js'
import moment from 'moment'
const ANCHOR_SCROLL_TOP = 160
export default {
	components: {
		readerHeaderTwo, readerItemBookTwo, readerComment
	},
	
	data () {
		return {
			navBarStyle: { // 顶部样式
				backgroundColor: '',
				position: 'fixed',
				color: '#ffffff'
			},
			scrollTopValue: -1, // 滚动距顶部的距离
			title: '书籍信息',
			showAll: false, // 简介是否显示全部
			authorBooks: [], // 作者的所有作品
			likeBooks: [], // 猜你喜欢（同类型作品）
			bookId: this.$route.query.bookId
		}
	},
	
	filters: {
		changeTime (val) {
			return moment(val).format('YYYY年MM月DD日 HH:mm')
		},
		getType (val) {
			return typeObj[val]
		}
	},
	
	computed: {
		bookDetail () { // 当前书
			let books = this.$store.getters.cacheBooks.find(item => item.bookId == this.bookId) // 缓存中是否有此书
			return books ? books : {}
		},
		isOnShelf () { // 是否放入书架
			return this.bookDetail.isOnShelf ? this.bookDetail.isOnShelf : '0'
		}
	},
	
	created () {
		this.$store.dispatch('setBookSourceId', this.bookId)
		this.getChapters()
		this.getLikeList()
		this.getAuthorBooks()
	},
	
	methods: {
		getChapters () { // 调接口获取目录
			this.$loading.show()
			getBookChapter({
				bookId: this.bookDetail.bookId,
				source: this.bookDetail.source
			}).then(res => {
				this.$loading.hide()
				this.$store.dispatch('setCacheBooks', { // 保存书籍信息
					bookId: this.bookDetail.bookId,
					chapters: res.data.list,
					chaptersCount: res.data.list.length
				})
			})
		},
		
		getChapter () { // 获取目录
			this.$store.dispatch('setIsShowMenu', true)
		},
		
		goLastChapter () { // 最新章节
			let lastIndex = this.bookDetail.chapters.length - 1 // 最新章节的index
			this.$store.dispatch('setCacheBooks', { // 保存当前章节索引
				currentChapterIndex: lastIndex,
				bookId: this.bookDetail.bookId
			})
			this.$router.push({
				path: '/book/bookRelate/bookTxt',
				query: {
					bookId: this.bookDetail.bookId
				}
			})
		},
		
		onScrollChange ($event) { // 监听页面滚动
			this.scrollTopValue = $event.target.scrollTop
			let opacity = this.scrollTopValue / ANCHOR_SCROLL_TOP
			if (opacity <= 1) 
				this.navBarStyle.backgroundColor = "rgba(255, 255, 255, " + opacity + ")",
				this.navBarStyle.color = "#ffffff",
				this.title = '书籍信息';
			else 
				this.navBarStyle.backgroundColor = "rgba(255, 255, 255, 1)",
				this.navBarStyle.color = "inherit",
				this.title = this.bookDetail.bookName;
		},
		
		goTxt () { // 开始阅读
			this.$router.push({
				path: '/book/bookRelate/bookTxt',
				query: {
					bookId: this.bookDetail.bookId
				}
			})
		},
		
		shelfFunc () { // 加入书架、移除书架
			this.$store.dispatch('inOutShelf', {
				bookId: this.bookDetail.bookId
			})
		},
		
		getLikeList () { // 猜你喜欢
			getBookByRandom({
				bookType: this.bookDetail.bookType,
				bookNum: 3
			}).then(res => {
				this.likeBooks = res.data.list
			})
		},
		
		getAuthorBooks () { // 作者所有作品
			getBookByAuthor({
				bookAuthor: this.bookDetail.bookAuthor
			}).then(res => {
				this.authorBooks = res.data.list
			})
		},
		
		getThis (item) { // 点击其他书籍
			if (this.isOnShelf == '0') { // 不在书架中，则删除本书缓存
				this.$store.dispatch('deleteCasheBooks', {
					bookId: this.bookDetail.bookId
				})
			}
			this.$store.dispatch('setCacheBooks', item) // 保存书籍信息
			this.bookId = item.bookId
			this.$store.dispatch('setBookSourceId', this.bookId) // 保存当前书籍id
			$(".detail-page").animate({
				scrollTop: 0
			}, 0)
			const newUrl = `/#${this.$route.path}?bookId=${this.bookId}`
			window.history.replaceState('', '', newUrl)
			this.getChapters() // 获取章节
			this.getLikeList()
			this.getAuthorBooks()
		}
	},
	
	beforeRouteLeave (to, from, next) {
		if (to.name != 'book/bookRelate/bookTxt' && this.isOnShelf == '0') { // 如果去往的页面不是章节页面，且不在书架中，则删除本书缓存
			this.$store.dispatch('deleteCasheBooks', {
				bookId: this.bookDetail.bookId
			})
		}
		next()
	}
}
</script>

<style scoped="scoped" lang="less">
	.detail-page{
		height: 100vh;
		overflow: scroll;
		padding-bottom: 50px;
		.detail-bottm{
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-around;
			position: fixed;
			bottom: 0;
			border-top: 1px solid #EFEDEF;
			background-color: #FFFFFF;
			div{
				height: 30px;
				line-height: 30px;
				width: 150px;
				text-align: center;
				border-radius: 30px;
				font-size: 14px;
			}
			.btn-one{
				color: #F48E4E;
				background-color: #FFDEC6;
			}
			.btn-two{
				color: #FFEAE1;
				background-color: #F24747;
			}
		}
	}
	.detail-top{
		width: 100%;
		background: url(../../../assets/img/14.jpg) no-repeat;
		background-size: 100% 100%;
		display: flex;
		padding: 50px 15px 10px;
		color: #FFFFFF;
		img{
			width: 100px;
			height: 120px;
			margin-right: 20px;
			border-radius: 5px;
		}
		.detail-top-content{
			display: flex;
			flex-direction: column;
			justify-content: center;
			.book-title{
				font-weight: bold;
			}
			.book-author{
				font-size: 14px;
				margin-top: 15px;
				line-height: 20px;
			}
			.book-type{
				font-size: 14px;
				line-height: 20px;
				margin-top: 5px;
			}
		}
	}
	.detail-brief{
		font-size: 12px;
		line-height: 18px;
		text-indent: 28px;
		padding: 10px 15px;
		position: relative;
		background-color: #FFFFFF;
		.more-btn{
			position: absolute;
			width: 100px;
			text-align: right;
			bottom: 10px;
			right: 10px;
			background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
			color: #1989fa;
		}
	}
	.moreClass{
		word-break: break-all;
		display: -webkit-box; /**对象作为伸缩盒子模型展示**/
		-webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
		-webkit-line-clamp: 3; /**显示的行数**/
		overflow: hidden; /**隐藏超出的内容**/
	}
	
	.chapter-msg-two{
		font-size: 12px;
		margin-top: 10px;
		padding: 10px;
		background-color: #FFFFFF;
		display: flex;
		.book-rate:first-child{
			border-right: 1px solid #b3b3b3;
		}
		.book-rate{
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.book-rate-value{
				font-size: 15px;
				margin-top: 7px;
			}
		}
	}
	
	.chapter-msg{
		font-size: 12px;
		height: 30px;
		line-height: 30px;
		margin-top: 10px;
		background-color: #FFFFFF;
		display: flex;
		.chapter-title{
			color: #1989fa;
			padding: 0 10px 0 15px;
		}
		.newest{
			flex: 1;
			overflow-y: hidden;
			display: flex;
			justify-content: space-between;
			.chapter-name{
				flex: 1;
				display:inline-block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.chapter-btn{
				display: flex;
				align-items: center;
				padding-right: 15px;
			}
		}
	}
	
	.like-div{
		margin-top: 10px;
		background-color: #FFFFFF;
		.book-list{
			display: flex;
			flex-wrap: wrap;
			padding: 10px 15px;
			.item-book{
				margin: 5px 15px 5px 10px;
			}
			.item-book:last-child{
				margin-right: 0;
			}
		}
		.module-top{
			height: 40px;
			padding: 0 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #EFEDEF;
			.module-top-left, .module-top-right{
				display: flex;
				align-items: center;
			}
			.module-top-left{
				span{
					display: inline-block;
					width: 4px;
					height: 14px;
					margin-right: 5px;
					border-radius: 1px;
					background-color: #1989fa;
				}
				div{
					font-weight: 550;
				}
			}
			.module-top-right{
				color: #1989fa;
				font-size: 12px;
			}
		}
		
		.book-comment{
			.book-comment-btn{
				height: 40px;
				line-height: 40px;
				font-size: 14px;
				text-align: center;
				color: #1989fa;
			}
		}
	}
</style>
