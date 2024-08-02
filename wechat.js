auto();
const { actionSleep, pressSleep, autoSwipe, pressXY, descClick, clickSleep } = require('./utils')

function openWechat(payload){
    actionSleep(back, 50);
    actionSleep(back, 100)
    actionSleep(home, 100)
    actionSleep(home, 500)
    // 打开微信应用
    var wechatText =  payload.wechatNo === 1? '微信' : '工作微信'
    descClick(wechatText, 500)
    
    // 账号切换(选择账号)
    var me = className('android.widget.TextView').text('我').findOne(5000).parent()
    if (me && me.bounds().centerX()>0 && me.bounds().centerY()>0 ){
        click(me.bounds().centerX(), me.bounds().centerY())
        sleep(200)
    } else{
        pressSleep("我", 500);
    }
    // 判断当前账号是否需要切换
    if (className('android.view.View').textContains(payload.wechatName).findOne(3000)){
        console.log(`当前账号为目标账号, 不需要切换: ${payload.wechatName}`)
        sleep(200)
    } else{
        pressSleep("设置", 500);
        autoSwipe(1037, 2068, 1024, 1037, 200, 500)
        pressSleep('切换账号', 500)
        pressSleep(payload.wechatName, 500)
        // 返回
        var button返回 = className('android.widget.ImageView').desc('返回').findOne(8000)
        if (button返回 && button返回.bounds().centerX() > 0 && button返回.bounds().centerY()>0){
            click(button返回.bounds().centerX(), button返回.bounds().centerY())
            sleep(200)
        } else{
            actionSleep(back, 500)
        }
    }

    var parent微信 = className('android.widget.TextView').text('微信').findOne(5000).parent()
    if (parent微信 && parent微信.bounds().centerX() >0 && parent微信.bounds().centerY()>0) {
        click(parent微信.bounds().centerX(), parent微信.bounds().centerY())
        sleep(500)
    } else {
        pressXY(120, 2200, 200, 500);  // 点击微信中的`微信`
    }
    autoSwipe(500, 1037, 520, 2568, 300, 100)
    toast("微信切换完成")
}

module.exports = {
    openWechat: openWechat
}