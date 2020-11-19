<template>
	<div class="book-head">
		<div class="head-left"></div>
		<div class="head-middle"><h6>{{this.$route.meta.title}}</h6></div>
		<div class="head-right">
			<van-icon name="search" @click="getSearch" />
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		getSearch () {
			if (this.$route.path == '/book/search') { // 如果是搜索页面，则调搜索接口
				this.$emit('takeSearch')
			} else { // 其他则进入搜索页面
				this.$router.push({
					path: '/book/search'
				})
			}
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.book-head{
		height: 40px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.head-left, .head-right{
			width: 40px;
			text-align: right;
		}
	}
</style>
