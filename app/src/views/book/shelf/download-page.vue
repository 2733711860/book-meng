<template>
	<div class="download-page">
		<reader-header-two title="缓存管理"></reader-header-two>
		
		<van-empty description="还没有缓存书籍哦~~~" v-if="cacheBooks.length == 0" />
		
		<div class="download-list" v-else>
			<div class="item-book" v-for="(item, index) in cacheBooks" :key="index + 'cache'">
				<div class="item-top">
					<div>{{item.bookName}}（{{item.cacheStartOrigin + 1}} - {{item.chaptersCount}}章）</div>
					<div>{{item.cacheStart + 1}}/{{item.cacheEnd + 1}}</div>
				</div>
				
				<div class="item-bottom">
					<van-slider v-model="item.cacheStart + 1" :min="1" :max="item.cacheEnd + 1" active-color="#F48E4E" disabled>
						<template #button>
							<div class="custom-button-n"></div>
						</template>
					</van-slider>
					
					<span class="pro-right" @click="cacheFunc(item)">
						<i :class="['iconfont', item.cacheState == '3' ? 'iconwancheng' : (item.cacheState == '2' ? 'iconstartDld' : 'iconzanting')]"></i>
						<div>{{item.cacheState == '3' ? '已完成' : (item.cacheState == '2' ? '继续' : '暂停')}}</div>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import readerHeaderTwo from '../components/reader-header-two.vue'
import transferUtil from '../../../utils/middle-transfer.js'
export default {
	components: {
		readerHeaderTwo
	},
	
	data () {
		return {
		}
	},
	
	computed: {
		cacheBooks () { // 有缓存记录的书
			return this.$store.getters.cacheBooks.filter(item => item.cacheStartOrigin != -1)
		}
	},
	
	methods: {
		cacheFunc (item) {
			if (item.cacheState == '3') { // 缓存完成
				return
			} else if (item.cacheState == '2') { // 缓存暂停，点击开始继续缓存
				this.$store.dispatch('setCacheBooks', {
					bookId: item.bookId,
					cacheState: '1'
				})
				transferUtil.$emit('testDemo', item.cacheStart, item.cacheEnd, item)
			} else if (item.cacheState == '1') { // 正在缓存，点击暂停缓存
				this.$store.dispatch('setCacheBooks', {
					bookId: item.bookId,
					cacheState: '2'
				})
			}
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.download-page{
		display: flex;
		height: 100%;
		flex-direction: column;
		.download-list{
			margin-top: 10px;
			overflow-y: auto;
			.item-book{
				padding: 15px;
				margin-bottom: 10px;
				background-color: #FFFFFF;
				.item-top{
					display: flex;
					justify-content: space-between;
					color: #333333;
					div:last-child{
						font-size: 12px;
						color: #999;
						span{
							margin-right: 10px;
						}
					}
				}
				.item-bottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 10px;
					.pro-right{
						width: 50px;
						margin-left: 10px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 10px;
						color: #999999;
						.iconfont{
							font-size: 20px;
							margin-bottom: 5px;
						}
						.iconwancheng, .iconwancheng + div{
							color: #04b554;
						}
						.iconstartDld, .iconzanting, .iconstartDld + div, .iconzanting + div{
							color: #F48E4E;
						}
					}
				}
				.custom-button{
					width: 8px;
					height: 8px;
					border-radius: 100%;
					background-color: #F48E4E;
				}
			}
		}
	}
</style>
