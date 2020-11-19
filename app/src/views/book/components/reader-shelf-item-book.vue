<template>
	<div class="module-book" @click="goPage">
		<img class="module-book-pic" :src="bookBasic.bookImg" />
		<div class="module-book-content">
			<h1>{{bookBasic.bookName}}</h1>
			<div class="desc">
				<div>更新时间：{{bookBasic.updatedTime | changeTime}}</div>
				<div>最新章节：{{bookBasic.lastChapter}}</div>
				<div v-if="bookBasic.currentChapterIndex > -1">已阅读：{{bookBasic.currentChapterIndex + 1}}章  /  共{{bookBasic.chaptersCount}}章</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
export default {
	props: {
		bookBasic: {
			type: Object,
			default: () => {}
		}
	},
	
	filters: {
		changeTime (val) {
			return moment(val).format('YYYY年MM月DD日 HH:mm')
		}
	},
	
	methods: {
		goPage () {
			this.$emit('click')
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.module-book{
		display: flex;
		padding: 10px 15px;
		.module-book-pic{
			width: 70px;
			height: 100px;
			border-radius: 3px;
		}
		.module-book-content{
			flex: 1;
			overflow: hidden;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.desc{
				width: 100%;
				div{
					overflow: hidden; /**隐藏超出的内容**/
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				div:nth-child(2), div:nth-child(3) {
					margin-top: 5px;
				}
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
