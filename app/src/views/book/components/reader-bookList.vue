<template>
	<div class="list-page">
		<reader-item-book
			v-if="showMoreList=='false'"
			v-for="(item, index) in bookList"
			:key="index"
		  :bookBasic="item"
		></reader-item-book>
		
		<van-list
			v-if="showMoreList=='true'"
		  v-model="loadings"
		  :finished="finished"
		  finished-text="我也是有底线的~"
		  @load="onLoad"
		>
			<reader-item-book
				v-for="(item, index) in bookList"
				:key="index"
			  :bookBasic="item"
			></reader-item-book>
		</van-list>
	</div>
</template>

<script>
import readerItemBook from './reader-item-book.vue'
export default {
	components: {
		readerItemBook
	},
	
	data () {
		return {
			loadings: this.value
		}
	},
	
	props: {
		value: false,
		
		showMoreList: { // 是否显示加载更多
			type: String,
			default: 'true'
		},
		
		bookList: { // 书籍列表
			type: Array,
			default: () => []
		},
		
		finished: { // 数据是否全部加载完成
			type: Boolean,
			default: false
		}
	},
	
	watch: {
		value () {
			this.loadings = this.value
		},
		loadings () {
			this.$emit('input', this.loadings)
		}
	},
	
	methods: {
		onLoad () {
			this.$emit('loadData')
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.list-page{
		height: 100%;
	}
</style>
