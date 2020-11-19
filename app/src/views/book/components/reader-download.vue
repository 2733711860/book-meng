<template>
	<div :class="['tool-page-download', showDownload ? 'show' : '']">
		<div class="download-div">
			<div class="title">{{thisBook.bookName}}</div>
			<div class="item"
				v-for="(item, index) in downloadChooseList" 
				:key="index + 'down'"
				@click="downloadThis(item)">{{item.text}}</div>
		</div>
		
		<div class="download-bg" @click="closeDownload"></div>
	</div>
</template>

<script>
import transferUtil from '../../../utils/middle-transfer.js'
export default {
	data () {
		return {
			showDownload: this.value,
			downloadChooseList: [
				{ type: '1', text: '缓存后面50章' }, { type: '2', text: '缓存剩余章节' },
				{ type: '3', text: '缓存全本' }, { type: '4', text: '查看缓存管理' }
			],
			startIndex: -1, // 开始缓存的索引
			endIndex: -1, // 结束缓存的索引
		}
	},
	
	props: {
		value: false
	},
	
	watch: {
		showDownload () {
			this.$emit('input', this.showDownload)
		},
		value () {
			this.showDownload = this.value
		}
	},
	
	computed: {
		thisBook () { // 当前书
			let nowBook = this.$store.getters.cacheBooks.find(item => item.bookId == this.$route.query.bookId)
			return nowBook ? nowBook : {}
		}
	},
	
	methods: {
		closeDownload () { // 关闭下载框
			this.showDownload = false
		},
		
		downloadThis (item) { // 下载
			this.closeDownload()
			if (item.type == '4') {
				if (this.thisBook.isOnShelf == '0') {
					this.$store.dispatch('inOutShelf', { // 只要选择进入下载页面，则加入书架
						bookId: this.$route.query.bookId
					})
				}
				this.$router.push({
					path: '/book/download'
				})
			} else {
				let endIndex = item.type == '1' ? (((this.thisBook.currentChapterIndex + 50) > (this.thisBook.chapters.length - 1)) ? (this.thisBook.chapters.length - 1) : (this.thisBook.currentChapterIndex + 50)) : (this.thisBook.chapters.length - 1)
				let startIndex = item.type == '3' ? 0 : this.thisBook.currentChapterIndex
				this.$store.dispatch('setCacheBooks', { // 保存缓存进度
					bookId: this.$route.query.bookId,
					cacheStartOrigin: startIndex,
					cacheEnd: endIndex,
					cacheStart: startIndex,
					cacheState: '1'
				})
				transferUtil.$emit('testDemo', startIndex, endIndex, this.thisBook)
			}
		},
	}
}
</script>

<style scoped="scoped" lang="less">
	.tool-page-download{
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		transform: translateX(-100%);
		transition: transform 0.5s;
		color: #535353;
		.download-div{
			position: absolute;
			z-index: 11;
			width: 90%;
			height: 230px;
			background-color: #FFFFFF;
			box-shadow: 2px 2px 10px 4px #d0d0d0;
			border-radius: 5px;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 10px 20px;
			.title{
				height: 50px;
				line-height: 50px;
				font-weight: bold;
			}
			.item{
				height: 40px;
				line-height: 40px;
				font-size: 14px;
			}
		}
		.download-bg{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 10;
		}
	}
	.tool-page-download.show{
		transform: translateX(0);
	}
</style>
