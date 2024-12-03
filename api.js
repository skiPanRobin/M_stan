const {apiConfig} = require('./config')
var androidId = shell('settings get secure android_id', true).result
const uid = $crypto.digest(androidId, "MD5", {output: 'toString'})    // "fb257b0c1044b5042d4ed7ede37ea1e2"


/** 上传截图
 * @param {string} shotPath -截图路径
*/
function postScreenOss(shotPath){
    var res = http.postMultipart(apiConfig.apiUplaodFile , {
        file: open(shotPath)
    }); 
    let jsonResponse = res.body.json()
    console.info('post response' + JSON.stringify(jsonResponse));
    console.log('online_path: ' + jsonResponse.data.online_path)
    return jsonResponse.data.online_path
}


/** 上传下单截图 (成功, 失败都上传)
 *  @param {string} online_path - 阿里云oss路径
 *  @param {Object} msg 
*/
function updaloadPayPic(online_path, msg){
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": msg.status === 0 ? 'uploadPayPic': 'uploadErrorPic',
        "data": {
            "id": msg.payload.id, //订单id
            "type": msg.status === 0 ? 'uploadPayPic': 'uploadErrorPic',
            "status": msg.status, //是否成功下单  1是2否
            "fileUrl": online_path,
            "msg": msg.msg, // 下单失败的提示
            "shopList": []
        }
    }
    var res = http.postJson(apiConfig.apiMsg, json)
    console.info('updaload pic res: ' + res.body.string())
}


/** 上传错误信息, 成功则不上传
 * @param {Object} errorMsg 
 * @param {string} errorMsg.type
 * @param {number} errorMsg.status
 * @param {string} errorMsg.msg
 * @param {Object} errorMsg.payload
 * @param {string} errorMsg.payload.id
 * @param {string} errorMsg.payload.city
 * @param {string} errorMsg.payload.shopName
 * @param {number} errorMsg.payload.wechatNo
 * @param {string} errorMsg.payload.wechatName
 * @param {Object[]} errorMsg.payload.shopList
*/
function uploadErrorStatus(errorMsg){
    var url = apiConfig.apiMsg
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "errOrder",
        "data": errorMsg
    }
    var res = http.postJson(url, json)
    console.info('updaloadPayPic res: ' + res.body.string())

}


/**接受到任务后, 返回设备状态
 * @param {string} payloadId    - payload.id
 * @param {number} status       - 0: 空闲, 1: 忙碌
*/
function updateDeviceStatus(payloadId, status){
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "deviceStatus",
        "data": {
            "id": payloadId,   //订单id
            "type": 'deviceStatus',
            "status": status,       // 返回设备是否忙碌
            "msg": status === 0 ? '任务开始执行' : status === 1? "任务成功接收": "任务执行完毕"     // 下单失败的提示
        }
    }
    var res = http.postJson(apiConfig.apiMsg, json)
    console.info('updateDeviceStatus: ' + res.body.string())
}

/**设备与服务端绑定
 * @param {string} cid - 
*/
function bindUid(cid){
    var registMessage = {
        "cid": cid,
        "uid": uid, //微信账号uid  目前写死
        "name": device.brand, //微信昵称 目前写死, 不绑定到微信, 绑定到设备
        "terminal": "mini" //目前写死 终端类型  mini小程序  pc 电脑端 app 移动端
    }
    console.log("registMessage " + JSON.stringify(registMessage))
    var r = http.postJson(apiConfig.apiBind, registMessage)
    console.log("bindUid " + r.body.string())
}

function unbindUid(cid){
    var registMessage = {
        "cid": cid,
        "uid": uid, //微信账号uid  目前写
    }
    var r = http.postJson(apiConfig.apiUnbind, registMessage)
    console.log('unbindUid: '+ r.body.string())
}


module.exports = {
    postScreenOss: postScreenOss,
    updaloadPayPic: updaloadPayPic,
    uploadErrorStatus: uploadErrorStatus,
    updateDeviceStatus: updateDeviceStatus,
    bindUid: bindUid,
    unbindUid: unbindUid,
    apiConfig: apiConfig
};