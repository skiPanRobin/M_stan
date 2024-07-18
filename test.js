// 打开调试
// auto();
const {pressSleep, autoSwipe, pressXY, inputAndSubmit, clickByPartialText } = require('./utils')
var utils = require('./utils')

// utils.inputAndSubmit('海上世界', 1000)


function writeNotes(notes, sleepTime){
    pressSleep('如有忌口过敏请填写到这儿', 500)
    pressXY(200, 850, 100, 200)
    pressXY(300, 800, 100, 500)
    for (let index = 0; index < notes.length; index++) {
        input(notes[index])
        input(notes[index])
        sleep(1000)
    }
    sleep(1000)
    pressSleep('活动提醒', 100)     // 保存
    sleep(sleepTime)
}

writeNotes('不吃葱姜蒜', 1000)
// selectCity('深圳市', 200)
// selectShop('深圳湾万象城店', 500)
// // shell("input keyevent KEYCODE_APP_SWITCH", true);
// utils.pressSleep('零咖特饮', 2300)
// utils.pressSleep('黑糖燕麦奶', 4000)
// utils.pressSleep('少冰', 2300)
// utils.pressSleep('加入购物车', 2300)
// // utils.clickSleep('点单', 2500)
toast("操作完成");