auto();
var WIDTH = 1080
var HEIGHT = 2340
var width = device.width;
var height = device.height;
if (WIDTH == width && height == HEIGHT) {
} else {
    setScreenMetrics(WIDTH, HEIGHT)
}
var shotPath = "/sdcard/Pictures/Screenshots/screenshot.png";


function randomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 点亮屏幕
*/
function swithcScreenOn(){
    var counter = 0
    let maxIter = 20
    var status_ = 0
    while (!device.isScreenOn()){
        device.wakeUpIfNeeded()
        sleep(300)
        if(counter >= maxIter){
            status_ = 90
            console.error('无法点亮屏幕');
            break
        }
        counter ++;
    } 
    if (device.isScreenOn()){
        console.log('正常点亮屏幕 ' + counter);
        device.keepScreenDim()
    }
    return status_
}

function isNumeric(str) {
    return /^[0-9]+$/.test(str);
  }
// function sleep(sleepTime){
//     var duration   = Math.ceil(sleepTime * 0.1)
//     return randomInt(sleepTime - duration, sleepTime + duration)
// }

function actionSleep(func, sleepTime){
    func();
    sleep(sleepTime)
}

/**
 * 定义一个clickSleep方法
 * @param {string} textToClick - 需要点击的文本
 * @param {number} sleepTime - 休眠时间（毫秒）
 */
function clickSleep(textToClick, sleepTime) {
    // 点击传入的文本
    toast(textToClick);
    click(textToClick);
    sleep(sleepTime); // 休眠指定时间
};


function descClick(descText, sleepTime) {
    // 点击传入的文本
    // toast(descText);
    var ele = desc(descText).findOne(3000)
    ele ? ele.click() : console.log(`无法定位 ${descClick}`);
    
    sleep(sleepTime); // 休眠指定时间
};

/**
 * 定义一个clickSleep方法
 * @param {string} resourceId - 需要点击元素的resource-id
 * @param {number} sleepTime - 休眠时间（毫秒）
 */
function clickIdSleep(resourceId, sleepTime) {
    // 通过resource-id定位元素
    var element = id(resourceId).findOne();
    if (element) {
        element.click();
        sleep(sleepTime); // 休眠指定时间
    } else {
        toast("未找到resource-id: " + resourceId);
    }
};
/**
 * 定义一个clickSleep方法
 * @param {string} textToClick - 需要点击的文本
 * @param {number} sleepTime - 休眠时间（毫秒）
 */
function pressSleep(textToClick, sleepTime) {
    // 通过文本定位元素
    // toast(textToClick);
    var ele = text(textToClick).findOne(8000);
    if (ele === null) {
        toast("未找到文本: " + textToClick);
        sleep(sleepTime)
        return false
    } else {
        var bounds = ele.bounds(); // 获取元素的边界
        // 计算元素的中心点
        var x = bounds.centerX();
        var y = bounds.centerY();
        // 在元素中心点长按0.5秒
        press(x, y, 200);
        sleep(sleepTime); // 休眠指定时间
        return true
    }
}
;

/**
 * 根据部分文本定位元素并点击
 * @param {string} partialText - 部分文本内容
 * @param {number} sleepTime - 休眠事假
 */
function clickByPartialText(partialText, sleepTime) {
    // 使用正则表达式匹配包含部分文本的元素
    var element = textMatches(partialText + ".*").findOne(2000);
    if (element) {
        element.click();
        toast("已点击: " + element.text());
        sleep(sleepTime)
    } else {
        toast("未找到包含文本: " + partialText);
    }
};

// 定义函数来模拟人类逐字逐句地输入内容
function typeTextSlowly(inputField, text) {
    // 聚焦到输入框
    // inputField.click()
    clickEvent(inputField.bounds().centerX, inputField.bounds().centerY, 2000)
    toast('准备输入：' + text)
    sleep(2000)
    for (var i = 0; i < text.length; i++) {
        inputField.setText(text.slice(0, i+1))
        sleep(200);
    }
    
}

function inputAndSubmit(inputText, findText, sleepTime) {
    // 查找输入框元素（假设通过text定位）
    var inputField = text(findText).findOne(3000);
    if (inputField) {
        sleep(100)
        clickEvent(inputField.bounds().centerX, inputField.bounds().centerY, 2000)
        var inputField = text(findText).findOne(3000);
        inputField.setText(findText)
        typeTextSlowly(inputField, inputText); // 每输入一个字母间隔200毫秒
        toast("已输入: " + inputText);
        inputField.click();
        sleep(sleepTime)
    } else {
        toast("未找到输入框");
    }
};

function transX(x){
    return x * width / WIDTH
}

function transY(y){
    return y * height / HEIGHT
}

function pressXY(x, y, pt, sleepTime){
    press(transX(x), transY(y), pt)
    sleep(sleepTime)
};

function autoSwipe(sx, sy, ex, ey, duration, sleepTime){
    // 自适应手机屏幕分辨率
    swipe(transX(sx), transY(sy), transX(ex), transY(ey), duration)
    sleep(sleepTime)
}

function clickEvent(x, y, sleepTime){
    var openRemarkShell = `
    sendevent /dev/input/event4 3 57 580
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(-20, 20)}
    sendevent /dev/input/event4 3 54 ${y + randomInt(-10, 10)}
    sendevent /dev/input/event4 0 0 0
    sleep 0.05
    sendevent /dev/input/event4 3 57 -1
    sendevent /dev/input/event4 1 330 0
    sendevent /dev/input/event4 1 325 0
    sendevent /dev/input/event4 0 0 0
    `    
    shell(openRemarkShell, true)
    sleep(sleepTime)
}

function isExists(content, findTime, sleepTime){
    sleep(sleepTime)
    return !!text(content).findOne(findTime)
}

/**
 * 截图函数
*/
function takeScreenShot(savePath) {
    sleep(200)
    var result = shell("screencap -p " + savePath, true);
    if (result.code == 0) {
        console.log("截图成功，保存路径：" + savePath);
    } else {
        console.log("截图失败");
    }
};

function clockFloaty(isClose){
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        floaty.requestPermission();
        exit();
    } else {
        toastLog('已有悬浮窗权限');
    }
    var window = floaty.window(
        <frame>
            <text id='time' textSize='16sp' textColor="#FFFFFF" />
        </frame>
    );
    window.setPosition(width - 200, 0);
    function updateTime(){
        var timeString =(new Date()).toTimeString().substring(0, 8);
        ui.run(function(){
                window.time.setText(`${timeString} AUTOX`);
        });
    }
    var windowInterId = setInterval(() => {
        updateTime();
        if (isClose){
            clearInterval(windowInterId)
        }
    }, 1000);
    updateTime();
}

/**
 * 返回桌面
*/ 
function backToDesk(){
    actionSleep(back, 200)
    actionSleep(back, 200)
    actionSleep(back, 200)
    actionSleep(back, 200)
    actionSleep(back, 200)
    home()
    home()
    home()
}


module.exports = {
    actionSleep: actionSleep,
    clickSleep: clickSleep,
    clickIdSleep: clickIdSleep,
    pressSleep: pressSleep,
    clickByPartialText: clickByPartialText,
    inputAndSubmit: inputAndSubmit,
    pressXY: pressXY,
    autoSwipe: autoSwipe,
    randomInt: randomInt,
    clickEvent: clickEvent,
    descClick: descClick,
    backToDesk: backToDesk,
    takeScreenShot: takeScreenShot,
    isNumeric: isNumeric,
    swithcScreenOn: swithcScreenOn,
    isExists, isExists,
    clockFloaty: clockFloaty,
    shotPath: shotPath
};