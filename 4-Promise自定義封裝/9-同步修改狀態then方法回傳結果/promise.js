// 宣告建構函式
function Promise(executor) {
    // 新增屬性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    // 宣告屬性
    this.callbacks = [];
    // 儲存實例物件的 this 值
    const self = this; // self _this that
    // resolve 函式
    function resolve(data) {
        // 判斷狀態
        if (self.PromiseState !== 'pending') return;
        // 1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'fulfilled'; // 已解決
        // 2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
        // 呼叫成功的回調函式
        self.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }
    // reject 函式
    function reject(data) {
        // 判斷狀態
        if (self.PromiseState !== 'pending') return;
        // 1. 修改物件的狀態 (promiseState)
        self.PromiseState = 'rejected'; // 已拒絕
        // 2. 設定物件結果值 (promiseResult)
        self.PromiseResult = data;
        // 執行失敗的回調
        self.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }
    try {
        // 同步呼叫『執行者函式』
        executor(resolve, reject);
    } catch (e) {
        // 修改 promise 物件狀態為『失敗』
        reject(e);
    }
}

// 新增 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
    return new Promise((resolve, reject) => {
        // 呼叫回調函式  PromiseState
        if (this.PromiseState === 'fulfilled') {
            try {
                // 獲取回調函式的執行結果
                let result = onResolved(this.PromiseResult);
                // 判斷
                if (result instanceof Promise) {
                    // 如果是 Promise 類型的物件
                    result.then(v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    })
                } else {
                    // 結果的物件狀態為『成功』
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        }
        if (this.PromiseState === 'rejected') {
            onRejected(this.PromiseResult);
        }
        // 判斷 pending 狀態
        if (this.PromiseState === 'pending') {
            // 儲存回調函式
            this.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            });
        }
    })
}
