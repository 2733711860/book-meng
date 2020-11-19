<template>
	<div class="al-page">
		<div class="chapter-page">
			<div class="chapter-top">
				<div class="book-name">{{thisBook.bookName}}</div>
				<div class="chapter-reserve"><van-icon name="exchange" /></div>
			</div>
			<div class="chapter-div">
				<div class="item-chapter" v-for="(item, index) in thisBook.chapters" :key="index + 'chapter'" @click="getContent(item, index)">{{item.title}}</div>
			</div>
		</div>
		
		<div class="right-page">
			<van-icon name="close" class="nav-close" @click="closeChapter" />
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		thisBook () {
			let thisBook = this.$store.getters.cacheBooks.find(item => item.bookId == this.$store.getters.bookSourceId)
			return thisBook ? thisBook : {}
		}
	},
	
	watch: {
	},
	
	mounted () {
	},
	
	methods: {
		getContent (item, index) { // 获取每章内容
			this.$store.dispatch('setCacheBooks', { // 保存当前章节索引
				currentChapterIndex: index,
				bookId: this.thisBook.bookId
			})
			this.closeChapter()
			this.$router.push({
				path: '/book/bookRelate/bookTxt',
				query: {
					bookId: this.thisBook.bookId
				}
			})
		},
		
		closeChapter () { // 关闭章节弹窗
			this.$store.commit('SET_ISSHOWMENU', false)
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.al-page{
		height: 100%;
		display: flex;
		.chapter-page{
			width: 50%;
			height: 100%;
			border-right: 1px solid #ebebeb;
			display: flex;
			flex-direction: column;
			.chapter-top{
				height: 60px;
				padding: 0 15px;
				border-bottom: 1px solid #ebebeb;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.book-name{
					font-weight: bold;
					line-height: 20px;
				}
				.chapter-reserve{
					color: #999999;
					display: flex;align-items: center;
				}
			}
			.chapter-div{
				flex: 1;
				overflow-y: auto;
				.item-chapter{
					font-size: 12px;
					color: #999999;
					height: 40px;
					line-height: 40px;
					padding: 0 15px;
					border-bottom: 1px solid #ebebeb;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		.right-page{
			.nav-close{
				font-size: 20px;
				color: #999999;
				margin: 20px;
			}
		}
	}
</style>
