// 宣告建構函數
function Promise(executor){
    // 添加属性
    this.PromiseState = 'pending'; // 狀態：待定中
    this.PromiseResult = null; // 結果：空
    // 聲明屬性
    this.callbacks = []; // 回調函數陣列
    // 保存實例對象的 this 的值
    const self = this; // self _this that
    // resolve 函數
    function resolve(data){
        // 判斷狀態
        if(self.PromiseState !== 'pending') return;
        // 1. 修改對象的狀態 (promiseState)
        self.PromiseState = 'fulfilled'; // 已實現
        // 2. 設置對象結果值 (promiseResult)
        self.PromiseResult = data;
        // 調用成功的回調函數
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onResolved(data);
            });
        });
    }
    // reject 函數
    function reject(data){
        // 判斷狀態
        if(self.PromiseState !== 'pending') return;
        // 1. 修改對象的狀態 (promiseState)
        self.PromiseState = 'rejected'; // 已拒絕
        // 2. 設置對象結果值 (promiseResult)
        self.PromiseResult = data;
        // 執行失敗的回調函數
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onRejected(data);
            });
        });
    }
    try{
        // 同步調用『執行器函數』
        executor(resolve, reject);
    }catch(e){
        // 修改 promise 對象狀態為『失敗』
        reject(e);
    }
}

// 添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
    const self = this;
    // 判斷回調函數參數
    if(typeof onRejected !== 'function'){
        onRejected = reason => {
            throw reason;
        }
    }
    if(typeof onResolved !== 'function'){
        onResolved = value => value;
        // value => { return value};
    }
    return new Promise((resolve, reject) => {
        // 封裝函數
        function callback(type){
            try{
                // 獲取回調函數的執行結果
                let result = type(self.PromiseResult);
                // 判斷
                if(result instanceof Promise){
                    // 如果是 Promise 類型的對象
                    result.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    })
                }else{
                    // 結果的對象狀態為『成功』
                    resolve(result);
                }
            }catch(e){
                reject(e);
            }
        }
        // 調用回調函數  PromiseState
        if(this.PromiseState === 'fulfilled'){
            setTimeout(() => {
                callback(onResolved);
            });
        }
        if(this.PromiseState === 'rejected'){
            setTimeout(() => {
                callback(onRejected);
            });
        }
        // 判斷 pending 狀態
        if(this.PromiseState === 'pending'){
            // 保存回調函數
            this.callbacks.push({
                onResolved: function(){
                    callback(onResolved);
                },
                onRejected: function(){
                    callback(onRejected);
                }
            });
        }
    })
}

// 添加 catch 方法
Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected);
}

// 添加 resolve 方法
Promise.resolve = function(value){
    // 返回 promise 對象
    return new Promise((resolve, reject) => {
        if(value instanceof Promise){
            value.then(v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        }else{
            // 狀態設置為成功
            resolve(value);
        }
    });
}

// 添加 reject 方法
Promise.reject = function(reason){
    return new Promise((resolve, reject)=>{
        reject(reason);
    });
}

// 添加 all 方法
Promise.all = function(promises){
    // 返回結果為 promise 對象
    return new Promise((resolve, reject) => {
        // 声明變量
        let count = 0;
        let arr = [];
        // 遍歷
        for(let i=0;i<promises.length;i++){
            //
            promises[i].then(v => {
                // 得知對象的狀態是成功
                // 每個 promise 對象 都成功
                count++;
                // 將當前 promise 對象成功的結果 存入到數組中
                arr[i] = v;
                // 判斷
                if(count === promises.length){
                    // 修改狀態
                    resolve(arr);
                }
            }, r => {
                reject(r);
            });
        }
    });
}

// 添加 race 方法
Promise.race = function(promises){
    return new Promise((resolve, reject) => {
        for(let i=0;i<promises.length;i++){
            promises[i].then(v => {
                // 修改返回對象的狀態為 『成功』
                resolve(v);
            },r=>{
                // 修改返回對象的狀態為 『失敗』
                reject(r);
            })
        }
    });
}
