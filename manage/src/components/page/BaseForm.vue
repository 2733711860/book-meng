<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i> 书籍爬取
				</el-breadcrumb-item>
				<el-breadcrumb-item>自主爬取</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="plugins-tips">
				风雨小说网PC端访问地址：
				<a href="https://www.44pq.cc/" target="_blank">风雨小说</a>
			</div>
			<div class="schart-box">
				<div class="content-title">爬取小说列表</div>
				<div class="handle-box">
					<div>
						书源：
						<el-select v-model="source" placeholder="请选择书源" class="handle-select mr10">
							<el-option v-for="(item, index) in sourceList" :key="index" :label="item.text" :value="item.value"></el-option>
						</el-select>
					</div>
					<div>
						开始页码：<el-input-number v-model="startNum" :min="1" :max="totalPage"></el-input-number>
					</div>
					<div>
						结束页码：<el-input-number v-model="endNum" :min="1" :max="totalPage"></el-input-number>
					</div>
					<el-button type="primary" icon="el-icon-ice-cream-round" @click="crawlBook">爬取</el-button>
				</div>
				<div class="handle-box-result">{{crawlResult}}</div>
			</div>
		</div>
		
		<div class="container-two">
			<div class="schart-box">
				<div class="content-title">爬取小说详情</div>
				<div class="handle-box">
					<div>
						页码：<el-input-number v-model="page" :min="1"></el-input-number>
					</div>
					<div>
						偏移：<el-input-number v-model="pageSize" :min="1" :max="100"></el-input-number>
					</div>
					<el-button type="primary" icon="el-icon-ice-cream-round" @click="crawlDetails">爬取</el-button>
				</div>
				<div class="handle-box-result">{{crawlDetailResult}}</div>
			</div>
		</div>
		
		<div class="container-two">
			<div class="schart-box">
				<div class="content-title">爬取小说详情（单本手动添加）</div>
				<div class="handle-box">
					书籍链接：<el-input v-model="bookLink" placeholder="书籍链接" class="handle-input mr10"></el-input>
					<el-button type="primary" icon="el-icon-ice-cream-round" @click="crawlDetail">爬取</el-button>
				</div>
				<div class="handle-box-result">{{crawlOneBookResult}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { crawlBookTosql, crawlDetailsTosql, getBookDetail } from '../../api/index.js'
export default {
	data() {
		return {
			sourceList: [ // 书源列表
				{ text: '风雨小说网（PC端）', value: 'fy_pc' }
			],
			source: 'fy_pc', // 爬取小说列表 选择的书源
			startNum: 1, // 爬取小说列表 开始页码
			endNum: 1, // 爬取小说列表 结束页码
			totalPage: 10, // 爬取小说列表 可供爬取书籍的总页数
			crawlResult: '', // 爬取小说列表 爬取结果
			page: 1, // 爬取小说详情 页码
			pageSize: 10, // 爬取小说详情 每次爬取10本
			crawlDetailResult: '', // 爬取小说详情 爬取结果
			bookLink: '', // 爬取小说详情（单本手动） 书籍链接
			crawlOneBookResult: '' // 爬取小说详情（单本手动） 爬取结果
		}
	},
	
	methods: {
		crawlBook () { // 爬取小说列表
			crawlBookTosql({
				source: this.source,
				start: this.startNum,
				end: this.endNum
			}).then(res => {
				if (res.status == 200) {
					this.totalPage = Number(res.data.totalPage);
					this.crawlResult = `成功获取${res.data.saveResult.affectedRows}本书籍！（最多${res.data.totalPage}页）`;
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			})
		},
		
		crawlDetails () { // 爬取小说详情
			crawlDetailsTosql({
				page: this.page,
				pageSize: this.pageSize
			}).then(res => {
				if (res.status == 200) {
					this.crawlDetailResult = `第${this.page}页,成功获取${res.data.books.length}本书籍！（总共${res.data.total}本）`;
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			})
		},
		
		crawlDetail () { // 爬取小说详情（单本手动）
		  let links = [];
			links.push(this.bookLink)
			getBookDetail({
				links: links,
			}).then(res => {
				if (res.status == 200) {
					this.crawlOneBookResult = `${res.data.books[0].bookName}获取成功！`;
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			})
		}
	}
}
</script>

<style scoped>
	.container-two{
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px 30px;
		margin-top: 20px;
	}
	.schart-box {
		display: inline-block;
		margin: 20px;
		width: 100%;
	}

	.content-title {
		clear: both;
		font-weight: 400;
		line-height: 50px;
		margin: 10px 0;
		font-size: 22px;
		color: #1f2f3d;
	}
	
	.handle-box {
		margin-bottom: 20px;
		display: flex;
		align-items: center;
	}
	
	.handle-input{
		width: 350px;
	}
	
	.handle-box-result{
		margin-top: 20px;
		text-align: center;
	}
	
	.handle-box div{
		margin-right: 20px;
	}
	
	.table {
		width: 100%;
		font-size: 14px;
	}
	
	.red {
		color: #ff0000;
	}
	
	.mr10 {
		margin-right: 10px;
	}
	
	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
</style>
