const {pressSleep, autoSwipe, pressXY, inputAndSubmit, randomInt, clickEvent, takeScreenshot, clickSleep, actionSleep, descClick } = require('./utils')

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

function textClickEvent(textContent, sleepTime){
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
        console.log(element.text())
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
function clearShopCar(){
    console.log('TODO: clear shop car')
}


function mstandTOMenu(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'message': 'selectShop',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
        }
    }
    function selectCity(cityName, sleepTime){
        if (cityName === '上海市'){
            return 
        }
        pressSleep('上海市', 500)
        var ele = text(cityName).findOne(2000)
        ele.click()
        sleep(sleepTime)
    }
    
    function selectShop(shopName, sleepTime){
        text('请输入门店名称').findOne(5000).click()
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
            msg.status = 1
        }
    }    
    pressSleep(payload.appName, 200)
    text('首页').findOne(5000)
    // 关闭推荐弹窗
    while (!text("手动选择").findOne(200)){
        pressXY(300, 300, 100, 300)    //  消除弹窗
        pressXY(300, 300, 100, 300)    //  消除弹窗
        pressXY(300, 1250, 100, 500);  //   门店自取
    }
    while (!text('选择门店').findOne(200)) {
        text('手动选择').findOnce().click()
        sleep(500)
    }
    // pressSleep('手动选择', 1500)
    selectCity(payload.city, 900)
    selectShop(payload.shopName, 1300)
    // pressSleep('去下单', 2500)
    return msg
}

function mstandSelectDrinks(payload){
    var msg = {
        'type': 'errorMsg',
        'status': 0,      
        'message': 'selectDrinks',
        'payload': {
            'id': payload.id,
            "city": payload.city,
            "shopName": payload.shopName,
            "wechatNo": payload.wechatNo,
            "wechatName": payload.wechatName,
            'shopList': []
        }
    }
    if (text('自提').findOne(5000)){
        console.log('到达商品选购页面..')
        textClickEvent('自提', 300)
        textClickEvent('自提', 300)
    }
    // 开始选购商品前清空购物车
    if (textContains('结算').findOne() && textContains('结算').findOne().text() === '去结算') {
        clearShopCar()
    }
    var shopList = payload.shopList
    for (let shop of shopList){
        console.info('shop: '+ shop)
        console.info('category: ' + shop.category)
        console.info('productName: ' + shop.productName)
        var pnEle = text(shop.productName).findOne(3000)
        if (pnEle){
            text(shop.productName).findOne(3000)
        } else {
            msg.status = 2
            msg.payload.shopList.pusp(shop)
            break
        }
        // 可能因为弹窗导致选购商品失败, 确认是否进入商品详情页面
        if (!(text('规格').findOne(2000))){
            textClickEvent('自提', 300)
            textClickEvent('自提', 500)
            text(shop.productName).findOne().click()
        }
        // autoSwipe(500, 1200, 520, 600, 300, 500)
        sleep(400)
        shop.feature.forEach( feat => {
            var featEle = textContains(feat).findOne(400)
            if (featEle){
                featEle.click()
            } else {
                console.log(`没有选中饮料属性: ${feat}`);
            }
            sleep(400)
        })
        _addQuantities(shop.quantity)
        textClickEvent('加入购物车', 800)
        if (text('规格').findOne(500)){
            console.log('添加失败' + shop);
            msg.status = 2      // 商品添加失败
            msg.payload.shopList.push(shop)
            actionSleep(back, 1000)
        }
    }
    sleep(500)
    return msg
    // shopList.forEach(shop => {
    //     console.info('shop: '+ shop)
    //     console.info('category: ' + shop.category)
    //     textClickEvent(shop.category, 2000)
    //     textClickEvent(shop.category, 800)
    //     textClickEvent(shop.productName, 500)
    //     // 可能因为弹窗导致选购商品失败, 确认是否进入商品详情页面
    //     if (!(text('规格').findOne(2000))){
    //         textClickEvent('自提', 800)
    //         textContains(shop.productName).findOne.click()
    //     }
    //     shop.feature.forEach( feat => {if (textClickEvent(feat, 600))})
    //     _addQuantities(shop.quantity)
    //     textClickEvent('加入购物车', 500)

    // });
}

function _payment(){
    text('确认下单').findOne(3000).click()
    if (text('确定门店').findOne(3000)) {
        // text('确定门店').findOne(3000).click()
        // text("等待某节点加载").findOne(3000)
        // sleep(3000)
        // pressXY(device.width/ 2, device.height/ 2, 300, 1000)
        text('确定门店').findOne(2000).click()
        sleep(400)
        textContains('余额支付').findOne(2000).click()

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
    } else {
        console.log('无法定位确认门店.. 请人工确认');
    }
}

function _newWriteNotes(notes){
    if (!notes){
        console.info('备注为空')
        sleep(sleepTime)
        return
    }
    text('如有忌口过敏请填写到这儿').findOne(3000).click()
    setClip(notes);
    sleep(300)
    press(600, 1000, 300)
    var finish = text('完成').findOne()
    click(device.width/2, finish.bounds().bottom + 80)
    sleep(200)
    finish.click()
    sleep(300)
    pressXY(523, 1750, 500, 300)
}


function mstandPayment(payload){
    textClickEvent('去结算', 1000)
    _newWriteNotes(payload.notes);
    _payment();
    console.info('支付完成, 等待截图...')
    var shotPath = "/sdcard/screenshot.png";
    takeScreenshot(shotPath)
    className('android.widget.Button').desc('返回').findOne(3000).click()
    sleep(300)
    return shotPath
}

function mstand(playload){
    mstandTOMenu(playload);
    mstandSelectDrinks(playload);
    mstandPayment(playload);
}


module.exports = {
    mstand: mstand,
    mstandTOMenu: mstandTOMenu,
    mstandSelectDrinks: mstandSelectDrinks,
    mstandPayment: mstandPayment,
    clickRemark: clickRemark,
    writeNotes: writeNotes
}