export default [
	{
	  path: '/',
	  redirect: '/book'
	},
  {
    path: '/book',
    component: resolve => { require(['@/views/book/index.vue'], resolve) },
    redirect: '/book/shelf',
    children: [
			{
				path: '/book/home/index',
				name: 'book/home/index',
				component: resolve => {
					require(['@/views/book/home/index.vue'], resolve)
				},
				meta: {
					title: '书城',
					showTop: true,
					rank: 1
				}
			}, {
				path: '/book/home/rank',
				name: 'book/home/rank',
				component: resolve => {
					require(['@/views/book/home/rank.vue'], resolve)
				},
				meta: {
					title: '榜单',
					showTop: true,
					rank: 1
				}
			}, {
				path: '/book/home/classify',
				name: 'book/home/classify',
				component: resolve => {
					require(['@/views/book/home/classify.vue'], resolve)
				},
				meta: {
					title: '分类',
					showTop: true,
					rank: 1
				}
			}, {
				path: '/book/bookRelate/detail',
				name: 'book/bookRelate/detail',
				component: resolve => {
					require(['@/views/book/bookRelate/detail.vue'], resolve)
				},
				meta: {
					title: '书名',
					keepAlive: true,
					rank: 3
				}
			}, {
				path: '/book/bookRelate/bookTxt',
				name: 'book/bookRelate/bookTxt',
				component: resolve => {
					require(['@/views/book/bookRelate/bookTxt.vue'], resolve)
				},
				meta: {
					title: '书籍文本',
					rank: 4
				}
			}, {
	      path: '/book/center',
	      name: 'book/center',
	      component: resolve => {
		      require(['@/views/book/center/index.vue'], resolve)
		    },
		    meta: {
		    	title: '我的',
					showTop: true,
					rank: 1
		    }
	    }, {
	      path: '/book/shelf',
	      name: 'book/shelf',
	      component: resolve => {
		      require(['@/views/book/shelf/index.vue'], resolve)
		    },
		    meta: {
		    	title: '书架',
					showTop: true,
					rank: 1
		    }
	    }, {
	      path: '/book/search',
	      name: 'book/search',
	      component: resolve => {
		      require(['@/views/book/search/index.vue'], resolve)
		    },
		    meta: {
		    	title: '搜索',
					keepAlive: true,
					rank: 2
		    }
	    }, {
	      path: '/book/download',
	      name: 'book/download',
	      component: resolve => {
		      require(['@/views/book/shelf/download-page.vue'], resolve)
		    },
		    meta: {
		    	title: '缓存管理'
		    }
	    }, {
	      path: '/book/rootpage',
	      name: 'book/rootpage',
	      component: resolve => {
		      require(['@/views/book/rootpage/index.vue'], resolve)
		    },
		    meta: {
		    	title: '后台管理'
		    }
	    }
    ]
  }
]
