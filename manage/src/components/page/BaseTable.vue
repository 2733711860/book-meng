<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 基础表格
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="bookType" placeholder="分类" class="handle-select mr10">
					<el-option v-for="(item, index) in typeList" :key="index" :label="item.text" :value="item.value"></el-option>
				</el-select>
				<el-select v-model="source" placeholder="书源" class="handle-select mr10">
					<el-option v-for="(item, index) in sourceList" :key="index" :label="item.text" :value="item.value"></el-option>
				</el-select>
				<el-input v-model="bookName" placeholder="书名" class="handle-input mr10"></el-input>
			</div>
			
			<div class="handle-box">
				<el-select v-model="isSerial" placeholder="状态" class="handle-select mr10">
					<el-option v-for="(item, index) in stateList" :key="index" :label="item.text" :value="item.value"></el-option>
				</el-select>
				<el-input v-model="bookAuthor" placeholder="作者" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
			</div>
			
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
			 @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="bookId" label="bookId" align="center"></el-table-column>
				<el-table-column prop="bookName" label="书名" align="center" min-width="150"></el-table-column>
				<el-table-column prop="bookAuthor" label="作者" align="center" min-width="150"></el-table-column>
				<el-table-column prop="bookType" label="书籍分类" align="center" :formatter="formatterType"></el-table-column>
				<!-- <el-table-column prop="bookRate" label="评分" align="center"></el-table-column> -->
				<!-- <el-table-column prop="latelyFollower" label="人气" align="center"></el-table-column> -->
				<!-- <el-table-column prop="retentionRatio" label="留存率" align="center"></el-table-column> -->
				<el-table-column prop="lastChapter" label="最新章节" align="center" min-width="180"></el-table-column>
				<el-table-column prop="isSerial" label="状态" align="center" :formatter="formatterType"></el-table-column>
				<el-table-column prop="source" label="书源" align="center"></el-table-column>
				<el-table-column label="封面" align="center">
					<template slot-scope="scope">
						<el-image class="table-td-thumb" :src="scope.row.bookImg" :preview-src-list="[scope.row.bookImg]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<div class="base_pagination">
				<el-pagination
			    @size-change="handleSizeChange"
			    @current-change="handlePageChange"
			    :current-page="page"
			    :page-sizes="[5, 10, 20, 50, 100]"
			    :page-size="pageSize"
			    layout="total, sizes, prev, pager, next, jumper"
			    :total="pageTotal">
			  </el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { deleteBook, searchBook } from '../../api/index.js'
import { typeObj, stateObj } from '../../utils/bookUtil.js'
export default {
	name: 'basetable',
	data() {
		return {
			typeList: [ // 书籍分类列表
				{ text: '全部', value: '' }, { text: '玄幻小说', value: '1' }, { text: '仙侠修真', value: '2' }, { text: '都市言情', value: '3' },
				{ text: '历史军事', value: '4' }, { text: '网游竞技', value: '5' }, { text: '科幻灵异', value: '6' }
			],
			stateList: [ // 书籍状态
				{ text: '全部', value: '' }, { text: '已完成', value: '1' }, { text: '连载中', value: '2' }
			],
			sourceList: [
				{ text: '全部', value: '' }, { text: '风雨小说网（PC端）', value: 'fy_pc' }
			],
			bookType: '', // 选择的书籍类别
			bookName: '', // 查询的书籍名称
			bookAuthor: '', // 查询的作者名
			isSerial: '', // 查询的书籍状态
			source: '', // 插叙的书籍来源
			page: 1, // 页码
			pageSize: 10, // 每页10条
			tableData: [],
			deleteBooks: [], // 要删除的书籍列表
			delList: [],
			editVisible: false,
			pageTotal: 0,
			form: {},
			idx: -1,
			id: -1
		};
	},
	created() {
		this.getData();
	},
	methods: {
		getData() { // 查询接口
			searchBook({
				page: this.page,
				pageSize: this.pageSize,
				bookType: this.bookType,
				bookName: this.bookName,
				bookAuthor: this.bookAuthor,
				isSerial: this.isSerial,
				source: this.source
			}).then(res => {
				this.tableData = res.data.list;
				this.pageTotal = res.data.total;
			})
		},
		
		handleSearch() { // 触发搜索按钮
			this.page = 1;
			this.getData();
		},
		
		handlePageChange(val) { // 分页导航
			this.page = val;
			this.getData();
		},
		
		handleSizeChange (val) { // 每页条数发生变化
			this.pageSize = val;
			this.page = 1;
			this.getData();
		},
		
		formatterType (row, column) { // 书籍类型转换
			if (column.property == 'bookType') {
				return typeObj[row[column.property]]
			} else {
				return stateObj[row[column.property]]
			}
		},
		
		// 删除操作
		handleDelete(index, row) {
			this.$confirm('确定要删除吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.deleteBooks = [].concat(row);
				this.deleteJK();
			}).catch(() => {});
		},
		
		deleteJK () { // 删除接口
			let ids = this.deleteBooks.map(item => {
				return item.bookId
			})
			deleteBook({
				bookIds: ids
			}).then(res => {
				if (res.status == 200) {
					this.deleteBooks = [];
					this.$message.success('删除成功');
					this.getData();
				}
			})
		},
		
		handleSelectionChange(val) { // 多选操作
			this.deleteBooks = val;
		},
		
		delAllSelection() {
			this.$confirm('确定要批量删除吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.deleteJK();
			}).catch(() => {});
		},
		
		// 编辑操作
		handleEdit(index, row) {
			this.idx = index;
			this.form = row;
			this.editVisible = true;
		},
		
		// 保存编辑
		saveEdit() {
			this.editVisible = false;
			this.$message.success(`修改第 ${this.idx + 1} 行成功`);
			this.$set(this.tableData, this.idx, this.form);
		}
	}
};
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
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
