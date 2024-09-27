const {pressSleep, pressContainsSleep, pressXY, autoSwipe, actionSleep, isNumeric, isExists, WIDTH, clickSleep} = require('./utils')

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


function _checkUpdateApp(whileCnt){
    if (whileCnt>=4){
        // pressSleep('同意')
        pressXY(306, 1623, 200, 1000)
    }
    if(text('小程序更新提示').findOnce()){
        console.log('小程序更新中...')
        var button确定 = className('android.widget.Button').text('确定').findOne(500)
        if (button确定){
            click(button确定.bounds().centerX(), button确定.bounds().centerY())
        } else {
            click(777, 1310)
        }
        var button知道了 = className('android.widget.Button').text('知道了').findOne(2000)
        if (button知道了){
            click(button知道了.bounds().centerX(), button知道了.bounds().centerY())
        } else {
            click(555, 1280)
        }
        return true
    } else {
        console.log('不需要跟新小程序');
        return false
    } 
}

/**
 * @param quantity -饮料数量
*/
function _addQuantities(quantity){
    if (quantity<=1) {
        return
    }
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
function _toPayBottom(payload){
    if (payload.notes || (payload.coupons && !!payload.coupons.total===true)){
        autoSwipe(400, 1900, 400, 500, 400, 800)    // 滑动到底部
    }
}
/**
 * 选择优惠券
 * @param {Object} coupons          - json对象
 * @param {number} coupons.total    - 使用优惠券张数
 * @param {string} coupons.titleSub - 所使用优惠券的标题
*/
function _useCoupons(coupons){
    if (!!coupons === false){
        console.error('缺少参数 coupons')
        return
    }
    var total = coupons.total ? coupons.total: 0
    var titleSub = coupons.titleSub ? coupons.titleSub : '单杯标杯饮品兑换券'
    console.log(titleSub + total);
    if (!!total === false){
        console.log('不使用优惠券');
        return 
    } else {
        console.log(`尝试使用 ${total} 张 "${titleSub}" 优惠券`);
    }
    var couponsEle = textContains('张可用').findOne(500)
    if(couponsEle){
        var userfulCoupons = parseInt(couponsEle.text())
        if(userfulCoupons > 0){    
            console.log(`${userfulCoupons}张可用`);
        } else {
            console.log('无优惠券可以使用');
            return 
        }
    } else {
        console.log('无优惠券可以使用');
        return false
    }
    // 点击进入优惠券
    pressXY(505, 1390, 150, 500)
    if(textContains('单杯标杯饮品兑换券').findOne(8000)){
        console.log('定位成功');
        var couponEles = textContains('单杯标杯饮品兑换券').find()
        console.log('优惠券控件数: ' + couponEles.length);
        
        for (let index = 0; index < total; index++) {
            var ele_index  = index * 2
            console.log('点击一次优惠券, ele_index: ' + ele_index);
            if (ele_index >= couponEles.length){
                console.error('超额使用优惠券');
                break
            } else {
                var bound = couponEles[ele_index].bounds()
                if (bound.centerY() > 2050){
                    // 优惠券超出屏幕范围时, 重新获取
                    autoSwipe(532, 1530, 536, 523, 400, 500)
                    couponEles = textContains('单杯标杯饮品兑换券').find()
                    bound = couponEles[ele_index].bounds()
                }
                pressXY(bound.centerX(), bound.centerY(), 150, 500)
                console.log(bound.centerX(), bound.centerY());
                
            }
        }
    } else {
        console.log('没有相关优惠券: ' + titleSub);
    }
    if (text('选择优惠').findOne(1000)){
        actionSleep(back, 500)
    }
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
    
    function selectShop(shopName){
        if (!text('请输入门店名称').findOne(5000)){
            msg.status = 11
            msg.msg = '无法定位门店输入框'
            return false
        } 
        for (let index = 0; index < 8; index++) {
            var ele = textContains(shopName).findOne(500)
            console.log(ele? `"${shopName}"位置: ${ele.bounds().centerY()}; index:${index}`: `页面中未出现"${shopName}"节点, index: ${index}`);
            if (ele && ele.bounds().centerY() < 2100) {
                var shopEle = className('android.widget.TextView').textContains(shopName).findOne(3000)
                if (shopEle) {
                    click(shopEle.bounds().centerX(), shopEle.bounds().centerY())
                    break
                } else {
                    console.log('无法定位商店, 重试次数: ' + index);  
                }                
            } else {
                if (text('请输入门店名称').findOne(1000)){
                    pressSleep('请输入门店名称', 500)
                    var inputEle = text('请输入门店名称').findOne(1000)
                    inputEle? inputEle.setText(shopName) : console.log('无法定位, 重试次数: ' + index)
                } 
            }
        }
        console.log('完成选择');
        if (!text('自提').findOne(8000)) {
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
    var toShopCnt = 0
    // 网络问题可能导致页面无法加载
    while (currentStep < 3) {
        console.log('currentStep: ' + currentStep);
        if (toShopCnt > 3) {
            throw new Error('无法到达"选择城市"界面,请人工处理')
        } else {
            toShopCnt ++
        }
        switch (currentStep){
            case 1:
                whileCnt = 0
                while (!text("手动选择").findOne(400)){
                    pressXY(300, 300, 100, 300)    //  消除弹窗
                    pressXY(300, 300, 100, 300)    //  消除弹窗
                    pressXY(300, 1250, 100, 500);  //   门店自取
                    whileCnt++
                    if (whileCnt >= 5) {
                        break
                    }
                }
                if(_checkUpdateApp(whileCnt) === true){
                    if (!text('首页').findOne(10000)){
                        throw new Error('更新小程序出错,请人工确认')
                    }
                }else if(text("手动选择").findOne(400)){
                    currentStep = 2
                }
                break
            case 2: 
                if (text('选择门店').findOne(1000)){
                    // 页面可能会直接跳转到选择城市导致错误
                    toast('定位到 "选择门店"')
                    actionSleep(back, 500)
                }
                whileCnt = 0
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
        case (selectShop(payload.shopName) === false):
            break;
        default:
            break;
    }
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
        // 当商品缺货时, 加入购物车不能点击, 页面保持在商品选购页. "规格" 只会出现在选购页面
        if (!text('规格').findOne(2000)){
            console.error('添加失败' + shop);
            msg.status = 14      // 商品添加失败
            msg.msg = '商品选购失败'
            msg.payload.shopFailList.push(shop)
            break
        }
        autoSwipe(400, 1300, 400, 500, 300, 500)
        shop.feature.forEach( feat => {
            // text('规格').findOne(2000)
            // autoSwipe(400, 1300, 400, 500, 300, 300)
            var featEle = textContains(feat).findOne(2000)
            if (featEle){
                pressContainsSleep(feat, 100)
            } else {
                if(feat.includes('冷') || feat.includes('冰')){
                    var start = feat.slice(0, 3)
                    var end = feat.slice(-6)
                    var regStr = "^" + start + "[冷冰]{1}" + end + '$'
                    featEle = textMatches(regStr).findOne(2000)
                    if (featEle){
                        click(featEle.bounds().centerX(), featEle.bounds().centerY())
                    } else {
                        console.log(`没有匹配到:${feat}`);
                    }
                } else {
                    console.log(`没有选中饮料属性: ${feat}`);
                    toast(`没有选中饮料属性: ${feat}`)
                }
            }
            if (feat.includes('杯')){
                // 冷/热杯切换时, 商品可能会切换属性,如是加冰相关选项变动, 需要等待页面加载
                sleep(500)
            }
        })
        _addQuantities(shop.quantity)
        pressSleep('加入购物车', 200)
        // 当商品缺货时, 加入购物车不能点击, 页面保持在商品详情选购页. "规格" 只会出现在商品详情选购页面
        switch (false) {
            // 点击加入购物车, 到选购页面可能需要1s到2s页面才能加载完全
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            case isExists("规格", 500, 500):
                break;
            default:
                console.error('添加失败' + shop);
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
    autoSwipe(400, 500, 400, 1900, 400, 800)
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
    text('如有忌口过敏请填写到这儿').findOne(2000)
    while (text('如有忌口过敏请填写到这儿').findOne(300)) {
        counter++
        if (counter > 3){
            return false
        }
        var bounds = text('如有忌口过敏请填写到这儿').findOne(300).bounds()
        setClip(notes);
        if (bounds.centerY() > 1700 && bounds.centerY() < 2150) {
            console.log('获取备注控件编辑点击');
            click(bounds.centerX(), bounds.centerY())
            sleep(800)
        } else {
            console.log('获取备注控件失败' + bounds.centerY());
            pressXY(700, 1950, 200, 800)                // 点击备注输入框
        }
        pressXY(600, 1000, 200, 500)                       // 点击输入法输入框
        var finish = text('完成').findOne(1000) 
        if (!finish) {
            // 输入框未弹出
            console.log('输入框未正常弹出');
            continue
        }
        pressXY(WIDTH/2, finish.bounds().bottom + 80, 200, 300)  // 点击输入法剪贴板上备注
        pressSleep('完成', 400)
        pressXY(523, 1750, 200, 500)  // 点击备注框'保存'按钮
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
    _toPayBottom(payload)
    _useCoupons(payload.coupons)
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