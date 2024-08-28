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
console.log(shell("am start -n com.mstand.autox/com.stardust.auojs.inrt.SplashActivity;", true));

