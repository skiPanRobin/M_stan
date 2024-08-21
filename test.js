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

// mstandPayment(
//     payload
// )
// takeScreenShot(shotPath)
console.log(text('黑糖碧螺春拿铁').findOne(1000).text());
