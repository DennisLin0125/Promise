
// * 封裝一個函數 mineReadFile 讀取檔案內容
// * 參數: path 檔案路徑
// * 返回: promise 對象

function mineReadFile(path){
   return new Promise((resolve, reject) => {
       //讀取檔案
       require('fs').readFile(path, (err, data) =>{
           //判斷
           if(err) reject(err);
           //成功
           resolve(data);
       });
   });
}

mineReadFile('./resource/content.txt')
.then(value=>{
   //輸出檔案內容
   console.log(value.toString());
}, reason=>{
   console.log(reason);
});