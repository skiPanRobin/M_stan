// 打开调试
// auto();
const {pressSleep, autoSwipe, pressXY, inputAndSubmit, actionSleep, clickByPartialText} = require('./utils')
var utils = require('./utils')

// utils.inputAndSubmit('海上世界', 1000)


function writeNotes(notes, sleepTime, callTimes){
    if (!notes){
        console.info('备注为空')
        sleep(sleepTime)
        return
    }
    // utils.clickSleep('如有忌口过敏请填写到这儿', 3000)
    // pressSleep('如有忌口过敏请填写到这儿', 1000)
    // var parentEditText = className('android.widget.TextView').textContains('如有忌口').findOne(3000)
    // var bounds = parentEditText.bounds()
    // var x = bounds.centerX()
    // var y = bounds.centerY()
    // console.info('x ' + x + 'y ' + y )
    // gesture(500,[x, y] , [x+10, y+10]) 
    // click(x, y)
    
    pressSleep('如有忌口过敏请填写到这儿', 1000)
    sleep(2000)
    pressXY(500, 1000, 100, 1000)
    var parentEditText = className("android.widget.EditText").textContains("60字以内").findOne(3000);
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
            }
        }
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
var bds = text('如有忌口过敏请填写到这儿').findOne(5000).bounds()
var x = bds.centerX()
var y = bds.centerY()
// tap(bds.centerX(), bds.centerY());
// writeNotes('加辣加麻, 葱姜蒜都要, 不要香菜', 1000, 0)
// importClass(android.support.test.uiautomator.UiSelector);
// var ra = new RootAutomator();
// events.on('exit', function(){
//   ra.exit();
// });
// ra.touchDown(x, y)
// sleep(300)
// ra.touchUp()
toast('x: '+ x + 'y: '+ y)
Tap(x, y);
toast('x: '+ x + 'y: '+ y)
sleep(500);
toast('x: '+ x + 'y: '+ y)
toast("操作完成");