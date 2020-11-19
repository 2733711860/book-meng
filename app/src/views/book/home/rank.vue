<template>
	<div class="rank-page">
		<div class="rank-side">
			<div class="rank-title">男频</div>
			<van-sidebar v-model="maleActivity">
			  <van-sidebar-item v-for="(item, index) in maleRankTypeList" :key="index + 'male'" :title="item.text" @click="onChange(item)" />
			</van-sidebar>
			
			<div class="rank-title">女频</div>
			<van-sidebar v-model="femaleActivity">
			  <van-sidebar-item v-for="(item, index) in femaleRankTypeList" :key="index + 'female'" :title="item.text" @click="onChange(item)" />
			</van-sidebar>
		</div>
		
		<div class="rank-content">
			<reader-bookList
				v-model="loading"
				:finished="finished"
				:bookList="bookList"
				@loadData="loadData"
			></reader-bookList>
		</div>
	</div>
</template>

<script>
import readerBookList from '../components/reader-bookList.vue'
import { getBookByRank } from '../../../api/index.js'
import { maleRankTypeObj, femaleRankTypeObj } from '../../../utils/bookUtil.js'
export default {
	components: {
		readerBookList
	},
	
	data () {
		return {
			maleActivity: 0,
			femaleActivity: -1,
			bookList: [],
			maleRankTypeList: [], // 男频排行分类列表
			femaleRankTypeList: [], // 女频排行分类列表
			page: 0,
			pageSize: 20,
			rankType: 'BR1',
			loading: false,
			finished: false
		}
	},
	
	watch: {
		maleActivity () {
			if (this.maleActivity >= 0) this.femaleActivity = -1;
		},
		femaleActivity () {
			if (this.femaleActivity >= 0) this.maleActivity = -1;
		}
	},
	
	created () {
		this.maleRankTypeList = Object.keys(maleRankTypeObj).map(el => {
			return {
				text: maleRankTypeObj[el],
				value: el
			}
		})
		this.femaleRankTypeList = Object.keys(femaleRankTypeObj).map(el => {
			return {
				text: femaleRankTypeObj[el],
				value: el
			}
		})
	},
	
	mounted () {
	},
	
	methods: {
		getBook () {
			this.$loading.show()
			getBookByRank({
				page: this.page,
				pageSize: this.pageSize,
				rankType: this.rankType
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
			$(".rank-content").animate({
				scrollTop: 0
			}, 0)
			this.rankType = item.value
			this.page = 1
			this.bookList = []
			this.finished = false
			this.getBook()
		},
		
		loadData () {
			this.page++
			this.getBook()
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.rank-page{
		height: 100%;
		overflow-y: hidden;
		position: relative;
		display: flex;
		justify-content: space-between;
		.rank-side{
			position: absolute;
			width: 85px;
			overflow-y: auto;
			height: 100%;
			.rank-title{
				color: #999999;
				padding: 15px;
				font-size: 14px;
			}
		}
		.rank-content{
			position: absolute;
			overflow-y: auto;
			right: 0;
			width: calc(100vw - 85px);
			background-color: #FFFFFF;
			height: 100%;
			padding: 0 15px 0 10px;
		}
	}
</style>

<style lang="less">
	.rank-page{
		.rank-side{
			.van-sidebar-item{
				background-color: #F6F7F9;
			}
			.van-sidebar-item--select{
				background-color: #FFFFFF;
			}
		}
	}
</style>

