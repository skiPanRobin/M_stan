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
const imgClips = {
    'xy同意协议': [350,  1350, 750, 1750],
    'xy门店自取': [190, 1120, 450 , 1230],
    'xy常用城市': [50, 580, 900, 680],
    'xy城市开头大写': [950, 400, 1070, 1700],
    'xy城市列表': [0, 150, 200, 2250],
    'xy门店选择': [200, 500, 450, 620],
    'xy咖啡类目' :[30, 730, 250, 2000],
    'xy咖啡列表': [550, 730, 1000, 1950],
    'xy咖啡属性_温度': [50, 450, 750, 1450],    // 选择咖啡温度
    'xy咖啡属性_其他': [50, 700, 950, 1950],    // 剔除温度选择
    'xy清空购物车': [770, 1900, 1000, 2050]
}
const CITES_LATTER_MAPPING = {
    '北京市': 'B', '成都市': 'C', '重庆市': 'C', '长沙市': 'C', '常州市': 'C', '慈溪市': 'C',
    '东莞市': 'D', '佛山市': 'F', '福州市': 'F', '广州市': 'F', '杭州市': 'F', '海口市': 'F',
    '合肥市': 'F', '嘉兴市': 'F', '金华市': 'F', '济南市': 'F', '昆山市': 'K', '昆明市': 'K',
    '宁波市': 'N', '南京市': 'N', '南昌市': 'N', '南通市': 'N', '泉州市': 'N', '青岛市': 'N',
    '上海市': 'S', '深圳市': 'S', '苏州市': 'S', '绍兴市': 'S', '三亚市': 'S', '天津市': 'T',
    '无锡市': 'W', '武汉市': 'W', '温州市': 'W', '厦门市': 'X', '西安市': 'X', '余姚市': 'Y',
    '扬州市': 'Y', '珠海市': 'Z', '中山市': 'Z', '郑州市': 'Z', '晋江市': '其他'}

function getCityLatter(cityName){
    return CITES_LATTER_MAPPING[cityName]
}


/**
 * 
 * @param {number} quality -图片质量 0 - 100
 * @returns 
 */
function getScreenImg(quality){
    takeScreenShot(ocrImgPath)
    quality = quality? quality: 20
    var img = images.read(ocrImgPath)
    if (quality !== 100){
        images.save(img, ocrImgPath, 'jpg', quality)
        img.recycle()
        img = images.read(ocrImgPath)
    }
    return img
}

function getOcrObj(xy, holdLimit, quality) {
    var img = getScreenImg(quality)
    var gimg = images.threshold(
        images.grayscale(                                                       // 二值化
            images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])),        // 剪切
        holdLimit,                                                              // 二值化分界值
        255,                                                                    // 二值化上届
        "BINARY"
    )
    gimg.saveTo('/sdcard/DCIM/temp.jpg')
    var ocrObj = paddle.ocr(gimg, 1)
    img.recycle()
    gimg.recycle()
    return ocrObj
}

/**
 * 
 * @param {*} xy                - 选定图片区域的左上/右下坐标 [x1, y1, x2, y2]
 * @param {string} checkText    - 检测的文字
 * @param {boolean} isLike      - 是否模糊匹配, 默认: 否
 * @param {number} holdLimit    - 二值化分界值, 默认: 100
 * @param {number} quality      - 图片质量, 默认 10, 传值范围0-100
 * @returns 
 */
function ocrLoctionXY(xy, checkText, isLike, holdLimit, quality){
    holdLimit = holdLimit? holdLimit: 120
    isLike = isLike? isLike: false
    var ocrObj = getOcrObj(xy, holdLimit, quality)
    
    for (let index = 0; index < ocrObj.length; index++) {
        var ocrResult = ocrObj[index];
        // console.log(`ocrResult text: ${ocrResult.text}, checkText: ${checkText}, substring: ${ocrResult.text.substring(1, 4)}`)
        if (ocrResult.text==checkText || (isLike == true && ocrResult.text.length >= 7 && checkText.includes(ocrResult.text.substring(0, 8)))){
            console.log(`定位 "${checkText}" 成功`);
            return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, substring: ${ocrResult.text.substring(0, 8)}`)
            continue
        }
    }
    console.log(`定位 "${checkText}" 失败`);
    return [0, 0]   
}


function ocrClickS(xy, checkTextArray, isLike, holdLimit, sleep){
    holdLimit = holdLimit? holdLimit: 60
    isLike = isLike? isLike: false
    sleep = sleep? sleep: 300
    var ocrObj = getOcrObj(xy, holdLimit)

    for (let i = 0; i < checkTextArray.length; i++) {
        var checkText = checkTextArray[i];
        var ocrSeccess = false
        for (let index = 0; index < ocrObj.length; index++) {
            var ocrResult = ocrObj[index];
            if (ocrResult.text==checkText || (isLike == true && checkText.includes(ocrResult.text.substring(0, 4)))){
                console.log(`定位 "${checkText}" 成功`);
                var [cx, cy] = [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
                pressXY(cx, cy, 100, sleep);  //   门店自取
                ocrSeccess = true
                break
            } else {
                console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, substring: ${ocrResult.text.substring(0, 4)}`)
            }
        }   
        if (ocrSeccess === false) { // 无法定位 checkText 字符串
            return checkText
        }
    }
    return true
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
    sleep(100)
    var result = shell("screencap -p " + savePath, true);
    if (result.code == 0) {
        console.log("截图成功，保存路径：" + savePath);
    } else {
        console.log("截图失败");
    }
    sleep(300)
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
    ocrClickS: ocrClickS,
    getOcrObj: getOcrObj,
    getCityLatter: getCityLatter,
    imgClips: imgClips,
    shotPath: shotPath,
    pathMap: pathMap,
    WIDTH: WIDTH
};