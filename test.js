const { pressXY, actionSleep } = require('./utils')
var currentStep = 2
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
            } 
            break
    }
}