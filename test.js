// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");

const {openWechat} = require("./wechat")
const {mstand, mstandSelectDrinks} = require("./mstan");
const { pressXY } = require("./utils");
// const { pressXY, actionSleep, autoSwipe } = require("./utils")

var payload = {
    "id": "1259",
    "city": "北京市",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "coupons": {
        "total": 2,
        "titleSub": "单杯标杯饮品兑换券"
    },
    "shopList": [
        // {
        //     "feature": ["标杯（热）295ml", '燕麦奶', '加份浓度'],
        //     "category": "季节限定",
        //     "quantity": 2,
        //     "productName": "山野樱桃拼配澳白"
        // }
        // ,
        // {
        //     "feature": ["标杯（冷）354ml", "燕麦奶"],
        //     "category": "季节限定",
        //     "quantity": 1,
        //     "productName": "山野樱桃拼配Dirty"
        // }  
        // ,
        // {
        //     "feature": ["标杯（冷）354ml", "少冰", '加份浓度'],
        //     "category": "季节限定",
        //     "quantity": 1,
        //     "productName": "山野樱桃拼配美式"
        // }
        // ,
        // {
        //     "feature": ["标杯（冷）354ml", "少冰", '燕麦奶', '减份浓度'],
        //     "category": "季节限定",
        //     "quantity": 1,
        //     "productName": "山野樱桃拼配拿铁"
        // }
        // ,
        {
            "feature": ["标杯（冷）354ml", "少冰", '加份浓度', '少糖'],
            "category": "奶咖",
            "quantity": 1,
            "productName": "奶油话梅拿铁"
        }
        ,
        {
            "feature": ["标杯（冷）354ml", '去冰', '加份浓度', '无糖'],
            "category": "奶咖",
            "quantity": 1,
            "productName": "椰香拿铁"
        }
    
    ],
    "shopName": "北京乐成中心店",
    "wechatNo": 2,
    "orderType": "店内就餐",
    "wechatName": "C4自动下单"
}
// mstandSelectDrinks(payload)
console.log(openWechat(payload));
console.log(mstand(payload));

// mstandPayment(payload)
// _useCoupons({"total": 4, titleSub: "单杯标杯饮品兑换券"})


// var eles = textContains("单杯标杯饮品兑换券").findOne(2000).parent().children()
// eles.forEach(element => {
//     console.log(element.text(), element.bounds().width(), element.bounds().height());
//     if (element.text() == ""){
//         console.log(element.bounds().width(), element.bounds().height());
        
//     }
// });