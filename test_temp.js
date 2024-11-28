


const {ocrLoctionXY, pressXY, getOcrObj, pressSleep, imgClips } = require("./utils");

var xy常用城市 = [50, 580, 900, 680] 
var xy点击门店 = [200, 500, 450, 620]
var xy类目 = [30, 730, 250, 2000]
var xy咖啡列表 = [550, 730, 700, 2100]
var xy属性选择 = [50, 450, 850, 1800]


// var [cx, cy]  = ocrLoctionXY(xy常用城市, '北京市', false)
// var [cx, cy]  = ocrLoctionXY(xy点击门店, '万科云城西里店', true)
// var [cx, cy]  = ocrLoctionXY(xy类目, '黑咖', true, 155)
// var [cx, cy]  = ocrLoctionXY(xy咖啡列表, '拿铁', false, 80)
// var [cx, cy]  = ocrLoctionXY(xy属性选择, '标杯（冷）354ml', true, 80)
// if (cx && cy){
//     pressXY(cx, cy, 100, 500);  //   门店自取
// }

// ocrClickS(xy属性选择, ['加份浓度', '少糖'], true, 80)
// pressSleep('Z', 100)
// var shopName = '世纪汇广场店'
// if (text('请输入门店名称').findOne(1000)){
//     pressSleep('请输入门店名称', 500)
//     var inputEle = text('请输入门店名称').findOne(1000)
//     inputEle? inputEle.setText(shopName) : console.log('无法定位, 重试次数: ' + index)
    
// } 

function ocrCoupons(couponText, total){
    var xy优惠券 = [350, 350, 600, 2020]
    var x点击区 = 965
    var y点击区_偏移量 = 75
    var ocrObj优惠券 = getOcrObj(xy优惠券, 100)
    for (let index = 0; index < ocrObj优惠券.length; index++) {
        var ocrResult = ocrObj优惠券[index];
        if (total <= 0 ){
            break
        }
        if (couponText.includes(ocrResult.text.substring(0, 4))){
            console.log(`定位 "${couponText}" 成功`);
            var [cx, cy] = [x点击区, xy优惠券[1] + ocrResult.bounds.centerY() + y点击区_偏移量]
            pressXY(cx, cy, 100, 1000);  //   门店自取
            --total
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${couponText}, substring: ${ocrResult.text.substring(0, 4)}`)
        }
    }
    return total
}

// var [x,y] = ocrLoctionXY(imgClips.xy咖啡类目, '面包简餐', false, 180)
// console.log(x, y);
// pressXY(x, y, 150, 200)
// var total = 10
// total = ocrCoupons('单杯标杯饮品兑换券', total)
// console.log(`total: ${total}`);

var couponString = textContains('单杯标杯饮品兑换券').findOne(3000).text()
console.log(couponString);

const regex = new RegExp(`(?=${bcouponString})`, 'g');
const matches = couponString.match(regex);
console.log(`matches: ${matches}`)