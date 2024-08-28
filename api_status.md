# 接口描述
## 订单异常
```json
{
    "type": "errorMsg",
    "status": 1,      
    "msg": "openWechat",
    "payload": {
        "id": "payload.id",
        "city": "payload.city",
        "shopName": "payload.shopName",
        "wechatNo": "payload.wechatNo",
        "wechatName": "payload.wechatName",
        "shopList": "payload.shopList",
        "shopFailList": [{}]
    }
}
```
- 商品选购失败时, shopFailList 会保存选购失败的商品信息, 否则该字段不出现

## 异常订单截图
```json
{
  "id": "payload.id",  
  "type": "uploadErrorPic",
  "status": 1,
  "fileUrl": "https://oss.aliyuncs.com/....png",
  "msg": "打开微信失败",
  "shopList": []
}
```
#### 异常订单和异常订单截图状态码表，微信异常：1-9；mstand异常: 11-19
| status | msg                  | 备注                     |
|--------|----------------------|------------------------|
| 1      | openWechat           | 未知异常                   |
| 2      | 打开微信失败               |                        |
| 3      | 无法查找到微信名, 切换微信账号失败   |                        |
| 4      | 无法定位小程序,  确认微信是否操作完成 |                        |
| 5      |                      | 暂未使用该状态码               |
| 6      |                      | 暂未使用该状态码               |
| 7      |                      | 暂未使用该状态码               |
| 8      |                      | 暂未使用该状态码               |
| 9      |                      | 暂未使用该状态码               |
| 11     | 无法定位城市/无法定位门店输入框     |                        |
| 12     | 无法定位到门店              |                        |
| 13     | 清空购物车失败, 请人工检查       |                        |
| 14     | 商品列表中无法定位到商品         | 可能是该门店没有该款咖啡           |
| 15     | 商品选购失败               | 选完规格,点击加入购物车后仍然停留咖啡选购页面 |
| 16     | “去结算”无法点击            | 点击”去结算“按钮之后页面没反应或者未到达结算页面 |
| 17     | 余额不足, 转人工         |          |
| 18     | 没有进入到余额支付页面        |            |
| 19     | 无法定位确认门店.. 请人工确认      |   |

## 设备状态
- 当前只会在设备忙碌是返回响应
```json
{
    "id": "payload.id",
    "type": "deviceStatus",
    "status": 1,      // 0 设备空闲; 1 设备忙碌
    "msg": "设备忙碌"      
}
```