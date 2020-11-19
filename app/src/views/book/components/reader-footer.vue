<template>
  <div class="me_footr">
  	<ul class="footer">
			<li class="item">
			  <router-link to="/book/shelf" class="flex2" active-class="active">
					<i class="iconfont iconshelf text"></i>
			    <p class="text menuText">书架</p>
			  </router-link>
			</li>
	    <li class="item">
	      <router-link to="/book/home/index" class="flex2" active-class="active">
					<i class="iconfont iconbook text"></i>
	        <p class="text menuText">书城</p>
	      </router-link>
	    </li>
			<li class="item">
			  <router-link to="/book/home/rank" class="flex2" active-class="active">
					<i class="iconfont iconrank text"></i>
			    <p class="text menuText">榜单</p>
			  </router-link>
			</li>
	    <li class="item">
	      <router-link to="/book/home/classify" class="flex2" active-class="active">
	        <i class="iconfont iconclassify text"></i>
	        <p class="text menuText">分类</p>
	      </router-link>
	    </li>
	    <li class="item">
	      <router-link to="/book/center" class="flex2" active-class="active">
					<i class="iconfont iconwode text"></i>
	        <p class="text menuText">我的</p>
	      </router-link>
	    </li>
	  </ul>
  </div>
</template>

<script>
export default {
	components: {
	},

	computed: {
	}
}
</script>

<style scoped lang="less">
.me_footr{
	height: 50px;
	.footer {
	  height: 50px;
	  width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.item{
			position: relative;
			.flex2{
				display: flex;
				flex-direction: column;
				align-items: center;
				.menuText{
					margin-top: 5px;
					font-size: 12px;
				}
			}
			.active .text {
			  color: #000000;
				font-weight: bold;
			}
		}
	}
}
</style>