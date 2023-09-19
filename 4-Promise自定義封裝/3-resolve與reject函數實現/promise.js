//宣告建構函數
function Promise(executor){
    //新增屬性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //儲存實例物件的 this 的值
    const self = this;// self _this that
    //resolve 函數
    function resolve(data){
        //1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
    }
    //reject 函數
    function reject(data){
        //1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'rejected';//
        //2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
    }

    //同步呼叫『執行器函數』
    executor(resolve, reject);
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){

}