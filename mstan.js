const {
    pressSleep, pressXY, autoSwipe, actionSleep, isNumeric, isExists, WIDTH, randomInt, descClick,
    ocrLoctionXY, ocrClickS, getOcrObj, imgClips, getCityLatter, ocrLongTextXY,
    takeScreenShot

} = require('./utils')

function _textClickEvent(textContent, sleepTime){
    console.info('textContent: ' + textContent)
    var ele = text(textContent).findOne(5000)
    if (!ele) {
        console.warn('缺少选项: ' + textContent)
    } else {
        var x = ele.bounds().centerX() 
        var y = ele.bounds().centerY() 
        pressXY(x, y, 200, sleepTime)
    }
    return !ele ? false : true
}

function _ocrCoupons(couponText, total, tailCoupons){
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
            if (tailCoupons == undefined){
                pressXY(cx, cy, 100, 1000);  //   门店自取
            } else if(cy > 2000 - tailCoupons * 400) {
                pressXY(cx, cy, 100, 1000);  //   门店自取
            }
            
            --total
        } else {
            console.log(`ocrResult text: ${ocrResult.text}, not match: ${couponText}, substring: ${ocrResult.text.substring(0, 4)}`)
        }
    }
    return total
}

function _selectCoupons(coupons, userfulCoupons){
    var titleSub = coupons.titleSub;
    var total = coupons.total
    var tailCoupons = userfulCoupons % 5
    sleep(800)
    console.log(`需使用: ${total}; 总计: ${userfulCoupons}, 需翻页次数: ${Math.floor(userfulCoupons/5)}`);
    for (let index = 0; index < Math.floor(userfulCoupons/5); index++) {
        total = _ocrCoupons(titleSub, total)    // 选择优惠券
        if (total<=0){
            return
        } else {
            autoSwipe(500, 1900, 502, 400, 600, 1000)
        }
    }
    if (total>0 && userfulCoupons <= 5) {
        _ocrCoupons(titleSub, total)
    }
    if (total > 0 && userfulCoupons > 5 && tailCoupons > 0){
        _ocrCoupons(titleSub, total, tailCoupons)
    }
}

function _checkUpdateApp(whileCnt){
    if(text('小程序更新提示').findOnce()){
        console.log('小程序更新中...')
        var button确定 = className('android.widget.Button').text('确定').findOne(500)
        if (button确定){
            click(button确定.bounds().centerX(), button确定.bounds().centerY())
        } else {
            click(777, 1310)
        }
        var button知道了 = className('android.widget.Button').text('知道了').findOne(2000)
        if (button知道了){
            click(button知道了.bounds().centerX(), button知道了.bounds().centerY())
        } else {
            click(555, 1280)
        }
    } else {
        console.log('不需要跟新小程序');
    } 
    if (whileCnt>=10){
        // pressSleep('同意')
        pressXY(306, 1623, 200, 1000)
    }
}

/**
 * @param quantity -饮料数量
*/
function _addQuantities(quantity){
    if (quantity<=1) {
        return
    }
    var siblings = text('¥').findOne(5000).parent().children()
    for (let index = 0; index < siblings.length; index++) {
        var element = siblings[index];
        // console.log(element.text())
        if (element.text() === '加入购物车'){
            var currentQuantity = parseInt(siblings[index-2].text())
            var addQuantity = quantity - currentQuantity
            var addElement = siblings[index-1]
            var subElement = siblings[index-3]
            if (addQuantity > 0){
                for (let index = 0; index < addQuantity; index++) {
                    click(addElement.bounds().centerX(), addElement.bounds().centerY())
                    sleep(300)
                }
            } else if(addQuantity < 0){
                for (let index = 0; index > addQuantity; index--) {
                    click(subElement.bounds().centerX(), subElement.bounds().centerY())
                    sleep(300)
                }
            }
        }
    }
    sleep(500)
}

