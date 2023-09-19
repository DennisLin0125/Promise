
// * util.promisify 方法
 
//引入 util 模組
const util = require('util');
//引入 fs 模組
const fs = require('fs');
//傳回一個新的函數
let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/content.txt').then(value=>{
     console.log(value.toString());
});