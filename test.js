// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");

// const {openWechat} = require('./wechat')
const {mstand, _useCoupons} = require('./mstan');
const { pressXY } = require('./utils');
// const { pressXY, actionSleep, autoSwipe } = require('./utils')

var payload = {
    "id": "1259",
    "city": "北京市",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "coupons": {
        "total": 1,
        "titleSub": "单杯标杯饮品兑换券"
    },
    "shopList": [
        {
            "feature": ["标杯（冰）354ml", "正常浓度"],
            "category": "果咖",
            "quantity": 1,
            "productName": "冰摇香橙美式"
        }
        // ,
        // {
        //     "feature": ["标杯（冷）354ml", "正常浓度"],
        //     "category": "果咖",
        //     "quantity": 2,
        //     "productName": "冰摇黄杏美式"
        // }
        ,
        {
            "feature": ["标杯（冰）354ml", "正常浓度"],
            "category": "果咖",
            "quantity": 1,
            "productName": "话梅气泡美式"
        }

    ],
    "shopName": "北京乐成中心店",
    "wechatNo": 2,
    "orderType": "店内就餐",
    "wechatName": "C7自动下单"
}

// console.log(openWechat(payload));
// console.log(mstand(payload));
// mstandPayment(payload)
_useCoupons({"total": 4, titleSub: "单杯标杯饮品兑换券"})


// var eles = textContains('单杯标杯饮品兑换券').findOne(2000).parent().children()
// eles.forEach(element => {
//     console.log(element.text(), element.bounds().width(), element.bounds().height());
//     if (element.text() == ''){
//         console.log(element.bounds().width(), element.bounds().height());
        
//     }
// });