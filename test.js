// const { clickByPartialText } = require("./utils");
const {openWechat} = require('./wechat')
const {mstandTOMenu, mstandSelectDrinks, mstandPayment}  = require('./mstan')
// 打开调试
auto();
// var parent微信 = className('android.widget.TextView').text('微信').findOne(5000).parent()
// if (parent微信) {
//     console.log(parent微信.bounds().centerX(), parent微信.bounds().centerY())
//     click(parent微信.bounds().centerX(), parent微信.bounds().centerY())
//     sleep(800)
// } 
var payload =  {
    "id": "1",
    "city": "上海市",
    "notes": "上海测试",
    "appName": "M Stand",
    "shopList": [
        {
            "feature": [
                "燕麦奶"
            ],
            "category": "奶咖",
            "quantity": 1,
            "productName": "脏咖啡"
        },
        {
            "feature": [
                "标杯（冰）354ml",
                "少冰",
                "加份浓度+¥5元",
                "标准糖"
            ],
            "category": "果咖",
            "quantity": 2,
            "productName": "野黑莓气泡美式"
        }
    ],
    "shopName": "上海BFC外滩店",
    "wechatNo": 2,
    "wechatName": "巴巴爸爸的咖啡厅",
    "orderType": "店内就餐",
    "isTest": true
}
r = openWechat(payload)
mstandTOMenu(payload)
mstandSelectDrinks(payload)
mstandPayment(payload)
// r = mstandTOMenu(payload)
// console.log(r);
// openWechat
// var ele = text( "中山市").findOne(2000)
// console.log(ele.bounds().centerX() + ', ' + ele.bounds().centerY())
// console.log(ele === null || ele.bounds().centerX() < 0 || ele.bounds().centerY() < 0 )
// ele.click()
// mstandTOMenu(payload)
// mstandSelectDrinks(payload)    
// openWechat(payload)
// mstand(payload)
// var city = "广州市"
// function _getCityInitial(cityName){
//     var cites = files.read('./cites.json')
//     return JSON.parse(cites)[cityName]
// }
// console.info(_getCityInitial('合肥市'))
// var e = text(_getCityInitial('合肥市')).findOne(2000)
// click(e.bounds().centerX(), e.bounds().centerY())
// print(text(city).findOne().bounds().centerX(), text(city).findOne().bounds().centerY(), text(city).findOne().bounds())

// addQuantities(3)
// p = className('android.widget.TextView').text('我').findOne(3000).parent()
// console.log(p.bounds().centerX(), p.bounds().centerY())
// // p.click()
// click(p.bounds().centerX(), p.bounds().centerY())

// p = className('android.widget.TextView').text('微信').findOne(3000).parent()
// console.log(p.bounds().centerX(), p.bounds().centerY())
// // p.click()
// click(p.bounds().centerX(), p.bounds().centerY())
// engines.stopAll()inputAndSubmit(shopName, '请输入门店名称', sleepTime)
// const {inputAndSubmit} = require('./utils')
// inputAndSubmit('上海陆家嘴中心店', '请输入门店名称', 2000)
// text('请输入门店名称').findOne(3000).click()
// setText('上海陆家嘴中心店')
// var shopName = '上海陆家嘴中心店'
// var bottomText = '请输入门店名称'
// function selectShop(shopName, sleepTime){
//     text('请输入门店名称').findOne(5000).click()
//     for (let index = 0; index < 4; index++) {
//         var ele = text('请输入门店名称').findOne(2000)
//         console.log('"请输入门店名称" 定位 :', !!ele)
//         if (!ele) {
//             // sleep(1500)
//             list_ele = className('android.widget.TextView').textContains(shopName).findOne(3000)
//             if (list_ele) {
//                 console.log(`店铺: ${shopName} 定位成功`)
//                 sleep(600)
//                 list_ele.click()
//                 break
//             }
//         } else {
//             console.log(`定位 "请输入门店名称", 设置门店: ${shopName}` )
//             sleep(1000)
//             text('请输入门店名称').findOne(1000).setText(shopName)
//         }
        
