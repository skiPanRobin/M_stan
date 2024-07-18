auto();


function openWechat(){
    const { actionSleep, pressSleep, autoSwipe, pressXY, clickSleep } = require('./utils')
    actionSleep(back, 50);
    actionSleep(back, 50)
    actionSleep(home, 50)
    actionSleep(home, 200)
    // 打开微信应用
    clickSleep('微信', 1000)
    // 通过文本定位并点击
    pressSleep("我", 500);
    pressSleep("设置", 500);
    autoSwipe(1037, 2068, 1024, 1037, 200, 500)
    pressSleep('切换账号', 500)
    pressSleep('阿呆的大哥', 2000)
    actionSleep(back, 500)
    pressXY(120, 2200, 200, 500);  // 点击微信中的`微信`
    autoSwipe(1024, 1037, 1037, 2568, 340, 500)
    toast("微信切换完成")
}

module.exports = {
    openWechat: openWechat
}