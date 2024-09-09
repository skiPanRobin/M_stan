// 导入 okhttp 库
importPackage(Packages["okhttp3"]); //导入包
const {api} = require('./config')
const { openWechat } = require('./wechat');
const { mstand } = require('./mstan');
const { backToDesk, swithcScreenOn, shotPath, takeScreenShot, randomInt } = require('./utils')
const { postScreenOss, updaloadPayPic, uploadErrorStatus, updateDeviceStatus, bindUid, unbindUid } = require('./api')
if (isProcessingTask !== undefined) {
    console.log('isProcessingTask was defined, valuse: ' + isProcessingTask);
    sleep(3000)
    exit()
}

// 创建 OkHttpClient 实例
var client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();

// 创建 WebSocket 请求
var request = new Request.Builder().url(api.apiWss).build(); //vscode 插件的ip地址
// 全局变量，用于跟踪当前任务状态
var isProcessingTask = false;
var cid = null;
var heartBeatId = null
var isClose = false;
var retryAttempts = 0;
var maxRetryAttempts = 10; // 设置最大重试次数
var heartbeatInterval = 30000; 
var pongTime = new Date()
var isReconnecting = false
var isScreenOning = false


// 收到任务直接执行, 不存储到缓存
function processTask(payload) {
    if (isProcessingTask === true) {
        updateDeviceStatus(payload.id, 1)
        console.log("already processing a task");
    } else {
        updateDeviceStatus(payload.id, 0)
        isProcessingTask = true;
        executeTask(payload);
        isProcessingTask = false;
        updateDeviceStatus(payload.id, 2)
    }
}


function updateTaskStatus(msg){
    console.log('准备截图.....');
    takeScreenShot(shotPath)
    console.log('截图完成....' + shotPath);
    var online_path = postScreenOss(shotPath);
    updaloadPayPic(online_path, msg);
    if (className('android.widget.Button').desc('返回').findOne(2000)) {
        className('android.widget.Button').desc('返回').findOne(200).click()
    } else {
        click(100, 210)
        sleep(300)
        click(130, 250)
    }
}


// 执行任务函数
function _executeTask(payload) {
    console.log("executing task:", payload.wechatName);
    while (isScreenOning === true){
        toast('处理屏幕点亮')
        sleep(1000)
    }
    var errorMsg = openWechat(payload)
    if (errorMsg.status == 0){
        errorMsg = mstand(payload)
    }
    if (errorMsg.status != 0){
        uploadErrorStatus(errorMsg)
    }
    // 模拟任务完成，更新任务状态
    updateTaskStatus(errorMsg)
};


function executeTask(payload){
    try {
        swithcScreenOn();
        _executeTask(payload)
        backToDesk()
    } catch (error) {
        var errorMsg = {
            'type': 'errorMsg',
            'status': 99,      
            'msg': "未定义异常" + error.message,
            'payload': {
                'id': payload.id,
                "city": payload.city,
                "shopName": payload.shopName,
                "wechatNo": payload.wechatNo,
                "wechatName": payload.wechatName,
                "shopList": payload.shopList
            }
        }
        console.error(error.message);
        uploadErrorStatus(errorMsg)
        updateTaskStatus(errorMsg)
        backToDesk()
    }
}


// 启动心跳检测
function startHeartbeat(webSocket) {
    heartBeatId = setInterval(() => {
        webSocket.send('ping');
    }, heartbeatInterval);
}

