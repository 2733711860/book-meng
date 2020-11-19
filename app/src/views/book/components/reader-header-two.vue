<template>
	<div class="book-head" :style="navBarStyle">
		<van-icon name="arrow-left" @click="goBack" />
		<div class="head-middle">
			<slot>
				<h6>{{title}}</h6>
			</slot>
		</div>
		<van-icon name="search" @click="getSearch" />
	</div>
</template>

<script>
export default {
	props: {
		navBarStyle: {
			type: Object,
			default: function () {
				return {
					background: '#ffffff',
					color: 'inherit'
				}
			}
		},
		title: {
			type: String,
			default: ''
		}
	},
	
	methods: {
		getSearch () {
			if (this.$route.path == '/book/search') { // 如果是搜索页面，则调搜索接口
				this.$emit('takeSearch')
			} else { // 其他则进入搜索页面
				this.$router.push({
					path: '/book/search'
				})
			}
		},
		
		goBack () {
			history.go(-1)
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.book-head{
		width: 100%;
		height: 40px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		.head-middle{
			padding: 0 10px;
			height: 100%;
			flex: 1;
			h6{
				height: 40px;
				line-height: 40px;
				text-align: center;
			}
		}
	}
</style>
