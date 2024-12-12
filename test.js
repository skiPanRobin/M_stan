// const { autoSwipe, pressSleep, clickEvent, pressContainsSleep, pressXY } = require("./utils");

const {openWechat} = require("./wechat")
const {mstand, mstandTOMenu, mstandSelectDrinks} = require("./mstan");
const { pressXY } = require("./utils");
// const { pressXY, actionSleep, autoSwipe } = require("./utils")

var payload = {
    "id": "1259",
    "notes": "",
    "isTest": true,
    "appName": "M Stand",
    "coupons": {
        "total": 1,
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
        // {
        //     "feature": ['一份', '经典拼配', '200ml', '燕麦奶'],
        //     "category": "奶咖",
        //     "quantity": 1,
        //     "productName": "脏咖啡"
        // }
        // ,
        {
            "feature": [],
            "category": "面包简餐", 
            "quantity": 1,
            "productName": "辛香肌肉大米法棍"
        },
        {
            "feature": [],
            "category": "潮流周边", 
            "quantity": 1,
            "productName": "M stand复古亮面咖啡保温杯原力蓝"
        }
    
    ],
    "city": "北京市",
    "shopName": "北京乐成中心店",
    "wechatNo": 1,
    "orderType": "店内就餐",
    "wechatName": "阿呆的大哥"
}

// const CITES_LATTER_MAPPING = {
//     '北京市': 'B', '成都市': 'C', '重庆市': 'C', '长沙市': 'C', '常州市': 'C', '慈溪市': 'C',
//     '东莞市': 'D', '佛山市': 'F', '福州市': 'F', '广州市': 'F', '杭州市': 'F', '海口市': 'F',
//     '合肥市': 'F', '嘉兴市': 'F', '金华市': 'F', '济南市': 'F', '昆山市': 'K', '昆明市': 'K',
//     '宁波市': 'N', '南京市': 'N', '南昌市': 'N', '南通市': 'N', '泉州市': 'N', '青岛市': 'N',
//     '上海市': 'S', '深圳市': 'S', '苏州市': 'S', '绍兴市': 'S', '三亚市': 'S', '天津市': 'T',
//     '无锡市': 'W', '武汉市': 'W', '温州市': 'W', '厦门市': 'X', '西安市': 'X', '余姚市': 'Y',
//     '扬州市': 'Y', '珠海市': 'Z', '中山市': 'Z', '郑州市': 'Z', '晋江市': '其他'}

// mstandTOMenu(payload)
console.log(openWechat(payload));
console.log(mstand(payload));

// console.log(mstandTOMenu(payload))
// mstandPayment(payload)
// _useCoupons({"total": 4, titleSub: "单杯标杯饮品兑换券"})


// var eles = textContains("单杯标杯饮品兑换券").findOne(2000).parent().children()
// eles.forEach(element => {
//     console.log(element.text(), element.bounds().width(), element.bounds().height());
//     if (element.text() == ""){
//         console.log(element.bounds().width(), element.bounds().height());
        
//     }
// });