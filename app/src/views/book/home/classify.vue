<template>
	<div class="classify-page">
		<van-tabs v-model="active" @change="onChange">
		  <van-tab v-for="(item, index) in typeList" :key="index + 'type'" :title="item.text">
				<reader-bookList
					class="book-list"
					v-model="loading"
					:finished="finished"
					:bookList="bookList"
					@loadData="loadData"
				></reader-bookList>
		  </van-tab>
		</van-tabs>
	</div>
</template>

<script>
import { typeObj } from '../../../utils/bookUtil.js'
import readerBookList from '../components/reader-bookList.vue'
import { getBookByType } from '../../../api/index.js'
export default {
	components: {
		readerBookList
	},
	
	data () {
		return {
			active: 0,
			typeList: [],
			page: 0,
			pageSize: 20,
			loading: false,
			finished: false,
			bookList: []
		}
	},
	
	created () {
		this.typeList = Object.keys(typeObj).map(el => {
			return {
				text: typeObj[el],
				value: el
			}
		})
	},
	
	methods: {
		getBook () {
			this.$loading.show()
			getBookByType({
				page: this.page,
				pageSize: this.pageSize,
				bookType: this.typeList[this.active].value
			}).then(res => {
				this.$loading.hide()
				this.bookList = [...this.bookList, ...res.data.list]
				this.loading = false
				if (this.bookList.length == res.data.total) { // 数据全部加载完成
					this.finished = true
				}
			})
		},
		
		onChange (item) { // 点击左侧切换排行榜
			$(".van-tabs__content").animate({
				scrollTop: 0
			}, 0)
			this.bookType = item.value
			this.page = 0
			this.bookList = []
			this.finished = false
		},
		
		loadData () {
			this.page++
			this.getBook()
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.classify-page{
		height: 100%;
		.book-list{
			padding: 0 15px;
			background-color: #FFFFFF;
			margin-top: 10px;
		}
	}
</style>

<style lang="less">
	.classify-page{
		.van-tabs{
			height: 100%;
			display: flex;
			flex-direction: column;
			.van-tabs__content{
				flex: 1;
				overflow-y: auto;
			}
		}
	}
</style>