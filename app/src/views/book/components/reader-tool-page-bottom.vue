<template>
	<div :class="['tool-page-bottom', showTool ? 'show' : '']">
		<div class="slider-div">
			<span @click="prevChapters">上一章</span>
			<van-slider
				class="slider"
				v-model="currentPaging"
				min='0'
				:max="resultPaging"
				disabled
			>
				<template #button>
					<div class="custom-button"></div>
				</template>
			</van-slider>
			<span @click="nextChapters">下一章</span>
		</div>
		
		<div class="tool-btn-div">
			<div class="item-tool" @click="openMenu">
				<i class="iconfont iconmulu icon1"></i>
				<div>目录</div>
			</div>
			<div :class="['item-tool', setting.dayNight == 'night' ? 'active' : '']" @click="changeDayNight">
				<i class="iconfont iconyejian icon"></i>
				<div>夜间</div>
			</div>
			<div class="item-tool" @click="openDownload">
				<i class="iconfont icondownload icon"></i>
				<div>缓存</div>
			</div>
			<div class="item-tool" @click="changeSource">
				<i class="iconfont iconhuan icon"></i>
				<div>换源</div>
			</div>
			<div class="item-tool" @click="openSetting">
				<i class="iconfont iconziti icon"></i>
				<div>设置</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
export default {
	data () {
		return {
			showTool: this.value
		}
	},
	
	computed: {
		setting () {
			return this.$store.getters.setting
		}
	},
	
	props: {
		value: false,
		resultPaging: { // 本章总页数
			type: [Number, String],
			default: 0
		},
		currentPaging: { // 当前页
			type: [Number, String],
			default: 0
		}
	},
	
	watch: {
		showTool () {
			this.$emit('input', this.showTool)
		},
		value () {
			this.showTool = this.value
		}
	},
	
	methods: {
		prevChapters () { // 下一章
			this.$emit('prevChapter', true)
		},
		
		nextChapters () { // 上一章
			this.$emit('nextChapter')
		},
		
		openSetting () { // 设置
			this.$emit('openSetting')
		},
		
		openDownload () { // 下载
			this.$emit('openDownload')
		},
		
		openMenu () { // 目录
			this.$emit('openMenu')
		},
		
		changeDayNight () { // 日间模式夜间模式
			this.$store.dispatch('setSetting', {
				dayNight: this.setting.dayNight == 'day' ? 'night' : 'day'
			})
		},
		
		changeSource () { // 换源
			Toast('敬请期待！')
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.tool-page-bottom{
		position: absolute;
		height: 100px;
		width: 100%;
		color: #FFFFFF;
		bottom: 0;
		background-color: rgba(50, 51, 52, 0.9);
		padding: 15px;
		transform: translateY(100px);
		transition: transform 0.5s;
		display: flex;
		flex-direction: column;
		font-size: 12px;
		.slider-div{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.slider{
				flex: 1;
				margin: 0 20px;
				.custom-button{
					width: 10px;
					height: 10px;
					background-color: #FFFFFF;
					border-radius: 100%;
				}
			}
		}
		
		.tool-btn-div{
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.active{
				color: #ff6c37;
			}
			.item-tool{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				div{
					margin-top: 10px;
				}
				.icon{
					font-size: 20px;
				}
				.icon1{
					font-size: 18px;
				}
			}
		}
	}
	.tool-page-bottom.show{
		transform: translateY(0);
	}
</style>
