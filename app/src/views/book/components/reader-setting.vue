<template>
	<div :class="['tool-page-setting', showS ? 'show' : '']">
		<div class="brights">
			<i class="iconfont iconbright"></i>
			<van-slider
				class="slider"
				v-model="currentBright"
				min='50'
				max='100'
				@change="onChange"
			>
				<template #button>
					<div class="custom-button"></div>
				</template>
			</van-slider>
			<span @click="onChange('default')">默认</span>
		</div>
		
		<div class="fontSet">
			<div class="font-btn" @click="changeFontSize('-')">
				<i class="iconfont iconziti"></i>
				<span>-</span>
			</div>
			<span class="font-value">{{setting.fontSize}}</span>
			<div class="font-btn" @click="changeFontSize('+')">
				<i class="iconfont iconziti"></i>
				<span>+</span>
			</div>
			<span class="defau" @click="changeFontSize()">默认</span>
		</div>
		
		<div class="column-cls">
			<div 
				v-for="(item, index) in lineHeightList" 
				:key="index + 'lineHeight'"
				:class="{'active': item.value == setting.lineHeight}"
				@click="changeLine(item)">{{item.text}}</div>
		</div>
		
		<div class="column-cls">
			<div
				v-for="(item, index) in pageMode"
				:key="index + 'mode'"
				:class="{'active': item.value == setting.turnPageMode}"
				@click="changeMode(item)">{{item.text}}</div>
		</div>
		
		<div class="set-bg">
			<div class="bg-div">
				<div
					v-for="(item, index) in bgColorList"
					:key="index + 'bg'"
					:style="{backgroundColor: item}"
					:class="{'active': item == setting.backgroundColor}"
					@click="chooseBg(item)"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
export default {
	data () {
		return {
			showS: this.value,
			currentBright: 0,
			lineHeightList: [
				{ text: '紧凑', value: 25 }, { text: '舒适', value: 28 },
				{ text: '松散', value: 35 }, { text: '默认', value: 30 }
			],
			pageMode: [
				{ text: '整页', value: 0}, { text: '平移', value: 1},
				{ text: '点移', value: 2}, { text: '仿真', value: 4}, { text: '默认', value: 3}
			],
			bgColorList: ['rgba(183, 198, 191, 1)', 'rgba(202, 201, 206, 1)', 'rgba(236, 216, 179, 1)', 'rgba(245, 228, 228, 1)',
				'rgba(222, 210, 188, 1)', 'rgba(238, 230, 221, 1)', 'rgba(215, 201, 188, 1)', 'rgba(141, 206, 141, 1.0)',
				'rgba(228, 241, 245, 1)', 'rgba(224, 224, 224, .8)'
			]
		}
	},
	
	computed: {
		setting () {
			return this.$store.getters.setting
		}
	},
	
	props: {
		value: false
	},
	
	mounted () {
		this.currentBright = this.setting.brightness * 100
	},
	
	watch: {
		value () {
			this.showS = this.value
		},
		showS () {
			this.$emit('input', this.showS)
		}
	},
	
	methods: {
		onChange (val) { // 切换亮度
			this.currentBright = val == 'default' ? 90 : val
			this.$store.dispatch('setSetting', {
				brightness: this.currentBright/100
			})
		},
		
		changeFontSize (type) { // 切换字体大小
			let fontsize = this.setting.fontSize
			if (type == '-' && fontsize > 10) fontsize--;
			if (type == '+' && fontsize < 22) fontsize++;
			if (!type) fontsize = this.setting.defaultFontSize;
			this.$store.dispatch('setSetting', {
				fontSize: fontsize
			})
		},
		
		changeLine (item) { // 切换行间距
			this.$store.dispatch('setSetting', {
				lineHeight: item.value
			})
		},
		
		changeMode (item) { // 切换翻页模式
		  if (item.value == '4') {
				Toast('敬请期待！')
				return
			}
			this.$store.dispatch('setSetting', {
				turnPageMode: item.value
			})
		},
		
		chooseBg (item) { // 选择背景
			this.$store.dispatch('setSetting', {
				backgroundColor: item
			})
		}
	}
}
</script>

<style scoped="scoped" lang="less">
	.tool-page-setting{
		position: absolute;
		height: 270px;
		width: 100%;
		color: #FFFFFF;
		bottom: 0;
		background-color: rgba(50, 51, 52, 0.9);
		padding: 10px;
		transform: translateY(270px);
		transition: transform 0.5s;
		font-size: 12px;
		.brights{
			display: flex;
			align-items: center;
			margin-bottom: 20px;
			.slider{
				flex: 1;
				margin: 0 10px;
				.custom-button{
					width: 10px;
					height: 10px;
					background-color: #FFFFFF;
					border-radius: 100%;
				}
			}
			span{
				display: inline-block;
				padding: 7px 10px;
				border: 1px solid #999999;
				border-radius: 5px;
			}
		}
		.fontSet{
			display: flex;
			align-items: center;
			margin-bottom: 20px;
			.font-btn{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 7px 10px;
				border: 1px solid #999999;
				border-radius: 5px;
			}
			.font-value{
				padding: 0 20px;
			}
			.defau{
				display: inline-block;
				padding: 7px 10px;
				border: 1px solid #999999;
				border-radius: 5px;
				margin-left: 10px;
			}
		}
		.column-cls{
			display: flex;
			align-items: center;
			margin-bottom: 20px;
			div{
				flex: 1;
				text-align: center;
				padding: 7px 10px;
				border: 1px solid #999999;
				border-radius: 5px;
			}
			div:not(:last-child){
				margin-right: 15px;
			}
			.active{
				color: #ff6c37;
				border: 1px solid #ff6c37;
			}
		}
		.set-bg{
			width: 100%;
			height: 40px;
			position: relative;
			overflow-x: auto;
			.bg-div{
				position: absolute;
				width: auto;
				overflow-x: auto;
				display: flex;
				div{
					width: 45px;
					height: 40px;
				}
				div:not(:last-child){
					margin-right: 20px;
				}
				.active{
					border: 1px solid #ff6c37;
				}
			}
		}
	}
	.tool-page-setting.show{
		transform: translateY(0);
	}
</style>