/**
 * 清空购物车
*/
function _clearShopCar(){
    console.log('准备清空购物车...');
    var 已选购 =  textMatches(/^[已未]选购\d{0,2}[件]{0,1}商品$/).findOne(2000)
    var b自提 = text('自提').findOne(2000).bounds()
    if (!已选购){ return {"status": 0, "msg": ""}}
    var b已选购 = 已选购.bounds()
    pressXY(b已选购.centerX(), b已选购.centerY(), 150, 700)
    pressXY(b自提.centerX(), b自提.centerY(), 150, 600)
    pressXY(b已选购.centerX(), b已选购.centerY(), 150, 800)
    var cntClear = 13
    while (textContains('最多可添加').findOne(300)){
        var ele最多 = textContains('最多可添加').findOne(300)
        if (!ele最多){break}
        var ele = ele最多.parent().children()[3].children()[0]
        var children = ele.children()
        if (children.length == 0){
            // 商品多余两种时, for循环可能无法删除购物车种商品, 添加如下方法
            pressXY(843, 1993, 150, 800)
            continue   
        }
        for (let index = 0; index < children.length; index++) {
            var element = children[index];
            if (!!element && isNumeric(element.text())) {
                // console.log(`杯数 ${element.text()}, 下标: ${index}`);
                pressXY(children[index - 1].bounds().centerX(), children[index - 1].bounds().centerY(), 150, 200)
                break
            } 
        }
        sleep(600)
        cntClear --
        if (cntClear <= 0 ){break}
    }

    return {'status': cntClear > 0 ? 0 : 13, 'msg': '清空购物车失败, 请人工检查'}
}
function _toPayBottom(){
    sleep(1000)
    for (let index = 0; index < 3; index++) {
        autoSwipe(400, 1900, 400, 300, 400, 800)    // 滑动到底部
        var ele订单 = text('订单备注').findOne(1000)
        if (!!ele订单 && ele订单.bounds().centerY() > 0 && ele订单.bounds().centerY() < 2100) {
            break
        } else {
            console.log(`订单按钮未出现`);
        }
        
    }
    
}
/**
 * 选择优惠券
 * @param {Object} coupons          - json对象
 * @param {number} coupons.total    - 使用优惠券张数
 * @param {string} coupons.titleSub - 所使用优惠券的标题
*/
function _useCoupons(coupons){
    if (!!coupons === false){
        console.error('缺少参数 coupons')
        return
    }
    var total = coupons.total ? coupons.total: 0
    var titleSub = coupons.titleSub ? coupons.titleSub : '单杯标杯饮品兑换券'
    console.log(titleSub + total);
    if (!!total === false){
        console.log('不使用优惠券');
        return 
    } else {
        console.log(`尝试使用 ${total} 张 "${titleSub}" 优惠券`);
    }
    var couponsEle = textContains('张可用').findOne(500)
    if(couponsEle){
        var userfulCoupons = parseInt(couponsEle.text())
        if(userfulCoupons > 0){    
            console.log(`${userfulCoupons}张可用`);
        } else {
            console.log('无优惠券可以使用');
            return 
        }
    } else {
        console.log('无优惠券可以使用');
        return false
    }
    var isSelected = false
    for (let index = 0; index < 3; index++) {
        pressXY(couponsEle.bounds().centerX(), couponsEle.bounds().centerY(), 200, 800)
        if(textContains(titleSub).findOne(4000)){
            _selectCoupons(coupons, userfulCoupons)
            isSelected = true
        } else {
            console.log('没有相关优惠券: ' + titleSub);
        }
        actionSleep(back, 500)
        if (isSelected === true){
            break
        }
    }

}

