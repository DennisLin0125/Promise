//宣告建構函數
function Promise(executor){
    //resolve 函數
    function resolve(data){

    }
    //reject 函數
    function reject(data){

    }

    //同步呼叫『執行器函數』
    executor(resolve, reject);
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}