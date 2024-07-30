auto();
var WIDTH = 1080
var HEIGHT = 2340
var width = device.width;
var height = device.height;
toast('width: ' + width + 'height: ' + height)

function randomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
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
    toast(descText);
    desc(descText).findOne().click()
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
    toast(textToClick);
    var ele = text(textToClick).findOne(8000);
    if (ele === null) {
        toast("未找到文本: " + textToClick);
        sleep(1000)
    } else {
        if (ele.clickable) {
            var bounds = ele.bounds(); // 获取元素的边界
            // 计算元素的中心点
            var x = bounds.centerX();
            var y = bounds.centerY();
            // 在元素中心点长按0.5秒
            press(x, y, 100);
            sleep(sleepTime); // 休眠指定时间
        } else {
            toast(textToClick + '->元素不可点击')
        }
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
    inputField.click()
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
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 486
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(-10, 10)}
    sendevent /dev/input/event4 3 54 ${y + randomInt(-15, 15)}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 -1
    sendevent /dev/input/event4 1 330 0
    sendevent /dev/input/event4 1 325 0
    sleep ${randomInt(10, 20)/100}
    sendevent /dev/input/event4 0 0 0
    sleep ${sleepTime/1000 + randomInt(50, 60)/100}
    exit
    `
    shell(openRemarkShell, true)
}

/**
 * 截图函数
*@param {string} savePath   - 保存路径
*/
function takeScreenshot(savePath) {
    let result = shell("screencap -p " + savePath, true);
    if (result.code == 0) {
        console.log("截图成功，保存路径：" + savePath);
    } else {
        console.log("截图失败");
    }
    sleep(500)
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
    actionSleep(back, 200)
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
    takeScreenshot: takeScreenshot
};