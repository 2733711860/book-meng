<template>
	<div class="item-book" @click="gothis">
		<img :src="bookDetail.bookImg" />
		<div>{{bookDetail.bookName}}</div>
	</div>
</template>

<script>
export default {
	props: {
		bookDetail: {
			type: Object,
			default: () => {}
		}
	},
	
	methods: {
		gothis () {
			this.$emit('click')
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.item-book{
		display: flex;
		flex-direction: column;
		width: 90px;
		img{
			width: 100%;
			height: 120px;
			border-radius: 3px;
		}
		div{
			font-size: 14px;
			line-height: 20px;
			text-align: center;
			margin-top: 5px;
		}
	}
</style>
