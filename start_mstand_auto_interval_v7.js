const insterval_id = setInterval(() => {
    auto();
    swithcScreenOn() 
    function _getHost(code){
        const hostMapping = {
            "love": "lovexiaohuli.com",
            "big": 'bigdiscount.cn'
        } 
        return hostMapping[code]
    }

    var host = _getHost('love')
    var apiMsg = `https://pay.${host}/ws/sendtoUid`

    /******************************************************
     * 1. lastTime 存在 且与当前时间差小于10分钟, 退出脚本不执行重启;
     * 2. 其他情况则向下执行代码。
     *      1. 读取不到lastTime
     *      2. lastTime与当前时间间隔较小
     *      3. 时间在22:00 - 05:00之间, 此期间程序会自动关闭
     * */ 

    const dirPath = '/sdcard/'
    const heartbeatFile = 'heartbeat.txt'
    var [laterTime, earlierTime] = getCloseTimeSec()
    var currentTimeSec = getCurrentTimeSec()
    console.log(`currentTimeSec： ${currentTimeSec}, earlierTime： ${earlierTime}, laterTime: ${laterTime}`);
    if ( currentTimeSec >= laterTime || currentTimeSec <= earlierTime ){
        // 22:30 - 5:30 本脚本在这直接退出
        console.log('// 21:30 - 5:30 本脚本在这直接退出');
        clearInterval(insterval_id)
        return 
    }
    try {
        var lastTime = files.read(dirPath + heartbeatFile)
    } catch (error) {
        console.error(error);
    }
    if (lastTime && ((new Date().getTime() - parseInt(lastTime)) < 5 * 60 * 1000)) {
        console.log(`最后发ping时间小于5分钟, 不往下执行重启`);
        return
    } 
    /****************************************************/

    function getCloseTimeSec(){
        // 22:30 - 5: 00 自动关闭程序
        return [21 * 3600 + 30 * 60, 5 * 3600 + 30 *60]
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
        return status_
    }

    var packageName = 'com.autox.mstandauto'
    var androidIdRes = shell('settings get secure android_id', true)
    var androidId = androidIdRes.result
    console.log("android ID: " + androidId);
    const uid = $crypto.digest(androidId, "MD5", {output: 'toString'}) 
    console.log('uid: ' + uid);
    setClip(uid)
    toast('uid见剪贴板')
    console.log('发送关闭MStandAuto命令, uid: ' + uid + ' android id: ' + androidId);
    r = http.postJson(apiMsg, {
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
}, 60 * 1000);