// WebSocket 监听器
function startWebSocket(){
    client.dispatcher().cancelAll(); // 清理一次
    myListener = {
        onOpen: function (webSocket, response) {
            console.log("onOpen ");
            isProcessingTask = false;
            cid = null;
            heartBeatId = null
            isClose = false;
            retryAttempts = 0;
            isReconnecting = false;
            startHeartbeat(webSocket);
        },
        onMessage: function (webSocket, msg) { 
            console.log("msg " + msg);
            pongTime = new Date()
            if (msg === 'pong') {
                return 
            }
            try {
                var message = JSON.parse(msg);
                if (!!message.type === false){
                    console.warn("未定义消息类型： " + msg)
                    return
                }
            } catch (error) {
                console.log('无需JSON解析消息： ' + msg);
                return
            }
            switch (message.type) {
                // case 'ping':
                //     break;
                case 'connect':
                    cid = message.cid
                    bindUid(cid)
                    break;
                case "goToPay":    
                    processTask(message.payload)
                    break;
                // case "uploadPayPic":
                //     break;
                // case 'disconnect':
                    // bindUid(cid)
                    // break;
                case 'exit':
                    console.log('Exit message received. Closing WebSocket connection.');
                    unbindUid(cid)
                    webSocket.close(1000, "Closing connection as requested");
                    isClose = true
                    break
                default:
                    console.log("无需处理类型消息：" + msg);
                    break
            }
        },
        onClosing: function (webSocket, code, response) {
            console.log("onClosing 正在关闭");
        },
        onClosed: function (webSocket, code, response) {
            console.log("onClosed 已关闭");
            // device.cancelKeepingAwake();
        },
        onFailure: function (webSocket, t, response) {
            console.log("onFailure 错误: " + t);
            attemptReconnect()
        }
    };
    // 创建 WebSocket 连接
    client.newWebSocket(request, new WebSocketListener(myListener)); //创建链接
}

function attemptReconnect() {
    if (isReconnecting == true) {
        console.log('已经尝试重启中...')
        return
    } else{
        isReconnecting = true
        console.log('正在尝试重启...')
    }
    retryAttempts++;
    try {
        unbindUid(cid)
    } catch (error) {
    }
    if (retryAttempts <= maxRetryAttempts) {
        console.log("重试连接, 尝试次数: " + retryAttempts);
        setTimeout(startWebSocket, 3000); // 延迟3秒后重试连接
    } else {
        console.log("已达到最大重试次数，停止重试。");
        isClose = true
    }
}

startWebSocket(); // 初次启动


function setWindow(){
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        console.log("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        floaty.requestPermission();
        // exit();
    } else {
        console.log('已有悬浮窗权限');
    }
    var window = floaty.window(
        <frame>
            <text id='time' textSize='8sp' textColor="#FF6900" />
        </frame>
    );
    window.setPosition(device.width - randomInt(300, 450), 0);
    return window
}

var window = setWindow()

// 防止主线程退出
const screenOnId = setInterval(() => {
    console.log('检查屏幕是否点亮');
    if (isProcessingTask === false && isScreenOning === false) {
        isScreenOning = true
        try {
            swithcScreenOn()
            app.launchPackage('com.tencent.mm')
            sleep(1000)
            if (currentPackage() !== 'com.tencent.mm'){
                toast('未能打开微信')
            } {
                toast('正常打开微信')
            }
            backToDesk()
        } catch (error) {
            console.log(error.message);
        }
    } else {
        console.log('正在执行任务...');
    }
    isScreenOning = false
}, 1000 * 60 * 2);

// 防止主线程退出
const windowInterId = setInterval(() => {
    var timeString =(new Date()).toTimeString().substring(0, 8);
    ui.run(function(){
            var lastPong = new Date() - pongTime
            var showText = isProcessingTask? ' ': `${timeString} Last Pong ${lastPong}` 
            window.time.setText(showText);
            if (lastPong >= heartbeatInterval * maxRetryAttempts){
                console.log('pong 响应超时, 尝试重启wss');
                attemptReconnect()
                pongTime = new Date()  // 避免高频率重连wss
            }
    });
    if (isClose){
        clearInterval(screenOnId)
        console.log("退出屏幕定时点亮!!!")
        clearInterval(windowInterId)
        console.log("退出时钟悬浮窗!!!");
        clearInterval(heartBeatId)
        console.log("停止心跳!!!")
    }
}, 1000);
