//宣告建構函數
function Promise(executor){
    //新增屬性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    //宣告屬性
    this.callbacks = [];
    //儲存實例物件的 this 的值
    const self = this;// self _this that
    //resolve 函數
    function resolve(data){
        //判斷狀態
        if(self.PromiseState !== 'pending') return;
        //1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'fulfilled';// resolved
        //2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
        //呼叫成功的回呼函數
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    //reject 函數
    function reject(data){
        //判斷狀態
        if(self.PromiseState !== 'pending') return;
        //1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'rejected';//
        //2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
        //執行失敗的回呼
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try{
        //同步呼叫『執行器函數』
        executor(resolve, reject);
    }catch(e){
        //修改 promise 物件狀態為『失敗’
        reject(e);
    }
}

//新增 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    //呼叫回調函數 PromiseState
    if(this.PromiseState === 'fulfilled'){
        onResolved(this.PromiseResult);
    }
    if(this.PromiseState === 'rejected'){
        onRejected(this.PromiseResult);
    }
    //判斷 pending 狀態
    if(this.PromiseState === 'pending'){
        //儲存回呼函數
        this.callbacks.push({
            onResolved: onResolved,
            onRejected: onRejected
        });
    }
}