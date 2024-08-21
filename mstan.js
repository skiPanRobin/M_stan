const {pressSleep, pressXY, randomInt, clickEvent, actionSleep, isNumeric, isExists, shotPath} = require('./utils')

function clickRemark(){
    var ele = text('如有忌口过敏请填写到这儿').findOne(10000)
    var bds = ele.bounds()

    var x = bds.left
    var y = bds.bottom
    // 定义脚本内容
    var openRemarkShell = `su
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 486
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(10, 15)}
    sendevent /dev/input/event4 3 54 ${y - randomInt(10, 15)}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 -1
    sendevent /dev/input/event4 1 330 0
    sendevent /dev/input/event4 1 325 0
    sleep ${randomInt(10, 20)/100}
    sendevent /dev/input/event4 0 0 0
    sleep ${randomInt(50, 60)/100}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 486
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(10, 15)}
    sendevent /dev/input/event4 3 54 ${y - randomInt(10, 15)}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 -1
    sendevent /dev/input/event4 1 330 0
    sendevent /dev/input/event4 1 325 0
    sleep ${randomInt(10, 20)/100}
    sendevent /dev/input/event4 0 0 0
    sleep ${randomInt(50, 60)/100}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 486
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(10, 15)}
    sendevent /dev/input/event4 3 54 ${y - randomInt(10, 15)}
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 -1
    sendevent /dev/input/event4 1 330 0
    sendevent /dev/input/event4 1 325 0
    sleep ${randomInt(10, 20)/100}
    sendevent /dev/input/event4 0 0 0
    sleep ${randomInt(50, 60)/100}
    exit
    exit
    `
    var result = shell(openRemarkShell, true);
    toast('打开备注结果: ' + result.code)
}

function writeNotes(notes, sleepTime, callTimes){
    if (!notes){
        console.info('备注为空')
        sleep(sleepTime)
        return
    }
    var parentEditText = className("android.widget.EditText").textContains("60字以内").findOne(4000);
    if (parentEditText) {
        console.info('parentEditText focusable ' + parentEditText.focusable()) 
        // 获取父控件的子控件列表
        var childEditText = parentEditText.parent().find(className("android.widget.EditText"));

        // 过滤下一级子控件
        for (var i = 0; i < childEditText.size(); i++) {
            var child = childEditText.get(i);
            if (child.focusable()) {
                // 你可以在这里对找到的子控件进行进一步操作，例如点击
                toast('找到下一级子控件 focusable ' + child.focusable() + ' index: ' + i) 
                child.click();
                sleep(1000)
                toast("找到下一级子控件 focused: " + child.focused())
                child.setText(notes)
                break
            }
        }
        sleep(randomInt(50, 80) * 10)
        className("android.widget.TextView").text("完成").findOne(4000).click();
        sleep(randomInt(50, 80) * 10)
        className("android.widget.TextView").text("保存").findOne(4000).click();
        sleep(randomInt(sleepTime-100, sleepTime+100))
    } else {
        callTimes = callTimes + 1
        if (callTimes > 3){
            console.error('无法定位到备注弹窗控件, 尝试' + callTimes  + '失败')
            return
        }
        pressSleep('店内就餐', 2000)
        console.info("未找到包含 '60字以内' 的 EditText 控件 callTimes" + callTimes);
        writeNotes(notes, sleepTime, callTimes)
    }
}

function _textClickEvent(textContent, sleepTime){
    console.info('textContent: ' + textContent)
    var ele = text(textContent).findOne(5000)
    if (!ele) {
        console.warn('缺少选项: ' + textContent)
    } else {
        var x = ele.bounds().centerX() 
        var y = ele.bounds().centerY() 
        clickEvent(x, y, sleepTime)
    }
    return !ele ? false : true
}

