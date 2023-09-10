
class Promise {
    // 構造方法
    constructor(executer){
        // 在此區this是指向Promise函數
        // 添加屬性
        this.PromiseState = "pending";
        this.PromiseResult = null;
        // 宣告一個物件
        this.callbacks = [];
        // 先保存實例物件的值
        const self = this;
        // resolve 函數
        function resolve(data){
            // 在此區this是指向window
            // 判斷狀態,使promise只能改變一次
            if (self.PromiseState !== 'pending') {
                return;
            }
            // 1.修改對象的狀態 PromiseState
            self.PromiseState = "fulfilled";  //和resolve都是成功的意思
            // 2.設定對象結果值 PromiseResult
            self.PromiseResult = data;
            // 調用成功的回調函數
            // 增加setTimeout可以模擬異步
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onResolved(data);
                })
            });   
        }
        // reject 函數
        function reject(data){
            // 在此區this是指向window
            // 判斷狀態,使promise只能改變一次
            if (self.PromiseState !== 'pending') {
                return;
            }
            // 1.修改對象的狀態 PromiseState
            self.PromiseState = "rejected";  //失敗
            // 2.設定對象結果值 PromiseResult
            self.PromiseResult = data;
            // 調用失敗的回調函數
            // 增加setTimeout可以模擬異步
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onRejected(data);
                })
            });   
        }

        try {
            // 執行器是同步調用
            executer(resolve,reject);
        } catch (error) {
            // 修改對象的狀態 PromiseState
            reject(error);
        }
    }

    // then方法封裝
    then(onResolved ,onRejected){
        const self = this;
        // 判斷回調函數參數
        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                throw reason
            }
        }
        // 如果then內沒有傳參數,就加一個
        if (typeof onResolved !== 'function') {
            onResolved = value => value;
        }

        return new Promise((resolve, reject) => {
            // 封裝函數
            function callback(type){
                try {
                    // 獲取回調函數的執行結果
                    let result = type(self.PromiseResult);
                    // 判斷
                    if (result instanceof Promise){
                        // 如果結果是一個Promise類型的物件
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        })
                    }else{
                        // 改變結果的物件狀態為成功
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }
            // 調用回調函數
            if (this.PromiseState === "fulfilled") {
                // 用setTimeout可以模擬callback異步執行
                setTimeout(() => {
                    callback(onResolved);
                });
            }

            if (this.PromiseState === "rejected") {
                // 用setTimeout可以模擬callback異步執行
                setTimeout(() => {
                    callback(onRejected);
                });
            }

            // 判斷pending
            if (this.PromiseState === "pending") {
                // 保存回調函數
                this.callbacks.push({
                    onResolved: function(){callback(onResolved);},
                    onRejected: function(){callback(onRejected);}
                });
            }
        });
    }

    // catch方法封裝
    catch(onRejected){
        return this.then(undefined,onRejected);
    }

    // 添加resolve 方法
    // static表示這是一個靜態成員,是屬於class
    static resolve(value){
        // 返回Promise物件
        return new Promise((resolve,reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                })
            }else{
                // 狀態設置成功
                resolve(value);
            }
        })
    }

    // 添加reject 方法
    static reject(reason){
        return new Promise((resolve,reject) => {
            reject(reason);
        });
    }

    // 添加all方法
    static all(promise){
        // 返回結果是一個Promise物件
        return new Promise((resolve, reject) => {
            let count = 0;
            let arr =[];        
            // 遍歷
            for (let i = 0; i < promise.length; i++) {
                const element = promise[i];
                element.then(v => {
                    // 成功
                    count++;
                    // 將目前promise的結果存入arr
                    arr[i] = v;
                    // 判斷
                    if (count === promise.length) {
                        resolve(arr);
                    }
                },r => {
                    reject(r);
                })
            }
        });
    }

    // 添加race方法
    static race(promise){
        // 返回結果是一個Promise物件
        return new Promise((resolve, reject) => {
            // 遍歷
            for (let i = 0; i < promise.length; i++) {
                const element = promise[i];
                element.then(v => {
                    // 誰先成功誰就先回調
                    resolve(v);
                },r => {
                    reject(r);
                })
            }
        })
    }
}







