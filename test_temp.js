const { autoSwipe,getScreenImg,ocrLoctionXY, clickEvent, pressXY} = require("./utils");

function _selectCoupons(coupons){
    var titleSub = coupons.titleSub;
    var total = coupons.total
    try {
        var eles = textContains(titleSub).findOne(100).parent().parent().children()
    } catch (error) {
        console.error(error.message);
        console.log();
        
    }
    var indexsCoupons = []
    for (let index = 0; index < eles.length; index++) {
        let element = eles[index];
        if (element.children().findOne(textContains(titleSub))){
            console.log(`${titleSub} && ${index}`);
            indexsCoupons.push(index)
        }
        if (indexsCoupons.length === total){
            break   
        }
    }
    console.log(indexsCoupons);
    var swipCnt = 0
    var couponsTotal = eles.length - 2
    for (let index = 0; index < indexsCoupons.length; index++) {
        let ic = indexsCoupons[index];
        console.log(`indexsCoupons: ${ic}; couponsTotal: ${couponsTotal}; swipCnt: ${swipCnt}`);
        if (ic + 1 > (couponsTotal - 5)){
            var last = couponsTotal - (ic + 1)
            while (ic > 5){
                ic = (ic + 1) - 5 * swipCnt
                autoSwipe(500, 2050, 510, 180, 1000,  1000)
                swipCnt = swipCnt + 1
            }
            var couponY = 1800 - last * 362
            click(500, couponY)
            console.log(`1 ** x: 500, y: ${couponY}; last: ${last}; couponsTotal: ${couponsTotal}`);
            sleep(1000)
            continue
        }
        ic = (ic + 1) - 5 * swipCnt
        while (ic > 5){
            autoSwipe(500, 2050, 510, 180, 1000, 1000)
            swipCnt = swipCnt + 1
            ic = ic - 5
            log(`: ${ic}`)
        }
        var couponY = 400 + 362 * (ic -1)
        click(500, couponY)
        console.log(`2. x: 500, y: ${couponY}; last: ${last}; couponsTotal: ${couponsTotal}`);
        sleep(1000)
    }
}


// autoSwipe(400, 1900, 400, 500, 400, 800)
// pressXY(505, 1390, 150, 500)
// // clickEvent(505, 1390, 500)
// _selectCoupons({
    
//         "total": 2,     
//         "titleSub": "单杯标杯饮品兑换券"    
    
// })