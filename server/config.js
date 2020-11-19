module.exports = {
  sqlCongif: {
    host: 'localhost',
    user: 'root',
    port: '3306',
    database: 'book',
    password: '123456',
    connectionLimit: 50 // 最大连接数
  },
  listenPort: 8080,
  listenHost: 'localhost'
};
