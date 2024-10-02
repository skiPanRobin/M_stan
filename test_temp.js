const { autoSwipe,getScreenImg,ocrLoctionXY } = require("./utils");

function test01(total){
    var select = 0
    var eles = text('确定').findOne(100).parent().children()
    console.log(eles.length);
    for (let index = 0; index < eles.length && select < total; index++) {
        var element = eles[index];
        // console.log(!! element.children().findOne(textContains('单杯标杯饮品兑换券')));
        if (!! element.children().findOne(textContains('单杯标杯饮品兑换券'))){
            for (let j = 0; j < 4; j++) {
                if ( element.bounds().centerY() > 0 && element.bounds().centerY() < 2050 ){
                    click(element.bounds().centerX(), element.bounds().centerY())   
                    console.log(`${element.bounds().centerX()}` + ', '+`${element.bounds().centerY()}`);
                    sleep(1000)
                    select ++ 
                    break
                } else if (element.bounds().centerY() > 2050){
                    autoSwipe(511, 1702, 529, 530, 500, 1000)
                    eles = text('确定').findOne(100).parent().children()
                    element = eles[index];
                    continue
                } else if(element.bounds().centerY() < 0){
                    autoSwipe(511, 530, 529, 1702, 500, 1000)
                    eles = text('确定').findOne(100).parent().children()
                    element = eles[index];
                    continue
                }
            }
        }
    }
};




// var gimg = images.grayscale(img)
// var gimg = images.threshold(gimg, 140, 255, "BINARY")
// var res = paddle.ocr(img)
// for (let index = 0; index < res.length; index++) {
//     var element = res[index];
//     console.log(element.text);

// }

function test(){
    var  eles = elesTextContains('单杯标杯饮品兑换券').findOne(2000)
    if(eles){
        var coupanEles = eles.parent().parent().children()
        coupanEles.forEach(element => {
            pass
        });
    }

}

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
                autoSwipe(500, 2050, 510, 180, 1000,  500)
                swipCnt = swipCnt + 1
            }
            var couponY = 1800 - last * 362
            click(500, couponY)
            console.log(`1 ** x: 500, y: ${couponY}; last: ${last}; couponsTotal: ${couponsTotal}`);
            sleep(2000)
            continue
        }
        ic = (ic + 1) - 5 * swipCnt
        while (ic > 5){l
            autoSwipe(500, 2050, 510, 180, 1000,  500)
            sleep(1000)
            swipCnt = swipCnt + 1
            ic = ic - 5
            log(`: ${ic}`)
        }
        var couponY = 400 + 362 * (ic -1)
        click(500, couponY)
        console.log(`2. x: 500, y: ${couponY}; last: ${last}; couponsTotal: ${couponsTotal}`);
        sleep(2000)
    }
}




autoSwipe(500, 2050, 510, 180, 1000,  500)