//     }
//     sleep(sleepTime)
// }  
// selectShop('上海陆家嘴中心店', 1200)
// text(bottomText).findOne(3000).click()
// sleep(1000)
// text(bottomText).findOne(3000).setText(shopName)
// text('请输入门店名称').findOne(3000).setText('上海陆家嘴中心店')
// className('android.widget.TextView').textContains(shopName).findOne(3000).click()
// function selectShop(shopName, sleepTime){
//     text('请输入门店名称').findOne(5000).click()
//     for (let index = 0; index < 4; index++) {
//         var ele = text(shopName).findOne(1000)
//         if (ele) {
//             sleep(sleepTime)
//             break
//         } else {
//             text('请输入门店名称').findOne(1000).setText(shopName)
//         }
        
//     }
//     sleep(sleepTime)
// }    

// selectShop('上海陆家嘴中心店', 1200);


// var ele = text('如有忌口过敏请填写到这儿').findOne(10000)
// var bds = ele.bounds()
// console.log(bds)
// function postScreenOss(filePath){
//     // var path = '"/sdcard/screenshot.png"'
//     var api = "https://sapi.lovexiaohuli.com/api/file/upload"

//     var res = http.postMultipart(api, {
//         file: open(filePath)
//     }); 
//     var body = res.body.json()
//     console.info('body: ', body);

//     console.log('body.data.online_path: ' + body.data.online_path)
//     return  body.data.online_path
// }

// var j = {"state":1,"list":[],"msg":"上传成功","data":{"path":"dev/2024-08-01/0/e9e65713082dafca1f07bb6b0b52a493.png","online_path":"https://xiaohuli-bj.oss-cn-beijing.aliyuncs.com/dev/2024-08-01/0/e9e65713082dafca1f07bb6b0b52a493.png"}}
// postScreenOss("/sdcard/screenshot.png")



// var array = desc('工作微信').find()
// for (let index = 0; index < array.length; index++) {
//     const element = array[index];
//     console.info(element.text() + 'index: ' + index)
//     element.click()
// }
// if (!requestScreenCapture()) {
//     toast("请求截图权限失败");
//     exit();
// }
// var path = '"/sdcard/screenshot.png"'
// var api = "https://sapi.lovexiaohuli.com/api/file/upload"

// var res = http.postMultipart(api, {
//     file: open("/sdcard/screenshot.png")
// });
// console.info(res.body.string());
// const {mstandSelectDrinks, mstandPayment} = require('./mstan')

// mstandSelectDrinks(
//     {
//         "id": "1", //订单id
//         "wechatNo": 1,
//         "wechatName": "阿呆的大哥",
//         "appName": "M Stand",
//         "city": "深圳市",
//         "shopName": "深圳湾万象城店",
//         "shopList": [
//             {
//                 "category": "奶咖",
//                 "productName": "脏咖啡",
//                 "quantity": 1,
//                 "feature": ["减份浓度", "燕麦奶"]
//             },
//             {
//                 "category": "果咖",
//                 "productName": "罗望子碧螺春气泡美式",
//                 "quantity": 1,
//                 "feature": ["少冰", "少糖"]
//             },
//             {
//                 "category": "零咖特饮",
//                 "productName": "黑糖燕麦奶",
//                 "quantity": 1,
//                 "feature": ["少冰", "少糖"]
//             }
//         ],
//         "notes": "不加葱姜蒜, 多放辣椒"
//     }
// )

// var ele = text('如有忌口过敏请填写到这儿').findOne(5000)
// var bds = ele.bounds()
// toast(bds.left)
// toast(bds.bottom)

// mstandPayment({"notes": "不加葱姜蒜, 多放辣椒"})
// 获取当前活动页面的类名

// 定义截图保存路径
// print(text('知道').findOne(2000))
// 打开制定app
// 定义经纬度
// // ADB命令字符串w
// let adbCommand = `adb shell am broadcast -a com.android.intent.action.SET_GPS --es latitude ${latitude} --es longitude ${longitude}`;
// console.log(adbCommand)
// // 执行ADB命令
// function executeAdbCommand(command) {
//     let result = shell(command, true);
//     if (result.code == 0) {
//         console.log("模拟位置设置成功" + result);
//     } else {
//         console.log("模拟位置设置失败") + result;
//     }
// }

// // 调用函数执行ADB命令
// executeAdbCommand(adbCommand);

