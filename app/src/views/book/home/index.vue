<template>
	<div>
		<div class="item-module">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>猜你喜欢</div>
				</div>
			</div>
			
			<reader-bookList
				:bookList="likeBooks"
				showMoreList="false"
			></reader-bookList>
		</div>
		
		<div class="item-module">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>男频热榜</div>
				</div>
			</div>
			
			<reader-bookList
				:bookList="maleHots"
				showMoreList="false"
			></reader-bookList>
		</div>
		
		<div class="item-module">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>女频热榜</div>
				</div>
			</div>
			
			<reader-bookList
				:bookList="femaleHots"
				showMoreList="false"
			></reader-bookList>
		</div>
		
		<div class="item-module">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>火热新书</div>
				</div>
			</div>
			
			<reader-bookList
				:bookList="newBooks"
				showMoreList="false"
			></reader-bookList>
		</div>
		
		<div class="item-module">
			<div class="module-top">
				<div class="module-top-left">
					<span></span>
					<div>完结精选</div>
				</div>
				<!-- <div class="module-top-right">
					<span>更多</span>
					<van-icon name="arrow" />
				</div> -->
			</div>
			
			<reader-bookList
				:bookList="endBooks"
				showMoreList="false"
			></reader-bookList>
		</div>
	</div>
</template>

<script>
import { getBookByRandom, getBookByRank } from '../../../api/index.js'
import { getBook } from '../../../utils/bookUtil.js'
import readerBookList from '../components/reader-bookList.vue'
export default {
	components: {
		readerBookList
	},
	
	data () {
		return {
			likeBooks: [], // 猜你喜欢列表
			maleHots: [], // 男频热榜
			femaleHots: [], // 女频热榜
			newBooks: [], // 新书榜
			endBooks: [], // 完结榜
		}
	},
	
	mounted () {
		this.getYouLike() // 猜你喜欢
		this.getMailHots() // 男频热榜
		this.getFemaleHots() // 女频热榜
		this.getNewBooks() // 新书榜
		this.getEndBooks() // 完结榜
	},
	
	methods: {
		getYouLike () { // 猜你喜欢，默认起点月票榜
			this.$loading.show()
			getBookByRandom({
				bookNum: 3, // 随机获取的数量
				bookType: '1'
			}).then(res => {
				this.$loading.hide()
				this.likeBooks = res.data.list
			})
		},
		
		getMailHots () { // 男频热榜，默认男频人气榜
			this.$loading.show()
			getBookByRank({
				page: 1,
				pageSize: 3,
				rankType: 'BR1'
			}).then(res => {
				this.$loading.hide()
				this.maleHots = res.data.list
			})
		},
		
		getFemaleHots () { // 女频热榜，默认女频人气榜
			this.$loading.show()
			getBookByRank({
				page: 1,
				pageSize: 3,
				rankType: 'GR1'
			}).then(res => {
				this.$loading.hide()
				this.femaleHots = res.data.list
			})
		},
		
		getNewBooks () { // 新书榜，默认连载榜
			this.$loading.show()
			getBookByRank({
				page: 1,
				pageSize: 3,
				rankType: 'BR5'
			}).then(res => {
				this.$loading.hide()
				this.newBooks = res.data.list
			})
		},
		
		getEndBooks () { // 完结榜，默认完结榜
			this.$loading.show()
			getBookByRank({
				page: 1,
				pageSize: 3,
				rankType: 'BR6'
			}).then(res => {
				this.$loading.hide()
				this.endBooks = res.data.list
			})
		},
	}
}
</script>

<style scoped="scoped" lang="less">
	.item-module{
		background-color: #FFFFFF;
		padding: 10px 15px;
		margin-top: 10px;
		.module-top{
			height: 40px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #EDEDED;
			.module-top-left, .module-top-right{
				display: flex;
				align-items: center;
			}
			.module-top-left{
				span{
					display: inline-block;
					width: 4px;
					height: 14px;
					margin-right: 5px;
					border-radius: 1px;
					background-color: #1989fa;
				}
				div{
					color: #000000;
					font-weight: 550;
				}
			}
			.module-top-right{
				color: #999999;
				font-size: 12px;
			}
		}
	}
</style>
