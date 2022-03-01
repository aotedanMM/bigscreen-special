/**
 * `WebsocketHeartbeatJs` constructor.
 *
 * @param {Object} opts
 * {
 *  url                  websocket链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    pingMsg
 * }
 * @api public
 */

function WebsocketHeartbeatJs({
    url, 
    pingTimeout = 15000,
    pongTimeout = 10000,
    reconnectTimeout = 2000,
    pingMsg = 'heartbeat',
    repeatLimit = null
}){
    this.opts ={
        url: url,
        pingTimeout: pingTimeout,
        pongTimeout: pongTimeout,
        reconnectTimeout: reconnectTimeout,
        pingMsg: pingMsg,
        repeatLimit: repeatLimit
    };
    this.ws = null;//websocket实例
    this.repeat = 0;

    //override hook function
    this.onclose = function() {};
    this.onerror = function() {};
    this.onopen = function() {};
    this.onmessage = function() {};
    this.onreconnect = function() {};

    this.createWebSocket();
}
WebsocketHeartbeatJs.prototype.createWebSocket = function(){
    try {
        this.ws = new WebSocket(this.opts.url);
        this.initEventHandle();
    } catch (e) {
        this.reconnect();
        throw e;
    }     
};

WebsocketHeartbeatJs.prototype.initEventHandle = function(){
    this.ws.onclose = function() {
        this.onclose();
        this.reconnect();
    }.bind(this);
    this.ws.onerror =function() {
        this.onerror();
        this.reconnect();
    }.bind(this);
    this.ws.onopen = function() {
        this.repeat = 0;
        this.onopen();
        //心跳检测重置
        this.heartCheck();
    }.bind(this);
    this.ws.onmessage = function(event) {
        this.onmessage(event);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        this.heartCheck();
    }.bind(this);
};

WebsocketHeartbeatJs.prototype.reconnect = function(){
    if(this.opts.repeatLimit>0 && this.opts.repeatLimit <= this.repeat) return;//limit repeat the number
    if(this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++;//必须在lockReconnect之后，避免进行无效计数
    this.onreconnect();
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function() {
        this.createWebSocket();
        this.lockReconnect = false;
    }.bind(this), this.opts.reconnectTimeout);
};
WebsocketHeartbeatJs.prototype.send = function(msg){
    this.ws.send(msg);
};
//心跳检测
WebsocketHeartbeatJs.prototype.heartCheck = function(){
    this.heartReset();
    this.heartStart();
};
WebsocketHeartbeatJs.prototype.heartStart = function(){
    if(this.forbidReconnect) return;//不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        this.ws.send(this.opts.pingMsg);
        //如果超过一定时间还没重置，说明后端主动断开了
        this.pongTimeoutId = setTimeout(function() {
            //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            this.ws.close();
        }.bind(this), this.opts.pongTimeout);
    }.bind(this), this.opts.pingTimeout);
};
WebsocketHeartbeatJs.prototype.heartReset = function(){
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
};
WebsocketHeartbeatJs.prototype.close = function(){
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.heartReset();
    this.ws.close();
};
if(window) window.WebsocketHeartbeatJs = WebsocketHeartbeatJs;