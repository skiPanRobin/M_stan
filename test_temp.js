// auto.waitFor();
// // images.requestScreenCapture()
// const {takeScreenShot} = require('./utils')
// var xy门店自取 = [190, 1120, 450 , 1230]
// var ex异常判断 = [320, 700, 800, 1600]
// // var xy首页 = [130, 2000, 250, 2200]
// function getScreenImg(){
//     var path = '/sdcard/DCIM/test.png'
//     takeScreenShot(path)
//     sleep(1000)
//     return images.read(path)
// }


// function ocrLoctionXY(img, xy, checkText){

//     var clipImg = images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])
    
    
//     var gimg = images.grayscale(clipImg)
//     // console.log(1);
//     var gimg = images.threshold(gimg, 140, 255, "BINARY")
//     // console.log(2)
//     var res = paddle.ocr(clipImg)
//     console.log(3)
//     for (let index = 0; index < res.length; index++) {
//         const ocrResult = res[index];
//         if (ocrResult.text==checkText){
//             console.log(`定位 "${checkText}" 成功`);
//             return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
//         }
        
//     }
//     console.log(`定位 "${checkText}" 失败`);
//     return [0, 0]   
// }
// var img = getScreenImg()
// var [cx, cy]  = ocrLoctionXY(img, xy门店自取, '门店自取')
// // var [cx, cy]  = ocrLoctionXY(img, xy首页, '首页')
// console.log(`cx: ${cx}, cy:${cy}`);
// // click(cx, cy)
// // img.recycle()
var total = 2
var select = 0
var eles = text('确定').findOne(100).parent().children()
console.log(eles.length);

for (let index = 0; index < eles.length && select <= total; index++) {

    var element = eles[index];
    console.log(!! element.children().findOne(textContains('单杯标杯饮品兑换券')));
    
    if (!! element.children().findOne(textContains('单杯标杯饮品兑换券'))){
        click(element.bounds().centerX(), element.bounds().centerY())   
        // sleep(600)
        console.log(`${element.bounds().centerX()}` + ', '+`${element.bounds().centerY()}`);
        sleep(1000)
        select ++ 
    }
    // log(index + eles.length + total)
}

;
