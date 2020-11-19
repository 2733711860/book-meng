<template>
	<div class="module-book" @click="goPage">
		<img class="module-book-pic" :src="bookBasic.bookImg" />
		<div class="module-book-content">
			<h1>{{bookBasic.bookName}}</h1>
			<div class="desc" v-html="bookBasic.bookDesc"></div>
			<div class="module-book-content-bot">
				<div>{{bookBasic.bookAuthor}}</div>
				<div class="book-tag">
					<span>{{bookBasic.bookType | changeType}}</span>
					<span class="boot-tag-rate">{{bookBasic.bookRate}}分</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { typeObj, baseUrl } from '../../../utils/bookUtil.js'
export default {
	props: {
		bookBasic: {
			type: Object,
			default: () => {}
		}
	},
	
	filters: {
		changeType (val) {
			return typeObj[val]
		}
	},
	
	methods: {
		goPage () {
			this.$store.dispatch('setCacheBooks', this.bookBasic) // 保存书籍信息
			
			this.$router.push({
				path: '/book/bookRelate/detail',
				query: {
					bookId: this.bookBasic.bookId
				}
			})
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.module-book{
		display: flex;
		padding: 10px 0;
		.module-book-pic{
			width: 70px;
			height: 100px;
			border-radius: 3px;
		}
		.module-book-content{
			flex: 1;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.desc{
				word-break: break-all;
				display: -webkit-box; /**对象作为伸缩盒子模型展示**/
				-webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
				-webkit-line-clamp: 2; /**显示的行数**/
				overflow: hidden; /**隐藏超出的内容**/
			}
			h1{
				color: #363636;
				margin-bottom: 13px;
			}
			div{
				color: #999999;
				font-size: 12px;
				line-height: 15px;
			}
			.module-book-content-bot{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 10px;
				.book-tag{
					span{
						display: inline-block;
						padding: 3px 5px;
						margin-right: 8px;
						border-radius: 10px;
						background-color: #F0F0F2;
					}
					.boot-tag-rate{
						color: #F4AFB2;
						background-color: #FCECEC;
					}
				}
			}
		}
	}
</style>
