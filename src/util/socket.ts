import publishObjectPath from '@/util/configRegistry';
const path = publishObjectPath.value.wsServerPath;

interface Socket {
  socket: any;
  onopen: any;
  onmessage: any;
  onclose: any;
  handles: any;
  send: any;
  get: any;
  connect: any;
  reconnect: any;
  serverUrl: any;
  reconnectLock: any;
}

// 获取当前客户端id
let sendKey = '';
function getSendKey() {
  // 获取用户信息-从sessionstorage里获取
  const userInfoStr: any = window.sessionStorage.role;
  if (userInfoStr) {
    const userInfo: any = JSON.parse(userInfoStr);
    sendKey = userInfo.loginName;
  } else {
    // 保留原来从url获取用户信息的方式
    const sendSearch = location.hash || location.search;
    const paramName: any = 'loginName';
    if (sendSearch.indexOf(paramName) !== -1) {
      sendKey = sendSearch.split(`${paramName}=`)[1];
    }
  }
  if (!sendKey) {
    sendKey = 'eads';
  }
  console.debug('当前 sendKey = ' + sendKey);
  return sendKey;
}

// 创建Socket
function createSocket(url: any) {
  let ws: any = null;
  // 参数参考
  // https://github.com/joewalnes/reconnecting-websocket
  // const options: any = {
  //   debug: false, // 是否debug
  //   automaticOpen: false,
  //   binaryType: 'blob',
  //   maxReconnectAttempts: 1000, // 最大重连次数
  //   maxReconnectInterval: 30000, // 最大重连
  //   reconnectDecay: 1.5, // 重连延迟
  //   reconnectInterval: 1000, // 重连间隔
  //   timeoutInterval: 2000, // 超时时间
  // };
  // ws = new (window as any).ReconnectingWebSocket(url, null, options);
  // 心跳websocket
  // https://github.com/zimv/websocket-heartbeat-js
  const options = {
    url,
    pingTimeout: 15000,
    pongTimeout: 10000,
    reconnectTimeout: 2000,
    pingMsg: 'heartbeat',
    // repeatLimit: 1000, 重连次数限制
  };
  ws = new (window as any).WebsocketHeartbeatJs(options);
  return ws;
}

/**
 *
 */
class Socket {
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.reconnectLock = 0;
    this.handles = {
      router: {},
      componts: {},
    };
  }
}

Socket.prototype.constructor = Socket;

Socket.prototype.connect = function() {
  this.socket = createSocket(this.serverUrl);
  this.socket.onopen = () => {
    const sendKeyStr: any = getSendKey();
    console.log(`-----【websocket】建立连接  ${sendKeyStr}----------`);
    this.socket.send(sendKeyStr);
  };
  this.socket.onmessage = (...rest: any) => {
    if (rest[0].data === 'pong') { // 心跳返回消息不处理
      return;
    }
    this.onmessage(...rest);
  };
  this.socket.onerror = (...args: any) => {
    console.log('-----【websocket】断开 onerror----------');
  };
  this.socket.onclose = (...args: any) => {
    console.log('-----【websocket】断开 onclose----------');
  };
  // this.socket.open();
};

Socket.prototype.onmessage = function(key: string, type: string, handler: any) {
  if (!arguments.length) { return false; }
  const data = arguments[0][0].data;
  const content = JSON.parse(data).content;
  const option = JSON.parse(content);

  option.forEach((item: any) => {
    if (item.memo.indexOf('.') !== -1) {
      // layout
      const keys = item.memo.split('.')[1];

      this.send(keys, 'router', item.data);

    } else {

      this.send(item.memo, 'componts', item.data);
    }
  });

};

// Socket.prototype.onclose = function() {
//   new Error('socket已经关闭') ;
// };

Socket.prototype.get = function(key: string, type: string, handler: string) {
  if (!this.handles[type][key]) {
    this.handles[type][key] = [];
  }
  this.handles[type][key].push(handler);
};

Socket.prototype.send = function(key: string, type: string) {
  if (!this.handles[type][key]) {
    return false;
  } else {
    // for (let i = 0; i < this.handles[type][key].length; i++) {
    //   this.handles[type][key][i](arguments[2]);
    // }
    for (const i of this.handles[type][key]) {
      i(arguments[2]);
    }
  }
};

const socket = new Socket(path);

socket.connect();

export default socket as any;
