<template>
	<div class="item-comment">
		<div class="comment-top">
			<img src="../../../assets/img/14.jpg" />
			<span>慕天翎</span>
		</div>
		<div class="comment-content">记得每每有人分析宝钗的性格时，这一段便经常被拿出来引证，总归就是说她如何如何心机和世故，如何如何懂得讨人的欢心，揣测着老祖宗的喜欢，尽挑拣顺耳的话说，比起王熙凤明显的野心，更显得虚伪云云。</div>
		<div class="comment-bottom">
			<div>12小时前  ·  1.96万阅读</div>
			<div class="bottm-btn">
				<span><van-icon name="comment-o" /><span>39</span></span>
				<span><van-icon name="good-job-o" /><span>39</span></span>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style scoped="scoped" lang="less">
	.item-comment{
		padding: 15px;
		border-bottom: 1px solid #FAF8FA;
		.comment-top{
			display: flex;
			align-items: center;
			color: #5f5e5f;
			margin-bottom: 10px;
			img{
				width: 30px;
				height: 30px;
				border-radius: 100%;
				margin-right: 10px;
			}
		}
		.comment-content{
			font-size: 13px;
			line-height: 22px;
			word-break: break-all;
			display: -webkit-box; /**对象作为伸缩盒子模型展示**/
			-webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
			-webkit-line-clamp: 3; /**显示的行数**/
			overflow: hidden; /**隐藏超出的内容**/
		}
		.comment-bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			color: #999999;
			margin-top: 15px;
			.bottm-btn{
				display: flex;
				justify-content: space-between;
				align-items: center;
				span{
					margin-left: 20px;
					display: flex;
					align-items: center;
					span{
						margin-left: 7px;
					}
				}
			}
		}
	}
</style>
