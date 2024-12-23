auto();
var WIDTH = 1080
var HEIGHT = 2340
var width = device.width;
var height = device.height;
if (WIDTH == width && height == HEIGHT) {
    console.log('不需要重置屏幕宽高');
} else {
    setScreenMetrics(WIDTH, HEIGHT)
}
var shotPath = "/sdcard/Pictures/screenshot.png";
var ocrImgPath = '/sdcard/DCIM/test.png'

const pathMap = {
    "shotPath": shotPath,
    "ocrImgPath": ocrImgPath,
    'dirPath': '/sdcard/',
    "tempFile": 'heartbeat_temp.txt',
    "heartbeatFile": 'heartbeat.txt'
}

function getScreenImg(){
    takeScreenShot(ocrImgPath)
    sleep(500)
    return images.read(ocrImgPath)
}

/**
 * 识别指定区域内文字, 返回中心坐标
 * 
*/
function ocrLoctionXY(img, xy, checkText){
    var clipImg = images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])
    var gimg = images.grayscale(clipImg)
    var gimg = images.threshold(gimg, 140, 255, "BINARY")
    var res = paddle.ocr(clipImg)
    for (let index = 0; index < res.length; index++) {
        var ocrResult = res[index];
        if (ocrResult.text==checkText){
            console.log(`定位 "${checkText}" 成功`);
            return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
        } else {
            toast(`ocrResult text: ${ocrResult.text}, not match`)
        }
        
    }
    console.log(`定位 "${checkText}" 失败`);
    img.recycle()
    return [0, 0]   
}


function randomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 点亮屏幕
*/
function swithcScreenOn(isTest){
    var counter = 0
    let maxIter = 20
    var status_ = 0
    while (!device.isScreenOn()){
        console.log('准备点亮屏幕');
        shell("input keyevent 26", true);
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
        device.keepScreenOn(3 * 60*1000)
        if (device.getBrightnessMode()!==0){
            device.setBrightnessMode(0)
        }
        var brightInt = !!isTest === true? 30 : 1
        if (device.getBrightness() !== brightInt){
            sleep(500)
            device.setBrightness(brightInt)
        }
        
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
    ele ? ele.click() : console.log(`无法定位 ${descText}`);
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
    console.log(`添加到购物车: ${textToClick}`);
    sleepTime = sleepTime === undefined ? 200 : sleepTime
    var ele = text(textToClick).findOne(6000);
    if (ele === null) {
        console.log("未找到文本: " + textToClick);
        sleep(sleepTime)
        return false
    } else {
        var bounds = ele.bounds(); // 获取元素的边界
        // 计算元素的中心点
        var x = bounds.centerX();
        var y = bounds.centerY();
        // 在元素中心点长按0.5秒
        toast('x:' + x + ';y: ' + y)
        press(x, y, 150);
        sleep(sleepTime); // 休眠指定时间
        return true
    }
}
;


function pressContainsSleep(textSub, sleepTime) {
    // 通过文本定位元素
    // toast(textToClick);
    sleepTime = sleepTime === undefined ? 200 : sleepTime
    var ele = textContains(textSub).findOne(4000);
    if (ele === null) {
        toast(`未找包含 "${textSub}" 文本控件`);
        sleep(sleepTime)
        return false
    } else {
        var bounds = ele.bounds(); // 获取元素的边界
        // 计算元素的中心点
        var x = bounds.centerX();
        var y = bounds.centerY();
        // 在元素中心点长按0.5秒
        toast('x:' + x + ';y: ' + y)
        press(x, y, 150);
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

function pressXY(x, y, pt, sleepTime){
    press(x, y, pt)
    sleep(sleepTime)
};

function autoSwipe(sx, sy, ex, ey, duration, sleepTime){
    // 自适应手机屏幕分辨率
    swipe(sx, sy, ex, ey, duration)
    sleep(sleepTime)
}

function clickEvent(x, y, sleepTime){
    var openRemarkShell = `
    sendevent /dev/input/event5 3 57 580
    sendevent /dev/input/event5 1 330 1
    sendevent /dev/input/event5 1 325 1
    sendevent /dev/input/event5 3 53 ${x + randomInt(-20, 20)}
    sendevent /dev/input/event5 3 54 ${y + randomInt(-10, 10)}
    sendevent /dev/input/event5 0 0 0
    sleep 0.05
    sendevent /dev/input/event5 3 57 -1
    sendevent /dev/input/event5 1 330 0
    sendevent /dev/input/event5 1 325 0
    sendevent /dev/input/event5 0 0 0
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
    pressContainsSleep: pressContainsSleep,
    getScreenImg: getScreenImg,
    ocrLoctionXY: ocrLoctionXY,
    shotPath: shotPath,
    pathMap: pathMap,
    WIDTH: WIDTH
};