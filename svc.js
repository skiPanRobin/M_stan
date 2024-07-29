import Vue from 'vue';

class Msg extends Vue {
  constructor({ terminal = null }) {
    super({ data: { session: [] } });
    this.ws = null;
    this.cid = null;
    this.uuid = null;
    this.terminal = terminal;
    this.init();
  }

  _send(msg) {
    //私有发送消息
    const data = typeof msg === 'string' ? msg : JSON.stringify(msg);
    //
    this.ws.send(data);
  }
  //心跳检测
  _heart() {
    //心跳检测
    this.pingTimeoutId = setTimeout(() => {
      this._send('ping');
      this._pong();
    }, 20000);
  }
  _pong() {
    if (this.pongTimeoutId) return;
    this.pongTimeoutId = setTimeout(() => {
      console.log('断线重连');
      this.pongTimeoutId = 0;
      this.init();
    }, 5000);
  }
  // 请求封装
  async _post(path, body) {
    let url = `https://pay.lovexiaohuli.com/${path}/`;
    const row = await fetch(url, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });
    return row.json();
  }
  // 获取消息
  _getSessionList() {
    //私有 获取会话列表
    if (!this.uuid) return [];
    clearTimeout(this.sessionTimeoutId);
    this.sessionTimeoutId = setTimeout(async () => {
      const obj = { creator: this.uuid };
      if (this.uuid) this.session = await this._post('ws/getSessionListByUid', obj);
    }, 300);
  }
  //初始化
  init() {
    //私有 初始化socket
    this.ws?.close();
    this.ws = new WebSocket('wss://pay.lovexiaohuli.com');
    this.ws.addEventListener('open', () => setTimeout(() => this.bindUid(), 1000));
    this.ws.addEventListener('close', () => this._pong());
    this.ws.addEventListener('error', () => this._pong());
    this.ws.onmessage = (e) => {
      clearTimeout(this.pingTimeoutId);
      clearTimeout(this.pongTimeoutId);
      this._heart();
      if (e.data === 'pong') return true;
      const obj = JSON.parse(e.data);
      if (obj.type === 'connect') {
        console.log('📢', '连接成功' + obj.cid);
        this.cid = obj.cid;
        return this.$emit('connect');
      }
      this._getSessionList();
      this.broadcast(obj);
    };
  }
  // 设备绑
  async bindUid() {
    const { uuid: uid, name } = cache('mine');
    if (uid && this.cid) {
      this.uuid = uid;
      const cid = this.cid;
      const obj = { uid, name, cid, terminal: this.terminal };
      await this._post('ws/bindUid', obj);
      this._getSessionList();
    }
  }
  async unBind() {
    if (this.uuid) await this._post('ws/unBind', { cid: this.cid, uid: this.uuid });
    cache('mine', null);
  }
  // 给系统/用户发送消息
  async sendToUid(uid = 0, type = 0, data = null) {
    if (!uid) return false;
    const obj = { uid, creator: this.uuid, type, data };
    return this._post('ws/sendtoUid', obj);
  }
  // 广播
  broadcast(e) {
    this.$emit('msg', e);
  }

}
export default Msg
Vue.prototype.$svc = new Msg({ terminal: 'pc' });

// 使用方法
// import {Msg} from svc.js
// svc = new Msg({terminal: 'pc'})
