const { pressXY, autoSwipe } = require("./utils");


var eles = text('待支付').findOne(1000).parent().children().find(text('余额支付'))
if (eles){
    console.log(eles[0].bounds().centerY());
    
}

// _selectCoupons(cp_)