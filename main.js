// 导入 okhttp 库
importPackage(Packages["okhttp3"]); //导入包
const { openWechat } = require('./wechat');
const { mstand } = require('./mstan');
const { backToDesk, swithcScreenOn, shotPath, takeScreenShot, randomInt } = require('./utils')
const { postScreenOss, updaloadPayPic, uploadErrorStatus, updateDeviceStatus, bindUid, unbindUid, apiConfig } = require('./api')

// 创建 OkHttpClient 实例
var client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();

// 创建 WebSocket 请求
var request = new Request.Builder().url(apiConfig.apiWss).build(); //vscode 插件的ip地址
// 全局变量，用于跟踪当前任务状态
var cid = null;
var heartBeatId = null
var isClose = false;
var retryAttempts = 0;
var maxRetryAttempts = 99999; // 设置最大重试次数
var heartbeatInterval = 20000; 
var pongTime = new Date()
var isScreenOning = false
var taskQueue = []
var isTaskRunning = false
var doTaskEndDate = new Date()
var screenOnDate = new Date()
var restart = false

// 执行下一个任务
function executeNextTask() {
    if (isTaskRunning || taskQueue.length === 0) {
        // 如果有任务在执行，或者队列为空，不执行
        return;
    }
    // 标记任务正在执行
    isTaskRunning = true;
    while (isScreenOning === true){
        toast('等待屏幕点亮事件循环完成')
        sleep(300)
    }
    sleep(1500) // 等待关闭任务
    // 取出队列中的第一个任务
    var payload = taskQueue.shift();

    // 使用 setTimeout 模拟异步任务
    setTimeout(function() {
        processTask(payload);
        isTaskRunning = false; // 标记任务已完成
        // 执行下一个任务
        executeNextTask();
        // 最后执行完成任务时间
        doTaskEndDate = new Date()
    }, 0); // 延迟 0ms, 模拟异步任务
}


// 收到任务直接执行, 不存储到缓存
function processTask(payload) {
    updateDeviceStatus(payload.id, 0)
    executeTask(payload);
    updateDeviceStatus(payload.id, 2)
}


function updateTaskStatus(msg){
    console.log('准备截图.....');
    takeScreenShot(shotPath)
    console.log('截图完成....' + shotPath);
    var online_path = postScreenOss(shotPath);
    updaloadPayPic(online_path, msg);
    click(47, 176)
    sleep(300)
    click(43, 191)
    if (msg.status != 0){
        console.error('未成功完成任务， 强制退出应用及微信程序');
        shell('am force-stop ' + 'com.tencent.mm', true)
    }
}


// 执行任务函数
function _executeTask(payload) {
    console.log("executing task:", payload.wechatName);
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
            cid = null;
            heartBeatId = null
            isClose = false;
            retryAttempts = 0;
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
                    // processTask(message.payload)
                    taskQueue.push(message.payload)
                    toast("任务队列长度: " + taskQueue.length)
                    executeNextTask();
                    break;
                // case "uploadPayPic":
                //     break;
                case 'disconnect':
                    unbindUid(message.cid)  // 断线重连后, 解绑未绑定
                    break;
                case 'exit':
                    console.log('Exit message received. Closing WebSocket connection.');
                    unbindUid(cid)
                    webSocket.close(1000, "Closing connection as requested");
                    isClose = true
                    break
                default:
                    console.log("无需处理类型消息：" + JSON.stringify(message));
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
            console.log("onFailure 错误: " + t );
            attemptReconnect()
        }
    };
    // 创建 WebSocket 连接
    client.newWebSocket(request, new WebSocketListener(myListener)); //创建链接
}

function attemptReconnect() {
    console.log('正在尝试重启...')
    if (retryAttempts != 0){
        try {
            unbindUid(cid)
        } catch (error) {

        }
    }
    if (retryAttempts <= maxRetryAttempts) {
        console.log("重试连接, 尝试次数: " + retryAttempts);
        setTimeout(startWebSocket, 3000); // 延迟3秒后重试连接
    } else {
        console.log("已达到最大重试次数，停止重试。");
        isClose = true
    }
    retryAttempts++;
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
const windowInterId = setInterval(() => {
    var date = new Date()
    var timeString = date.toTimeString().substring(0, 8);
    ui.run(function(){
            var lastPong = date - pongTime
            var showText = isTaskRunning? ' ': `${timeString} Last Pong ${lastPong}` 
            window.time.setText(showText);
    });
    if  (isTaskRunning === false && restart === false && (date - screenOnDate) > 60 * 1000){
        // 每60s检查一次屏幕是否开启
        swithcScreenOn()
        screenOnDate = new Date()
    }
    // 2 * 3600 * 1000
    if ((date - doTaskEndDate) > 2 * 3600 * 1000 && isTaskRunning === false && restart === false){ 
        // 超过2个小时没执行任务, 则重启/关闭(22:30以后)关闭任务
        restart = true
        launchPackage('com.autox.startmstandauto');
    }
    if (timeString >= '22:10:00' || timeString <= "05:00:00"){
        console.log('22:30至05:00自动关闭应用');
        isClose = true
    }
    if (isClose){
        clearInterval(windowInterId)
        console.log("退出时钟悬浮窗!!!");
        clearInterval(heartBeatId)
        console.log("停止心跳!!!")
    }
}, 1000);
