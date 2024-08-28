auto()
/**
 * 点亮屏幕
*/
toast('uid见剪贴板')
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
var androidIdRes = shell('settings get secure android_id', true)
var androidId = androidIdRes.result
console.log("android ID: " + androidId);
const uid = $crypto.digest(androidId, "MD5", {output: 'toString'}) 
console.log('uid: ' + uid);
setClip(uid)
toast('MStandAuto重启中')
console.log('发送关闭MStandAuto命令, uid: ' + uid + ' android id: ' + androidId);
r = http.postJson('https://pay.lovexiaohuli.com/ws/sendtoUid', {
    "uid": uid,
    "type": "goToPay",
    "data": {
        "type": "exit",
        "payload": {}
    }
})

var data = r.body.json()
if(data['code']===200){
    sleep(5000)
    shell("am start -n com.autox.mstandauto/com.stardust.auojs.inrt.SplashActivity;", true)
    sleep(2000)
} else {
    toast('MStandAuto重启失败!!!')
    console.log('调用wss关闭客户端失败, res: ' + JSON.stringify(data));
}
if (currentPackage() == 'com.autox.mstandauto'){
    back();
    sleep(300)
    back();
    sleep(300)
    home();
    sleep(300)
    home();
}