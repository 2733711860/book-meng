<template>
	<div class="hot-search">
		<div class="title">
			<span>{{title}}</span>
			<van-icon name="delete" v-if="title=='搜索历史'" @click="deleteS" />
		</div>
		<div class="hot-list">
			<span class="item-hot" v-for="(item, index) in hotList" :key="index" @click="getSearch(item)">
				{{item.bookName}}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
		}
	},
	
	props: {
		hotList: {
			type: Array,
			default: () => []
		},
		title: {
			type: String,
			default: ''
		}
	},
	
	methods: {
		getSearch (item) {
			this.$emit('searchHot', item.bookName)
		},
		
		deleteS () { // 删除
			this.$emit('deleteHistory')
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.hot-search{
		color: #999999;
		background-color: #FFFFFF;
		.title{
			font-size: 12px;
			padding: 20px 15px 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.hot-list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 15px;
			.item-hot{
				font-size: 12px;
				padding: 5px 12px;
				margin: 0 15px 15px 0;
				border-radius: 10px;
				background-color: #F0F0F2;
			}
		}
	}
</style>
