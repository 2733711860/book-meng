module.exports = {
    baseUrl: './',
    assetsDir: 'static',
		devServer: {
			open: true,
			port: 8080,
			sockHost: 'http://localhost:8080',
			disableHostCheck: true
		},
    productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}