// const { descClick } = require("./utils");

// const { takeScreenShot, shotPath } = require('./M_stan/utils')
var payload = {
    "id": "1",
    "city": "北京市",
    "notes": "今天七夕节",
    "appName": "M Stand",
    "shopList": [
        {
            "feature": [
                "标杯（冷）354ml",
                "加份浓度",
                "少冰",
                "少糖"
            ],
            "category": "奶咖",
            "quantity": 1,
            "productName": "椰香拿铁"
        }
    ],
    "shopName": "北京喜隆多店",
    "wechatNo": 1,
    "wechatName": "巴巴爸爸的咖啡厅",
    "orderType": "打包带走",
    "isTest": true
}
// console.log(device.getIMEI());
// console.log(shell("service call iphonesubinfo 1", true));



// console.log(getAppName('com.mstand.autox'));
// console.log(getPackageName('微信'))

// 获取 mainActivity
// console.log(shell("dumpsys package com.mstand.autox| grep -A 1 MAIN", true));
// 使用shell启动应用
// console.log(shell("am start -n com.mstand.autox/com.stardust.auojs.inrt.SplashActivity;", true));

// console.log(currentPackage() === 'com.tencent.mm')
// app.launchPackage('com.tencent.mm')

// var shotPath = "/sdcard/Pictures/screenshot.png";
// function takeScreenShot() {
//     sleep(200)
//     var result = shell("screencap -p " + shotPath, true);
//     if (result.code == 0) {
//         console.log("截图成功，保存路径：" + shotPath);
//     } else {
//         console.log("截图失败");
//     }
// };
// takeScreenShot()
// console.log(text('自提').findOne(100).bounds().centerX());
// if ((!!text('确认下单').findOne(2000) === false) && (!!text('去结算').findOne(1000) === false)){
//     descClick('返回', 100)
//     if (text('去结算').findOne(2000)){
//         sleep(200)
//         text('去结算').findOne(2000).click()
//     } else {
//         throw new Error('无法定位确认下单, 点击返回后, 无法定位去结算')
//     }

// }currentPackage() ==  'com.autox.mstandauto'
// console.log(currentPackage());
// home()
// console.log(currentPackage());
console.log(launchPackage('com.autox.startmstandauto'));

