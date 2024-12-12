const {imgClips, getOcrObj } = require("./utils");


function ocrLongTextXY(xy, checkText, holdLimit, quality){
    holdLimit = holdLimit? holdLimit: 120
    var ocrObj = getOcrObj(xy, holdLimit, quality)
    
    for (let index = 0; index < ocrObj.length - 1 ; index++) {
        var ocrResult = ocrObj[index];
        var nextOcrRes = ocrObj[index + 1]
        if (checkText.includes(ocrResult.text)){
            if (checkText === ocrResult.text || checkText.includes(nextOcrRes.text)){  // 单行且相等 或者 两行包含则判断相等
                console.log(`定位 "${checkText}" 成功`);
                return [xy[0] + ocrResult.bounds.centerX(), xy[1] + ocrResult.bounds.centerY()]
            } else if (checkText === nextOcrRes.text){      // 下一行完全相等
                return [xy[0] + nextOcrRes.bounds.centerX(), xy[1] + nextOcrRes.bounds.centerY()]
            } else {
                console.log(`checkText: ${checkText}, ocrText: ${ocrResult.text}`);
            }
            
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${checkText}, nextOcrRes text: ${nextOcrRes.text}`)
            continue
        }
    }
    console.log(`定位 "${checkText}" 失败`);
    return [0, 0]   
}

ocrLongTextXY(imgClips.xy咖啡列表, 'M Stand 复古两面咖啡保温杯美拉德棕',110, 40)