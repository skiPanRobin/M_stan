auto();
toast('uid见剪贴板')
var api = 'https://pay.lovexiaohuli.com/ws/sendtoUid'
// var api = 'https://pay.bigdiscount.cn/ws/sendtoUid'
function getCloseTimeSec(){
    // 22:30 - 5: 00 自动关闭程序
    return [22 * 3600 + 30 * 60, 5 * 3600 + 30 *60]
}


function getCurrentTimeSec(){
    // 当前时间
    var now = new Date()
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}


/**
 * 点亮屏幕
*/
function swithcScreenOn(){
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
            console.log('无法点亮屏幕');
            break
        }
        counter ++;
        sleep(1000)
    } 
    if (device.isScreenOn()){
        console.log('正常点亮屏幕 ' + counter);
        device.keepScreenOn(60*1000)
        device.setBrightnessMode(0)
        sleep(200)
        device.setBrightness(20)
    }
    return status_
}

swithcScreenOn()
var packageName = 'com.autox.mstandauto'
var androidIdRes = shell('settings get secure android_id', true)
var androidId = androidIdRes.result
console.log("android ID: " + androidId);
const uid = $crypto.digest(androidId, "MD5", {output: 'toString'}) 
console.log('uid: ' + uid);
setClip(uid)
console.log('发送关闭MStandAuto命令, uid: ' + uid + ' android id: ' + androidId);
r = http.postJson(api, {
    "uid": uid,
    "type": "goToPay",
    "data": {
        "type": "exit",
        "payload": {}
    }
})

var data = r.body.json()
if(data['code']===200){
    sleep(3000)
} else {
    toast('请求wss关闭客户端失败!!!')
    console.log('请求wss关闭客户端失败, res: ' + JSON.stringify(data));
}
var forceRes = shell('am force-stop ' + packageName, true)
console.log('强制关闭mstandauto, code: ' + forceRes.code);
sleep(1000)
var [laterTime, earlierTime] = getCloseTimeSec()
var currentTimeSec = getCurrentTimeSec()
console.log(`currentTimeSec： ${currentTimeSec}, earlierTime： ${earlierTime}, laterTime: ${laterTime}`);
if ( currentTimeSec >= laterTime || currentTimeSec <= earlierTime ){
    toast('MStandAuto关闭, 等待定时任务重启')
} else {
    toast('MStandAuto重启')
    shell("am start -n com.autox.mstandauto/com.stardust.auojs.inrt.SplashActivity;", true)
    sleep(2000)
}
home();
sleep(300)
home();