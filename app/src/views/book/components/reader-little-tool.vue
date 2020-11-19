<template>
	<v-touch>
		<div :class="['container-floating', showLittleTool ? 'is-opened' : '']">
			<div
				v-for="(item, index) in toolList"
				:key="index + 'tool'"
				:class="['nds', 'nd' + (index+1), item.show ? 'is-opened' : '']"
				@click="showDeatil(item)"
			>
				<span v-if="item.show">{{item.name}}</span>
				<i :class="['iconfont', item.icon]" v-if="!item.show"></i>
			</div>
		
			<div class="floating-button" @click="openTool">
				<p class="plus">+</p>
			</div>
		</div>
	</v-touch>
</template>

<script>
export default {
	data () {
		return {
			showLittleTool: false,
			toolList: [
				{ name: '清理缓存', icon: 'iconclear', show: false },
				{ name: '缓存中心', icon: 'iconxiazai', show: false },
				{ name: '书架布局', icon: 'iconlayout', show: false },
				// { name: '书架管理', icon: 'iconmanage', show: false }
			]
		}
	},
	
	mounted () {
	},
	
	methods: {
		openTool () {
			this.toolList.map(item => {
				return item.show = false
			})
			this.showLittleTool = !this.showLittleTool
		},
		
		showDeatil (obj) {
			this.toolList.map(item => {
				return item.show = item.show ? false : (item.name == obj.name ? true : false)
			})
			if (!obj.show) {
				this.$emit('ToolFunc', obj.name)
			}
		}
	}
}
</script>

<style scoped="scoped" lang="less">
		.nds {
		  width: 40px;
		  height: 40px;
		  border-radius: 20px;
		  position: fixed;
		  z-index: 300;
		  transform: scale(0);
		  transition: width 0.25s;
		  cursor: pointer;
		  background-color: #888;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconfont{
				font-size: 20px;
			}
			span{
				font-size: 13px;
			}
		}
		
		.nd1 {
		  right: 30px;
		  bottom: 140px;
		  animation-delay: 0.2s;
		  animation: bounce-out-nds 0.3s linear;
		  animation-fill-mode: forwards;
		}
		
		.nd2 {
		  right: 30px;
		  bottom: 190px;
		  animation-delay: 0.15s;
		  animation: bounce-out-nds 0.15s linear;
		  animation-fill-mode: forwards;
		}
		
		.nd3 {
		  right: 30px;
		  bottom: 240px;
		  animation-delay: 0.1s;
		  animation: bounce-out-nds 0.1s linear;
		  animation-fill-mode: forwards;
		}
		
		.nd4 {
		  right: 30px;
		  bottom: 290px;
		  animation-delay: 0.08s;
		  animation: bounce-out-nds 0.1s linear;
		  animation-fill-mode: forwards;
		}
		
		.container-floating.is-opened .nds {
		  animation: bounce-nds 0.1s linear;
		  animation-fill-mode: forwards;
		}
		
		.container-floating.is-opened .nd2 {
		  animation-delay: 0.08s;
		}
		
		.container-floating.is-opened .nd3 {
		  animation-delay: 0.15s;
		}
		
		.container-floating.is-opened .nd4 {
		  animation-delay: 0.2s;
		}
		
		.floating-button {
		  width: 40px;
		  height: 40px;
		  border-radius: 50%;
		  background: #db4437;
		  position: fixed;
		  bottom: 85px;
		  right: 30px;
		  cursor: pointer;
		  box-shadow: 0px 2px 5px #666;
		}
		
		.nds.is-opened{
			width: 150px;
		}
		
		@keyframes bounce-nds {
		  from {
		    opacity: 0;
		  }
		  to {
		    opacity: 1;
		    transform: scale(1);
		  }
		}
		@keyframes bounce-out-nds {
		  from {
		    opacity: 1;
		    transform: scale(1);
		  }
		  to {
		    opacity: 0;
		    transform: scale(0);
		  }
		}
		
		.plus {
		  color: white;
		  position: absolute;
		  top: 0;
		  display: block;
		  bottom: 0;
		  left: 0;
		  right: 0;
		  text-align: center;
		  padding: 0;
		  margin: 0;
		  line-height: 40px;
		  font-size: 24px;
		  font-family: "Roboto";
		  font-weight: 300;
		}
</style>
