// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");


// const { takeScreenShot, shotPath } = require('./M_stan/utils')
const {openWechat} = require('./wechat')
const {mstand} = require('./mstan')
// const { pressXY, actionSleep, autoSwipe } = require('./utils')
const { pressXY, pressSleep } = require('./utils')
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

// var  payload = {
//     "id": "1230",
//     "city": "深圳市",
//     "notes": "多加点胡椒",
//     "isTest": true,
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
//     "coupons": {
//         "total": 1,     // INT ; 默认值 0 不适用优惠券, 1 使用1张...
//         "titleSub": "单杯标杯饮品兑换券"    // 优惠券标题
//     },
//     "shopName": "深圳湾万象城店",
//     "wechatNo": 1,
//     "orderType": "店内就餐",
//     "wechatName": "阿呆的大哥"
// }

var payload = {
    "id": "1259",
    "city": "深圳市",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "coupons": {
        "total": 2,
        "titleSub": "单杯标杯饮品兑换券"
    },
    "shopList": [
        {
            "feature": ["标杯（冷）354ml", "正常浓度"],
            "category": "果咖",
            "quantity": 1,
            "productName": "冰摇香橙美式"
        },
        {
            "feature": ["标杯（冷）354ml", "正常浓度"],
            "category": "果咖",
            "quantity": 1,
            "productName": "冰摇黄杏美式"
        },
        {
            "feature": ["标杯（冷）354ml", "正常浓度"],
            "category": "果咖",
            "quantity": 1,
            "productName": "话梅气泡美式"
        }

    ],
    "shopName": "深圳东海缤纷天地店",
    "wechatNo": 1,
    "orderType": "店内就餐",
    "wechatName": "阿呆的大哥"
}
// var shopName = '上海世纪汇广场店'
// pressSleep('请输入门店名称', 500)
// var inputEle = text('请输入门店名称').findOne(1000)
// inputEle? inputEle.setText(shopName) : console.log('无法定位, 重试次数: ' + index)
// var ele = textContains(shopName).findOne(500)
// console.log(ele.bounds().centerY());

console.log(openWechat(payload));

console.log(mstand(payload));

// auto.waitFor();
// images.requestScreenCapture()
// var xy门店自取 = [190, 1120, 450 , 1230]
// var ex异常判断 = [320, 700, 800, 1600]

// function ocrLoctionXY(img, xy, checkText){

//     var clipImg = images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])
//     var gimg = images.grayscale(clipImg)
//     var gimg = images.threshold(gimg, 100, 255, "BINARY")
//     var res = paddle.ocr(gimg)
//     for (let index = 0; index < res.length; index++) {
//         const ocrResult = res[index];
//         if (ocrResult.text==checkText){
//             console.log(`定位 "${checkText}" 成功`);
//             return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
//         }
//     }
//     console.log(`定位 "${checkText}" 失败`);
    
// }
// var img = images.captureScreen()
// var [cx, cy]  = ocrLoctionXY(img, xy门店自取, '门店自取')
// console.log(`cx: ${cx}, cy:${cy}`);
// click(cx, cy)