function mstandTOMenu(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'msg': 'selectShop',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
            "shopList": payload.shopList
        }
    }
    function selectCity(cityName, sleepTime){
        if (cityName === '上海市'){
            // 默认城市为上海市
            return true
        }
        pressSleep('上海市', 500)
        var [x, y] = ocrLoctionXY(imgClips.xy常用城市, cityName)
        if (x > 0){
            pressXY(x, y, 150, 500)
            return
        } else {
            var latter = getCityLatter(cityName)
            if (['B', 'C', 'D'].includes(latter)) {
                console.log('直接通过"xy城市列表"识别城市名');
            }  else {
                var [lx, ly] = ocrLoctionXY(imgClips.xy城市开头大写, latter , false, 70, 60)
                if (lx ==0){
                    console.error(`无法定位城市, latter: ${latter} 定位失败`);
                    throw new Error(`无法定位城市, latter: ${latter} 定位失败`);
                } else {
                    pressXY(lx, ly, 150, 500)
                }
            }
            var [lx, ly] = ocrLoctionXY(imgClips.xy城市列表, cityName)
            if (lx == 0){
                throw new Error(`无法定位城市, 城市名: ${cityName} 定位失败`);
            } else {
                pressXY(lx, ly, 150, 500)
                return
            }
        }
    }
    
    function selectShop(shopName){
        if (!text('请输入门店名称').findOne(5000)){
            msg.status = 11
            msg.msg = '无法定位门店输入框'
            return false
        } 
        if (!!shopName === false){
            msg.status = 12
            msg.msg = `shopName : ${shopName}`
            return 
        }
        for (let index = 0; index < 8; index++) {
            var ele = text(shopName).findOne(1000)
            if (ele) {
                var shopEle = className('android.widget.TextView').text(shopName).findOne(3000)
                if (shopEle) {
                    click(shopEle.bounds().centerX(), shopEle.bounds().centerY())
                    break
                } else {
                    console.log('无法定位商店, 重试次数: ' + index);  
                }                
            } else {
                if (text('请输入门店名称').findOne(1000)){
                    pressSleep('请输入门店名称', 500)
                    var inputEle = text('请输入门店名称').findOne(1000)
                    inputEle? inputEle.setText(shopName) : console.log('无法定位, 重试次数: ' + index)
                } 
            }
        }
        console.log('完成选择');
        if (!text('自提').findOne(8000)) {
            msg.status = 12
            msg.msg = `无法定位到门店: ${shopName}`
            return false 
        } else {
            return true
        }
    }    
    pressSleep(payload.appName, 200)
    text('首页').findOne(9000)
    var currentStep = 1
    var whileCnt = 0
    var toShopCnt = 0
    // 网络问题可能导致页面无法加载
    var xy门店自取 = imgClips.xy门店自取
    while (currentStep < 3) {
        console.log('currentStep: ' + currentStep);
        if (toShopCnt > 3) {
            throw new Error('无法到达"选择城市"界面,请人工处理')
        } else {
            toShopCnt ++
        }
        switch (currentStep){
            case 1:
                whileCnt = 0
                while (!text("手动选择").findOne(500)){
                    pressXY(300, 300, 150, 500)    //  消除弹窗
                    pressXY(300, 300, 150, 500)    //  消除弹窗
                    var [cx, cy]  = ocrLoctionXY(xy门店自取, '门店自取')
                    if (cx && cy){
                        pressXY(cx, cy, 150, 500);  //   点击 "门店自取" 跳转到 "手动选择"
                    } else {
                        // 没有识别到 '门店自取', 识别弹窗中包含"同意" 并点击
                        var [tx, ty]  = ocrLoctionXY(imgClips.xy同意协议, '同意并继续', true, 100, 20)
                        if (tx && ty){
                            pressXY(tx, ty, 150, 500)
                        } else {
                            console.log('没有定位到"同意协议弹窗"');
                        }
                    }
                    whileCnt++
                    if (whileCnt >= 5) {
                        break
                    }
                }
                if(_checkUpdateApp(whileCnt) === true){
                    if (!text('首页').findOne(10000)){
                        throw new Error('更新小程序出错,请人工确认')
                    }
                }else if(text("手动选择").findOne(400)){
                    currentStep = 2
                }
                break
            case 2: 
                if (text('选择门店').findOne(1000)){
                    // 页面可能会直接跳转到选择城市导致错误
                    toast('定位到 "选择门店"')
                    actionSleep(back, 500)
                }
                whileCnt = 0
                while (!text('选择门店').findOne(200)) {
                    if (text('手动选择').findOne(500)){
                        toast("点击手动选择")
                        pressSleep('手动选择', 300)
                    } else {
                        toast(`无法定位: 手动选择`)
                    }                    
                    sleep(500)
                    whileCnt++
                    if (whileCnt >= 5) {
                        break
                    }
                }
                if (whileCnt >= 5){
                    currentStep = 1  // 退回到case 1
                    actionSleep(back, 1000)
                } else {
                    currentStep = 3
                    console.log('break currentStep: ' + currentStep);
                } 
                break
        }
    }
    // pressSleep('手动选择', 1500)
    switch (true) {
        case (selectCity(payload.city, 500) === false):
            break;
        case (selectShop(payload.shopName) === false):
            break;
        default:
            break;
    }
    console.log('去下单...');
    return msg
}

