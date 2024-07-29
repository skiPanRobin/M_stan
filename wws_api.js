// 导入 okhttp 库
importPackage(Packages["okhttp3"]); //导入包

const { openWechat } = require('./wechat');
const { mstandTOMenu, mstandSelectDrinks, mstandPayment} = require('./mstan');
const { backToDesk } = require('./utils')

// 创建 OkHttpClient 实例
var client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();

// 创建 WebSocket 请求
var request = new Request.Builder().url("wss://pay.lovexiaohuli.com").build(); //vscode 插件的ip地址

client.dispatcher().cancelAll(); // 清理一次

// 全局变量，用于跟踪当前任务状态
// var currentTask = null;
var isProcessingTask = false;
var cid = null;
var uid = 'fb257b0c1044b5042d4ed7ede37ea1e2'
var heartbeatInterval = 10000; 

// 处理任务队列
function processNextTask(payload) {
    if (!isProcessingTask) {
        isProcessingTask = true;
        // currentTask = tasks.shift(); // 取出队列中的第一个任务
        executeTask(payload);
    } else {
        console.log("No tasks to process or already processing a task");
    }
}

function postScreenOss(filePath){
    // var path = '"/sdcard/screenshot.png"'
    var api = "https://sapi.lovexiaohuli.com/api/file/upload"

    var res = http.postMultipart(api, {
        file: open(filePath)
    }); 
    console.info(res.body.string());
    return  res.body.data.online_path
}

function updaloadPayPic(online_path){
    console.info('online path: ' + online_path)
    var url = 'https://pay.lovexiaohuli.com/ws/sendtoUid'
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "uploadPayPic",
        "data": {
            "id": "1", //订单id
            "type": "uploadPayPic",
            "status": "1", //是否成功下单  1是2否
            "fileUrl": online_path,
            "msg": "", // 下单失败的提示
            "shopList": []
        }
    }
    var res = http.postJson(url, json)
    console.info(res.body.string())

}


function updateTaskStatus(filePath){
    var online_path = postScreenOss(filePath);
    updaloadPayPic(online_path);
}


// 执行任务函数
function _executeTask(payload) {
    console.log("Executing task:", payload.wechatName);
    openWechat(payload);
    mstandTOMenu(payload)
    mstandSelectDrinks(payload)
    var filePath = mstandPayment(payload)
    // 模拟任务完成，更新任务状态
    console.info('filePath: ' + filePath)
    updateTaskStatus(filePath)
};


function executeTask(payload){
    try {
        _executeTask(payload)
    } catch (error) {
        backToDesk()
    }
}

function bindUid(message){
    cid = message.cid
    var registMessage = {
        "cid": cid,
        "uid": "fb257b0c1044b5042d4ed7ede37ea1e2", //微信账号uid  目前写死
        "name": "阿呆的大哥", //微信昵称 目前写死
        "terminal": "mini" //目前写死 终端类型  mini小程序  pc 电脑端 app 移动端
    }
    var r = http.postJson('https://pay.lovexiaohuli.com/ws/bindUid', registMessage)
    console.log('bindUid: ' + r.body.string())
}

function unbindUid(message){
    var registMessage = {
        "cid": message.cid,
        "uid": "fb257b0c1044b5042d4ed7ede37ea1e2", //微信账号uid  目前写
    }
    var r = http.postJson('https://pay.lovexiaohuli.com/ws/unBind', registMessage)
    console.log('unbindUid'+ r.body.string())
}




// 启动心跳检测
function startHeartbeat(webSocket) {
    setInterval(() => {
        webSocket.send('ping');
    }, heartbeatInterval);
}

// WebSocket 监听器
myListener = {
    onOpen: function (webSocket, response) {
        toast("onOpen");
        startHeartbeat(webSocket);
    },
    onMessage: function (webSocket, msg) { 
        print('msg: ' + msg);
        if (msg==='非法请求'||msg === 'pong') {
            return 
        }
        var message = JSON.parse(msg);
        switch (message.type) {
            case 'ping':
                break;
            case 'connect':
                bindUid(message)
                break;
            case "goToPay":    
                console.log("Received tasks list:", message);
                processNextTask(message.payload);
                break;
            case "uploadPayPic":
                if (message.status === 1) {
                    console.log("Task status updated successfully");
                    isProcessingTask = false;
                    // 等待服务器推送下一个任务列表
                } else {
                    console.error("Failed to update task status");
                }
                break;
            case 'disconnect':
                bindUid(message)
                break;
            default:
                console.error("Unknown message type:", message);
        }
    },
    onClosing: function (webSocket, code, response) {
        print("正在关闭");
    },
    onClosed: function (webSocket, code, response) {
        print("已关闭");
    },
    onFailure: function (webSocket, t, response) {
        print("错误");
        print(t);
    }
};

// 创建 WebSocket 连接
var webSocket = client.newWebSocket(request, new WebSocketListener(myListener)); //创建链接

// 防止主线程退出
setInterval(() => {}, 1000);
