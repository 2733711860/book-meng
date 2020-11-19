<template>
	<div class="search-page">
		<reader-search @getSearch="getSearch"></reader-search>
		<div class="search-badge" v-if="!hasSearch">
			<reader-hot-search
			  :hotList="hotList"
				title="搜索热词"
				@searchHot="getSearch"></reader-hot-search>
				
			<reader-hot-search
			  :hotList="historyList"
				title="搜索历史"
				@deleteHistory="deleteHistory"
				@searchHot="getSearch"></reader-hot-search>
		</div>
		
		<reader-bookList
			 class="search-result"
			:bookList="searchResult"
			v-model="loading"
			:finished="finished"
			@loadData="loadData"
			v-if="hasSearch"></reader-bookList>
		<div>
			
		</div>
	</div>
</template>

<script>
import readerSearch from '../components/reader-search.vue'
import readerHotSearch from '../components/reader-hot-search.vue'
import readerBookList from '../components/reader-bookList.vue'
import { getBookByWord, getHotWord } from '../../../api/index.js'
import { getBook } from '../../../utils/bookUtil.js'
export default {
	components: {
		readerSearch, readerHotSearch, readerBookList
	},
	
	data () {
		return {
			hotList: [], // 热搜列表
			searchResult: [], // 搜索结果
			hasSearch: false, // 已经搜索了
			page: 0,
			pageSize: 20,
			loading: false,
			finished: false,
			searchKey: ''
		}
	},
	
	computed: {
		historyList () { // 搜索历史
			return this.$store.getters.historyList
		}
	},
	
	mounted () {
		this.getHotWord() // 获取热搜列表
	},
	
	methods: {
		getHotWord () { // 获取热搜列表
			this.$loading.show()
			getHotWord().then(res => {
				this.$loading.hide()
				this.hotList = res.data.list
			})
		},
		
		getSearch (value) {
			this.hasSearch = true
			this.searchKey = value
			this.searchResult = []
			this.page = 0
			this.finished = false
		},
		
		getSearchs () { // 搜索接口
			this.$store.dispatch('setHistory', this.searchKey) // 保存搜索历史
			this.$loading.show()
			getBookByWord({
				keyWord: this.searchKey == '' ? '元尊' : this.searchKey,
				page: this.page,
				pageSize: this.pageSize
			}).then(res => {
				this.$loading.hide()
				this.searchResult = [...this.searchResult, ...res.data.list]
				this.loading = false
				if (this.searchResult.length == res.data.total) { // 数据全部加载完成
					this.finished = true
				}
			})
		},
		
		deleteHistory () { // 删除搜索历史
			this.$store.dispatch('setHistory', {deleteType: true}) // 保存搜索历史
		},
		
		loadData () {
			this.page++
			this.getSearchs()
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.search-page{
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #FFFFFF;
		.search-badge{
			flex: 1;
			overflow-y: auto;
		}
		.search-result{
			flex: 1;
			overflow-y: auto;
			padding: 10px 15px;
		}
	}
</style>
