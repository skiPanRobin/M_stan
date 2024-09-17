const {pressSleep, pressContainsSleep, pressXY, autoSwipe, actionSleep, isNumeric, isExists} = require('./utils')

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

/**
 * @param quantity -饮料数量
*/
function _addQuantities(quantity){
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
    var 已选购 =  textMatches(/^[已未]选购\d{0,2}[件]{0,1}商品$/).findOne(2000)
    var b自提 = text('自提').findOne(2000).bounds()
    if (!已选购){ return {"status": 0, "msg": ""}}
    var b已选购 = 已选购.bounds()
    click(b已选购.centerX(), b已选购.centerY())
    sleep(400)
    click(b自提.centerX(), b自提.centerY())
    sleep(300)
    click(b已选购.centerX(), b已选购.centerY())
    sleep(400)
    var status_ = 13
    while (textContains('最多可添加').findOne(300)){
        status_ = 0
        var ele最多 = textContains('最多可添加').findOne(300)
        if (!ele最多){break}
        var ele = ele最多.parent().children()[3].children()[0]
        var children = ele.children()
        for (let index = 0; index < children.length; index++) {
            var element = children[index];
            if (isNumeric(element.text())) {
                // console.log(`杯数 ${element.text()}, 下标: ${index}`);
                click(children[index - 1].bounds().centerX(), children[index - 1].bounds().centerY())
                sleep(300)
                break
            } 
        }
    }
    return {'status': status_, 'msg': '清空购物车失败, 请人工检查'}
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
        if (text(cityName).findOne(2000)){
            var cnt = 10
            while (!!cnt){
                var cityBounds = text(cityName).findOne(100).bounds()
                console.log(cityBounds.centerX(), cityBounds.centerY());
                if (cityBounds.centerY() < 200){
                    autoSwipe(450, 400, 460, 1603, 400, 500)
                } else if (cityBounds.centerY() > 2230){
                    autoSwipe(460, 1603, 450, 400, 400, 500)
                } else {
                    click(cityBounds.centerX(), cityBounds.centerY())
                    sleep(400)
                    break
                }
                cnt--
            }
            if (cnt == 0) {
                throw new Error('无法定位城市')
            }
        }else {
            msg.status = 11
            msg.msg = `无法定位城市: ${cityName}`
            return false
        }
        sleep(sleepTime)
        return true
    }
    
    function selectShop(shopName, sleepTime){
        if (!text('请输入门店名称').findOne(5000)){
            msg.status = 11
            msg.msg = '无法定位门店输入框'
            return false
        } else {
            pressSleep('请输入门店名称', 500)
        }

        for (let index = 0; index < 4; index++) {
            var ele = textContains(shopName).findOne(500)
            if (ele && ele.bounds().centerY() < 2000) {
                sleep(sleepTime)
                var shopEle = className('android.widget.TextView').textContains(shopName).findOne(3000)
                if (shopEle) {
                    sleep(300)
                    click(shopEle.bounds().centerX(), shopEle.bounds().centerY())
                    break
                } else {
                    console.log('无法定位商店, 重试次数: ' + index);  
                }                
            } else {
                var inputEle = text('请输入门店名称').findOne(1000)
                inputEle? inputEle.setText(shopName) : console.log('如法定位, 重试次数: ' + index)
            }
        }
        if (!text('自提').findOne(3000)) {
            msg.status = 12
            msg.msg = `无法定位到门店: ${shopName}`
            return false
        } else {
            return true
        }
    }    
    pressSleep(payload.appName, 200)
    text('首页').findOne(5000)
    var currentStep = 1
    var whileCnt = 0

    // 网络问题可能导致页面无法加载
    while (currentStep < 3) {
        console.log('currentStep: ' + currentStep);
        
        switch (currentStep){
            case 1:
                whileCnt = 0
                while (!text("手动选择").findOne(400)){
                    pressXY(300, 300, 100, 300)    //  消除弹窗
                    pressXY(300, 300, 100, 300)    //  消除弹窗
                    pressXY(300, 1250, 100, 500);  //   门店自取
                    whileCnt++
                    if (whileCnt >= 10) {
                        break
                    }
                }
                currentStep = 2
                break
            case 2: 
                whileCnt = 0
                if (text('选择门店').findOne(1000)){
                    // 页面可能会直接跳转到选择城市导致错误
                    toast('定位到 "选择门店"')
                    actionSleep(back, 500)
                }
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

    // 关闭推荐弹窗
    
    
    // pressSleep('手动选择', 1500)
    switch (true) {
        case (selectCity(payload.city, 500) === false):
            break;
        case (selectShop(payload.shopName, 500) === false):
            break;
        default:
            break;
    }
    // pressSleep('去下单', 500)
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
        pressSleep(item.category, 800)
        swipTimes = 5
        while (!!swipTimes){
            var cy = text(item.productName).findOne(1000).bounds().centerY()
            console.log(cy);
            swipTimes--
            if (cy >= 800 &&  cy <=  2000){
                console.log(`centerY : ${cy}; productName: ${item.productName}`);
                pressSleep(item.productName)
                break
            } else if(cy < 800 ) {
                autoSwipe(800, 800, 800, 1800, 500, 500)   // 手指往下滑
            } else {
                autoSwipe(650, 1800, 650, 800, 500, 500)    // 手指往上滑
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
        var pnEle = text(shop.productName).findOne(3000)
        if (pnEle){
            toItemDetail(shop)
            sleep(500)
        } else {
            msg.status = 14
            msg.msg = '商品列表中无法定位到商品'
            msg.payload.shopFailList.push(shop)
            console.error(msg);
            break
        }
        // 可能因为弹窗导致选购商品失败, 确认是否进入商品详情页面
        if (!(text('规格').findOne(2000))){
            pressSleep('自提', 300)
            pressSleep('自提', 300)
            toItemDetail(shop)
            sleep(400)
        }
        // autoSwipe(500, 1200, 520, 600, 300, 500)
        shop.feature.forEach( feat => {
            text('规格').findOne(2000)
            autoSwipe(400, 1300, 400, 500, 300, 300)
            var featEle = textContains(feat).findOne(1000)
            if (featEle){
                pressContainsSleep(feat, 100)
            } else {
                console.log(`没有选中饮料属性: ${feat}`);
            }
            if (feat.includes('杯')){
                // 冷/热杯切换时, 商品可能会切换属性,如是加冰相关选项变动, 需要等待页面加载
                sleep(500)
            }
        })
        _addQuantities(shop.quantity)
        pressSleep('加入购物车', 200)
        // 当商品缺货时, 加入购物车不能点击, 页面保持在商品选购页. "规格" 只会出现在选购页面
        switch (false) {
            case isExists('规格', 400, 400):
                break;
            case isExists('规格', 400, 400):
                break;
            case isExists('规格', 400, 400):
                break;
            case isExists('规格', 400, 400):
                break;
            default:
                console.log('添加失败' + shop);
                msg.status = 15      // 商品添加失败
                msg.msg = '商品选购失败'
                msg.payload.shopFailList.push(shop)
                actionSleep(back, 500)  // 回到饮品列表页
                break;
        }
    }
    sleep(500)
    return msg
}

function _payment(isTest){
    function matchMoney(str){
        if (!!str && typeof(str) === 'string'){
            var _ = str.match(/[.\d]+/)
            return !!_? parseFloat(_[0]): 0
        }
        return 0
    }

    pressSleep('确认下单', 300)
    if (text('确定门店').findOne(3000)) {
        console.log('已定位到确认门店.. 请确认点击');
        pressSleep('确定门店', 500)
        sleep(400)
        if (textContains('余额支付').findOne(3000)){
            var balance = 0
            var amount = 0
            if (textContains('储值余额').findOne(3000)){
                balance = matchMoney(textContains('储值余额').findOne(3000).text())
            }
            if (textContains('余额支付').findOne(2000)){
                amount = matchMoney(textContains('余额支付').findOne(2000).text())
            }   
            console.log(`账户余额: ${balance}, 需支付: ${amount}`);
            console.log('余额是否充足：' + !( balance && balance < amount));
            if (balance && balance < amount){
                console.log(`余额不足, 余额: ${balance}, 需支付: ${amount}`);
                return {'status': 17, "msg": "余额不足, 转人工"}
            } else  {
                if (isTest == true){
                    console.log('测试支付...');
                    return {'status': 0, "msg": "测试支付"}
                } else {
                    pressContainsSleep('余额支付', 100)
                }
            }
        } else {
            return {"status": 18, "msg": "没有进入到余额支付页面"}
        }
        for (let index = 0; index < 3; index++) {
            if (!text('查看卡券').findOne(1000)){
                console.log('查看卡券 没定位到');
                click(250, 250)
            }  else {
                console.log('定位到卡券 break')
                click(250, 250)
                break
            }
        }
        // 关闭查看卡券
        while (text('查看卡券').findOne(500)) {
            console.log('查看卡券 已定位到')
            var ele = textContains('关注 M Stand').findOne(3000)
            ele ? pressSleep('关注 M Stand', 300): console.log('关注 M Stand 无法定位');
        }
        while (text('查看卡券').findOne(500)){
            console.log('再次定位到卡券');
            click(250, 250);
            sleep(1000)
        }
        if (textContains('关注 M Stand').findOne(500)){
            pressSleep('关注 M Stand', 300)
        } {
            console.log();
            click(820, 371)
        }
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
    text('如有忌口过敏请填写到这儿').findOne(3000)
    while (text('如有忌口过敏请填写到这儿').findOne(300)) {
        setClip(notes);
        autoSwipe(400, 1900, 400, 500, 400, 600)    // 滑动到底部
        pressXY(700, 1950, 200, 500)                // 点击备注输入框
        press(600, 1000, 300)                       // 点击输入法输入框
        var finish = text('完成').findOne(5000) 
        pressXY(device.width/2, finish.bounds().bottom + 80, 200, 300)  // 点击输入法剪贴板上备注
        pressSleep('完成', 400)
        pressXY(523, 1750, 200, 600)  // 点击备注框'保存'按钮
        counter++
        if (counter > 3){
            return false
        }
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
    while ((!!text('确认下单').findOne(2000) === false) && (!!text('去结算').findOne(1000) === false)){
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
    mstandPayment: mstandPayment
}