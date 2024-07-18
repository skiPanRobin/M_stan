function mstand(){
    const {pressSleep, autoSwipe, pressXY, inputAndSubmit, clickByPartialText, actionSleep } = require('./utils')
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
    function writeNotes(notes, sleepTime){
        inputAndSubmit('没有忌口', '请输入您的备注(60字以内哦)', sleepTime)
        inputAndSubmit(notes, '请输入您的备注(60字以内哦)', sleepTime)
        actionSleep(back, 800)
        pressSleep('保存', 100)
        sleep(sleepTime)
    }

    pressSleep('M Stand', 200)
    // 关闭推荐弹窗
    pressSleep('首页', 200)
    pressXY(300, 300, 100, 200)    //  消除弹窗
    pressXY(300, 300, 100, 200)   //   消除弹窗
    pressXY(300, 300, 100, 1000)   //   消除弹窗
    pressXY(300, 1250, 100, 3000);  //   门店自取
    pressSleep('手动选择', 1500)
    selectCity('深圳市', 1000)
    selectShop('深圳湾万象城店', 500)
    pressSleep('去下单', 300)
    pressSleep('零咖特饮', 2000)
    pressSleep('黑糖燕麦奶', 1000)
    pressSleep('少冰', 500)
    pressSleep('加入购物车', 1000)
    pressSleep('去结算', 500)
    pressSleep('如有忌口过敏请填写到这儿', 500)
    writeNotes('不吃葱姜蒜', 500)
}

module.exports = {
    mstand: mstand
}