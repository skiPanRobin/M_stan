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

var xy优惠券 = [50, 200,700, 1500]
var img = getScreenImg()
var[x, y] = ocrLoctionXY(img, xy优惠券, "单杯标杯饮品兑换券")

// var gimg = images.grayscale(img)
// var gimg = images.threshold(gimg, 140, 255, "BINARY")
// var res = paddle.ocr(img)
// for (let index = 0; index < res.length; index++) {
//     var element = res[index];
//     console.log(element.text);
    
// }

// textContains('单杯标杯饮品兑换券').findOne(2000).click()