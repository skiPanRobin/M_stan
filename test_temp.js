const {imgClips, getScreenImg } = require('./utils');

// !ocrLoctionXY([400, 300, 700, 500], "已下单", false, 80, 20)[0]
const CITES_LATTER_MAPPING = {
    '北京市': 'B', '成都市': 'C', '重庆市': 'C', '长沙市': 'C', '常州市': 'C', '慈溪市': 'C',
    '东莞市': 'D', '佛山市': 'F', '福州市': 'F', '广州市': 'F', '杭州市': 'F', '海口市': 'F',
    '合肥市': 'F', '嘉兴市': 'F', '金华市': 'F', '济南市': 'F', '昆山市': 'K', '昆明市': 'K',
    '宁波市': 'N', '南京市': 'N', '南昌市': 'N', '南通市': 'N', '泉州市': 'N', '青岛市': 'N',
    '上海市': 'S', '深圳市': 'S', '苏州市': 'S', '绍兴市': 'S', '三亚市': 'S', '天津市': 'T',
    '无锡市': 'W', '武汉市': 'W', '温州市': 'W', '厦门市': 'X', '西安市': 'X', '余姚市': 'Y',
    '扬州市': 'Y', '珠海市': 'Z', '中山市': 'Z', '郑州市': 'Z', '晋江市': '其他'
}

function getOcrObj(xy, holdLimit, quality) {
    var img = getScreenImg(quality)
    var gimg = images.threshold(
        images.grayscale(                                                       // 二值化
            images.clip(img, xy[0], xy[1], xy[2] - xy[0], xy[3]-xy[1])),        // 剪切
        holdLimit,                                                              // 二值化分界值
        255,                                                                    // 二值化上届
        "BINARY"
    )
    gimg.saveTo('/sdcard/DCIM/temp.jpg')
    var ocrObj = paddle.ocr(gimg, 1)
    img.recycle()
    gimg.recycle()
    return ocrObj
}

function ocrLoctionXY(xy, checkText, isLike, holdLimit, quality){ 
    holdLimit = holdLimit? holdLimit: 100
    isLike = isLike? isLike: false
    var ocrObj = getOcrObj(xy, holdLimit, quality)
    
    for (let index = 0; index < ocrObj.length; index++) {
        var ocrResult = ocrObj[index];
        // console.log(`ocrResult text: ${ocrResult.text}, checkText: ${checkText}, substring: ${ocrResult.text.substring(1, 4)}`)
        if (ocrResult.text==checkText || (isLike == true && ocrResult.text.length >= 7 && checkText.includes(ocrResult.text.substring(0, 8)))){
            console.log(`定位 "${checkText}" 成功`);
            return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, substring: ${ocrResult.text.substring(0, 8)}`)
            continue
        }
    }
    console.log(`定位 "${checkText}" 失败`);
    return [0, 0]   
}

// for (let key of Object.keys(CITES_LATTER_MAPPING)) {
//     console.log(`key: ${key}; latter: ${CITES_LATTER_MAPPING[key]}`);
    
//     var [lx, ly] = ocrLoctionXY(imgClips.xy城市开头大写, CITES_LATTER_MAPPING[key], true, 140, 40)
//     console.log(lx,ly);
//     sleep(1000)
// }

// CITES_LATTER_MAPPING.forEach(latter => {
//     console.log(latter);
    
    // var [lx, ly] = ocrLoctionXY(imgClips.xy城市开头大写, latter, true, 140, 40)
    // console.log(lx,ly);

// });

getOcrObj(imgClips.xy城市开头大写, 140, 40).forEach(element => {
    console.log(element.text);
    
});