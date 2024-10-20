// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");

const {openWechat} = require('./wechat')
const {mstand} = require('./mstan');
const wechat = require('./wechat');
// const { pressXY, actionSleep, autoSwipe } = require('./utils')

var payload = {
    "id": "1259",
    "city": "北京市",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "coupons": {
        "total": 3,
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
    "shopName": "北京乐成中心店",
    "wechatNo": 1,
    "orderType": "店内就餐",
    "wechatName": "New Vest"
}

console.log(openWechat(payload));
console.log(mstand(payload));

