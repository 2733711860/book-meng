/*
* 用户注册
*
*/
const sha1 = require('sha1'); // 加密算法
const {check_token_code, create_token} = require('../util/token');
const { PWD_ENCODE_STR} = require('../config');
const { addData, findData, editData } = require('../mysql/mysql');
const xss = require('xss'); // 安全，XSS过滤器可以从输入值中删除html标记

module.exports = {
  async register(ctx, next) {
      let {
        userName = '',
        userId = '',
        password = '',
        re_password = '',
        avatar = '',
        checkCode = '',
        code_token = ''
      } = ctx.request.body;

      try {
        if (userId == '' || password == '') {
          ctx.body = {
            code: 401,
            msg: '注册失败，请填写完整信息！'
          };
          return ;
        }
        if (password.length < 6) {
          ctx.body = {
            code: 401,
            msg: '注册失败，密码最少为6位！'
          };
          return;
        }
        if (password != re_password) {
          ctx.body = {
            code: 401,
            msg: '注册失败，2次密码输入不一致！'
          };
          return;
        }
        // 验证码判断
        let checkcoderesult = await check_token_code({token: code_token, code: checkCode});
        if (!checkcoderesult) {
          ctx.body = {
            code: 401,
            msg: '注册失败，验证码错误！'
          };
          return;
        }

        // 创建user用户表
        let createSql = `create table if not exists user(
          userName varchar(255),
          userId varchar(255) not null,
          password varchar(255) not null,
          avatar varchar(255),
          token varchar(255),
          level varchar(255),
          primary key (userId)
        )charset=utf8`;
        await addData(createSql);

        // 判断用户账户是否重复
        let searchSql = `select * from user where userId = "${userId}"`;
        let checkUserResult = await findData(searchSql);
        if (checkUserResult.length != 0) {
          ctx.body = {
            code: 401,
            msg: '注册失败，登录账号重复了，换一个吧！'
          };
          return;
        }

        // 用户密码加密
        password = sha1(sha1(password + PWD_ENCODE_STR));

        // 防止xss攻击， 转义
        userName = xss(userName);

        // 创建token
        let token = create_token(userId);
        let level = '0'; // 刚注册级别为0

        // 保存用户信息
        var user = {userName, userId, password, avatar, token, level};
        let insertSql = `insert into user set ?`;
        await addData(insertSql, user).then(data => {
          ctx.body = {
            code: 200,
            data: {
              userMsg: user
            },
            msg: '注册成功！'
          };
        }, (err) => {
          ctx.body = {
            code: 401,
            msg: '注册失败，服务器异常！'
          };
        });
      } catch (e) {
        ctx.body = {
          code: 401,
          msg: '服务器异常，请稍后再试！'
        }
      }
  }
};
