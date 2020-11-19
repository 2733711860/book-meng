/*
* 用户登录
*
*/
const sha1 = require('sha1'); // 加密算法
const {check_token_code, create_token} = require('../util/token');
const { PWD_ENCODE_STR} = require('../config');
const { findData, editData } = require('../mysql/mysql');
const xss = require('xss'); // 安全，XSS过滤器可以从输入值中删除html标记

module.exports = {
  async login(ctx, next) {
    let {userId = '', password = '', checkCode = '', code_token = ''} = ctx.request.body;
    try {
      if (userId == '' || password == '') {
        ctx.body = {
          code: 401,
          msg: '登录失败，请输入账户或密码！'
        };
        return ;
      }

      // 验证码判断
      let checkCoderesult = await check_token_code({token: code_token, code: checkCode});
      if (!checkCoderesult) {
        ctx.body = {
          code: 401,
          msg: '登录失败，验证码错误！'
        };
        return;
      }

      // 用户名及密码判断
      password = sha1(sha1(password + PWD_ENCODE_STR)); // 获取加密后的密码
      let searchSql = `select * from user where userId = "${userId}" and password = "${password}"`;
      let checkUserResult = await findData(searchSql);
      if (checkUserResult.length == 0) {
        ctx.body = {
          code: 401,
          msg: '登录失败，账户或密码错误！'
        };
        return ;
      }

      // 登陆成功后先创建token
      let token = create_token(userId);

      // 将token存入user表里
      checkUserResult[0].token = token;
      let editSql = `update user set token = "${token}" where userId = "${userId}"`;
      await editData(editSql).then(data => {
        ctx.body = {
          code: 200,
          msg: '登陆成功！',
          data: {
            userMsg: checkUserResult
          }
        }
      }, err => {
        ctx.body = {
          code: 500,
          msg: '登录失败，服务器异常！'
        }
      });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '登录失败，服务器异常！'
      }
    }
  }
};
