


const { getScreenImg, pressXY } = require("./utils");


function ocrLoctionXY(img, xy, checkText, isLike){
    var clipImg = images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])
    var gimg = images.grayscale(clipImg)
    var gimg = images.threshold(gimg, 40, 255, "BINARY")
    var res = paddle.ocr(gimg)
    for (let index = 0; index < res.length; index++) {
        var ocrResult = res[index];
        if (ocrResult.text==checkText || (isLike == true && checkText.includes(ocrResult.text.substring(1, 4)))){
            console.log(`定位 "${checkText}" 成功`);
            img.recycle()
            gimg.recycle()
            return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, substring: ${ocrResult.text.substring(1, 4)}`)
        }
        
    }
    console.log(`定位 "${checkText}" 失败`);
    img.recycle()
    return [0, 0]   
}


function ocrClickS(xy, checkTextArray, isLike){
    var img = getScreenImg()
    var clipImg = images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])
    var gimg = images.grayscale(clipImg)
    var gimg = images.threshold(gimg, 60, 255, "BINARY")
    var res = paddle.ocr(gimg)
    for (let i = 0; i < checkTextArray.length; i++) {
        var checkText = checkTextArray[i];
        for (let index = 0; index < res.length; index++) {
            var ocrResult = res[index];
            if (ocrResult.text==checkText || (isLike == true && checkText.includes(ocrResult.text.substring(0, 4)))){
                console.log(`定位 "${checkText}" 成功`);
                var [cx, cy] = [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
                pressXY(cx, cy, 100, 800);  //   门店自取
                break
            } else {
                console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, substring: ${ocrResult.text.substring(0, 4)}`)
            }
            
        }
        
    }

    // console.log(`定位 "${checkText}" 失败`);
    img.recycle()
    gimg.recycle()
    return [0, 0]   
}
// var xy常用城市 = [50, 580, 900, 680] 
// var xy点击门店 = [200, 500, 450, 620]
// var xy类目 = [30, 730, 250, 2000]
// var xy咖啡列表 = [550, 730, 700, 2100]
var feat属性选择 = [50, 450, 850, 1800]


// var img = getScreenImg()
// var [cx, cy]  = ocrLoctionXY(img, feat属性选择, '加份浓度', true)
// if (cx && cy){
//     pressXY(cx, cy, 100, 500);  //   门店自取
// }

ocrClickS(feat属性选择, ['标杯（热）295ml', '减份浓度', '燕麦奶'], true)