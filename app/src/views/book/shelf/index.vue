<template>
	<div class="shelf-page">
		<van-empty description="书架空空如也~~~" v-if="shelfBooks.length == 0" />
		
		<div class="shelf-list" v-if="shelfBooks.length > 0">
			<reader-item-book-two
				class="book-shelf-one"
				v-if="setting.shelfTheme == '0'"
				v-for="(item, index) in shelfBooks"
				:key="index + 'shelf'"
				:bookDetail="item"
				@click="goRead(item)"></reader-item-book-two>
			
			<van-swipe-cell 
				v-if="setting.shelfTheme == '1'"
				v-for="(item, index) in shelfBooks"
				:key="index + 'shelf'"
				:name="index"
				:before-close="beforeClose"
			>
				<reader-shelf-item-book
					class="book-shelf"
					:bookBasic="item"
					@click="goRead(item)"
				>
				</reader-shelf-item-book>
				
				<template #right>
					<van-button square text="删除" type="danger" class="delete-button" />
				</template>
			</van-swipe-cell>
		</div>
		
		<reader-little-tool
			@ToolFunc="ToolFunc"></reader-little-tool>
			
		<van-action-sheet v-model="showTheme" :actions="actions" close-on-click-action @select="onSelect" />
	</div>
</template>

<script>
import readerShelfItemBook from '../components/reader-shelf-item-book.vue'
import readerItemBookTwo from '../components/reader-item-book-two.vue'
import readerLittleTool from '../components/reader-little-tool.vue'
import { get_cache_size } from '../../../utils/bookUtil.js'
import { Dialog } from 'vant'
export default {
	components: {
		readerShelfItemBook, readerLittleTool, readerItemBookTwo
	},
	
	data () {
		return {
			showTheme: false,
			actions: [
				{ name: '经典书架', value: '0' }, { name: '简约列表', value: '1' }
			]
		}
	},
	
	computed: {
		shelfBooks () {
			return this.$store.getters.shelfBooks
		},
		setting () {
			return this.$store.getters.setting
		}
	},
	
	mounted () {
	},
	
	methods: {
		goRead (item) {
			this.$router.push({
				path: '/book/bookRelate/bookTxt',
				query: {
					bookId: item.bookId
				}
			})
		},
		
		ToolFunc (name) { // 小工具方法
			if (name == '清理缓存') {
				Dialog.confirm({
				  title: '警示',
				  message: `确定清空所有书架（${get_cache_size()}）？`,
				}).then(() => {
					var copyChache = [].concat(this.$store.getters.cacheBooks); // 先拷贝一份缓存
					copyChache.forEach(item => {
						this.$store.dispatch('inOutShelf', {
							bookId: item.bookId
						})
					})
				}).catch(() => {})
			} else if (name == '缓存中心') {
				this.$router.push({
					path: '/book/download'
				})
			} else if (name == '书架布局') {
				this.showTheme = true
			}
		},
		
		onSelect (item) { // 切换书架模式
			this.$store.dispatch('setSetting', {
				shelfTheme: item.value
			})
		},
		
		beforeClose({ position, instance, name }) { // 单本书籍左滑删除
			switch (position) {
				case 'left':
				case 'cell':
				case 'outside':
					instance.close();
					break;
				case 'right':
					Dialog.confirm({
						title: '警示',
						message: `确定从书架中移除${this.shelfBooks[name].bookName}吗？`,
					}).then(() => {
						this.$store.dispatch('inOutShelf', {
							bookId: this.shelfBooks[name].bookId
						})
						instance.close();
					}).catch(() => {})
					break;
			}
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.shelf-page{
		padding-top: 10px;
		.shelf-list{
			display: flex;
			flex-wrap: wrap;
			background-color: #FFFFFF;
			.book-shelf-one{
				margin: 10px 20px 10px 15px;
			}
			.book-shelf-one:last-child{
				margin-right: 0;
			}
			.delete-button{
				height: 100%;
			}
		}
	}
</style>
<style lang="less">
	.shelf-page{
		.van-swipe-cell{
			width: 100%;
		}
	}
</style>
