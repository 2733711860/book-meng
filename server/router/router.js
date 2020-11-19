const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const request = require('../util/request');
const controller = require('../controller/index');

router.get('/', async (ctx, next) => {
  ctx.body = "hello world! create by pawn! my blog => http://blog.lcylove.cn"
});

let base_path = path.join(__dirname, '../module');
requireRouters(base_path);

// get方法
function requireRouters(base_path) {
  let files = fs.readdirSync(base_path);
  files.forEach(file => {
    let file_name = base_path + '/' + file; // 完整文件名
    if (fs.statSync(file_name).isFile() && path.extname(file_name)==='.js') {
      let route = '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
      let question = require(file_name);
      router.get(route, async (ctx) => {
        console.log(ctx.query);
        let result = await question(ctx, request);
        ctx.body = result
      });
    } else {
      requireRouters(file_name)
    }
  })
}

// post
router.post('/api/user/register', controller.register); // 用户注册
router.post('/api/user/login', controller.login); // 用户登录

module.exports = router;
