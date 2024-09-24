// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");


// const { takeScreenShot, shotPath } = require('./M_stan/utils')
// const {openWechat} = require('./wechat')
const {mstandSelectDrinks} = require('./mstan')
// const { pressXY, pressSleep } = require('./utils')
// var payload = {
//     "id": "1",
//     "city": "北京市",
//     // "city": "深圳市",
//     "notes": "今天七夕节",
//     "appName": "M Stand",
//     "shopList": [
//         {
//             "feature": [
//                 "大杯（热）354ml",
//                 "正常浓度",
//                 "少糖"
//             ],
//             "category": "奶咖",
//             "quantity": 1,
//             "productName": "香烤坚果拿铁"
//         }
//     ],

//     "shopName": "北京喜隆多店",
//     // "shopName": "深圳湾万象城店",
//     "wechatNo": 1,
//     "wechatName": "阿呆的大哥",
//     "orderType": "打包带走",
//     "isTest": true
// }

var  payload = {
    "id": "1230",
    "city": "杭州市",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "shopList": [
        {
            "feature": [
                "大杯（热）354ml",
                "正常浓度",
                "少糖"
            ],
            "category": "奶咖",
            "quantity": 1,
            "productName": "香烤坚果拿铁"
        }
    ],
    "shopName": "杭州来福士店",
    "wechatNo": 1,
    "orderType": "店内就餐",
    "wechatName": "阿呆的大哥"
}
// descContains('“工作微信”').findOne(100).click()
// openWechat(payload)
// mstand(payload)
mstandSelectDrinks(payload)
// pressSleep('去下单', 100)



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
// console.log(currentActivity());
// console.log(launchPackage('com.autox.startmstandauto'));
// forceStopApp('com.tencent.mm.plugin.appbrand.ui.AppBrandUI00')
// shell('am force-stop ' + 'com.tencent.mm', true)
// var packageName = 'com.autox.mstandauto'
// shell('am force-stop ' + packageName, true)
// swipe(400, 800, 410, 400, 400)
// sleep(300)
// click(ele.bounds().centerX(), ele.bounds().centerY())
// var productName = '拿铁'
// var categroy = '黑咖'

// pressSleep(categroy, 500)
// while (true){
//     var centerY = text(productName).findOne(1000).bounds().centerY()
//     console.log(centerY);
//     if (800 < centerY &&  centerY <  2000){
//         console.log(text(productName).findOne(1000).bounds().centerY());
//         pressSleep(productName)
//         break
//     } else {
//         autoSwipe(400, 1800, 400, 500, 600, 1000)
//     }
// }

// text('规格').findOne(2000)
// autoSwipe(400, 1300, 400, 500, 300, 300)
// var ele = text('标杯（热）295').findOne(100)
// pressContainsSleep('标杯（热）295')
// pressContainsSleep('加份浓度')
// pressContainsSleep('燕麦奶')
// pressSleep('加入购物车')
// function toastXY(str){
//     var ele = text(str).findOne(1000)
//     if (ele) {
//         var bounds = ele.bounds()
//         console.log(`X: ${bounds.centerX()}; Y: ${bounds.centerY()}`)
//     } else {
//         toast('定位不到: ', str)
//     }
// }


// _newWriteNotes('能下单吗')
// console.log(text('如有忌口过敏请填写到这儿').findOne(3000).click());
// toastXY('备注')
// pressSleep('去结算', 500)
// var 下单ele = text('确认下单').findOne(2000)
// if (下单ele){
//     var bounds = 下单ele.bounds()
// }
// var notes = '不加咖啡'
// if (!!notes) {
//     setClip(notes);
//     sleep(300)
//     autoSwipe(400, 1300, 400, 500, 300, 500)    // 滑动到底部
//     pressXY(700, 1950, 200, 500)                // 点击备注输入框
//     press(600, 1000, 300)                       // 点击输入法输入框
//     var finish = text('完成').findOne(5000) 
//     click(device.width/2, finish.bounds().bottom + 80)  // 点击输入法剪贴板上备注
//     sleep(200)
//     pressSleep('完成', 400)
// }

// pressXY(523, 1750, 200, 600)  // 点击备注框'保存'按钮
// pressXY(bounds.centerX(), bounds.centerY(), 200, 500)   // 点击确认下单
// pressSleep('确定门店', 500)