function mstandSelectDrinks(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'msg': 'selectDrinks',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
            "shopList": payload.shopList,
            "shopFailList": []
        }
    }
    function toItemDetail(item){
        console.log('toItemDetail');
        console.log(item.category + '==>' + item.productName)
        for (let i = 0; i < 3; i++) {
            var [categoryX, categoryY] = ocrLoctionXY(imgClips.xy咖啡类目, item.category, false, 180)
            if (categoryX == 0){
                var [x果咖, y果咖] = ocrLoctionXY(imgClips.xy咖啡类目, '果咖', false, 180)
                pressXY(x果咖, y果咖, 150, 800)
            } else  {
                pressXY(categoryX, categoryY, 150, 800)
                break
            }
            if (i >= 2){
                throw new Error(`无法定位到类目: ${item.category}`)   
            }
        }
            
        
        swipTimes = 10
        while (!!swipTimes){
            var productName = item.productName.replace(/\s+/g, "")
            if (item.productName.length <= 13){
                var [productX, productY] = ocrLoctionXY(imgClips.xy咖啡列表, productName, true, 60)
            } else {
                var [productX, productY] = ocrLongTextXY(imgClips.xy咖啡列表, productName, 60)
            }
            console.log(`productName: ${productName}; ${item.productName}, productX: ${productX}, productY: ${productY}`);
            swipTimes--
            if (productY >= 800 &&  productY <=  2070){
                console.log(`centerY : ${productY}; productName: ${item.productName}`);
                pressXY(productX, productY, 150, 1000)
                break
            } else if(productY < 800 ) {
                autoSwipe(850, 1700, 850, 800, 500, 800)    // 手指往上滑
            } else {
                autoSwipe(800, 800, 800, 1700, 500, 800)   // 手指往下滑
            }
        }
        if (!!swipTimes){
            return true 
        } else {
            throw new Error('无法定位到商品: ' + item.productName)   
        }
    }
    console.log('"自提检测"');
    if (text('自提').findOne(5000)){
        console.log('到达商品选购页面..')
        pressSleep('自提', 300)
        pressSleep('自提', 300)
    }
    // 开始选购商品前清空购物车
    if (textContains('结算').findOne(5000) && textContains('结算').findOne(5000).text() === '去结算') {
        var result = _clearShopCar()
        console.log(`clear shop car result: ${result}`);
        if (result.status != 0){
            msg.status == result.status
            msg.msg = result.msg
            return msg  // 状态异常, 直接返回
        }
    }
    var shopList = payload.shopList
    for (let shop of shopList){
        console.info('category:  '+ shop.category)
        console.info('productName: ' + shop.productName)
        toItemDetail(shop)
        // 可能因为弹窗导致选购商品失败, 确认是否进入商品详情页面
        if (!(textContains('规格').findOne(2000))){
            pressSleep('自提', 300)
            pressSleep('自提', 300)
            toItemDetail(shop)
            sleep(400)
        }
        // 当商品缺货时, 加入购物车不能点击, 页面保持在商品选购页. "规格" 只会出现在选购页面
        if (!textContains('规格').findOne(2000)){
            console.error('添加失败' + shop);
            msg.status = 14      // 商品添加失败
            msg.msg = `商品选购失败: ${shop.productName}`
            msg.payload.shopFailList.push(shop)
            break
        }
        autoSwipe(400, 1300, 400, 500, 300, 500)    // 滑动到咖啡属性页底部
        var featureElse = []

        shop.feature.forEach( feat => {
            if(feat.includes('杯')){
                var [temX, temY] = ocrLoctionXY(imgClips.xy咖啡属性_温度, feat, true, 120, 20)
                if  (temX == 0) {
                    console.error(`无法定位咖啡温度, 关键字: ${feat}`)

                } else {
                    // 冷/热杯切换时, 商品可能会切换属性,如是加冰相关选项变动, 需要等待页面加载
                    pressXY(temX, temY, 150, 1000)
                    autoSwipe(400, 1300, 400, 500, 300, 800)    // 滑动到咖啡属性页底部
                }
            }  else if (feat == '一份'){
                console.log('ocr无法识别"一份", 特殊处理');
            } else{
                featureElse.push(feat)
            }
        })
        var ocrsRes = ocrClickS(imgClips.xy咖啡属性_其他, featureElse, true, 100, 200)
        if ( ocrsRes !== true){
            console.warn(`ocr click feat fail, feats: ${featureElse}`)
            throw new Error(`"${shop.productName}"无法选择"${ocrsRes}"`)
        }
        _addQuantities(shop.quantity)
        pressSleep('加入购物车', 200)
        // 当商品缺货时, 加入购物车不能点击, 页面保持在商品详情选购页. "规格" 只会出现在商品详情选购页面
        switch (false) {
            // 点击加入购物车, 到选购页面可能需要1s到2s页面才能加载完全
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            default:
                console.error('添加失败' + shop);
                msg.status = 15      // 商品添加失败
                msg.msg = `商品选购失败: ${shop.productName}`
                msg.payload.shopFailList.push(shop)
                actionSleep(back, 500)  // 回到饮品列表页
                break;
        }
    }
    sleep(500)
    return msg
}

