<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 书籍爬取</el-breadcrumb-item>
				<el-breadcrumb-item>书籍详情</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				开始爬取页码：<el-input v-model="page" type="number" placeholder="爬取页数" class="handle-input mr10"></el-input>
			</div>
			
			<div class="handle-box">
				每次爬取页数：<el-input v-model="everyPage" type="number" placeholder="爬取页数" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="autoCrawlDetail()">自动爬取</el-button>
			</div>
			
			<!-- <el-table :data="tableData" border class="table" header-cell-class-name="table-header" height="600">
				<el-table-column prop="bookId" label="bookId" align="center"></el-table-column>
				<el-table-column prop="bookName" label="书名" align="center" min-width="150"></el-table-column>
				<el-table-column prop="bookAuthor" label="作者" align="center" min-width="150"></el-table-column>
				<el-table-column prop="bookType" label="书籍分类" align="center" :formatter="formatterType"></el-table-column>
				<el-table-column prop="lastChapter" label="最新章节" align="center" min-width="180"></el-table-column>
				<el-table-column prop="isSerial" label="状态" align="center" :formatter="formatterType"></el-table-column>
				<el-table-column prop="source" label="书源" align="center"></el-table-column>
			</el-table> -->
			
			<div style="text-align: center; margin-top: 20px;">{{crawlResult}}</div>
		</div>
	</div>
</template>

<script>
import { getPages, searchBook, crawlBookTosql, crawlDetailsTosql } from '../../api/index.js'
import { typeObj, stateObj } from '../../utils/bookUtil.js'
export default {
	name: 'upload',
	data () {
		return {
			tableData: [],
			page: 1,
			everyPage: 20, // 每次爬取20条数据
			crawlResult: '' // 爬取结果
		}
	},
  mounted() {
	},
	methods: {
		autoCrawlDetail () { // 爬取按钮
			crawlDetailsTosql({
				page: this.page,
				pageSize: this.everyPage
			}).then(res => {
				if (res.status == 200) {
					this.tableData = [...this.tableData, ...res.data.books];
					this.crawlResult = `已成功爬取${this.tableData.length}本书籍！`;
					if (Number(res.data.total) > (Number(this.page) * Number(this.everyPage))) {
						this.page++;
						this.autoCrawlDetail();
					}
				} else {
					this.$message.error(res.msg);
				}
			})
		},
		
		formatterType (row, column) { // 书籍类型转换
			if (column.property == 'bookType') {
				return typeObj[row[column.property]]
			} else {
				return stateObj[row[column.property]]
			}
		},
	}
}
</script>

<style scoped>
	.handle-box{
		margin-bottom: 20px;
	}
	.handle-input {
		width: 300px;
		display: inline-block;
	}
</style>

