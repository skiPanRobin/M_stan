const {pressSleep, autoSwipe, pressXY, inputAndSubmit, randomInt, clickEvent } = require('./utils')

function clickRemark(){
    var ele = text('如有忌口过敏请填写到这儿').findOne(5000)
    var bds = ele.bounds()

    var x = bds.centerX() 
    var y = bds.centerY() 
    // 定义脚本内容
    var openRemarkShell = `su
    sendevent /dev/input/event4 0 0 0
    sendevent /dev/input/event4 3 57 486
    sendevent /dev/input/event4 1 330 1
    sendevent /dev/input/event4 1 325 1
    sendevent /dev/input/event4 3 53 ${x + randomInt(-100, 100)}
    sendevent /dev/input/event4 3 54 ${y + randomInt(-15, 15)}
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
    sendevent /dev/input/event4 3 53 ${x + randomInt(-100, 100)}
    sendevent /dev/input/event4 3 54 ${y + randomInt(-15, 15)}
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
    sendevent /dev/input/event4 3 53 ${x + randomInt(-100, 100)}
    sendevent /dev/input/event4 3 54 ${y + randomInt(-15, 15)}
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
                sleep(sleepTime)
                break
            }
        }
        sleep(randomInt(5, 15)/10)
        className("android.widget.TextView").text("完成").findOne(4000).click();
        sleep(randomInt(30, 50)/10)
        className("android.widget.TextView").text("保存").findOne(4000).click();
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
}

function mstandTOMenu(payload){
    function selectCity(cityName, sleepTime){
        pressSleep('上海市', 50)
        var ele = text(cityName).findOne(2000)
        while (ele === null) {
            autoSwipe(500, 2110, 520, 800, 1000, 500)
            ele = text(cityName).findOne(200)
        }
        ele.click()
        sleep(sleepTime)
    }
    
    function selectShop(shopName, sleepTime){
    
        inputAndSubmit(shopName, '请输入门店名称', sleepTime)
        inputAndSubmit(shopName, '请输入门店名称', sleepTime)
        back()
        sleep(sleepTime)
    }
    var shopList = payload.shopList
    
    pressSleep(payload.appName, 200)
    // 关闭推荐弹窗
    pressSleep('首页', 500)
    pressXY(300, 300, 100, 500)    //  消除弹窗
    pressXY(300, 300, 100, 500)   //   消除弹窗
    pressXY(300, 300, 100, 500)   //   消除弹窗
    pressXY(300, 1250, 100, 3000);  //   门店自取
    pressSleep('手动选择', 1500)
    selectCity(payload.city, 900)
    selectShop(payload.shopName, 1300)
    pressSleep('去下单', 2500)
    // pressSleep('零咖特饮', 2000)
    // pressSleep('零咖特饮', 800)

}

function mstandSelectDrinks(payload){
    var shopList = payload.shopList
    shopList.forEach(shop => {
        console.info('shop: '+ shop)
        console.info('category: ' + shop.category)
        textClickEvent(shop.category, 2000)
        textClickEvent(shop.category, 800)
        textClickEvent(shop.productName, 1000)
        shop.feature.forEach( feat => {
            textClickEvent(feat, 600)
            // textClickEvent('燕麦奶', 600)
        }
        )
        textClickEvent('加入购物车', 1000)
    });
}

function mstandPayment(payload){
    textClickEvent('去结算', 1000)
    clickRemark()
    writeNotes( payload.notes, 2000, 0)   
    toast('支付完成, 等待截图...')
    var img = captureScreen();
    if (img) {
        // 保存截图到临时文件
        var path = "/sdcard/screenshot.png";
        images.save(img, path);
        toast("截图已保存到: " + path);
        return path

    }
}



module.exports = {
    mstandTOMenu: mstandTOMenu,
    mstandSelectDrinks: mstandSelectDrinks,
    mstandPayment: mstandPayment
}