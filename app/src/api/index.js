/**
 * API命名配置列表
 * 命名规则：驼峰式命名方式，动词放前面，名词放后面，
 * 如:addFeatures
 * API命名变量不要太过长
 */
import { get } from './http.js'

export const baseUrl = `http://121.41.79.10:8080/api`
// export const baseUrl = `http://localhost:8080/api`
// export const baseUrl = 'https://www.fastmock.site/mock/f5b0436d25760cd9e4b88fdf3de4d459/api'


export const getBookByAuthor = params => get(`${baseUrl}/search/authorbook`, params) // 根据作者查询书籍

export const getBookByRandom = params => get(`${baseUrl}/search/randombook`, params) // 随机获取几本书籍

export const getBookByRank = params => get(`${baseUrl}/search/rankbook`, params) // 获取排行榜书籍

export const getBookByType = params => get(`${baseUrl}/search/typebook`, params) // 根据分类获取书籍

export const getBookByWord = params => get(`${baseUrl}/search/wordbook`, params) // 根据关键字查询书籍

export const getBookChapter = params => get(`${baseUrl}/get/chapter`, params) // 获取章节

export const getCrawlChapter = params => get(`${baseUrl}/crawl/chapter`, params) // 爬取章节

export const getHotWord = params => get(`${baseUrl}/search/hotWord`, params) // 获取搜索热词

export const getBookDetail = params => get(`${baseUrl}/crawl/detail`, params) // 获取书籍详情

export const getBookContent = params => get(`${baseUrl}/crawl/content`, params) // 获取正文(爬取)

export const getContent = params => get(`${baseUrl}/get/content`, params) // 获取正文

export const crawlBookTosql = params => get(`${baseUrl}/crawl/book`, params) // 爬取书籍到数据库

export const crawlDetailsTosql = params => get(`${baseUrl}/crawl/alldetail`, params) // 从数据库获取bookId，批量爬取书籍详情并保存到数据库（阅读器用不到）


