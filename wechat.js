auto();
const { actionSleep, pressSleep, autoSwipe, pressXY, descClick,  swithcScreenOn} = require('./utils')

function _openWechat(payload){
    var status = 0
    for (let index = 0; index < 5; index++) {
        status = 0
        if (swithcScreenOn(payload.isTest) === 90) {
            // return {'status': 90, "msg": '点亮屏幕失败'}
            status = 90
        }
        actionSleep(back, 50);
        actionSleep(back, 100)
        actionSleep(home, 100)
        actionSleep(home, 500)
        // 打开微信应用
        var wechatText =  payload.wechatNo == 1? '微信' : '工作微信'
        if (desc(wechatText).findOne(2000)){
            descClick(wechatText, 500)
            break
        } else if (descContains(`“${wechatText}”`).findOne(1000)) {
            descClick(`"${wechatText}"`, 500)
        } else {
            console.error(`打开微信失败, ` + JSON.stringify(payload))
            // return {'status': 2, "msg": '打开微信失败'}
            status = 2
        }
        if (status !== 0){
            var bounds = text('微信').find()[payload.wechatName - 1].bounds()
            pressXY(bounds.centerX(), bounds.centerY(), 150, 800)
        }
        if (currentPackage() === 'com.tencent.mm'){
            status = 0
            break
        }

    }
    if (status !== 0){
        return {'status': status, "msg": status === 2? '打开微信失败': '点亮屏幕失败'}
    }
    
    // 账号切换(选择账号)
    var me = className('android.widget.TextView').text('我').findOne(5000).parent()
    if (me && me.bounds().centerX()>0 && me.bounds().centerY()>0 ){
        click(me.bounds().centerX(), me.bounds().centerY())
        sleep(200)
    } else{
        pressSleep("我", 500);
    }
    // 判断当前账号是否需要切换
    if (className('android.view.View').textContains(payload.wechatName).findOne(1000)){
        console.log(`当前账号为目标账号, 不需要切换: ${payload.wechatName}`)
        sleep(200)
    } else{
        pressSleep("设置", 500);
        autoSwipe(1037, 2068, 1024, 1037, 200, 500)
        pressSleep('切换账号', 500)
        if(!pressSleep(payload.wechatName, 500)){
            console.log('切换账号失败: ' + JSON.stringify(payload));
            return {"status": 3, "msg": "无法查找到微信名, 切换微信账号失败"}
        }
        
        // 返回
        var button返回 = className('android.widget.ImageView').desc('返回').findOne(40000)
        if (button返回 && button返回.bounds().centerX() > 0 && button返回.bounds().centerY()>0){
            click(button返回.bounds().centerX(), button返回.bounds().centerY())
            sleep(200)
        } else{
            actionSleep(back, 500)
        }
    }

    var parent微信 = className('android.widget.TextView').text('微信').findOne(20000).parent()
    if (parent微信 && parent微信.bounds().centerX() >0 && parent微信.bounds().centerY()>0) {
        click(parent微信.bounds().centerX(), parent微信.bounds().centerY())
        sleep(500)
    } else {
        pressXY(120, 2200, 200, 500);  // 点击微信中的`微信`
    }
    autoSwipe(500, 1037, 520, 2568, 300, 100)
    toast("微信切换完成")
    // 当appName为空时, 给出错误提示
    if (!payload.appName){
        return {"status": 9, "msg": "appName缺失或为空"}
    } else {
        if (text(payload.appName).findOne(2000)){
            return {"status": 0, "msg": "openWechat"}
        } else {
            return {"status": 4, "msg": "无法定位小程序,  确认微信是否操作完成"}
        }
    }
}
// 定位异常任务
function getWDesc(){
    var addMsg = ''
    try {
        text('微信').find().forEach(element => {
            addMsg = addMsg + element.contentDescription
        });
    } catch (error) {
        addMsg= error.message
    }
    console.log('addMsg: '+addMsg);
    if (addMsg == ''){
        return '未发现"微信"应用'
    }
    return addMsg
}

/**
 * @param payload -任务信息
 * status: 0 正常; 1 - 9 为微信启动异常
*/
function openWechat(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'msg': 'openWechat',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
            "shopList": payload.shopList
        }
    }
    try {
        r = _openWechat(payload)
        msg.status = r.status
        msg.msg = r.msg
    } catch (error) {
        msg.status = 1
        msg.msg = error.message
    }
    if (msg.status !== 0) {
        msg.msg = msg.msg + getWDesc()
    }
    console.log('wechat end msg : ' + JSON.stringify(msg));
    return msg
}

module.exports = {
    openWechat: openWechat
}