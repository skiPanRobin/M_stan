// 打开调试
auto();
// const {randomInt, pressSleep} = require('./utils')

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
const {mstandSelectDrinks} = require('./mstan')

mstandSelectDrinks(
    {
        "id": "1", //订单id
        "wechatNo": 1,
        "wechatName": "阿呆的大哥",
        "appName": "M Stand",
        "city": "深圳市",
        "shopName": "深圳湾万象城店",
        "shopList": [
            {
                "category": "奶咖",
                "productName": "脏咖啡",
                "quantity": 1,
                "feature": ["减份浓度", "燕麦奶"]
            },
            {
                "category": "果咖",
                "productName": "罗望子碧螺春气泡美式",
                "quantity": 1,
                "feature": ["少冰", "少糖"]
            },
            {
                "category": "零咖特饮",
                "productName": "黑糖燕麦奶",
                "quantity": 1,
                "feature": ["少冰", "少糖"]
            }
        ],
        "notes": "不加葱姜蒜, 多放辣椒"
    }
)