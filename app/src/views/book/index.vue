<template>
	<div class="book-page">
		<reader-header v-if="$route.meta.showTop"></reader-header>
		<router-view class="book-content"></router-view>
		<reader-footer v-if="$route.meta.showTop"></reader-footer>
	</div>
</template>

<script>
import readerHeader from './components/reader-header.vue'
import readerFooter from './components/reader-footer.vue'
import transferUtil from '../../utils/middle-transfer.js'
import { getBookContent, getContent } from '../../api/index.js'
import { Toast } from 'vant'
export default {
	components: {
		readerHeader, readerFooter
	},
	mounted() {
		transferUtil.$on('testDemo', (startIndex, endIndex, thisBook) => {
			this.getChapterDetail(startIndex, endIndex, thisBook)
		})
	},
	
	methods: {
		getChapterDetail (startIndex, endIndex, thisBook) { // 只要当前章节index发生变化，就获取数据
			if (this.$store.getters.cacheBooks.find(item => item.bookId == thisBook.bookId).cacheState != '1') { // 不是正在缓存
				return
			}
			let hasThisChapter = thisBook.hasReadChapterList.find(item => item.chapterIndex == startIndex)
			if (hasThisChapter) { // 如果本章已经缓存过了
				if (startIndex < endIndex) {
					startIndex++
					this.$store.dispatch('setCacheBooks', { // 保存缓存进度
						bookId: thisBook.bookId,
						cacheStart: startIndex
					})
					this.getChapterDetail(startIndex, endIndex, thisBook)
				} else {
					this.$store.dispatch('setCacheBooks', { // 保存缓存进度(缓存完成)
						bookId: thisBook.bookId,
						cacheState: '3'
					})
					Toast(`${thisBook.bookName} 缓存完成`)
				}
			} else { // 本章没有缓存
				getContent({
					bookId: thisBook.bookId,
					chapterId: thisBook.chapters[startIndex].chapterId
				}).then(res => {
					if (res.status == 1001) { // 暂无本章信息，则调用爬取接口
						getBookContent({
							source: thisBook.source,
							bookId: thisBook.bookId,
							chapterId: thisBook.chapters[startIndex].chapterId
						}).then(res => {
							this.$store.dispatch('setCacheBooks', { // 保存章节信息
								bookId: thisBook.bookId,
								newReadChapter: {
									chapterIndex: startIndex,
									chapterName: res.data.title,
									chapterContent: res.data.cpContent ? res.data.cpContent : '正文获取失败！'
								}
							})
							if (startIndex < endIndex) {
								startIndex++
								this.$store.dispatch('setCacheBooks', { // 保存缓存进度
									bookId: thisBook.bookId,
									cacheStart: startIndex
								})
								this.getChapterDetail(startIndex, endIndex, thisBook)
							} else {
								this.$store.dispatch('setCacheBooks', { // 保存缓存进度(缓存完成)
									bookId: thisBook.bookId,
									cacheState: '3'
								})
								Toast(`${thisBook.bookName} 缓存完成`)
							}
						})
					} else if (res.status == 200) {
						this.$store.dispatch('setCacheBooks', { // 保存章节信息
							bookId: thisBook.bookId,
							newReadChapter: {
								chapterIndex: startIndex,
								chapterName: res.data.title,
								chapterContent: res.data.cpContent ? res.data.cpContent : '正文获取失败！'
							}
						})
						if (startIndex < endIndex) {
							startIndex++
							this.$store.dispatch('setCacheBooks', { // 保存缓存进度
								bookId: thisBook.bookId,
								cacheStart: startIndex
							})
							this.getChapterDetail(startIndex, endIndex, thisBook)
						} else {
							this.$store.dispatch('setCacheBooks', { // 保存缓存进度(缓存完成)
								bookId: thisBook.bookId,
								cacheState: '3'
							})
							Toast(`${thisBook.bookName} 缓存完成`)
						}
					}
				})
			}
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.book-page{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.book-content{
		flex: 1;
		overflow-y: auto;
		background-color: #F6F7F9;
		position: relative;
	}
</style>
