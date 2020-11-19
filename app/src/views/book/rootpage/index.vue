<template>
	<div>
		<van-button type="default" style="margin: 30px;" @click="crawlBook">获取书籍</van-button>
		<br />
		<van-button type="default" style="margin: 30px;" @click="crawlDetail">获取详情</van-button>
	</div>
</template>

<script>
import { crawlBookTosql, crawlDetailsTosql } from '../../../api/index.js'
export default {
	data () {
		return {
			page: 1,
			start: 1,
			end: 10,
			endPage: 300 // 最多爬取多少页
		}
	},
	
	methods: {
		crawlBook () { // 爬取书籍
			crawlBookTosql({
				source: 'fy_pc',
				start: this.start,
				end: this.end
			}).then(res => {
				if (res.status == 200) {
					if (this.endPage > this.end) {
						setTimeout(() => { // 每5秒钟就爬取一次
							this.start = this.start + 10
							this.end = this.end + 10
							this.crawlBook()
						}, 5000)
					}
				}
			})
		},
		
		crawlDetail () { // 爬取详情页
			crawlDetailsTosql({
				page: this.page,
				pageSize: 50
			}).then(res => {
				if (res.status == 200) {
					if (this.page * 50 < res.total) { // 数据库还有
						setTimeout(() => { // 每5秒钟就爬取一次
							this.page++
							this.crawlDetail()
						}, 5000)
					}
				}
			})
		}
	}
}
</script>

<style>
</style>
