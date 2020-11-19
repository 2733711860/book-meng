<template>
	<reader-header-two @takeSearch="takeSearch">
		<van-search
			class="search-div"
			v-model="value"
			shape="round"
			clearable
			autofocus
			left-icon=''
			input-align='center'
			background="#FFFFFF"
			placeholder="请输入书名或作者"
		/>
	</reader-header-two>
</template>

<script>
import readerHeaderTwo from '../components/reader-header-two.vue'
export default {
	components: {
		readerHeaderTwo
	},
	
	data () {
		return {
			value: '' // 搜索关键字
		}
	},
	
	methods: {
		takeSearch () { // 搜索接口
			this.$emit('getSearch', this.value)
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.search-div{
		height: 100%;
	}
</style>
