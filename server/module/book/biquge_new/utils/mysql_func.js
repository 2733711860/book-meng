/**
 * @description:数据库操作
 * @author: 86183
 * @param:
 * @date: 2021/3/11
 */

const { addData, findData } = require('../../../../mysql/mysql');

function saveBooks(list, tableName) {
  return new Promise(async (resolve, reject) => {
    try {
      let keysList = Object.keys(list[0]);
      let str1 = keysList.join(',');

      let updates = keysList.map(item => {
        return `${item} = values(${item})`
      });
      updates = updates.join(',');

      let valueList = list.map(item => {
        return Object.values(item)
      });

      let editSql = `insert into ${tableName} (${str1}) values ? on duplicate key update ${updates}`;

      await addData(editSql, [valueList]).then(data => {
        resolve(data)
      }, (err) => {
        reject(err)
      });
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  saveBooks
};
