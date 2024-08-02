const {pressSleep, autoSwipe, pressXY, inputAndSubmit, randomInt, clickEvent, takeScreenshot, clickSleep } = require('./utils')

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

function _getCityInitial(cityName){
    var cites = files.read('./cites.json')
    return JSON.parse(cites)[cityName]
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

function mstandTOMenu(payload){
    function selectCity(cityName, sleepTime){
        if (cityName === '上海市'){
            return 
        }
        pressSleep('上海市', 50)
        var ele = text(cityName).findOne(2000)
        while (ele === null && ele.bounds().centerX >0 ) {
            autoSwipe(500, 2110, 520, 800, 1000, 1000)
            ele = text(cityName).findOne(2000)
        }
        ele.click()
        sleep(sleepTime)
    }
    
    function selectShop(shopName, sleepTime){
        text('请输入门店名称').findOne(5000).click()
        for (let index = 0; index < 4; index++) {
            var ele = textContains(shopName).findOne(500)
            if (ele) {
                sleep(sleepTime)
                className('android.widget.TextView').textContains(shopName).findOne(3000).click()
            } else {
                text('请输入门店名称').findOne(1000).setText(shopName)
            }
            
        }
        sleep(sleepTime)
    }    
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
    // pressSleep('去下单', 2500)
}

function mstandSelectDrinks(payload){
    text('自提').waitFor()
    var shopList = payload.shopList
    shopList.forEach(shop => {
        console.info('shop: '+ shop)
        console.info('category: ' + shop.category)
        textClickEvent(shop.category, 2000)
        textClickEvent(shop.category, 800)
        textClickEvent(shop.productName, 500)
        if (!(text('规格').findOne(2000))){
            textClickEvent('自提', 800)
            textClickEvent(shop.productName, 500)
        }
        shop.feature.forEach( feat => {if (textClickEvent(feat, 600)){}})
        _addQuantities(shop.quantity)
        textClickEvent('加入购物车', 500)

    });
}

function payment(){
    textClickEvent('确认下单', 1000)
}


function mstandPayment(payload){
    textClickEvent('去结算', 1000)
    clickRemark()
    writeNotes( payload.notes, 2000, 0)   
    payment();
    console.info('支付完成, 等待截图...')
    var shotPath = "/sdcard/screenshot.png";
    takeScreenshot(shotPath)
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
    mstandPayment: mstandPayment
}