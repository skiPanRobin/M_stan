const {api} = require('./config')

/** 上传截图
 * @param {string} shotPath -截图路径
*/
function postScreenOss(shotPath){
    var res = http.postMultipart(api.apiUplaodFile , {
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
        "type": "uploadPayPic",
        "data": {
            "id": msg.payload.id, //订单id
            "type": msg.status === 0 ? 'uploadPayPic': 'uploadErrorPic',
            "status": msg.status, //是否成功下单  1是2否
            "fileUrl": online_path,
            "msg": msg.msg, // 下单失败的提示
            "shopList": []
        }
    }
    var res = http.postJson(api.apiMsg, json)
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
    var url = api.apiMsg
    var json = {
        "uid": "system",
        "creator": uid, //微信账号uid  目前写死
        "type": "uploadPayPic",
        "data": errorMsg
    }
    var res = http.postJson(url, json)
    console.info('updaloadPayPic res: ' + res.body.string())

}

module.exports = {
    postScreenOss: postScreenOss,
    updaloadPayPic: updaloadPayPic,
    uploadErrorStatus: uploadErrorStatus
};