/**
 * @param quantity -饮料数量
*/
function _addQuantities(quantity){
    var siblings = text('¥').findOne().parent().children()
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
    var 已选购 =  textMatches(/^[已未]选购\d{0,2}商品$/).findOne(2000)
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
        var ele = text(cityName).findOne(2000)
        if (ele){
            ele.click()
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
            text('请输入门店名称').findOnce().click()
        }

        for (let index = 0; index < 4; index++) {
            var ele = textContains(shopName).findOne(500)
            if (ele) {
                sleep(sleepTime)
                var shopEle = className('android.widget.TextView').textContains(shopName).findOne(3000)
                if (shopEle) {
                    shopEle.click()
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
                    actionSleep(back, 500)
                }
                while (!text('选择门店').findOne(200)) {
                    text('手动选择').findOne(500).click()
                    sleep(500)
                    whileCnt++
                    if (whileCnt >= 10) {
                        break
                    }
                }
                if (whileCnt >= 10){
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
        case (selectCity(payload.city, 900) === false):
            break;
        case (selectShop(payload.shopName, 1300) === false):
            break;
        default:
            break;
    }
    // pressSleep('去下单', 2500)
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
    if (text('自提').findOne(5000)){
        console.log('到达商品选购页面..')
        _textClickEvent('自提', 300)
        _textClickEvent('自提', 300)
    }
    // 开始选购商品前清空购物车
    if (textContains('结算').findOne() && textContains('结算').findOne().text() === '去结算') {
        var result = _clearShopCar()
        if (result.status != 0){
            msg.status == result.status
            msg.msg = result.msg
            return msg  // 状态异常, 直接返回
        }
    }
    var shopList = payload.shopList
    for (let shop of shopList){
        console.info('shop: '+ shop)
        console.info('productName: ' + shop.productName)
        var pnEle = text(shop.productName).findOne(3000)
        if (pnEle){
            text(shop.productName).findOne(3000).click()
            sleep(500)
        } else {
            msg.status = 14
            msg.msg = '商品列表中无法定位到商品'
            msg.payload.shopFailList.push(shop)
            break
        }
        // 可能因为弹窗导致选购商品失败, 确认是否进入商品详情页面
        if (!(text('规格').findOne(2000))){
            _textClickEvent('自提', 300)
            _textClickEvent('自提', 500)
            text(shop.productName).findOne(2000).click()
            sleep(400)
        }
        // autoSwipe(500, 1200, 520, 600, 300, 500)
        shop.feature.forEach( feat => {
            var featEle = textContains(feat).findOne(1000)
            if (featEle){
                featEle.click()
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
    text('确认下单').findOne(3000).click()
    if (text('确定门店').findOne(3000)) {
        text('确定门店').findOne(2000).click()
        sleep(400)
        if (isTest === true){
            console.log('测试支付...');
            return {'status': 0, "msg": "测试支付"}
        }
        if (textContains('余额支付').findOne(3000)){
            var balance = parseFloat(textContains('可用余额：').findOne(3000).text())
            var amount = parseFloat(textContains('余额支付').findOne(2000).text())
            if (balance && balance < amount){
                console.log(`余额不足, 余额: ${balance}, 需支付: ${amount}`);
                return {'status': 17, "msg": "余额不足, 转人工"}
            } else  {
                textContains('余额支付').findOne(2000).click()
            }
        } else {
            return {"status": 18, "msg": "没有进入到余额支付页面"}
        }
        for (let index = 0; index < 10; index++) {
            if (!text('查看卡券').findOne(1000)){
                console.log('查看卡券 没定位到');
            }  else {
                console.log('定位到卡券 break')
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
        pressSleep('关注 M Stand', 300)
        console.log('已定位到确认门店.. 请确认点击');
        return {"status": 0, "msg": ""}
    } else {
        console.log('无法定位确认门店.. 请人工确认');
        return {"status": 19, "msg": "无法定位确认门店.. 请人工确认"}
    }
}

function _newWriteNotes(notes){
    if (!notes){
        console.info('备注为空')
        sleep(sleepTime)
        return true
    }
    var counter = 0
    text('如有忌口过敏请填写到这儿').findOne(3000)
    while (text('如有忌口过敏请填写到这儿').findOne(300)) {
        text('如有忌口过敏请填写到这儿').findOnce().click()
        setClip(notes);
        sleep(300)
        press(600, 1000, 300) // 点击输入框
        var finish = text('完成').findOne() 
        click(device.width/2, finish.bounds().bottom + 80)  // 点击输入法剪贴板上备注
        sleep(200)
        finish.click()      // 点击完成
        sleep(300)
        pressXY(523, 1750, 500, 300)  // 点击备注框'保存'按钮
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
    if (orderType === undefined || orderType === "店内就餐"){
        // 默认店内就餐
        return 
    } else if (orderType === "打包带走"){
        text('打包带走').findOne(2000).click()
    } else {
        console.log(`orderTYpe 参数错误: ${orderType}`);
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
    
    switch (true) {
        case (!_textClickEvent('去结算', 1000)):
            msg.status = 16
            msg.msg = '“去结算”无法点击'
            break
        case (!_newWriteNotes(payload.notes)):
            msg.status = 16
            msg.msg = "备注输入失败"
            break;
        case (true):
            _clickOrderType(payload.orderType)
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
    switch (true) {
        case (errorMsg = mstandTOMenu(playload)):
            if (errorMsg.status !== 0){
                break;                
            }
        case (errorMsg = mstandSelectDrinks(playload)):
            if (errorMsg.status !== 0){
                break;                
            }
        case (errorMsg = mstandPayment(playload)):
            if (errorMsg.status !== 0){
                break;                
            }
        default:
            break;
    }
    return errorMsg
}


module.exports = {
    mstand: mstand,
    mstandTOMenu: mstandTOMenu,
    mstandSelectDrinks: mstandSelectDrinks,
    mstandPayment: mstandPayment,
    clickRemark: clickRemark,
    writeNotes: writeNotes,
    _clearShopCar: _clearShopCar
}