// 导入 okhttp 库
importPackage(Packages["okhttp3"]); //导入包

const { openWechat } = require('./wechat');
const { mstand } = require('./mstan');
const { backToDesk, swithcScreenOn, shotPath, takeScreenShot } = require('./utils')

// 创建 OkHttpClient 实例
var client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();

// 创建 WebSocket 请求
var request = new Request.Builder().url("wss://pay.lovexiaohuli.com").build(); //vscode 插件的ip地址

client.dispatcher().cancelAll(); // 清理一次

// 全局变量，用于跟踪当前任务状态
var isProcessingTask = false;
var cid = null;
var uid = 'fb257b0c1044b5042d4ed7ede37ea1e2'
var heartbeatInterval = 30000; 
let taskQueue = [];
var isClose = false;

// 处理任务队列
function processTask() {
    if (isProcessingTask === true) {
        // console.log("already processing a task");
    }  else if (taskQueue.length == 0) {
        // console.log("taskQueue length 0");
    } else {
        isProcessingTask = true;
        // currentTask = tasks.shift(); // 取出队列中的第一个任务
        var payload = taskQueue.shift()
        executeTask(payload);
        isProcessingTask = false;
        if (taskQueue.length === 0){
            device.cancelKeepingAwake();
            sleep(200)
            shell("input keyevent 26", true);
        }
    }
}

function postScreenOss(shotPath){
    // var path = '"/sdcard/screenshot.png"'
    var api = "https://sapi.lovexiaohuli.com/api/file/upload"

    var res = http.postMultipart(api, {
        file: open(shotPath)
    }); 
    let jsonResponse = res.body.json()
    console.info('post response' + JSON.stringify(jsonResponse));
    console.log('online_path: ' + jsonResponse.data.online_path)
    return jsonResponse.data.online_path
}

function updaloadPayPic(online_path, msg){
    var url = 'https://pay.lovexiaohuli.com/ws/sendtoUid'
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "uploadPayPic",
        "data": {
            "id": msg.payload.id, //订单id
            "type": "uploadPayPic",
            "status": msg.status, //是否成功下单  1是2否
            "fileUrl": online_path,
            "msg": msg.msg, // 下单失败的提示
            "shopList": []
        }
    }
    var res = http.postJson(url, json)
    console.info('updaloadPayPic res: ' + res.body.string())

}

function uploadErrorStatus(errorMsg){
    var url = 'https://pay.lovexiaohuli.com/ws/sendtoUid'
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "uploadPayPic",
        "data": errorMsg
    }
    var res = http.postJson(url, json)
    console.info('updaloadPayPic res: ' + res.body.string())

}


function updateTaskStatus(msg){
    console.log('准备截图.....');
    takeScreenShot(shotPath)
    console.log('截图完成....' + shotPath);
    var online_path = postScreenOss(shotPath);
    updaloadPayPic(online_path, msg);
    if (className('android.widget.Button').desc('返回').findOne(200)) {
        className('android.widget.Button').desc('返回').findOne(3000).click()
    }
}


// 执行任务函数
function _executeTask(payload) {
    console.log("Executing task:", payload.wechatName);
    var errorMsg ;
    switch (true) {
        case (errorMsg = openWechat(payload)):
            if (errorMsg.status !== 0) break;
        case (errorMsg = mstand(payload)):
            if (errorMsg.status !== 0) break;
        default:
            break;
    }
    if (errorMsg.status !== 0){
        uploadErrorStatus(errorMsg)
    }
    // 模拟任务完成，更新任务状态
    updateTaskStatus(errorMsg)
};


function executeTask(payload){
    try {
        console.log("executing task:", payload.wechatName);
        swithcScreenOn();
        _executeTask(payload)
        device.cancelKeepingAwake()
        backToDesk()
    } catch (error) {
        console.error(error.message);
        // console.error(error.track())
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

function unbindUid(){
    var registMessage = {
        "cid": cid,
        "uid": "fb257b0c1044b5042d4ed7ede37ea1e2", //微信账号uid  目前写
    }
    var r = http.postJson('https://pay.lovexiaohuli.com/ws/unBind', registMessage)
    console.log('unbindUid'+ r.body.string())
}


// 启动心跳检测
function startHeartbeat(webSocket) {
    const heartBeatId = setInterval(() => {
        webSocket.send('ping');
        if (isClose === true) {
            clearInterval(heartBeatId)
            toast('停止心跳');
            sleep(1000)
        }
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
        try {
            var message = JSON.parse(msg);
        } catch (error) {
            console.error('msg类型错误不能解析' + msg);
            return
        }
        switch (message.type) {
            case 'ping':
                break;
            case 'connect':
                bindUid(message)
                break;
            case "goToPay":    
                console.log("Received tasks list:" + msg);
                taskQueue.push(message.payload)
                break;
            case "uploadPayPic":
                console.log(msg);
                break;
            case 'disconnect':
                bindUid(message)
                break;
            case 'exit':
                toast('Exit message received. Closing WebSocket connection.');
                unbindUid()
                webSocket.close(1000, "Closing connection as requested");
                isClose = true
                break
            default:
                console.error("Unknown message type:" + msg);
        }
    },
    onClosing: function (webSocket, code, response) {
        toast("正在关闭");
    },
    onClosed: function (webSocket, code, response) {
        toast("已关闭");
        device.cancelKeepingAwake();
    },
    onFailure: function (webSocket, t, response) {
        toast("错误");
        toast(t);
    }
};

// 创建 WebSocket 连接
var webSocket = client.newWebSocket(request, new WebSocketListener(myListener)); //创建链接

// 防止主线程退出
const intervalId = setInterval(() => { 
    toast('INTERVAL FOR TASK')
    processTask() 
    if (isClose === true) {
        clearInterval(intervalId)
        toast('收到关闭ws指令');
    }
}, 5000);


function setWindow(){
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        floaty.requestPermission();
        // exit();
    } else {
        toastLog('已有悬浮窗权限');
    }
    var window = floaty.window(
        <frame>
            <text id='time' textSize='16sp' textColor="#FFFFFF" />
        </frame>
    );
    window.setPosition(device.width - 300, 0);
    return window
}

var window = setWindow()

const windowInterId = setInterval(() => {
    var timeString =(new Date()).toTimeString().substring(0, 8);
    ui.run(function(){
            window.time.setText(`${timeString} AUTOX`);
    });
    if (isClose){
        clearInterval(windowInterId)
    }
}, 1000);