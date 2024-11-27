


const {ocrLoctionXY, ocrClickS, pressXY, clickSleep, pressSleep, imgClips } = require("./utils");

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
var [x,y] = ocrLoctionXY(imgClips.xy咖啡类目, '面包简餐', false, 180)
console.log(x, y);
pressXY(x, y, 150, 200)