function _payment(isTest){
    if (text('余额支付').find().length == 1){
        console.log('"余额支付" Y坐标: ', text('余额支付').findOne().bounds().centerY());
        pressXY(990, text('余额支付').findOne().bounds().centerY(), 200, 500)
    }
    var 支付bottoms = text('待支付').findOne(1000).parent().children().find(text('余额支付'))
    if (支付bottoms && 支付bottoms[0]){
        console.log(支付bottoms[0].bounds().centerX(), 支付bottoms[0].bounds().centerY(), 200, 500);
        pressXY(支付bottoms[0].bounds().centerX(), 支付bottoms[0].bounds().centerY(), 200, 500)
    } else {
        console.log('支付bottom定位失败');
    }
    if (text('确定门店').findOne(3000)) {
        console.log('已定位到确认门店.. 请确认点击');
        if (isTest == true){
            return {"status": 19, "msg": "测试任务"}
        } else {
            pressSleep('确定门店', 500)
        }
        for (let index = 0; index < 3; index++) {
            if (!text('查看卡券').findOne(1000)){
                console.log('查看卡券 没定位到');
                pressXY(randomInt(240, 260), randomInt(240, 260), 100, 500)
            }  else {
                console.log('定位到卡券 break')
                pressXY(randomInt(240, 260), randomInt(240, 260), 100, 500)
                break
            }
        }
        // 不管卡券是否定位到, 都点击屏幕空白区域(250, 250)
        pressXY(randomInt(240, 260), randomInt(240, 260), 100, 500)
        pressXY(randomInt(240, 260), randomInt(240, 260), 100, 500)
        takeScreenShot(`/sdcard/DCIM/支付是否成功前截图${(new Date()).getTime()}.png`)
        return {"status": 0, "msg": ""}
    } else {
        console.log('无法定位确认门店.. 请人工确认');
        return {"status": 19, "msg": "无法定位确认门店.. 请人工确认"}
    }
}

