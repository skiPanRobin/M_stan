// 打开调试
// auto();
const {pressSleep, autoSwipe, pressXY, inputAndSubmit, actionSleep, clickByPartialText} = require('./utils')
var utils = require('./utils')

// utils.inputAndSubmit('海上世界', 1000)


function writeNotes(notes, sleepTime){
    inputAndSubmit('没有忌口', '请输入您的备注(60字以内哦)', sleepTime)
    inputAndSubmit(notes, '请输入您的备注(60字以内哦)', sleepTime)
    actionSleep(back, 800)
    pressSleep('保存', 100)
    sleep(sleepTime)
}

// pressSleep('如有忌口过敏请填写到这儿', 500)
// pressSleep('店内就餐', 500)
// pressSleep('如有忌口过敏请填写到这儿', 500)
// writeNotes('不吃葱姜蒜', 500)
// selectCity('深圳市', 200)
// selectShop('深圳湾万象城店', 500)
// // shell("input keyevent KEYCODE_APP_SWITCH", true);
// utils.pressSleep('零咖特饮', 2300)
// utils.pressSleep('黑糖燕麦奶', 4000)
// utils.pressSleep('少冰', 2300)
// utils.pressSleep('加入购物车', 2300)
// // utils.clickSleep('点单', 2500)
// clickByPartialText('请输入您的备注', 1000)
// textMatches('请输入您的备注' + ".*").findOne();
// var elements = textMatches('请输入您的备注' + ".*").find();
// toast(' elements.length ' + elements.length)
// for (let index = 0; index < elements.length; index++) {
//     const element = elements[index];
//     var bx = element.bounds().centerX()
//     var by = element.bounds().centerY()
//     toast('X: ', bx + 'Y: ' + by)
//     sleep(2000)
// }
var parentEditText = className("android.widget.EditText").textContains("60字以内").findOne(10000);
toast('parentEditText focusable ' + parentEditText.focusable()) 
if (parentEditText) {
    // 获取父控件的子控件列表
    var childEditText = parentEditText.parent().find(className("android.widget.EditText"));

    // 过滤下一级子控件
    for (var i = 0; i < childEditText.size(); i++) {
        var child = childEditText.get(i);
        if (child.focusable()) {
            toast("找到下一级子控件 EditText: " + child.text());
            // 你可以在这里对找到的子控件进行进一步操作，例如点击
            toast('childEditText focusable ' + child.focusable() + ' index: ' + i) 
            child.click();
            sleep(1000)
            toast("找到下一级子控件 focused: " + child.focused())
            child.setText('不加葱薑蒜')
        }
    }
    
    // toast('childEditText focusable ' + childEditText.focusable()) 
    // toast('childEditText focusable ' + childEditText.focusable()) 
    sleep(10000)
    // var bx = childEditText.bounds().centerX()
    // var by = childEditText.bounds().centerY()
    // console.info('X: ' + bx + 'Y: ' + by)
    // pressXY(bx, by, 100, 500)
    // pressXY(bx, by, 100, 1000)

} else {
    console.info("未找到包含 '请输入' 的 EditText 控件");
}


// var editText = className("android.widget.TextView").textContains('60字以内').findOne(10000);
// var bx = editText.bounds().centerX()
// var by = editText.bounds().centerY()
// console.info('X: ' + bx + 'Y: ' + by)
// pressXY(bx, by, 100, 500)
// pressXY(bx, by, 100, 1000)
// var inText = '不要葱姜蒜'
// editText.click()
// for (var i = 0; i < inText.length; i++) {

//     editText.setText(inText.slice(0, i+1))
    
//     sleep(200);
// }
sleep(5000)
toast("操作完成");