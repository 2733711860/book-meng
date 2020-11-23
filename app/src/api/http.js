import axios from 'axios';
import config from './config'
import qs from 'qs'
import { Toast } from 'vant'

/**
 * 显示加载函数 （也可以写一个Loading.vue组件，通过v-if控制组件的显示页隐藏。在vuex建一个状态,在axios请求拦截中改成true，在axios响应拦截中改为false）
 * @param {String} msg 要提示的信息
 * ES6语法，默认值"加载中..."
 * 禁止点击蒙层
 * duration 为0，loading不会自动消失
 */
const loadingShow = (msg="加载中...") => {
	Toast.loading({
		forbidClick: true,
		duration: 0,
		message: msg
	});
};

/**
 * 清楚加载 函数
* */
const loadingHide = () => {
	Toast.clear();
};

//http request 拦截器
axios.interceptors.request.use(
  config => {
		loadingShow()
		if (config.method === 'get') {
			// 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2,不转换会显示为arr[]=1&arr[]=2
			config.paramsSerializer = function(params) {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			}
		}
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
		loadingHide()
    if(response.data.code == 202001){
      router.push({
        path:"/login",
        query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
		loadingHide()
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url, { params:params }, config)
	    .then(response => {
	      resolve(response.data);
	    })
	    .catch(err => {
	      reject(err)
	    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url, data, config)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url, data, config)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url, data, config)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}