function _newWriteNotes(notes){
    if (!notes){
        console.info('备注为空')        
        sleep(500)
        return true
    }
    var counter = 0
    text('订单备注').findOne(2000)
    while (text('口味、包装、配送等要求').findOne(300)) {
        counter++
        if (counter > 3){
            return false
        }
        var bounds = text('订单备注').findOne(300).bounds()
        setClip(notes);
        if (bounds.centerY() > 1700 && bounds.centerY() < 2150) {
            console.log('获取备注控件编辑点击');
            click(randomInt(700, 850), bounds.centerY())
            sleep(800)
        } else {
            console.log('获取备注控件失败' + bounds.centerY());
            pressXY(700, 1950, 200, 800)                // 点击备注输入框
        }
        pressXY(600, 1000, 200, 500)                       // 点击输入法输入框
        var finish = text('完成').findOne(1000) 
        if (!finish) {
            // 输入框未弹出
            console.log('输入框未正常弹出');
            continue
        }
        pressXY(WIDTH/2.2, finish.bounds().bottom + 80, 200, 300)  // 点击输入法剪贴板上备注
        pressSleep('完成', 400)
        var [x保存, y保存] = ocrLoctionXY([470, 1410, 600, 1770], '保存')
        console.log(`点击"保存", x: ${x保存}, y: ${y保存}`);
        pressXY(x保存, y保存, 200, 500)  // 点击备注框'保存'按钮
        // pressSleep('保存', 400)
    }
    return true
}

/**
 * @param {string} orderType  - 店内就餐、打包带走
*/
function _clickOrderType(orderType){
    if (orderType == undefined || orderType == "店内就餐"){
        // 默认店内就餐
        return 
    } else if (orderType == "打包带走"){
        pressSleep(orderType, 200)
    } else {
        console.log(`orderTYpe 参数错误: ${orderType}`);
    }
}

function toPayPage(){
    if (!_textClickEvent('去结算', 1000)){
        throw new Error('“去结算”无法点击')
    }
    var testCnt = 0
    while ((!!text('会员折扣').findOne(2000) === false) && (!!text('去结算').findOne(1000) === false)){
        testCnt ++ 
        descClick('返回', 100)
        if (text('去结算').findOne(2000)){
            sleep(200)
            pressSleep('去结算', 400)
        } else {
            throw new Error('无法定位确认下单, 点击返回后, 无法定位去结算')
        }
        if (testCnt >= 3){
            throw new Error('“确认下单”界面异常')
        }
    }

}

function mstandPayment(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'msg': 'mstandPayment',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
            "shopList": payload.shopList,
        }
    }
    toPayPage()
    _clickOrderType(payload.orderType)
    _toPayBottom()
    _useCoupons(payload.coupons)
    switch (true) {
        case (!_newWriteNotes(payload.notes)):
            msg.status = 16
            msg.msg = "备注输入失败"
            break;
        case (true):
            var result  = _payment(payload.isTest)
            msg.status = result.status
            msg.msg = result.msg
            break
        default:
            break;
    }
    pressXY(randomInt(240, 260), randomInt(240, 260), 150, 1000)
    if (!ocrLoctionXY([400, 300, 700, 500], "已下单", false, 120, 20)[0]){
        msg.status = 19
        msg.msg = payload.isTest == true ? '测试任务不支付': '支付可能失败,未检测到"已下单"'
        toast(msg.msg)
    }
    return msg
}

function mstand(playload){
    var errorMsg;
    errorMsg = mstandTOMenu(playload)
    if (errorMsg.status !== 0){
        return errorMsg
    } 
    errorMsg = mstandSelectDrinks(playload)
    if (errorMsg.status !== 0){
        return errorMsg
    } 
    return mstandPayment(playload)
}


module.exports = {
    mstand: mstand,
    mstandTOMenu: mstandTOMenu,
    mstandSelectDrinks: mstandSelectDrinks,
    mstandPayment: mstandPayment,
    _useCoupons: _useCoupons
}