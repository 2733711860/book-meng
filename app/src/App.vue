<template>
  <div class="app">
		<router-view :class="['app-router-view', isShowMenu ? 'animate' : '']"></router-view>
		
		<reader-chapter></reader-chapter>
  </div>
</template>

<script>
import readerChapter from './views/book/components/reader-chapter.vue'
export default {
  name: "app",
	
	components: {
		readerChapter
	},
	
	computed: {
		isShowMenu () {
			return this.$store.getters.isShowMenu
		}
	},
	
  created() {
  },
  
  mounted () {
  },

  methods: {
  }
}
</script>

<style lang="less">
	@import url("./assets/style/index.less");
	*{
		padding: 0;
		margin: 0;
	}
	html,
  body,
  .app {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
		-webkit-perspective: 1500px;
		perspective: 1500px;
  }
	.app-router-view{
		color: #535353;
		position: absolute;
		-webkit-transition: -webkit-transform 0.4s;
		transition: transform 0.4s;
		-webkit-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
		-webkit-transform: translateZ(0) translateX(0) rotateY(0deg);
		transform: translateZ(0) translateX(0) rotateY(0deg);
		overflow: hidden;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		z-index: 100;
	}
	
	.animate.app-router-view {
	  -webkit-transform: translateZ(-500px) translateX(100%) rotateY(-45deg);
	  transform: translateZ(-500px) translateX(50%) rotateY(-45deg);
	  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
	}
</style>



