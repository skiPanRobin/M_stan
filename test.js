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

function mstandTOMenu(payload){
    return {
        status: payload
    }
}
function mstandSelectDrinks(payload){
    return {
        status: payload
    }
}
function mstandPayment(payload){
    return {
        status: payload
    }
}


function mstand(payload){
    var errorMsg;
    switch (true) {
        case (errorMsg = mstandTOMenu(payload)):
            console.log(1);
            if (errorMsg.status !== 0){
                break;                
            }
        case (errorMsg = mstandSelectDrinks(payload)):
            console.log(2);
            if (errorMsg.status !== 0){
                break;                
            }
        case (errorMsg = mstandPayment(payload)):
            console.log(3);
            if (errorMsg.status !== 0){
                break;                
            }
        default:
            break;
    }
    return errorMsg
}
console.log(mstand(2));
