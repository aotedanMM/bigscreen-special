/* eslint-disable no-undef */

/**
 * CloudICP 20.0
 * version: eSDK ICP V600R020C10SPC100
 */
var sdkVersion = "v20.0"
var cloudICP;

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (this == undefined) {
        window.ICPSDK = factory();
    } else {
        // Browser globals (root is window)
        root.ICPSDK = factory();
    }
}(this, function() {
    /**
     * 
     * @param {*} config {
     *  serverAddress: "", //eg: 
     *  serverWSPort: "8015", //
     *  serverHttpPort : "9898",
     *  debugMode: "false",
     *  localMediaServiceAudioPort : ""，
     *  localMediaServiceVideoPort : "",
     *  localMediaServiceWSPort : "",
     *  localDeamonServiceWSPort : "",
     *  sdkStatusNotify:
     * }
     */
    function ICPSDK(config) {

        this.util = new ICPSDK_Util();
        if (!config["serverAddress"] || !this.util.checkIp(config["serverAddress"])) {
            this.util.log({ "logLevel": "error", "logMsg": "serverAddress is invalid" });
            throw new Error("serverAddress is invalid");
            return;
        }

        if (undefined == config["sdkStatusNotify"] || typeof config["sdkStatusNotify"] != "function") {
            this.util.log({ "logLevel": "error", "logMsg": "sdkStatusNotify is invalid" });
            throw new Error("sdkStatusNotify is invalid");
            return;
        }

        if (!config["serverWSPort"] || !this.util.checkPort(config["serverWSPort"])) {
            config["serverWSPort"] = "8015";
        }

        if (!config["serverHttpPort"] || !this.util.checkPort(config["serverHttpPort"])) {
            config["serverHttpPort"] = "8015";
        }

        if (!config["debugMode"] || (config["debugMode"] != "true" && config["debugMode"] != "false")) {
            config["debugMode"] = "false";
        }

        if (!config["localMediaServiceAudioPort"] || !this.util.checkPort(config["localMediaServiceAudioPort"])) {
            config["localMediaServiceAudioPort"] = "8002";
        }

        if (!config["localMediaServiceVideoPort"] || !this.util.checkPort(config["localMediaServiceVideoPort"])) {
            config["localMediaServiceVideoPort"] = "8002";
        }

        if (!config["localMediaServiceWSPort"] || !this.util.checkPort(config["localMediaServiceWSPort"])) {
            config["localMediaServiceWSPort"] = "17802";
        }

        if (!config["localDeamonServiceWSPort"] || !this.util.checkPort(config["localDeamonServiceWSPort"])) {
            config["localDeamonServiceWSPort"] = "17801";
        }

        if (!config["mrsServerIP"] || !this.util.checkIp(config["mrsServerIP"])) {
            config["mrsServerIP"] = "";
        }

        config["sdkServerHttpTimeout"] = "60000";

        this.config = config;
        this.dispatch = {};
        this.dispatch.auth = new ICPSDK_Dispatch_Auth();
        this.dispatch.event = new ICPSDK_Dispatch_Event();
        this.dispatch.gis = new ICPSDK_Dispatch_GIS();
        this.dispatch.sms = new ICPSDK_Dispatch_Sms();
        this.dispatch.voice = new ICPSDK_Dispatch_Voice();
        this.dispatch.video = new ICPSDK_Dispatch_Video();
        this.dispatch.group = new ICPSDK_Dispatch_Group();
        this.dispatch.webSocket = new ICPSDK_Dispatch_WebSocket();
        this.dispatch.device = new ICPSDK_Dispatch_Device();
        this.dispatch.query = new ICPSDK_Dispatch_Query();
        this.dispatch.conf = new ICPSDK_Dispatch_Conf();
        this.userInfo = {
            "session": "",
            "isdn": "",
            "sdkVersion": sdkVersion
        };
        this.dispatchSdkStatus = "-1";
        cloudICP = this;

        // 建立一个定时器，监控是否离线
        setInterval(function() {
            if (!navigator.onLine) {
                logoutCleanUp();
                var event = {};
                event["eventName"] = "OnDisConnection";
                event["moduleType"] = "3";
                cloudICP.dispatch.event.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);
            }
        }, 10 * 1000);

        this.dispatch.webSocket.connectToLocalDeamon();
    };

    /**
     * @param data {
     *  "status" : "" 0//sdk初始化成功; 1: sdk连接mediaserver的守护进程失败；2: sdk连接mediaserver的业务进程失败；3: sdk获取本地ip失败
     *  "desc" : ""
     * }
     */
    ICPSDK.prototype.reportDispatchSdkStatus = function(data) {
        cloudICP.util.sendLogOut("sdkStatusNotify: sdkstatus is " + JSON.stringify(data));
        this.dispatchSdkStatus = data["status"];
        if (undefined == this.config["sdkStatusNotify"] || typeof this.config["sdkStatusNotify"] != "function") {
            return;
        }
        this.config["sdkStatusNotify"](data);
    }

    ICPSDK.prototype.getSdkServerUrl = function() {
        return "https://" + this.config["serverAddress"] + ":" + this.config["serverHttpPort"] + "/sdkserver";
    }

    ICPSDK.prototype.getSdkServerWssUrl = function() {
        return "wss://" + this.config["serverAddress"] + ":" + this.config["serverWSPort"] + "/sdkserver?agentVersion=2.0";
    }

    ICPSDK.prototype.getMediaServerUrl = function() {
        return "wss://localhost.cloudicp.huawei.com:" + this.config["localMediaServiceWSPort"];
    }

    ICPSDK.prototype.getLocalDeamonUrl = function() {
        return "wss://localhost.cloudicp.huawei.com:" + this.config["localDeamonServiceWSPort"];
    }

    return ICPSDK;
}));

function ICPSDK_Dispatch_Auth() {
    this.USER_SEND_HEART_INTERVAL = 30000; //心跳间隔时间30s
    this.VDM_SESSION_TOKEN_INTERVAL = 600000; //心跳间隔时间60s
    this.MAX_PASSWORD_LENGTH = 18; //最大密码长度
    this.errorHeartNumber = 0; //异常心跳次数
    this.USER_SEND_HEART_MAX_TRY = 3; //最大尝试次数
    this.sendHeartbeatTimeOutId = "";
    this.vdmtokenRefresh = "";

    this.sdkserverVersion = "";
};

/**
 * unifiedLogin() unified Login
 * @param {Object} param {
 *  user: ,
 *  password: ,
 *  force: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Auth.prototype.unifiedLogin = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiedLogin: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiedLogin: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (cloudICP.dispatchSdkStatus == "-1") {
        result["rsp"] = "-3";
        result["desc"] = "unifiedLogin: sdk is doing init. please wait";
        param["callback"](result);
        return;
    }

    if (undefined == cloudICP.config["localIP"] || "" == cloudICP.config["localIP"]) {
        result["rsp"] = "-4";
        result["desc"] = "unifiedLogin: sdk init failed. so cannot get localIP.";
        param["callback"](result);
        return;
    }

    if (undefined == cloudICP.config["cameraInfo"]) {
        result["rsp"] = "-5";
        result["desc"] = "unifiedLogin: sdk init failed. so cannot get cameraInfo.";
        param["callback"](result);
        return;
    }

    var loginParam = {};
    var result = {
        "rsp": "-2",
        "desc": ""
    };

    if (!cloudICP.util.checkUserName(param["user"])) {
        result["desc"] = "unifiedLogin: user is invalid";
        param["callback"](result);
        return;
    }

    if (!(param["password"] && param["password"].length >= 1 && param["password"].length <= this.MAX_PASSWORD_LENGTH)) {
        result["desc"] = "unifiedLogin: password is invalid";
        param["callback"](result);
        return;
    }

    loginParam["password"] = param["password"];
    loginParam["localip"] = cloudICP.config["localIP"];

    if (param["force"] && param["force"] == "true") {
        loginParam["force"] = param["force"];
    }

    if (undefined != cloudICP.config["udcIP"] && undefined != cloudICP.config["udcPort"]) {
        loginParam["serverip"] = cloudICP.config["udcIP"];
        loginParam["serverport"] = cloudICP.config["udcPort"];
    } else {
        loginParam["serverip"] = "";
        loginParam["serverport"] = "";
    }

    param["user"] = encodeURIComponent(param["user"]);

    var url = cloudICP.getSdkServerUrl() + "/v1/register/" + param["user"] + "/unifilogin";

    // 在登录成功后，自动注册websocket的事件通知，故要对login的callbacl进行封装
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "async": false,
        "data": loginParam,
        "callback": function(data) {
            if (data["rsp"] == "4011") {
                logoutCleanUp();
                data["rsp"] = "0";
                // login success, 保存session并删除，防止暴露给用户
                cloudICP.userInfo["session"] = data["session"];
                if (undefined != data["session"]) {
                    delete data.session;
                }
                var urlArray = url.split("/");
                // cloudICP.userInfo["isdn"] = param["isdn"];
                cloudICP.userInfo["isdn"] = data["isdn"]

                // delete data["isdn"]
                cloudICP.userInfo["isUnified"] = true;

                cloudICP.userInfo["serverVersion"] = data["version"]

                //登录成功, 启动心跳
                clearTimeout(cloudICP.dispatch.auth.sendHeartbeatTimeOutId);
                cloudICP.dispatch.auth.errorHeartNumber = 0;
                cloudICP.dispatch.auth.sendHeartbeatTimeOutId = setTimeout(function() {
                    sendHeartbeat();
                }, cloudICP.dispatch.auth.USER_SEND_HEART_INTERVAL);

                //连接websocket
                cloudICP.dispatch.webSocket.connectToSDKServer();

                clearInterval(cloudICP.dispatch.auth.vdmtokenRefresh);

                cloudICP.dispatch.auth.vdmtokenRefresh = setInterval(function() {
                    var murl = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/vmdsession";
                    var majaxCfg = {
                        "type": "GET",
                        "url": murl,
                        "data": null,
                        "callback": function(mdata) {}
                    }
                    cloudICP.util.ajax(majaxCfg);
                }, cloudICP.dispatch.auth.VDM_SESSION_TOKEN_INTERVAL);
            } else if (data["rsp"] == "104") {
                cloudICP.userInfo["session"] = data["session"];
            }

            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * unifiedLogout() unified logout
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Auth.prototype.unifiedLogout = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiedLogout: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiedLogout: callback is not a function" });
        return;
    }

    var loginParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unifiedLogout: User not logged.";
        param["callback"](result);
        return;
    }

    if (cloudICP.userInfo["isUnified"] && !cloudICP.userInfo["isUnified"]) {
        result["desc"] = "logoutFromMDC: User not logged by unifiedLogin.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/register/" + cloudICP.userInfo["isdn"] + "/unifilogout";

    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "async": false,
        "data": null,
        "callback": function(data) {
            //如果登出成功，清理用户信息
            delete data["user"]
            delete data["ipccserveripport"]
            if (data["rsp"] == "4012" || data["rsp"] == "4017") {
                data["rsp"] = "0";
                logoutCleanUp();
            }

            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * unifiPasswordChange() change password of user
 * @param {Object} param {
 *  user: ,
 *  newPassword: ,
 *  oldPassword: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Auth.prototype.unifiPasswordChange = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiPasswordChange: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unifiPasswordChange: callback is not a function" });
        return;
    }

    var unifiPasswordChangeParam = {};
    var result = {
        "rsp": "-2",
        "desc": ""
    };

    if (!cloudICP.util.checkUserName(param["user"])) {
        result["desc"] = "unifiPasswordChange: user is invalid.";
        param["callback"](result);
        return;
    }

    if (!(param["newPassword"] && param["newPassword"].length >= 1 && param["newPassword"].length <= this.MAX_PASSWORD_LENGTH)) {
        result["desc"] = "unifiPasswordChange: newPassword is invalid";
        param["callback"](result);
        return;
    }

    if (!(param["oldPassword"] && param["oldPassword"].length >= 1 && param["oldPassword"].length <= this.MAX_PASSWORD_LENGTH)) {
        result["desc"] = "unifiPasswordChange: oldPassword is invalid";
        param["callback"](result);
        return;
    }

    unifiPasswordChangeParam["newPassword"] = param["newPassword"];
    unifiPasswordChangeParam["oldPassword"] = param["oldPassword"];

    var url = cloudICP.getSdkServerUrl() + "/v1/register/" + param["user"] + "/unifipassword";

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": unifiPasswordChangeParam,
        "callback": function(data) {
            delete data["externs"];
            delete data["isdn"];
            delete data["method"];
            delete data["user"];
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * 发送心跳
 */
function sendHeartbeat() {
    if (!cloudICP.userInfo["isdn"]) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "sendHeartbeat: User not logged." });
        return;
    }
    var url = cloudICP.getSdkServerUrl() + "/v1/heartbeat/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                cloudICP.dispatch.auth.errorHeartNumber = 0;
            } else if (data["rsp"] == "10000") {
                //鉴权失败
                cloudICP.userInfo["isdn"] = "";
                cloudICP.userInfo["session"] = "";
                cloudICP.util.log({ "logLevel": "error", "logMsg": "sendHeartbeat: send failed. the data is " + JSON.stringify(data) });

                logoutCleanUp();

                var event = {};
                event["eventName"] = "OnDisConnection";
                event["moduleType"] = "5";
                cloudICP.dispatch.event.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);
                return;
            } else {
                cloudICP.dispatch.auth.errorHeartNumber++;
                cloudICP.util.log({ "logLevel": "error", "logMsg": "sendHeartbeat: send failed. the data is " + JSON.stringify(data) });
            }
            if (cloudICP.dispatch.auth.errorHeartNumber > cloudICP.dispatch.auth.USER_SEND_HEART_MAX_TRY) {
                logoutCleanUp();

                var event = {};
                event["eventName"] = "OnDisConnection";
                event["moduleType"] = "5";
                cloudICP.dispatch.event.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);
                return;
            }
            cloudICP.dispatch.auth.sendHeartbeatTimeOutId = setTimeout(function() {
                sendHeartbeat();
            }, cloudICP.dispatch.auth.USER_SEND_HEART_INTERVAL);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};


function logoutCleanUp() {
    delete cloudICP.userInfo["isdn"];
    cloudICP.userInfo["session"] = "";
    delete cloudICP.userInfo["isUnified"];
    clearTimeout(cloudICP.dispatch.auth.sendHeartbeatTimeOutId);
    clearInterval(cloudICP.dispatch.auth.vdmtokenRefresh);
    var callStatusMgr = cloudICP.util.callStatusMgr;

    if (cloudICP.dispatch.webSocket.isMSPConflicted != true) {
        // 停止振铃音
        var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
            parseInt(callStatusMgr.callingCid)
        );

        cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

        // 删除所有振铃
        var param = "{\"description\":\"msp_clean_tone\", \"cmd\": 131080}";

        cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

        // 删除所有通道
        var param = "{\"description\":\"msp_clean_channel\", \"cmd\": 65550}";

        cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
    } else {
        cloudICP.dispatch.webSocket.isMSPConflicted = false;
    }

    callStatusMgr.cleanUp();
    cloudICP.dispatch.conf.chairName = "chairman";
    cloudICP.dispatch.gis.subList = [];
    cloudICP.dispatch.device.isDTMFDone = true;

    cloudICP.dispatch.group.current_groupcall_num = 0;
    cloudICP.dispatch.group.isCurrentPtt = { "grpid": "-1", "isPtt": false };

    cloudICP.dispatch.video.currentVideoAbility = 0;
};

function ICPSDK_Dispatch_Conf() {
    this.MAX_CONF_ID = "9223372036854775807";

    this.chairName = "chairman";

    this.MAX_CONF_NUM = 1;

    this.MAX_MEMBER_NUM = 60;
};

/**
 * createConf
 * @param {
 *  isVideo :
 *  memberInfos : [
 *   {
 *       "number": 
 *       "name":
 *       "isCamera":
 *       "isWatchOnly"
 *       "h265"
 *   }
 *  ]
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.createConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "createConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "createConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "createConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.isBool(param["isVideo"])) {
        result["desc"] = "createConf: isVideo is invalid";
        param["callback"](result);
        return;
    }

    // TODO: 会议人数规格需要确认。
    if (!(param["memberInfos"] && Array.isArray(param["memberInfos"]))) {
        result["desc"] = "createConf: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    var length = param["memberInfos"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberInfos"][i];
        if (!cloudICP.util.checkIsdn(user["number"])) {
            result["desc"] = "createConf: number is invalid";
            param["callback"](result);
            return;
        }

        if (!user["name"]) {
            result["desc"] = "createConf: name is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["isCamera"])) {
            result["desc"] = "createConf: isCamera is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["isWatchOnly"])) {
            result["desc"] = "createConf: isWatchOnly is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["h265"])) {
            result["desc"] = "createConf: h265 is invalid";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentCallState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "createConf: There is a call is ringing."
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;

    if (callStatusMgr.currentGoingConf != 0) {
        result["rsp"] = "-5";
        result["desc"] = "createConf: The number of conf is limited to " + this.MAX_CONF_NUM;
        param["callback"](result);
        return;
    }

    if (param["isVideo"] != "false") {
        if (callStatusMgr.numberOfCall[callStatusMgr.VIDEO] + callStatusMgr.numberOfCall[callStatusMgr.VIDEOCONF] >= cloudICP.dispatch.video.MAX_VIDEO_DIAL_NUM ||
            cloudICP.dispatch.video.currentVideoAbility >= cloudICP.dispatch.video.MAX_VIDEO_ABILITY) {
            result["rsp"] = "-7";
            result["desc"] = "createConf: The ability of video conf is limited";
            param["callback"](result);
            return;
        }
    }


    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "createConf: This call is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var tmpMemberInfos = param["memberInfos"].slice();

    var tmpArr = []
    var isHaveChairMan = false;

    for (var index = 0; index < tmpMemberInfos.length; index++) {
        if (tmpMemberInfos[index]["number"] == cloudICP.userInfo["isdn"]) {
            isHaveChairMan = true;
        } else {
            if (tmpMemberInfos[index]["isWatchOnly"] == "true") {
                result["rsp"] = "-2";
                result["desc"] = "createConf: memberInfos is invalid";
                param["callback"](result);
                return;
            }
        }
    }

    if (!isHaveChairMan) {
        tmpMemberInfos.push({
            "number": cloudICP.userInfo["isdn"],
            "name": cloudICP.dispatch.conf.chairName,
            "isCamera": "false",
            "isWatchOnly": "false",
            "h265": "false"
        });
    }

    for (var index = 0; index < tmpMemberInfos.length; index++) {
        tmpArr.push(tmpMemberInfos[index]["number"]);
    }

    var retArr = cloudICP.util.findDuplicates(tmpArr);

    if (retArr.length != 0) {
        result["rsp"] = "-2";
        result["desc"] = "createConf: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    if (tmpMemberInfos.length > cloudICP.dispatch.conf.MAX_MEMBER_NUM) {
        result["rsp"] = "-8";
        result["desc"] = "createConf: memberInfos is out of size";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "create",
        "param": {
            "confInfo": {
                "isVideo": param["isVideo"],
                "isRecorded": "false",
            },
            "memberInfos": tmpMemberInfos
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * joinConf
 * @param {
 *  confId : ,
 *  fmt : ,
 *  unifiedAccessCode: ,
 *  passcode: ,
 *  isVideo: 
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.joinConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "joinConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "joinConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "joinConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "joinConf: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isNumber(param["unifiedAccessCode"])) {
        result["desc"] = "joinConf: unifiedAccessCode is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isNumber(param["passcode"])) {
        result["desc"] = "joinConf: passcode is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isBool(param["isVideo"])) {
        result["desc"] = "joinConf: isVideo is invalid";
        param["callback"](result);
        return;
    }

    if (!param["fmt"]) {
        param["fmt"] = "1080P";
    }

    var fmts = ["1080P", "720P", "D1", "CIF", "GCIF"];
    if (param["fmt"] && !cloudICP.util.includes(fmts, param["fmt"])) {
        result["desc"] = "joinConf: The fmt is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentCallState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "joinConf: There is a call is ringing."
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;

    if (callStatusMgr.currentGoingConf != 0) {
        result["rsp"] = "-5";
        result["desc"] = "joinConf: The number of conf is limited to " + this.MAX_CONF_NUM;
        param["callback"](result);
        return;
    }

    if (param["isVideo"] != "false") {
        if (callStatusMgr.numberOfCall[callStatusMgr.VIDEO] + callStatusMgr.numberOfCall[callStatusMgr.VIDEOCONF] >= cloudICP.dispatch.video.MAX_VIDEO_DIAL_NUM ||
            cloudICP.dispatch.video.currentVideoAbility >= cloudICP.dispatch.video.MAX_VIDEO_ABILITY) {
            result["rsp"] = "-7";
            result["desc"] = "joinConf: The ability of video conf is limited";
            param["callback"](result);
            return;
        }
    }


    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "joinConf: This call is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "join",
        "param": {
            "confId": param["confId"],
            "fmt": param["fmt"],
            "video_format": cloudICP.config.cameraInfo.toString(),
            "audio_format": "1",
            "unifiedAccessCode": param["unifiedAccessCode"],
            "passcode": param["passcode"],
            "isVideo": param["isVideo"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * acceptAudioConf
 * @param {
 *  cid :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.acceptAudioConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "acceptAudioConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "acceptAudioConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "acceptAudioConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "acceptAudioConf: cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        result["rsp"] = "-40002";
        result["desc"] = "";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;

    if (callStatusMgr.currentGoingConf != 0) {
        result["rsp"] = "-5";
        result["desc"] = "acceptAudioConf: The number of conf is limited to " + this.MAX_CONF_NUM;
        param["callback"](result);
        return;
    }
    if (callStatusMgr.connectingCallMgr[callStatusMgr.VIDEO].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.DISCREET].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.VIDEOCONF].length != 0) {
        result["rsp"] = "-4";
        result["desc"] = "acceptAudioConf: The call is conflicted with other calls"
        param["callback"](result);
        return;
    };

    var requestParam = {
        "opt": "audioAccept",
        "cid": param["cid"],
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * acceptVideoConf
 * @param {
 *  cid :
 *  windowInfo: {
 *      width:
 *      height:
 *      posX:
 *      posY:
 *  }
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.acceptVideoConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "acceptVideoConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "acceptVideoConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "acceptVideoConf: The user does not logined";
        param["callback"](result);
        return;
    }

    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "acceptVideoConf: cid is invalid";
        param["callback"](result);
        return;
    }

    if (param["windowInfo"] != undefined) {
        if (!cloudICP.util.isNumber(param["windowInfo"]["width"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "acceptVideoConf: The width is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["height"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "acceptVideoConf: The height is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posX"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "acceptVideoConf: The posX is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posY"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "acceptVideoConf: The posY is invalid";
            param["callback"](result);
            return;
        }

        var callStatusMgr = cloudICP.util.callStatusMgr;
        callStatusMgr.windowInfos[param["cid"]] = param["windowInfo"];
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        result["rsp"] = "-40002";
        result["desc"] = "";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentGoingConf != 0) {
        result["rsp"] = "-5";
        result["desc"] = "acceptVideoConf: The number of conf is limited to " + this.MAX_CONF_NUM;
        param["callback"](result);
        return;
    }
    if (callStatusMgr.connectingCallMgr[callStatusMgr.VIDEO].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.DISCREET].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.VIDEOCONF].length != 0) {
        result["rsp"] = "-4";
        result["desc"] = "acceptVideoConf: The call is conflicted with other calls"
        param["callback"](result);
        return;
    };

    var requestParam = {
        "opt": "videoAccept",
        "cid": param["cid"],
        "param": {
            "video_format": cloudICP.config.cameraInfo.toString(),
            "audio_format": "1"
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * rejectAudioConf
 * @param {
 *  cid :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.rejectAudioConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "rejectAudioConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "rejectAudioConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "rejectAudioConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "rejectAudioConf: cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        var str;
        if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.CONNECTING) {
            str = "rejectAudioConf: The cid is answered";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.HOLD) {
            str = "rejectAudioConf: The cid is holded";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.RELEASE) {
            str = "rejectAudioConf: The cid is ended";
        } else {
            str = "rejectAudioConf: The cid is invalid";
        }
        result["rsp"] = "-4";
        result["desc"] = str;
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "audioReject",
        "cid": param["cid"],
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                // 停止振铃音
                var mediaParam = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(param["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, { "value": { "cid": param["cid"] } });
            }

            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * rejectVideoConf
 * @param {
 *  cid :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.rejectVideoConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "rejectVideoConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "rejectVideoConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "rejectVideoConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "rejectVideoConf: cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        var str;
        if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.CONNECTING) {
            str = "rejectVideoConf: The cid is answered";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.HOLD) {
            str = "rejectVideoConf: The cid is holded";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.RELEASE) {
            str = "rejectVideoConf: The cid is ended";
        } else {
            str = "rejectVideoConf: The cid is invalid";
        }
        result["rsp"] = "-4";
        result["desc"] = str;
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "videoReject",
        "cid": param["cid"],
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                // 停止振铃音
                var mediaParam = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(param["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, { "value": { "cid": param["cid"] } });
            }

            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * addConfMembers @param {
 *  confId :
 *  memberInfos : [
 *   {
 *       "number": 
 *       "name":
 *       "isCamera":
 *       "isWatchOnly":
 *       "h265":
 *   }
 *  ]
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.addConfMembers = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addConfMembers: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addConfMembers: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "addConfMembers: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "addConfMembers: confId is invalid";
        param["callback"](result);
        return;
    }

    // TODO: 会议人数规格需要确认。
    if (!(param["memberInfos"] && Array.isArray(param["memberInfos"]) && param["memberInfos"].length > 0)) {
        result["desc"] = "addConfMembers: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    var length = param["memberInfos"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberInfos"][i];
        if (!cloudICP.util.checkIsdn(user["number"])) {
            result["desc"] = "addConfMembers: number is invalid";
            param["callback"](result);
            return;
        }

        if (!user["name"]) {
            result["desc"] = "addConfMembers: name is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["isCamera"])) {
            result["desc"] = "addConfMembers: isCamera is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["isWatchOnly"])) {
            result["desc"] = "addConfMembers: isWatchOnly is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isBool(user["h265"])) {
            result["desc"] = "addConfMembers: h265 is invalid";
            param["callback"](result);
            return;
        }
    }

    var tmpArr = []
    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];

    // 检查当前会议状态
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "addConfMembers: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "addConfMembers: The chairman is leaved.";
            param["callback"](result);
            return;
        }

        if (confInfo["confMembersStatus"] && param["memberInfos"].length + confInfo["confMembersStatus"].length > cloudICP.dispatch.conf.MAX_MEMBER_NUM) {
            result["rsp"] = "-9";
            result["desc"] = "addConfMembers: memberInfos is out of size";
            param["callback"](result);
            return;
        }
    }

    for (var index = 0; index < param["memberInfos"].length; index++) {
        if (param["memberInfos"][index]["number"] == cloudICP.userInfo["isdn"]) {
            result["rsp"] = "-2";
            result["desc"] = "addConfMembers: memberInfos is invalid";
            param["callback"](result);
            return;
        } else {
            if (param["memberInfos"][index]["isWatchOnly"] == "true") {
                result["rsp"] = "-2";
                result["desc"] = "addConfMembers: memberInfos is invalid";
                param["callback"](result);
                return;
            }
        }
        tmpArr.push(param["memberInfos"][index]["number"]);


        var userStatus = cloudICP.util.callStatusMgr.userStatusMgr[param["memberInfos"][index]["number"]];
        if (userStatus != undefined && userStatus == "4021") {
            result["rsp"] = "-8";
            result["desc"] = "addConfMembers: The member is rigning.";
            param["callback"](result);
            return;
        }
    }
    var retArr = cloudICP.util.findDuplicates(tmpArr);

    if (retArr.length != 0) {
        result["rsp"] = "-2";
        result["desc"] = "addConfMembers: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    if (param["memberInfos"].length > cloudICP.dispatch.conf.MAX_MEMBER_NUM) {
        result["rsp"] = "-9";
        result["desc"] = "addConfMembers: memberInfos is out of size";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "addMembers",
        "param": {
            "confId": param["confId"],
            "memberInfos": param["memberInfos"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * hangupConfMember @param {
 *  confId :
 *  memberInfo : {
 *       "number":
 *   }
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.hangupConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "hangupConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "hangupConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "hangupConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "hangupConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["memberInfo"]["number"])) {
        result["desc"] = "hangupConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "hangupConfMember: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "hangupConfMember: The chairman is leaved.";
            param["callback"](result);
            return;
        }

        for (var index = 0; index < confInfo["value"]["confMembersStatus"].length; index++) {
            var confMember = confInfo["value"]["confMembersStatus"][index];

            if (confMember["number"] == param["memberInfo"]["number"] && (confMember["participantStatus"] == "Disconnected" ||
                    confMember["participantStatus"] == "Connecting")) {
                result["rsp"] = "-7";
                result["desc"] = "hangupConfMember: The member is disconnected or connecting.";
                param["callback"](result);
                return;
            }
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "hangupConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    if (param["memberInfo"]["number"] == cloudICP.userInfo["isdn"]) {
        result["rsp"] = "-2";
        result["desc"] = "hangupConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "hangupMember",
        "param": {
            "confId": param["confId"],
            "memberInfo": param["memberInfo"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * callConfMember @param {
 *  confId :
 *  memberInfo : 
 *   {
 *       "number":
 *   }
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.callConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "callConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "callConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "callConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "callConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["memberInfo"]["number"])) {
        result["desc"] = "callConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "callConfMember: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-8";
            result["desc"] = "callConfMember: The chairman is leaved.";
            param["callback"](result);
            return;
        }

        for (var index = 0; index < confInfo["value"]["confMembersStatus"].length; index++) {
            var confMember = confInfo["value"]["confMembersStatus"][index];
            if (confMember["number"] == param["memberInfo"]["number"] && (confMember["participantStatus"] == "Connected" ||
                    confMember["participantStatus"] == "Connecting")) {
                result["rsp"] = "-7";
                result["desc"] = "callConfMember: The member is connected or connecting.";
                param["callback"](result);
                return;
            }
        }
    }

    var userStatus = cloudICP.util.callStatusMgr.userStatusMgr[param["memberInfo"]["number"]];
    if (userStatus != undefined && userStatus == "4021") {
        result["rsp"] = "-6";
        result["desc"] = "callConfMember: The member is already conference member or is ringing conference member.";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-8";
        result["desc"] = "callConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "recallMember",
        "param": {
            "confId": param["confId"],
            "memberInfo": param["memberInfo"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * endConf @param {
 *  confId :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.endConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "endConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "endConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "endConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "endConf: confId is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"] + "/close/" + param["confId"];

    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
                if (confInfo) {
                    confInfo["isEnding"] = true;
                }
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * exitAudioConf
 * @param {
 *  cid :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.exitAudioConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "exitAudioConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "exitAudioConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "exitAudioConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "exitAudioConf: cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call["caller"] != cloudICP.userInfo["isdn"] && call.callState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "exitAudioConf: The callee can't release a ringing call.";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[cloudICP.util.callStatusMgr.currentGoingConf];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] == confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "exitAudioConf: The chairman can't leave conf.";
            param["callback"](result);
            return;
        }
    }

    var requestParam = {
        "opt": "audioLeave",
        "cid": param["cid"],
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "1") {
                data["rsp"] = "0";
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * exitVideoConf
 * @param {
 *  cid :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.exitVideoConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "exitVideoConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "exitVideoConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "exitVideoConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "exitVideoConf: cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call["caller"] != cloudICP.userInfo["isdn"] && call.callState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "exitVideoConf: The callee can't release a ringing call.";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[cloudICP.util.callStatusMgr.currentGoingConf];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] == confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "exitVideoConf: The chairman can't leave conf.";
            param["callback"](result);
            return;
        }
    }

    var requestParam = {
        "opt": "videoLeave",
        "cid": param["cid"],
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "1") {
                data["rsp"] = "0";
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * muteConfMember @param {
 *  confId :
 *  isMute :
 *  number :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.muteConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "muteConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "muteConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isBool(param["isMute"])) {
        result["desc"] = "muteConfMember: isMute is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["number"])) {
        result["desc"] = "muteConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if ((cloudICP.userInfo["isdn"] != param["number"]) && (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"])) {
            result["rsp"] = "-5";
            result["desc"] = "muteConfMember: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "muteConfMember: The current member is leaved.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "muteConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "muteMember",
        "param": {
            "confId": param["confId"],
            "isMute": param["isMute"],
            "number": param["number"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * muteConf @param {
 *  confId :
 *  isMute :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.muteConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "muteConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "muteConf: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isBool(param["isMute"])) {
        result["desc"] = "muteConf: isMute is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "muteConf: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "muteConf: The chairman is leaved.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "muteConf: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "muteConf",
        "param": {
            "confId": param["confId"],
            "isMute": param["isMute"],
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * watchConfMember @param {
 *  confId :
 *  number :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.watchConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "watchConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "watchConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "watchConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "watchConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["number"])) {
        result["desc"] = "watchConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "watchConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "watchMember",
        "param": {
            "confId": param["confId"],
            "number": param["number"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * broadcastMixPicture @param {
 *  confId :
 *  mixPictureType :
 *  memberInfos : [
 *   {
 *       "number": 
 *   }
 *  ]
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.broadcastMixPicture = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "broadcastMixPicture: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "broadcastMixPicture: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "broadcastMixPicture: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "broadcastMixPicture: confId is invalid";
        param["callback"](result);
        return;
    }

    var types = ["0", "1", "2"];
    if (!param["mixPictureType"] || !cloudICP.util.includes(types, param["mixPictureType"])) {
        result["desc"] = "broadcastMixPicture: The mixPictureType is invalid";
        param["callback"](result);
        return;
    }

    // TODO: 会议人数规格需要确认。
    if (!(param["memberInfos"] && Array.isArray(param["memberInfos"]) && param["memberInfos"].length > 0)) {
        result["desc"] = "broadcastMixPicture: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    var length = param["memberInfos"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberInfos"][i];
        if (!cloudICP.util.checkIsdn(user["number"])) {
            result["desc"] = "broadcastMixPicture: number is invalid";
            param["callback"](result);
            return;
        }
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "broadcastMixPicture: The permission of chairman is required.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "broadcastMixPicture: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "broadcastMix",
        "param": {
            "confId": param["confId"],
            "mixPictureType": param["mixPictureType"],
            "memberInfos": param["memberInfos"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * watchMixPicture @param {
 *  confId :
 *  mixPictureType :
 *  memberInfos : [
 *   {
 *       "number": 
 *   }
 *  ]
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.watchMixPicture = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "watchMixPicture: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "watchMixPicture: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "watchMixPicture: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "watchMixPicture: confId is invalid";
        param["callback"](result);
        return;
    }

    var types = ["0", "1", "2"];
    if (!param["mixPictureType"] || !cloudICP.util.includes(types, param["mixPictureType"])) {
        result["desc"] = "watchMixPicture: The mixPictureType is invalid";
        param["callback"](result);
        return;
    }

    // TODO: 会议人数规格需要确认。
    if (!(param["memberInfos"] && Array.isArray(param["memberInfos"]) && param["memberInfos"].length > 0)) {
        result["desc"] = "watchMixPicture: memberInfos is invalid";
        param["callback"](result);
        return;
    }

    var length = param["memberInfos"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberInfos"][i];
        if (!cloudICP.util.checkIsdn(user["number"])) {
            result["desc"] = "watchMixPicture: number is invalid";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "watchMixPicture: The member is leaved.";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "watchMixPicture: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "watchMixPicture: The chairman is leaved.";
            param["callback"](result);
            return;
        }
    }

    var requestParam = {
        "opt": "watchMix",
        "param": {
            "confId": param["confId"],
            "mixPictureType": param["mixPictureType"],
            "memberInfos": param["memberInfos"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * broadcastConfMember @param {
 *  confId :
 *  number :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.broadcastConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "broadcastConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "broadcastConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "broadcastConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "broadcastConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["number"])) {
        result["desc"] = "broadcastConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "broadcastConfMember: The permission of chairman is required.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "broadcastConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "broadcastMember",
        "param": {
            "confId": param["confId"],
            "number": param["number"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * cancelBroadcastConfMember @param {
 *  confId :
 *  number :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.cancelBroadcastConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelBroadcastConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelBroadcastConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "cancelBroadcastConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "cancelBroadcastConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["number"])) {
        result["desc"] = "cancelBroadcastConfMember: number is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "cancelBroadcastConfMember: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "cancelBroadcastConfMember: The chairman is leaved.";
            param["callback"](result);
            return;
        }

        // 限制只能取消广播正在广播中的成员
        if (confInfo["value"]["confStatus"]["broadcast"] != param["number"]) {
            result["rsp"] = "-7";
            result["desc"] = "cancelBroadcastConfMember: The member is not broadcasting.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "cancelBroadcastConfMember: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "cancelBroadcastMember",
        "param": {
            "confId": param["confId"],
            "number": param["number"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * cancelBroadcastMixPicture @param {
 *  confId :
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.cancelBroadcastMixPicture = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelBroadcastMixPicture: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelBroadcastMixPicture: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "cancelBroadcastMixPicture: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "cancelBroadcastMixPicture: confId is invalid";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-5";
            result["desc"] = "cancelBroadcastMixPicture: The permission of chairman is required.";
            param["callback"](result);
            return;
        }

        if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
            result["rsp"] = "-6";
            result["desc"] = "cancelBroadcastMixPicture: The chairman is leaved.";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "cancelBroadcastMixPicture: The member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "cancelBroadcastMix",
        "param": {
            "confId": param["confId"],
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * startConfUploadWall
 * @param {
 *  confId :
 *  number :
 *  layerInfo : 
 *   {
 *       "xPos":
 *       "yPos":
 *       "width":
 *       "height":
 *       "decoder":
 *       "termType":
 *       "termName":
 *   }
 *  
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.startConfUploadWall = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "startConfUploadWall: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "startConfUploadWall: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "startConfUploadWall: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "startConfUploadWall: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["number"])) {
        result["desc"] = "startConfUploadWall: number is invalid";
        param["callback"](result);
        return;
    }

    if (!param["layerInfo"]) {
        result["desc"] = "startConfUploadWall: layerInfo is invalid";
        param["callback"](result);
        return;
    }

    var layerInfo = param["layerInfo"];

    if (!layerInfo["xPos"] || !cloudICP.util.isNumber(layerInfo["xPos"])) {
        result["desc"] = "startConfUploadWall: xPos is invalid";
        param["callback"](result);
        return;
    }

    if (!layerInfo["yPos"] || !cloudICP.util.isNumber(layerInfo["yPos"])) {
        result["desc"] = "startConfUploadWall: yPos is invalid";
        param["callback"](result);
        return;
    }

    if (!layerInfo["width"] || !cloudICP.util.isNumber(layerInfo["width"])) {
        result["desc"] = "startConfUploadWall: width is invalid";
        param["callback"](result);
        return;
    }

    if (!layerInfo["height"] || !cloudICP.util.isNumber(layerInfo["height"])) {
        result["desc"] = "startConfUploadWall: height is invalid";
        param["callback"](result);
        return;
    }

    if (undefined == layerInfo["decoder"] || !cloudICP.util.isStrInArray(layerInfo["decoder"], ["ivs", "elte", "te", "dec", "custom"])) {
        result["desc"] = "startConfUploadWall: decoder is invalid";
        param["callback"](result);
        return;
    }

    if (!layerInfo["termType"] || !cloudICP.util.isStrInArray(layerInfo["termType"], ["ivs_camera", "elte_phone", "voip", "pc", "dec_site"])) {
        result["desc"] = "startConfUploadWall: termType is invalid";
        param["callback"](result);
        return;
    }

    if (!layerInfo["termName"] || !cloudICP.util.checkIsdn(layerInfo["termName"])) {
        result["desc"] = "startConfUploadWall: termName is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "startConfUploadWall: The current member is leaved.";
        param["callback"](result);
        return;
    }

    var confInfo = cloudICP.util.callStatusMgr.confMgr[param["confId"]];
    if (confInfo != undefined) {
        if (cloudICP.userInfo["isdn"] != confInfo["value"]["confStatus"]["chair"]) {
            result["rsp"] = "-7";
            result["desc"] = "startConfUploadWall: The permission of chairman is required.";
            param["callback"](result);
            return;
        }
    }

    var murl = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/vmdsession";
    var majaxCfg = {
        "type": "GET",
        "url": murl,
        "data": null,
        "callback": function(mdata) {
            if (mdata["rsp"] == "0") {
                var requestParam = {
                    "opt": "wallStart",
                    "param": {
                        "confId": param["confId"],
                        "number": param["number"],
                        "layerInfo": param["layerInfo"]
                    }
                };

                var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": requestParam,
                    "callback": function(data) {
                        param["callback"](data);
                    }
                }
                cloudICP.util.ajax(ajaxCfg);
            } else {
                param["callback"]({ "rsp": "-1", "desc": "" });
            }
        }
    }
    cloudICP.util.ajax(majaxCfg);
};

/**
 * stopConfUploadWall
 * @param {
 *  layerID:
 *  termName:
 *  owner: 
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.stopConfUploadWall = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopConfUploadWall: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopConfUploadWall: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "stopConfUploadWall: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!param["layerID"]) {
        result["desc"] = "stopConfUploadWall: layerID is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["owner"])) {
        result["desc"] = "stopConfUploadWall: owner is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["termName"])) {
        result["desc"] = "stopConfUploadWall: termName is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "stopConfUploadWall: The member is leaved.";
        param["callback"](result);
        return;
    }

    var murl = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/vmdsession";
    var majaxCfg = {
        "type": "GET",
        "url": murl,
        "data": null,
        "callback": function(mdata) {
            if (mdata["rsp"] == "0") {
                var requestParam = {
                    "opt": "wallStop",
                    "param": {
                        "layerID": param["layerID"],
                        "owner": param["owner"],
                        "termName": param["termName"]
                    }
                };

                var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": requestParam,
                    "callback": function(data) {
                        param["callback"](data);
                    }
                }
                cloudICP.util.ajax(ajaxCfg);
            } else {
                param["callback"]({ "rsp": "-1", "desc": "" });
            }
        }
    }
    cloudICP.util.ajax(majaxCfg);
};

/**
 * holdConf
 * @param {
 *  cid:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.holdConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "holdConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "holdConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "holdConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "holdConf: The cid is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "holdConf: The current member is leaved.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "hold",
        "param": {
            type: "1",
            cid: param["cid"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                cloudICP.util.callStatusMgr.holdMgr.push(param["cid"]);
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * unholdConf
 * @param {
 *  cid:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.unholdConf = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unholdConf: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unholdConf: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unholdConf: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "unholdConf: The cid is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentGoingConf == 0) {
        result["rsp"] = "-6";
        result["desc"] = "unholdConf: The current member is leaved.";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.numberOfCall[callStatusMgr.VIDEO] + callStatusMgr.numberOfCall[callStatusMgr.VIDEOCONF] > 0) {
        result["rsp"] = "-7";
        result["desc"] = "unholdConf: There is a video existed";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "unhold",
        "param": {
            type: "1",
            cid: param["cid"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                cloudICP.util.callStatusMgr.holdMgr.push(param["cid"]);
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryRecordURLByConfID
 * @param {
 *  confId:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.queryRecordURLByConfID = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryRecordURLByConfID: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryRecordURLByConfID: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryRecordURLByConfID: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "queryRecordURLByConfID: The confId is invalid";
        param["callback"](result);
        return;
    }


    var requestParam = {
        "opt": "queryRecord",
        "param": {
            confId: param["confId"],
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryConfListByAttendee
 * @param {
 *  number:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.queryConfListByAttendee = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryConfListByAttendee: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryConfListByAttendee: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryConfListByAttendee: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    //result["rsp"] = "-2";
    // if (!cloudICP.util.checkIsdn(param["number"])) {
    //     result["desc"] = "queryConfListByAttendee: The number is invalid";
    //     param["callback"](result);
    //     return;
    // }

    var requestParam = {
        "opt": "queryByAttendee",
        "param": {
            number: cloudICP.userInfo["isdn"],
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryVWallDisplayMatrixInfo
 * @param {
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.queryVWallDisplayMatrixInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryVWallDisplayMatrixInfo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryVWallDisplayMatrixInfo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryVWallDisplayMatrixInfo: The user does not logined";
        param["callback"](result);
        return;
    }

    var murl = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/vmdsession";
    var majaxCfg = {
        "type": "GET",
        "url": murl,
        "data": null,
        "callback": function(mdata) {
            if (mdata["rsp"] == "0") {
                var requestParam = {
                    "opt": "queryVwallDisplay",
                };

                var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": requestParam,
                    "callback": function(data) {
                        param["callback"](data);
                    }
                }
                cloudICP.util.ajax(ajaxCfg);
            } else {
                param["callback"]({ "rsp": "-1", "desc": "" });
            }
        }
    }
    cloudICP.util.ajax(majaxCfg);
};

/**
 * queryConfWallInfo
 * @param {
 *  callback:
 * }
 */
ICPSDK_Dispatch_Conf.prototype.queryConfWallInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryConfWallInfo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryConfWallInfo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryConfWallInfo: The user does not logined";
        param["callback"](result);
        return;
    }

    var murl = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/vmdsession";
    var majaxCfg = {
        "type": "GET",
        "url": murl,
        "data": null,
        "callback": function(mdata) {
            if (mdata["rsp"] == "0") {
                var requestParam = {
                    "opt": "queryVwallLayer",
                };

                var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": requestParam,
                    "callback": function(data) {
                        param["callback"](data);
                    }
                }
                cloudICP.util.ajax(ajaxCfg);
            } else {
                param["callback"]({ "rsp": "-1", "desc": "" });
            }
        }
    }
    cloudICP.util.ajax(majaxCfg);
};

/**
 * setChairmanName
 * @param {
 *  name: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Conf.prototype.setChairmanName = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setChairmanName: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setChairmanName: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "setChairmanName: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!param["name"] || typeof(param["name"]) != "string" || param["name"].length > 32) {
        result["desc"] = "setChairmanName: The name is invalid";
        param["callback"](result);
        return;
    }

    cloudICP.dispatch.conf.chairName = param["name"];

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * setSpokenMember
 * @param {
 *  confId: ,
 *  member: ,
 * }
 */
ICPSDK_Dispatch_Conf.prototype.setSpokenMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setSpokenMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setSpokenMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "setSpokenMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "setSpokenMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["member"])) {
        result["desc"] = "setSpokenMember: member is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.isBool(param["isSpoken"])) {
        result["desc"] = "setSpokenMember: isSpoken is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "SetSpokenMember",
        "param": {
            "confId": param["confId"],
            "member": param["member"],
            "isSpoken": param["isSpoken"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * delConfMember @param {
 *  confId :
 *  memberInfo : {
 *       "number":
 *   }
 *  callback :
 * }
 */
ICPSDK_Dispatch_Conf.prototype.delConfMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delConfMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delConfMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "delConfMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "delConfMember: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["memberInfo"]["number"])) {
        result["desc"] = "delConfMember: number is invalid";
        param["callback"](result);
        return;
    }


    var requestParam = {
        "opt": "delMember",
        "param": {
            "confId": param["confId"],
            "memberInfo": param["memberInfo"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};


/**
 * proxyFloor
 * @param {
 *  confId: ,
 *  member: ,
 * }
 */
ICPSDK_Dispatch_Conf.prototype.proxyFloor = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "proxyFloor: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "proxyFloor: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "proxyFloor: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!cloudICP.util.checkConfId(param["confId"])) {
        result["desc"] = "proxyFloor: confId is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["member"])) {
        result["desc"] = "proxyFloor: member is invalid";
        param["callback"](result);
        return;
    }

    if (!param["operation"] || typeof param["operation"] != "string") {
        result["desc"] = "proxyFloor: operation is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "proxyFloor",
        "param": param
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Device() {
    this.isDTMFDone = true;
};


/**
 * muteSpeaker
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.muteSpeaker = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteSpeaker: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteSpeaker: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "muteSpeaker: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "muteSpeaker: The cid is invalid";
            param["callback"](result);
            return;
        };
    }

    var meidaSDKparam = "{\"description\":\"msp_quite_audio_channel\", \"cmd\": 65543, \"param\":{\"resID\": {0}, \"quiet\":true}}".format(
        parseInt(param["cid"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });

}


/**
 * unmuteSpeaker
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.unmuteSpeaker = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unmuteSpeaker: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unmuteSpeaker: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unmuteSpeaker: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "unmuteSpeaker: The cid is invalid";
            param["callback"](result);
            return;
        };
    }

    var meidaSDKparam = "{\"description\":\"msp_quite_audio_channel\", \"cmd\": 65543, \"param\":{\"resID\": {0}, \"quiet\":false}}".format(
        parseInt(param["cid"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });

}


/**
 * muteMic
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.muteMic = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteMic: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "muteMic: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "muteMic: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "muteMic: The cid is invalid";
            param["callback"](result);
            return;
        };

    }

    var meidaSDKparam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65542, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
        parseInt(param["cid"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });

}

/**
 * unmuteMic
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.unmuteMic = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unmuteMic: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unmuteMic: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unmuteMic: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "unmuteMic: The cid is invalid";
            param["callback"](result);
            return;
        };
    }

    var meidaSDKparam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65542, \"param\":{\"resID\": {0}, \"mute\":false}}".format(
        parseInt(param["cid"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });

}

/**
 * 二次拨号
 */
ICPSDK_Dispatch_Device.prototype.sendDTMF = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "sendDTMF: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "sendDTMF: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "sendDTMF: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "sendDTMF: The cid is invalid";
        param["callback"](result);
        return;
    };

    if (!param["function"]) {
        result["desc"] = "sendDTMF: The function is not exist";
        param["callback"](result);
        return;
    }

    if (!cloudICP.dispatch.device.isDTMFDone) {
        result["rsp"] = "-4";
        result["desc"] = "sendDTMF: last operation is not finished";
        param["callback"](result);
        return;
    } else {
        cloudICP.dispatch.device.isDTMFDone = false;
    }

    var meidaSDKparam = "{\"description\":\"msp_dial_again\", \"cmd\": 65548, \"param\":{\"resID\": {0}, \"functionCode\":\"{1}\"}}".format(
        parseInt(param["cid"]), param["function"]
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });

}


/**
 * getSoundDevice
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.getSoundDevice = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getSoundDevice: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getSoundDevice: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "getSoundDevice: The user does not logined";
        param["callback"](result);
        return;
    }

    var meidaSDKparam = "{\"description\":\"msp_get_audio_dev\", \"cmd\": 131077}";

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * getVolume
 * @param {Object} param {
 *  cid: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.getVolume = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getVolume: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getVolume: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "getVolume: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "getVolume: The cid is invalid";
            param["callback"](result);
            return;
        };
    }

    var meidaSDKparam = "{\"description\":\"msp_get_audio_volume\", \"cmd\": 65544, \"param\":{\"resID\": {0} }}".format(
        parseInt(param["cid"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * setVolume
 * @param {Object} param {
 *  cid: ,
 *  volume: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.setVolume = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setVolume: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setVolume: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "setVolume: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "setVolume: The cid is invalid";
            param["callback"](result);
            return;
        };
    }

    if (!param["volume"]) {
        result["desc"] = "setVolume: The volume is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkRate(param["volume"])) {
        result["desc"] = "setVolume: The volume is not number";
        param["callback"](result);
        return;
    }

    if (parseInt(param["volume"]).toString() != param['volume']) {
        result["desc"] = "setVolume: The volume is not Integer";
        param["callback"](result);
        return;
    }


    var meidaSDKparam = "{\"description\":\"msp_set_audio_Volume\", \"cmd\": 65545, \"param\":{\"resID\": {0}, \"newVolume\": {1} }}".format(
        parseInt(param["cid"]), parseFloat(param["volume"])
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * assignSoundDevice
 * @param {Object} param {
 *  cid: ,
 *  number:,
 *  outputDev: ,
 *  inputDev: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.assignSoundDevice = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "assignSoundDevice: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "assignSoundDevice: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "assignSoundDevice: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "assignSoundDevice: The cid is invalid";
            param["callback"](result);
            return;
        };

        // var call =  cloudICP.util.callStatusMgr.allCalls[param["cid"]];
        // if (!call || call.callState != cloudICP.util.callStatusMgr.CONNECTING) {
        //     result["desc"] = "assignSoundDevice: The cid is invalid";
        //     param["callback"](result);
        //     return;
        // }
    }

    if (param["number"] != "conference") {
        if (!cloudICP.util.checkIsdn(param["number"])) {
            result["desc"] = "assignSoundDevice: The number is invalid";
            param["callback"](result);
            return;
        }
    }

    if (!param["outputDev"] && !param["inputDev"]) {
        result["desc"] = "assignSoundDevice: The inputDev or outputDev is invalid";
        param["callback"](result);
        return;
    } else if (!param["outputDev"]) {
        param["outputDev"] = "";
    } else if (!param["inputDev"]) {
        param["inputDev"] = "";
    }

    var meidaSDKparam = "{\"description\":\"msp_assign_sound_device\", \"cmd\": 65546, \"param\":{\"resID\": {0}, \"number\": \"{1}\", \"mediaInfo\":{\"outputDev\":\"{2}\", \"inputDev\": \"{3}\" }}}".format(
        parseInt(param["cid"]), param["number"], param["outputDev"], param["inputDev"]
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * querySoundDevice
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.querySoundDevice = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "querySoundDevice: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "querySoundDevice: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "querySoundDevice: The user does not logined";
        param["callback"](result);
        return;
    }

    var meidaSDKparam = "{\"description\":\"msp_query_sound_device\", \"cmd\": 65547 }";

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * queryCameraAbility
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.queryCameraAbility = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryCameraAbility: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryCameraAbility: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraAbility: The user does not logined";
        param["callback"](result);
        return;
    }

    if (undefined == cloudICP.config["cameraInfo"]) {
        result["rsp"] = "-4";
        result["desc"] = "queryCameraAbility: The camera info is lost.";
        param["callback"](result);
        return;
    }

    param["callback"]({ "rsp": "0", "desc": "", "camera_ability": cloudICP.config["cameraInfo"] });
};

/**
 * stopPlayTone
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.stopPlayTone = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopPlayTone: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopPlayTone: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "stopPlayTone: The user does not logined";
        param["callback"](result);
        return;
    }

    // 停止振铃
    var reqParam = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
        parseInt("0")
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(reqParam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * getVersion
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.getVersion = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getVersion: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getVersion: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "getVersion: The user does not logined";
        param["callback"](result);
        return;
    }

    param["callback"]({
        "rsp": "0",
        "desc": "",
        "versions": {
            "mspVersion": cloudICP.userInfo["mspVersion"],
            "sdkVersion": cloudICP.userInfo["sdkVersion"],
            "serverVersion": cloudICP.userInfo["serverVersion"]
        }
    });
};

/**
 * initMRS
 * @param {Object} param {
 *  mrsIp: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.initMRS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "initMRS: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "initMRS: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "initMRS: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";

    if (!cloudICP.util.checkIp(param["mrsIp"])) {
        result["desc"] = "initMRS: The mrsIp is invalid";
        param["callback"](result);
        return;
    }

    // 初始化录音录像查询
    var ajaxReq = {
        "type": "PUT",
        "url": cloudICP.getSdkServerUrl() + "/v1/register/" + cloudICP.userInfo["isdn"] + "/initmrs",
        "async": false,
        "data": {
            "mrsServerIP": param["mrsIp"],
        },
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxReq);
};

/**
 * forceInit
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.forceInitMSP = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "forceInitMSP: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "forceInitMSP: callback is not a function" });
        return;
    }

    cloudICP.dispatch.webSocket._medisServerWs.send('ForceLogin');

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * setWindowInfo
 * @param {Object} param {
 *  cid:,
 *  windowInfo: {
 *      width:
 *      height:
 *      posX:
 *      posY:
 *  },
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.setWindowInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setWindowInfo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "setWindowInfo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "initMRS: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";

    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "setWindowInfo: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call.callState != cloudICP.util.callStatusMgr.CONNECTING) {
        result["desc"] = "setWindowInfo: The cid is invalid";
        param["callback"](result);
        return;
    }

    var videoInfo = cloudICP.util.callStatusMgr.videoMediaInfoBuf[param["cid"]];

    if (videoInfo == undefined) {
        result["desc"] = "setWindowInfo: The cid is invalid";
        param["callback"](result);
        return;
    }

    if (param["windowInfo"] != undefined) {
        if (!cloudICP.util.isNumber(param["windowInfo"]["width"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "setWindowInfo: The width is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["height"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "setWindowInfo: The height is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posX"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "setWindowInfo: The posX is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posY"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "setWindowInfo: The posY is invalid";
            param["callback"](result);
            return;
        }

        var callStatusMgr = cloudICP.util.callStatusMgr;
        callStatusMgr.windowInfos[param["cid"]] = param["windowInfo"];
        var windowInfo = param["windowInfo"];
    }

    var meidaSDKparam = "{\"description\":\"modify_window\", \"cmd\": 196611, \"param\":{\"cid\": {0}, \"width\": {1}, \"height\": {2}, \"x\": {3}, \"y\": {4}}}".format(
        parseInt(param["cid"]), parseInt(windowInfo["width"]), parseInt(windowInfo["height"]), parseInt(windowInfo["posX"]), parseInt(windowInfo["posY"])
    );

    cloudICP.dispatch.webSocket.sendDataToDeamonSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * getResolution
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.getResolution = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getResolution: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "getResolution: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "initMRS: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";

    var meidaSDKparam = "{\"description\":\"get_screen_resolution\", \"cmd\": 196612, \"param\":{}}";

    cloudICP.dispatch.webSocket.sendDataToDeamonSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

/**
 * windowOnTop
 * @param {Object} param {
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Device.prototype.windowOnTop = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "windowOnTop: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "windowOnTop: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (param["cid"] != "-1") {
        if (!cloudICP.util.checkCid(param["cid"])) {
            result["desc"] = "windowOnTop: The cid is invalid";
            param["callback"](result);
            return;
        };
    }


    var meidaSDKparam = "{\"description\":\"msp_window_top\", \"cmd\": 65551, \"param\":{\"cid\": {0}, \"isOnTop\":  {1}}}".format(
        parseInt(param["cid"]), param["isOnTop"]
    );

    cloudICP.dispatch.webSocket.sendDataToMediaSDK(meidaSDKparam, true);

    param["callback"]({ "rsp": "0", "desc": "" });
};

function ICPSDK_Dispatch_Event() {
    this.EVENT_LIST = {
        "VoiceNotify": {
            "OnUserStatusNotify": this.printEvent,
            "OnDialOutProceeding": this.printEvent,
            "OnDialOutRinging": this.printEvent,
            "OnCallConnect": this.printEvent,
            "OnDialOutFailure": this.printEvent,
            "OnCallRelease": this.printEvent,
            "OnDialInRinging": this.printEvent,
            "OnConnectProceeding": this.printEvent,
            "OnHalfDialConnectProceeding": this.printEvent,
            "OnStartRecvHalfDial": this.printEvent,
            "OnStopRecvHalfDial": this.printEvent,
            "OnTransferReject": this.printEvent,
            "OnTransferAccept": this.printEvent,
            "OnTransferSuccess": this.printEvent,
            "OnTransferFailure": this.printEvent,
            "OnTransferNotify": this.printEvent,
            "OnCancelTransferFailure": this.printEvent,
            "OnCancelTransferSuccess": this.printEvent,
            "OnHalfDuplexPTTAccept": this.printEvent,
            "OnHalfDialFailure": this.printEvent,
            "OnBreakOffFailure": this.printEvent,
            "OnBreakOffSuccess": this.printEvent,
            "OnHalfDialSuccess": this.printEvent,
            "OnStartDiscreetlistenSuccess": this.printEvent,
            "OnStartDiscreetlistenFailure": this.printEvent,
            "OnStopDiscreetlistenSuccess": this.printEvent,
            "OnStopDiscreetlistenFailure": this.printEvent,
            "OnDiscreetlistenStart": this.printEvent,
            "OnDiscreetlistenStop": this.printEvent,
            "OnHoldSuccess": this.printEvent,
            "OnHoldFailure": this.printEvent,
            "OnUnholdSuccess": this.printEvent,
            "OnUnholdFailure": this.printEvent,
            "OnInterceptSuccess": this.printEvent,
            "OnInterceptFailure": this.printEvent,
            "OnCallException": this.printEvent,
        },
        "VideoNotify": {
            "OnVideoDispatchRequest": this.printEvent,
            "OnVideoDispatchFailure": this.printEvent,
            "OnVideoDispatchSuccess": this.printEvent,
            "OnVideoDispatchStatusNotify": this.printEvent,
            "OnCancelVideoDispatchSuccess": this.printEvent,
            "OnCancelVideoDispatchFailure": this.printEvent,
            "OnStartVideoUploadWallSuccess": this.printEvent,
            "OnStartVideoUploadWallFailure": this.printEvent,
            "OnStopVideoUploadWallSuccess": this.printEvent,
            "OnStopVideoUploadWallFailure": this.printEvent,
        },
        "GroupCallNotify": {
            "OnGroupCallStatusNotify": this.printEvent,
            "OnTalkingGroupCallFailure": this.printEvent,
            "OnTalkingGroupCallPTTStart": this.printEvent,
            "OnTalkingGroupCallPTTNotify": this.printEvent,
            "OnTalkingGroupCallPTTSuccess": this.printEvent,
            "OnTalkingGroupCallPTTIdle": this.printEvent,
            "OnTalkingGroupCallPTTRecv": this.printEvent,
            "OnTalkingGroupCallStart": this.printEvent,
            "OnTalkingGroupCallStop": this.printEvent,
            "OnTalkingGroupCallRelease": this.printEvent,
            "OnTalkingGroupCallPTTFailure": this.printEvent,
            "OnTalkingGroupCallJoinNotify": this.printEvent,
            "OnAddTalkingGroupTempUserSuccess": this.printEvent,
            "OnAddTalkingGroupTempUserFailure": this.printEvent,
            "OnTalkingGourpEmergencyCallStart": this.printEvent,
        },
        "GroupNotify": {
            "OnTalkingGroupStatusChange": this.printEvent,
            "OnTalkingGroupMemberChange": this.printEvent,
            "OnDynamicGroupMemberChange": this.printEvent,
            "OnChangePatchGroupFailure": this.printEvent,
            "OnPatchGroupStatusChange": this.printEvent,
            "OnPatchGroupMemberChange": this.printEvent,
            "OnDynamicGroupMemberChangeFailure": this.printEvent,
            "OnDynamicGroupOptFailed": this.printEvent,
            "OnPatchGroupOptFailed": this.printEvent,
            "OnChangePatchGroupMemberFailure": this.printEvent,
            "OnTalkingGroupMemberChangeFailure": this.printEvent
        },
        "MsNotify": {
            "OnSendDispSMSResult": this.printEvent,
            "OnRecvDispSMSNotify": this.printEvent,
            "OnDispSMSModuleNotify": this.printEvent,
            "OnSendDispMMSResult": this.printEvent,
            "OnRecvDispMMSNotify": this.printEvent,
            "OnDispMMSModuleNotify": this.printEvent,
            "OnRecvStateMsgNotify": this.printEvent
        },
        "GisNotify": {
            "OnSubscribeGISResult": this.printEvent,
            "OnUnSubscribeGISResult": this.printEvent,
            "OnRecvGISNotify": this.printEvent
        },
        "ResourceNotify": {},
        "ModuleNotify": {
            "OnDisConnection": this.printEvent,
            "OnConnection": this.printEvent,
            "OnDispatchKickOutNotifyEvent": this.printEvent,
            "OnModifyPasswordNotify": this.printEvent,
            "OnDeleteAccountNotify": this.printEvent
        },
        "PhoneConfNotify": {
            "OnCreateConfSuccess": this.printEvent,
            "OnCreateConfFailure": this.printEvent,
            "OnEndConfSuccess": this.printEvent,
            "OnEndConfFailure": this.printEvent,
            "OnSubscribeConfSuccess": this.printEvent,
            "OnSubscribeConfFailure": this.printEvent,
            "OnUnsubscribeConfSuccess": this.printEvent,
            "OnUnsubscribeConfFailure": this.printEvent,
            "OnConfDialInRinging": this.printEvent,
            "OnConfDialOutRinging": this.printEvent,
            "OnConfConnect": this.printEvent,
            "OnConfRelease": this.printEvent,
            "OnConfFailure": this.printEvent,
            "OnMuteConfMemberSuccess": this.printEvent,
            "OnMuteConfMemberFailure": this.printEvent,
            "OnUnmuteConfMemberSuccess": this.printEvent,
            "OnUnmuteConfMemberFailure": this.printEvent,
            "OnSetSpokenMemberSuccess": this.printEvent,
            "OnSetSpokenMemberFailure": this.printEvent,
            "OnMuteConfSuccess": this.printEvent,
            "OnMuteConfFailure": this.printEvent,
            "OnUnmuteConfSuccess": this.printEvent,
            "OnUnmuteConfFailure": this.printEvent,
            "OnBroadcastMixPictureSuccess": this.printEvent,
            "OnBroadcastMixPictureFailure": this.printEvent,
            "OnCancelBroadcastMixPictureSuccess": this.printEvent,
            "OnCancelBroadcastMixPictureFailure": this.printEvent,
            "OnBroadcastConfMemberSuccess": this.printEvent,
            "OnBroadcastConfMemberFailure": this.printEvent,
            "OnCancelBroadcastConfMemberSuccess": this.printEvent,
            "OnCancelBroadcastConfMemberFailure": this.printEvent,
            "OnWatchConfMemberSuccess": this.printEvent,
            "OnWatchConfMemberFailure": this.printEvent,
            "OnWatchMixPictureSuccess": this.printEvent,
            "OnWatchMixPictureFailure": this.printEvent,
            "OnHangupConfMemberSuccess": this.printEvent,
            "OnHangupConfMemberFailure": this.printEvent,
            "OnCallConfMemberSuccess": this.printEvent,
            "OnCallConfMemberFailure": this.printEvent,
            "OnHoldConfSuccess": this.printEvent,
            "OnHoldConfFailure": this.printEvent,
            "OnUnholdConfSuccess": this.printEvent,
            "OnUnholdConfFailure": this.printEvent,
            "OnConfStatusNotify": this.printEvent,
            "OnQueryConfListByAttendeeResult": this.printEvent,
            "OnQueryRecordURLByConfIDResult": this.printEvent,
            "OnQueryVWallDisplayMatrixInfoResult": this.printEvent,
            "OnQueryConfWallInfoResult": this.printEvent,
            "OnStartConfUploadWallSuccess": this.printEvent,
            "OnStartConfUploadWallFailure": this.printEvent,
            "OnStopConfUploadWallSuccess": this.printEvent,
            "OnStopConfUploadWallFailure": this.printEvent,
            "OnAddConfMembersSuccess": this.printEvent,
            "OnAddConfMembersFailure": this.printEvent,
            "OnConfException": this.printEvent,
            "OnDelConfMembersSuccess": this.printEvent,
            "OnDelConfMembersFailure": this.printEvent,
            "OnConfProxyFloorSuccess": this.printEvent,
            "OnConfProxyFloorFailure": this.printEvent,
        },
        "MSPNotify": {
            "OnGetSoundDeviceResult": this.printEvent,
            "OnGetVolumeResult": this.printEvent,
            "OnSetVolumeResult": this.printEvent,
            "OnMuteSpeakerResult": this.printEvent,
            "OnUnmuteSpeakerResult": this.printEvent,
            "OnMuteMicResult": this.printEvent,
            "OnUnmuteMicResult": this.printEvent,
            "OnQuerySoundDeviceResult": this.printEvent,
            "OnAssignSoundDeviceResult": this.printEvent,
            "OnSendToDTMFResult": this.printEvent,
            "OnVDMStatusNotify": this.printEvent,
            "OnGetResolutionResult": this.printEvent,
            "OnWindowOnTopResult": this.printEvent,
        }
    };
};

ICPSDK_Dispatch_Event.prototype.printEvent = function(data) {
    cloudICP.util.sendLogOut("ICPSDK event: " + JSON.stringify(data));
}

/**
 * @param {
 * eventType:
 * eventName:
 * callback:
 * }
 */
ICPSDK_Dispatch_Event.prototype.register = function(param) {
    var eventType = param["eventType"];
    var eventName = param["eventName"];
    var callback = param["callback"];


    if (!eventType) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "register: register failed. Because eventType is invalid." });
        return;
    }
    if (!eventName) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "register: register failed. Because eventName is invalid." });
        return;
    }
    if (typeof callback != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "register: register failed. Because callback is not a function." });
        return;
    }
    var eventTypeObject = this.EVENT_LIST[eventType];
    if (undefined == eventTypeObject) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "register: register failed. Because eventType is invalid." });
        return;
    }
    var eventObject = eventTypeObject[eventName];
    if (undefined == eventObject) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "register: register failed. Because eventName is invalid." });
        return;
    }
    this.EVENT_LIST[eventType][eventName] = function(data) {
        cloudICP.util.sendLogOut("ICPSDK event: " + JSON.stringify(data));
        callback(data);
    }
}

/**
 * 处理GIS的业务通知
 * @param event
 */
ICPSDK_Dispatch_Event.prototype.delGisNotify = function(event) {
    var opt = event["opt"];
    if (undefined != opt) {
        delete event.opt;
    }

    if (opt == "sub") {
        // 订阅

        for (var item = 0; item < event["uelist"].length; item++) {
            if (event["uelist"][item]["rsp"] == "0" && !cloudICP.util.includes(cloudICP.dispatch.gis.subList, event["uelist"][item]["isdn"])) {
                cloudICP.dispatch.gis.subList.push(event["uelist"][item]["isdn"]);
            }
        }
        event["eventName"] = "OnSubscribeGISResult";
        this.EVENT_LIST["GisNotify"]["OnSubscribeGISResult"](event);
    } else if (opt == "unsub") {
        // 取消订阅

        for (var item = 0; item < event["uelist"].length; item++) {
            if (event["uelist"][item]["rsp"] == "0" && cloudICP.util.includes(cloudICP.dispatch.gis.subList, event["uelist"][item]["isdn"])) {
                var index = cloudICP.dispatch.gis.subList.indexOf(event["uelist"][item]["isdn"]);
                if (index != -1) {
                    cloudICP.dispatch.gis.subList.splice(index, 1);
                }
            }
        }

        event["eventName"] = "OnUnSubscribeGISResult";
        this.EVENT_LIST["GisNotify"]["OnUnSubscribeGISResult"](event);
    } else if (opt == "report") {
        // 上报通知

        for (var item = 0; item < event["list"].length; item++) {
            if (!cloudICP.util.includes(cloudICP.dispatch.gis.subList, event["list"][item]["isdn"])) {
                event["list"].splice(item, 1);
            }
        }

        if (event["list"].length == 0) {
            return;
        }

        event["eventName"] = "OnRecvGISNotify";
        this.EVENT_LIST["GisNotify"]["OnRecvGISNotify"](event);
    } else {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delGisNotify: unkown opt. the opt is." + opt });
        return;
    }
}

/**
 * 处理模块的状态通知
 */
ICPSDK_Dispatch_Event.prototype.delModuleNotify = function(event) {
    var statusType = event["statustype"];
    if (undefined != statusType) {
        delete event.statustype;
    }
    var statusValue = event["statusvalue"];
    if (statusType == "1") {
        //短信
        if (statusValue == "1") {
            //短信溢出
            event["eventName"] = "OnDispSMSModuleNotify";
            this.EVENT_LIST["MsNotify"]["OnDispSMSModuleNotify"](event);
        } else if (statusValue == "2") {
            //短信连接断开
            var event = {};
            event["eventName"] = "OnDisConnection";
            event["moduleType"] = "1";
            this.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);
        } else if (statusValue == "3") {
            //短信连接恢复
            var event = {};
            event["eventName"] = "OnConnection";
            event["moduleType"] = "1";
            this.EVENT_LIST["ModuleNotify"]["OnConnection"](event);
        }

    } else if (statusType == "2") {
        //彩信
        event["eventName"] = "OnDispMMSModuleNotify";
        this.EVENT_LIST["MsNotify"]["OnDispMMSModuleNotify"](event);
    } else if (statusType == "6") {
        //表示SIP模块
        if (statusValue == "15") {
            //用户已经登出
            clearTimeout(cloudICP.dispatch.auth.sendHeartbeatTimeOutId);
            delete event.statusvalue;
            logoutCleanUp();
            event["eventName"] = "OnDispatchKickOutNotifyEvent";
            this.EVENT_LIST["ModuleNotify"]["OnDispatchKickOutNotifyEvent"](event);
        } else if (statusValue == "9") {
            //SIP连接断开
            event = {};
            event["eventName"] = "OnDisConnection";
            event["moduleType"] = "2";
            this.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);
        } else if (statusValue == "10") {
            //SIP连接恢复
            event = {};
            event["eventName"] = "OnConnection";
            event["moduleType"] = "2";
            this.EVENT_LIST["ModuleNotify"]["OnConnection"](event);
        } else if (statusValue == "22") {
            //账号被删除
            delete event.statusvalue;
            logoutCleanUp();
            event["eventName"] = "OnDeleteAccountNotify";
            this.EVENT_LIST["ModuleNotify"]["OnDeleteAccountNotify"](event);
        } else if (statusValue == "17") {
            //密码被修改
            delete event.statusvalue;
            cloudICP.userInfo["isdn"] = "";
            logoutCleanUp();
            event["eventName"] = "OnModifyPasswordNotify";
            event["rsp"] = "0";
            this.EVENT_LIST["ModuleNotify"]["OnModifyPasswordNotify"](event);
        }
    } else if (statusType == "9") {
        if (event["statusvalue"] == "16") {
            if (event["param"]["type"] == "4") {
                if (event["param"]["ret"] == 0) {
                    var retEvent = {
                        "eventName": "OnTransferSuccess",
                        "rsp": "0"
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnTransferSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnTransferFailure",
                        "rsp": event["param"]["ret"]
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnTransferFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "5") {
                if (event["param"]["ret"] != "0") {
                    var retEvent = {
                        "eventName": "OnInterceptFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnInterceptFailure"](retEvent);
                } else if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnInterceptSuccess",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnInterceptSuccess"](retEvent);
                }
            } else if (event["param"]["type"] == "0") {
                if (event["param"]["ret"] != "0") {
                    var retEvent = {
                        "eventName": "OnBreakOffFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "objid": event["param"]["ObjId"]
                        }
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnBreakOffFailure"](retEvent);
                } else if (event["param"]["ret"] == "0") {
                    if (cloudICP.dispatch.group.isCurrentPtt["grpid"] == event["param"]["ObjId"]) {
                        cloudICP.dispatch.group.isCurrentPtt = { "grpid": event["param"]["ObjId"], "isPtt": false };
                    }

                    var retEvent = {
                        "eventName": "OnBreakOffSuccess",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "objid": event["param"]["ObjId"]
                        }
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnBreakOffSuccess"](retEvent);

                }
            } else if (event["param"]["type"] == "1") {
                var retEvent = {
                    "eventName": "OnTalkingGroupCallJoinNotify",
                    "rsp": event["param"]["ret"],
                    "value": {
                        "grpid": event["param"]["ObjId"]
                    }
                }
                this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallJoinNotify"](retEvent);
            } else if (event["param"]["type"] == "7") {
                if (event["param"]["ret"] != "0") {
                    var retEvent = {
                        "eventName": "OnVideoDispatchFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VideoNotify"]["OnVideoDispatchFailure"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnVideoDispatchSuccess",
                        "rsp": "0",
                    }
                    this.EVENT_LIST["VideoNotify"]["OnVideoDispatchSuccess"](retEvent);
                }
            } else if (event["param"]["type"] == "8") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnCancelVideoDispatchSuccess",
                        "rsp": "0",
                    }
                    this.EVENT_LIST["VideoNotify"]["OnCancelVideoDispatchSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnCancelVideoDispatchFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VideoNotify"]["OnCancelVideoDispatchFailure"](retEvent);
                }

            } else if (event["param"]["type"] == "9") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnStopVideoUploadWallSuccess",
                        "rsp": "0",
                        "value": {
                            "channel": event["param"]["DstObjId"]
                        }
                    }
                    this.EVENT_LIST["VideoNotify"]["OnStopVideoUploadWallSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnStopVideoUploadWallFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VideoNotify"]["OnStopVideoUploadWallFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "10") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnStartVideoUploadWallSuccess",
                        "rsp": "0",
                        "value": {
                            "channel": event["param"]["DstObjId"],
                            "src": event["param"]["SrcObjId"]
                        }
                    }
                    this.EVENT_LIST["VideoNotify"]["OnStartVideoUploadWallSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnStartVideoUploadWallFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VideoNotify"]["OnStartVideoUploadWallFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "17") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnAddTalkingGroupTempUserSuccess",
                        "rsp": "0",
                    }
                    this.EVENT_LIST["GroupCallNotify"]["OnAddTalkingGroupTempUserSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnAddTalkingGroupTempUserFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["GroupCallNotify"]["OnAddTalkingGroupTempUserFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "21") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnCancelTransferSuccess",
                        "rsp": "0",
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnCancelTransferSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnCancelTransferFailure",
                        "rsp": event["param"]["ret"],
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnCancelTransferFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "24") {
                var holdCid = "-1";
                var callStatusMgr = cloudICP.util.callStatusMgr;

                for (var index = callStatusMgr.holdMgr.length - 1; index >= 0; index--) {
                    var call = callStatusMgr.allCalls[callStatusMgr.holdMgr[index]];
                    var callID = "";
                    if (call["callee"] == cloudICP.userInfo["isdn"]) {
                        callID = call["caller"];
                    } else if (call["caller"] == cloudICP.userInfo["isdn"]) {
                        callID = call["callee"];
                    } else {
                        return;
                    }
                    if (call && callID == event["param"]["isdn"]) {
                        holdCid = callStatusMgr.holdMgr[index];
                        callStatusMgr.holdMgr.splice(index, 1);
                        break;
                    }
                }

                if (holdCid == "-1") {
                    return;
                }

                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnHoldSuccess",
                        "rsp": "0",
                        "value": {
                            "peerid": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }
                    callStatusMgr.updateCallStatus(null, callStatusMgr.HOLD, { "value": { "cid": holdCid } });
                    this.EVENT_LIST["VoiceNotify"]["OnHoldSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnHoldFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "peerid": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    this.EVENT_LIST["VoiceNotify"]["OnHoldFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "25") {
                var holdCid = "-1";
                var callStatusMgr = cloudICP.util.callStatusMgr;

                for (var index = callStatusMgr.holdMgr.length - 1; index >= 0; index--) {
                    var call = callStatusMgr.allCalls[callStatusMgr.holdMgr[index]];
                    var callID = "";
                    if (call["callee"] == cloudICP.userInfo["isdn"]) {
                        callID = call["caller"];
                    } else if (call["caller"] == cloudICP.userInfo["isdn"]) {
                        callID = call["callee"];
                    } else {
                        return;
                    }
                    if (call && callID == event["param"]["isdn"]) {
                        holdCid = callStatusMgr.holdMgr[index];
                        callStatusMgr.holdMgr.splice(index, 1);
                        break;
                    }
                }

                if (holdCid == "-1") {
                    return;
                }

                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnUnholdSuccess",
                        "rsp": "0",
                        "value": {
                            "peerid": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    callStatusMgr.unholdCall(holdCid);

                    callStatusMgr.updateCallStatus(null, callStatusMgr.CONNECTING, { "value": { "cid": holdCid } });
                    this.EVENT_LIST["VoiceNotify"]["OnUnholdSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnUnholdFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "peerid": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    this.EVENT_LIST["VoiceNotify"]["OnUnholdFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "26") {
                var holdCid = "-1";
                var callStatusMgr = cloudICP.util.callStatusMgr;

                for (var index = callStatusMgr.holdMgr.length - 1; index >= 0; index--) {
                    var call = callStatusMgr.allCalls[callStatusMgr.holdMgr[index]];
                    var callID = "";
                    if (call["callee"] == cloudICP.userInfo["isdn"]) {
                        callID = call["caller"];
                    } else if (call["caller"] == cloudICP.userInfo["isdn"]) {
                        callID = call["callee"];
                    } else {
                        return;
                    }
                    if (call && callID == event["param"]["isdn"]) {
                        holdCid = callStatusMgr.holdMgr[index];
                        callStatusMgr.holdMgr.splice(index, 1);
                        break;
                    }
                }

                if (holdCid == "-1") {
                    return;
                }

                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnHoldConfSuccess",
                        "rsp": "0",
                        "value": {
                            "confCode": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }
                    callStatusMgr.updateCallStatus(null, callStatusMgr.HOLD, { "value": { "cid": holdCid } });
                    this.EVENT_LIST["PhoneConfNotify"]["OnHoldConfSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnHoldConfFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "confCode": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    this.EVENT_LIST["PhoneConfNotify"]["OnHoldConfFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "27") {
                var holdCid = "-1";
                var callStatusMgr = cloudICP.util.callStatusMgr;

                for (var index = callStatusMgr.holdMgr.length - 1; index >= 0; index--) {
                    var call = callStatusMgr.allCalls[callStatusMgr.holdMgr[index]];
                    var callID = "";
                    if (call["callee"] == cloudICP.userInfo["isdn"]) {
                        callID = call["caller"];
                    } else if (call["caller"] == cloudICP.userInfo["isdn"]) {
                        callID = call["callee"];
                    } else {
                        return;
                    }
                    if (call && callID == event["param"]["isdn"]) {
                        holdCid = callStatusMgr.holdMgr[index];
                        callStatusMgr.holdMgr.splice(index, 1);
                        break;
                    }
                }

                if (holdCid == "-1") {
                    return;
                }

                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnUnholdConfSuccess",
                        "rsp": "0",
                        "value": {
                            "confCode": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    callStatusMgr.unholdCall(holdCid);

                    callStatusMgr.updateCallStatus(null, callStatusMgr.CONNECTING, { "value": { "cid": holdCid } });

                    this.EVENT_LIST["PhoneConfNotify"]["OnUnholdConfSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnUnholdConfFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "confCode": event["param"]["isdn"],
                            "cid": holdCid
                        }
                    }

                    this.EVENT_LIST["PhoneConfNotify"]["OnUnholdConfFailure"](retEvent);
                }
            } else if (event["param"]["type"] == "11") {
                if (event["param"]["ret"] != "0") {
                    var retEvent = {
                        "eventName": "OnDynamicGroupOptFailed",
                        "rsp": event["param"]["ret"],
                        "grpid": ""
                    }

                    this.EVENT_LIST["GroupNotify"]["OnDynamicGroupOptFailed"](retEvent);
                }
            } else if (event["param"]["type"] == "28") {
                if (event["param"]["ret"] == "0") {
                    var retEvent = {
                        "eventName": "OnConfProxyFloorSuccess",
                        "rsp": "0",
                        "value": {
                            "member": event["param"]["member"],
                            "operation": event["param"]["operation"]
                        }
                    }
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfProxyFloorSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnConfProxyFloorFailure",
                        "rsp": event["param"]["ret"],
                        "value": {
                            "member": event["param"]["member"],
                            "operation": event["param"]["operation"]
                        }
                    }
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfProxyFloorFailure"](retEvent);
                }
            }
        }
    }
};

ICPSDK_Dispatch_Event.prototype.delMsNotify = function(event) {
    var opt = event["opt"];
    if (undefined != opt) {
        delete event.opt;
    }
    var value = event["value"];
    if (undefined == value) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delMsNotify: value is undefined." });
        return;
    }

    var type = value["type"];
    if (undefined != type) {
        delete value.type;
    }

    if (undefined != value["direction"]) {
        delete value.direction;
    }

    if (type == "0001") {
        //短信
        if (undefined != value["statuscode"]) {
            delete value.statuscode;
        }
        if (undefined != value["speed"]) {
            delete value.speed;
        }

        if (undefined != value["attach"]) {
            delete value.attach;
        }

        if (opt == "recvmsg") {
            //接收短信
            event["rsp"] = "0";

            // 转化时区
            if (value["state"] == 1) {
                var tmpTime = value["date"].split("-");
                var tempDate = value["time"].split(":");
                var time = new Date(Date.UTC(tmpTime[0], parseInt(tmpTime[1]) - 1, tmpTime[2], tempDate[0], tempDate[1], tempDate[2]));
                var mYear = time.getFullYear().toString();
                var tempMonth = time.getMonth() + 1;
                var mMonth = (tempMonth < 10) ? "0" + tempMonth.toString() : tempMonth.toString();
                var mDay = (time.getDate() < 10) ? "0" + time.getDate().toString() : time.getDate().toString();
                var mHour = (time.getHours() < 10) ? "0" + time.getHours().toString() : time.getHours().toString();
                var mMinute = (time.getMinutes() < 10) ? "0" + time.getMinutes().toString() : time.getMinutes().toString();
                var mSecond = (time.getSeconds() < 10) ? "0" + time.getSeconds().toString() : time.getSeconds().toString();

                value["date"] = mYear + "-" + mMonth + "-" + mDay;
                value["time"] = mHour + ":" + mMinute + ":" + mSecond;
            }

            if (undefined != value["state"]) {
                delete value.state;
            }

            event["eventName"] = "OnRecvDispSMSNotify";
            this.EVENT_LIST["MsNotify"]["OnRecvDispSMSNotify"](event);
        } else if (opt == "sendresult") {
            //发送短信
            if (undefined != value["groupid"]) {
                delete value.groupid;
            }

            if (undefined != value["state"]) {
                delete value.state;
            }

            if (undefined != value["emerg_groupid"]) {
                delete value.emerg_groupid;
            }
            if (undefined != value["emerg_ueid"]) {
                delete value.emerg_ueid;
            }

            // value.msgid = new Date(value["date"] + " " + value["time"]).getTime().toString()
            event["eventName"] = "OnSendDispSMSResult";
            this.EVENT_LIST["MsNotify"]["OnSendDispSMSResult"](event);
        }
    } else if (type == "0002") {
        //状态短信
        if (undefined != value["state"]) {
            delete value.state;
        }
        if (undefined != event["rsp"]) {
            delete event.rsp;
        }
        if (undefined != value["speed"]) {
            delete value.speed;
        }
        if (undefined != value["emerg_groupid"]) {
            delete value.emerg_groupid;
        }
        if (undefined != value["emerg_ueid"]) {
            delete value.emerg_ueid;
        }
        if (undefined != value["groupid"]) {
            delete value.groupid;
        }
        if (undefined != value["attach"]) {
            delete value.attach;
        }
        event["eventName"] = "OnRecvStateMsgNotify";
        this.EVENT_LIST["MsNotify"]["OnRecvStateMsgNotify"](event);
    } else if (type == "0003") {
        //表示告警信息

    } else if (type == "0004") {
        if (undefined != value["speed"]) {
            delete value.speed;
        }

        if (undefined != value["statuscode"]) {
            delete value.statuscode;
        }

        //表示彩信
        if (opt == "recvmsg") {
            //接收彩信
            event["rsp"] = "0";

            // 转化时区
            if (value["state"] == 1) {
                var tmpTime = value["date"].split("-");
                var tempDate = value["time"].split(":");
                var time = new Date(Date.UTC(tmpTime[0], parseInt(tmpTime[1]) - 1, tmpTime[2], tempDate[0], tempDate[1], tempDate[2]));
                var mYear = time.getFullYear().toString();
                var tempMonth = time.getMonth() + 1;
                var mMonth = (tempMonth < 10) ? "0" + tempMonth.toString() : tempMonth.toString();
                var mDay = (time.getDate() < 10) ? "0" + time.getDate().toString() : time.getDate().toString();
                var mHour = (time.getHours() < 10) ? "0" + time.getHours().toString() : time.getHours().toString();
                var mMinute = (time.getMinutes() < 10) ? "0" + time.getMinutes().toString() : time.getMinutes().toString();
                var mSecond = (time.getSeconds() < 10) ? "0" + time.getSeconds().toString() : time.getSeconds().toString();

                value["date"] = mYear + "-" + mMonth + "-" + mDay;
                value["time"] = mHour + ":" + mMinute + ":" + mSecond;
            }

            if (undefined != value["state"]) {
                delete value.state;
            }

            event["eventName"] = "OnRecvDispMMSNotify";
            this.EVENT_LIST["MsNotify"]["OnRecvDispMMSNotify"](event);
        } else if (opt == "sendresult") {
            //发送彩信
            if (undefined != value["groupid"]) {
                delete value.groupid;
            }

            if (undefined != value["state"]) {
                delete value.state;
            }

            if (undefined != value["emerg_groupid"]) {
                delete value.emerg_groupid;
            }
            if (undefined != value["emerg_ueid"]) {
                delete value.emerg_ueid;
            }

            event["eventName"] = "OnSendDispMMSResult";
            this.EVENT_LIST["MsNotify"]["OnSendDispMMSResult"](event);
        }

    } else if (type == "0010") {
        //表示ACK消息

    } else if (type == "0011") {
        //表示消息发送失败错误码
    }


}

/**
 * 处理视频通知
 */
ICPSDK_Dispatch_Event.prototype.delVideoNotify = function(event) {
    var rsp = event["rsp"];
    if (undefined == rsp) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delVideoNotify: rsp is undefined." });
        return;
    }

    var value = event["value"];
    if (undefined == value) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delVideoNotify: value is undefined." });
        return;
    }

    var confInfo = value["confInfo"];
    if (undefined != confInfo) {
        delete value.confInfo;
    }


    var newEvent = {
        "eventName": "",
        "rsp": rsp,
        "value": {
            "callee": value["callee"],
            "caller": value["caller"],
            "cid": value["cid"],
            "fmt": value["fmt"]
        }
    }

    if (value["caller"] == cloudICP.userInfo["isdn"]) {
        // 呼出方
        switch (rsp) {
            case "3004":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.NEW, event, confInfo);
                    break;
                }

                if (event["value"]["isVideoDial"] == "0") {
                    var callStatusMgr = cloudICP.util.callStatusMgr;
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.NEW, event);

                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["eventName"] = "OnDialOutProceeding";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutProceeding"](newEvent);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.NEW, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["eventName"] = "OnDialOutProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutProceeding"](newEvent);
                break;
            case "3005":
                // 视频振铃事件
                // 播放回铃音
                var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":1, \"delay\":0, \"duration\":0, \"playcount\":0}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RINGING, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfDialOutRinging";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfDialOutRinging"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.MONITOR) {
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.RINGING, event);

                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["eventName"] = "OnDialOutRinging";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutRinging"](newEvent);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RINGING, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["eventName"] = "OnDialOutRinging";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutRinging"](newEvent);
                break;
            case "3003":
                // 视频点呼建立事件

                // 停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 建立音频媒体通道
                if (value["local_audio"] != "0.0.0.0,0" && value["server_audio"] != "0.0.0.0,0") {
                    let localArr = value["local_audio"].split(",");
                    let serverArr = value["server_audio"].split(",");

                    var callStatusMgr = cloudICP.util.callStatusMgr;
                    var call = callStatusMgr.allCalls[event["value"]["cid"]];
                    if (call && call.callType == callStatusMgr.VIDEOCONF) {
                        var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"conference\"}}}".format(
                            parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"])
                        )

                        cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                    } else {
                        var callNumber;
                        if (event["value"]["callee"] != cloudICP.userInfo["isdn"]) {
                            callNumber = event["value"]["callee"]
                        } else {
                            callNumber = event["value"]["caller"];
                        }


                        if (call && call.callType == callStatusMgr.MONITOR) {
                            var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"{7}\" , \"recvOnly\": true }}}".format(
                                parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"]), parseInt(callNumber)
                            )

                            cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                        } else {
                            var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"{7}\"} }}".format(
                                parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"]), parseInt(callNumber)
                            )

                            cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                        }
                    }


                }

                var recvOnly = false;
                if (event["value"]["camera"] == "1") {
                    recvOnly = true;
                }

                // 建立视频媒体通道
                if (value["local_video"] != "0.0.0.0,0" && value["server_video"] != "0.0.0.0,0") {
                    cloudICP.util.callStatusMgr.videoMediaInfoBuf[event["value"]["cid"]] = event;

                    var windowInfo = cloudICP.util.callStatusMgr.windowInfos[event["value"]["cid"]];

                    if (windowInfo != undefined) {
                        var param = "{\"description\":\"msp_create_video_window\", \"cmd\": 196610, \"param\":{\"resID\":{0}, \"windowName\": \"{1}\", \"width\": {2}, \"height\": {3}, \"x\": {4}, \"y\": {5}}}".format(
                            parseInt(value["cid"]), parseInt(value["cid"]), parseInt(windowInfo["width"]), parseInt(windowInfo["height"]), parseInt(windowInfo["posX"]), parseInt(windowInfo["posY"])
                        )
                    } else {
                        var param = "{\"description\":\"msp_create_video_window\", \"cmd\": 196610, \"param\":{\"resID\":{0}, \"windowName\": \"{1}\" }}".format(
                            parseInt(value["cid"]), parseInt(value["cid"])
                        )
                    }

                    cloudICP.dispatch.webSocket.sendDataToDeamonSDK(param, true);
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.MONITOR) {
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.CONNECTING, event);

                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["ptz"] = event["value"]["ptz"];
                    newEvent["value"]["mute"] = event["value"]["mute"];
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfConnect";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfConnect"](newEvent);

                    var ajaxCfg = {
                        "type": "POST",
                        "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                        "data": {
                            "opt": "sub",
                            "confId": call["confId"]
                        },
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnSubscribeConfFailure",
                                    "rsp": data["rsp"],
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
                            } else {
                                cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] = true;
                            }
                        }
                    }
                    cloudICP.util.ajax(ajaxCfg);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.CONNECTING, event);

                callStatusMgr.holdCall(event["value"]["cid"]);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["value"]["ptz"] = event["value"]["ptz"];
                newEvent["value"]["mute"] = event["value"]["mute"];
                newEvent["eventName"] = "OnCallConnect";
                this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                break;
            case "3008":
                // 对端挂起事件
                var value = event["value"];

                //停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除视频媒体通道
                var param = "{\"description\":\"msp_delete_video_channel\", \"cmd\": 65540, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.MONITOR) {
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.RELEASE, event);


                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }

                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }

                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["releasetype"] = "other";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "3009":
                // DC挂断事件
                var value = event["value"];

                //停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除视频媒体通道
                var param = "{\"description\":\"msp_delete_video_channel\", \"cmd\": 65540, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.MONITOR) {
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["value"]["releasetype"] = "self";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }

                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }

                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);


                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["releasetype"] = "self";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "3013":
            case "3015":
            case "3014":
            case "3016": // 被叫号码不存在
            case "3021": // 对端不在线
            case "3045": // 对端不支持该操作，可能是没有权限或者不支持该分辨率
            case "3044": // 本端不支持该操作，可能是没有权限
            case "3048": // 对端没有权限
            case "3022": // 对端没有权限
                // 呼出失败事件

                //停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                if (rsp == "3013") {
                    //对端正在通话中
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":3, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "3014" || rsp == "3048") {
                    //对端无法接通
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":4, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "3016" || rsp == "3021") {
                    //对端号码不存在
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":5, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //本段没有权限
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":6, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //对端没有权限
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":7, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "3015") {
                    //对端无应答
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":8, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //对端正忙
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":9, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "3044" || rsp == "3022" || rsp == "2033" || "3045") {
                    //拨打业务无法支持
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":10, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                }


                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, event, confInfo);

                    newEvent["value"]["confId"] = confInfo["confInternalId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfFailure";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfFailure"](newEvent);
                    break;
                }

                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.MONITOR) {
                    callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "monitor";
                    newEvent["eventName"] = "OnDialOutFailure";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["eventName"] = "OnDialOutFailure";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                break;
            default:
                break;
        }
    } else {
        switch (rsp) {
            case "3002":
                var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":1, \"delay\":0, \"duration\": 0, \"playcount\":0}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RINGING, event, confInfo);

                    newEvent["value"]["confId"] = confInfo["confInternalId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfDialInRinging";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfDialInRinging"](newEvent);
                    break;
                }
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RINGING, event);

                // 视频响铃事件
                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["src"] = "";
                newEvent["eventName"] = "OnDialInRinging";
                this.EVENT_LIST["VoiceNotify"]["OnDialInRinging"](newEvent);
                break;
            case "3006":
                // 视频点呼被acked事件

                // 停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 建立音频媒体通道
                if (value["local_audio"] != "0.0.0.0,0" && value["server_audio"] != "0.0.0.0,0") {
                    let localArr = value["local_audio"].split(",");
                    let serverArr = value["server_audio"].split(",");

                    var callNumber;
                    if (event["value"]["callee"] != cloudICP.userInfo["isdn"]) {
                        callNumber = event["value"]["callee"]
                    } else {
                        callNumber = event["value"]["caller"];
                    }

                    var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"{7}\"}}}".format(
                        parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"]), parseInt(callNumber)
                    )

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                }

                // 建立视频媒体通道
                if (value["local_video"] != "0.0.0.0,0" && value["server_video"] != "0.0.0.0,0") {
                    cloudICP.util.callStatusMgr.videoMediaInfoBuf[event["value"]["cid"]] = event;

                    var windowInfo = cloudICP.util.callStatusMgr.windowInfos[event["value"]["cid"]];

                    if (windowInfo != undefined) {
                        var param = "{\"description\":\"msp_create_video_window\", \"cmd\": 196610, \"param\":{\"resID\":{0}, \"windowName\": \"{1}\", \"width\": {2}, \"height\": {3}, \"x\": {4}, \"y\": {5}}}".format(
                            parseInt(value["cid"]), parseInt(value["cid"]), parseInt(windowInfo["width"]), parseInt(windowInfo["height"]), parseInt(windowInfo["posX"]), parseInt(windowInfo["posY"])
                        )
                    } else {
                        var param = "{\"description\":\"msp_create_video_window\", \"cmd\": 196610, \"param\":{\"resID\":{0}, \"windowName\": \"{1}\" }}".format(
                            parseInt(value["cid"]), parseInt(value["cid"])
                        )
                    }

                    cloudICP.dispatch.webSocket.sendDataToDeamonSDK(param, true);
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfConnect";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfConnect"](newEvent);

                    var ajaxCfg = {
                        "type": "POST",
                        "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                        "data": {
                            "opt": "sub",
                            "confId": call["confId"]
                        },
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnSubscribeConfFailure",
                                    "rsp": data["rsp"],
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
                            } else {
                                cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] = true;
                            }
                        }
                    }
                    cloudICP.util.ajax(ajaxCfg);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEODISPATCH) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEODISPATCH, callStatusMgr.CONNECTING, event);

                    newEvent["value"]["calltype"] = "dispatch";
                    newEvent["value"]["src"] = event["value"]["uri"];
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["ptz"] = event["value"]["ptz"];
                    newEvent["value"]["mute"] = event["value"]["mute"];
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.CONNECTING, event);

                callStatusMgr.holdCall(event["value"]["cid"]);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["ptz"] = event["value"]["ptz"];
                newEvent["value"]["mute"] = event["value"]["mute"];
                newEvent["eventName"] = "OnCallConnect";
                this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                break;
            case "3009":
                // DC挂断事件
                var value = event["value"];

                //停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除视频媒体通道
                var param = "{\"description\":\"msp_delete_video_channel\", \"cmd\": 65540, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEODISPATCH) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEODISPATCH, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "dispatch";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["releasetype"] = "self";
                    newEvent["value"]["src"] = event["value"]["uri"];
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["releasetype"] = "self";
                newEvent["value"]["src"] = "";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "3008":
            case "3010":
            case "3013":
                // 对端拒接事件

                //停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除视频媒体通道
                var param = "{\"description\":\"msp_delete_video_channel\", \"cmd\": 65540, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "true";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.VIDEODISPATCH) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEODISPATCH, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "dispatch";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = event["value"]["uri"];
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["releasetype"] = "other";
                newEvent["value"]["src"] = "";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "3011":
                var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":1, \"delay\":0, \"duration\": 0, \"playcount\":0}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEODISPATCH, callStatusMgr.RINGING, event);

                newEvent["value"]["calltype"] = "dispatch";
                newEvent["eventName"] = "OnDialInRinging";
                newEvent["value"]["src"] = event["value"]["uri"];
                this.EVENT_LIST["VoiceNotify"]["OnDialInRinging"](newEvent);
                break;
            case "3040":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEOCONF, callStatusMgr.NEW, event);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VIDEODISPATCH) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VIDEODISPATCH, callStatusMgr.NEW, event);

                    newEvent["value"]["calltype"] = "dispatch";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["src"] = event["value"]["uri"];
                    newEvent["eventName"] = "OnConnectProceeding";
                    this.EVENT_LIST["VoiceNotify"]["OnConnectProceeding"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.NEW, event);

                newEvent["value"]["calltype"] = "video";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["src"] = "";
                newEvent["eventName"] = "OnConnectProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnConnectProceeding"](newEvent);
                break;
            case "3045":
                // 视频监控失败

                // 停止振铃
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.MONITOR, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "monitor";
                newEvent["eventName"] = "OnDialOutFailure";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                break;
            default:
                break;
        }
    }
}

/**
 * 处理组呼通知
 */
ICPSDK_Dispatch_Event.prototype.delGroupCallNotify = function(event) {
    var value = event["value"];

    if (event["opt"] == "speaker") {
        if (event["rsp"] == "1001") {
            var retEvent = {
                "eventName": "OnTalkingGroupCallStart",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "cid": event["value"]["cid"],
                    "from": event["value"]["from"],
                    "speaker": event["value"]["speaker"]
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallStart"](retEvent);
        } else if (event["rsp"] == "1003") {
            // 组呼放权事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTSuccess",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "from": event["value"]["from"]
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTSuccess"](retEvent);
        } else if (event["rsp"] == "1006") {
            // 建立音频媒体通道
            if (value["local"] != "0.0.0.0,0" && value["server"] != "0.0.0.0,0") {
                let localArr = value["local"].split(",");
                let serverArr = value["server"].split(",");

                var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"{7}\"}}}".format(
                    parseInt(event["value"]["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"]), parseInt(event["grpid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                cloudICP.dispatch.group.current_groupcall_num += 1;
            }

            var callStatusMgr = cloudICP.util.callStatusMgr;
            callStatusMgr.updateCallStatus(callStatusMgr.GROUP, callStatusMgr.NEW, event);

            // 组呼开始事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTStart",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "cid": event["value"]["cid"],
                    "from": event["value"]["from"],
                    "speaker": event["value"]["speaker"]
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTStart"](retEvent);
        } else if (event["rsp"] == "1011") {
            // 组呼权限更新通知
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTNotify",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "name": event["value"]["name"],
                    "speaker": event["value"]["speaker"]
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTNotify"](retEvent);
        } else if (event["rsp"] == "1012") {
            // 无人占权事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTIdle",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                }
            }


            cloudICP.dispatch.group.isCurrentPtt = { "grpid": event["isdn"], "isPtt": false };


            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTIdle"](retEvent);
        }
    } else if (event["opt"] = "state") {
        if (event["rsp"] == "1007") {
            // 退出组呼成功
            var callStatusMgr = cloudICP.util.callStatusMgr;
            var groupCid = callStatusMgr.groupCallMgr[event["grpid"]]

            // 删除音频媒体通道
            var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                parseInt(groupCid)
            )

            cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

            cloudICP.dispatch.group.current_groupcall_num -= 1;
            if (cloudICP.dispatch.group.isCurrentPtt["grpid"] == event["grpid"]) {
                cloudICP.dispatch.group.isCurrentPtt = { "grpid": event["grpid"], "isPtt": false };
            }

            // 组呼关闭事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallStop",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                }
            }
            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallStop"](retEvent);
        } else if (event["rsp"] == "1008") {
            // 删除音频媒体通道
            var callStatusMgr = cloudICP.util.callStatusMgr;
            var groupCid = callStatusMgr.groupCallMgr[event["grpid"]]

            var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                parseInt(groupCid)
            )

            cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
            cloudICP.dispatch.group.current_groupcall_num -= 1;

            // 组呼关闭事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallRelease",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                }
            }
            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallRelease"](retEvent);
        } else if (event["rsp"] == "1005") {
            // 组呼抢权失败事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTFailure",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                }

            }
            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTFailure"](retEvent);
        } else if (event["rsp"] == "1017") {
            // 组呼发起失败事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallFailure",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                }
            }
            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallFailure"](retEvent);
        } else if (event["rsp"] == "1003") {
            // 组呼请求事件
            var retEvent = {
                "eventName": "OnTalkingGroupCallPTTSuccess",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "from": event["from"],
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGroupCallPTTSuccess"](retEvent);
        } else if (event["rsp"] == "1014") {
            // 紧急组呼通知
            var retEvent = {
                "eventName": "OnTalkingGourpEmergencyCallStart",
                "rsp": event["rsp"],
                "value": {
                    "grpid": event["grpid"],
                    "name": event["value"]["name"],
                    "speaker": event["value"]["speaker"],
                }
            }

            this.EVENT_LIST["GroupCallNotify"]["OnTalkingGourpEmergencyCallStart"](retEvent);
        }
    }
}

/**
 * 处理资源状态通知
 */
ICPSDK_Dispatch_Event.prototype.delResourceNotify = function(event) {
    var opt = event["opt"];
    var statusValue = event["statusvalue"];
    var statusType = event["statustype"];
    switch (statusType) {
        case "18":
            cloudICP.util.callStatusMgr.updateUserStatus(event);

            var retEvent = {
                "eventName": "OnUserStatusNotify",
                "list": [{
                    "isdn": event["value"]["isdn"],
                    "peerid": event["value"]["peerid"],
                    "statustype": event["statustype"],
                    "statusvalue": event["statusvalue"]
                }]
            }
            this.EVENT_LIST["VoiceNotify"]["OnUserStatusNotify"](retEvent);
            break;
        case "20":
            if (statusValue == "4005") {
                var retEvent = {
                    "eventName": "OnDiscreetlistenStart",
                    "rsp": "0",
                    "value": {
                        "to": event["value"]["isdn"]
                    }
                };
                this.EVENT_LIST["VoiceNotify"]["OnDiscreetlistenStart"](retEvent);
            } else if (statusValue == "4006") {
                var retEvent = {
                    "eventName": "OnDiscreetlistenStop",
                    "rsp": "0",
                    "value": {
                        "to": event["value"]["isdn"]
                    }

                };
                this.EVENT_LIST["VoiceNotify"]["OnDiscreetlistenStop"](retEvent);
            }
            break;
        case "21":
            if (statusValue == "4026") {
                var retEvent = {
                    "eventName": "OnTalkingGroupMemberChangeFailure",
                    "rsp": event["value"]["cause"],
                    "value": {
                        "grpid": event["value"]["attaching"],
                        "isdn": event["isdn"],
                    }

                };
                this.EVENT_LIST["GroupNotify"]["OnTalkingGroupMemberChangeFailure"](retEvent);
            }
            break;
        case "22":
            if (statusValue == "4021" || statusValue == "4022" || statusValue == "4023") {
                var retEvent = {
                    "eventName": "OnVideoDispatchStatusNotify",
                    "rsp": event["statusvalue"],
                    "value": {
                        "src": event["value"]["camid"],
                        "peerid": event["value"]["peerid"],
                    }

                };
                this.EVENT_LIST["VideoNotify"]["OnVideoDispatchStatusNotify"](retEvent);
            }
            break;
        case "24":
            if (statusValue == "4038" || statusValue == "4036") {
                var retEvent = {
                    "eventName": "OnChangePatchGroupMemberFailure",
                    "rsp": "0",
                    "value": {
                        "grpid": event["isdn"],
                        "isdn": event["value"]["memberid"],
                        "opt": statusValue == "4036" ? "create" : "delete"
                    }

                };
                this.EVENT_LIST["GroupNotify"]["OnChangePatchGroupMemberFailure"](retEvent);
            }
            break;
        case "29":
            var retEvent = {
                "eventName": "OnVDMStatusNotify",
                "rsp": event["statusvalue"]
            }

            this.EVENT_LIST["MSPNotify"]["OnVDMStatusNotify"](retEvent);
            break;
        case "30":
            if (statusValue == "4090") {
                // 创会成功
                var retEvent = {
                    "eventName": "OnCreateConfSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confInternalId"],
                        "passcode": event["value"]["passcode"],
                        "unifiedAccessCode": event["value"]["unifiedAccessCode"],
                        "isVideo": event["value"]["isVideo"],
                        // "members": event["value"]["members"]
                    }
                };

                cloudICP.util.callStatusMgr.updateConfInfo(retEvent["value"], true);

                this.EVENT_LIST["PhoneConfNotify"]["OnCreateConfSuccess"](retEvent);

                var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"];
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": {
                        "opt": "join",
                        "param": {
                            "confId": event["value"]["confInternalId"],
                            "fmt": "1080P",
                            "video_format": cloudICP.config.cameraInfo.toString(),
                            "audio_format": "1",
                            "unifiedAccessCode": event["value"]["unifiedAccessCode"],
                            "passcode": event["value"]["passcode"],
                            "isVideo": event["value"]["isVideo"] == "1" ? "true" : "false"
                        }
                    },
                    "callback": function(data) {
                        cloudICP.util.sendLogOut("connectToSDKServer: WebSocket message received: joinConf: " + JSON.stringify(data));
                    }
                }
                cloudICP.util.ajax(ajaxCfg);
            } else if (statusValue == "4091") {
                // 创会失败
                var retEvent = {
                    "eventName": "OnCreateConfFailure",
                    "rsp": event["value"]["rsp"],
                    "value": {
                        "confId": event["value"]["confInternalId"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnCreateConfFailure"](retEvent);
            }
            break;
        case "31":
            if (statusValue == "4090") {
                // 结束会议成功
                var retEvent = {
                    "eventName": "OnEndConfSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confId"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnEndConfSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 结束会议失败
                var retEvent = {
                    "eventName": "OnEndConfFailure",
                    "rsp": event["value"]["rsp"],
                    "value": {
                        "confId": event["value"]["confId"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnEndConfFailure"](retEvent);
            }
            break;
        case "35":
            var value = event["value"];

            if (value["msgType"] == "ConfMuteMember") {
                if (value["params"] == "mute") {
                    if (statusValue == "4090") {
                        var retEvent = {
                            "eventName": "OnMuteConfMemberSuccess",
                            "rsp": "0",
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnMuteConfMemberSuccess"](retEvent);
                    } else if (statusValue == "4091") {
                        var retEvent = {
                            "eventName": "OnMuteConfMemberFailure",
                            "rsp": event["value"]["rsp"],
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnMuteConfMemberFailure"](retEvent);
                    }
                } else if (value["params"] == "unmute") {
                    if (statusValue == "4090") {
                        var retEvent = {
                            "eventName": "OnUnmuteConfMemberSuccess",
                            "rsp": "0",
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnUnmuteConfMemberSuccess"](retEvent);
                    } else if (statusValue == "4091") {
                        var retEvent = {
                            "eventName": "OnUnmuteConfMemberFailure",
                            "rsp": event["value"]["rsp"],
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnUnmuteConfMemberFailure"](retEvent);
                    }
                }
            } else if (value["msgType"] == "SetFloor" || value["msgType"] == "ConfFreeMode") {
                var IsSpoken = "false";
                if (value["msgType"] == "SetFloor") {
                    IsSpoken = "true"
                }
                if (value["params"] == "isSpoken") {
                    if (statusValue == "4090") {
                        var retEvent = {
                            "eventName": "OnSetSpokenMemberSuccess",
                            "rsp": "0",
                            "value": {
                                "confId": value["confId"],
                                "isSpoken": IsSpoken
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnSetSpokenMemberSuccess"](retEvent);
                    } else if (statusValue == "4091") {
                        var retEvent = {
                            "eventName": "OnSetSpokenMemberFailure",
                            "rsp": event["value"]["rsp"],
                            "retMsg": event["value"]["retMsg"],
                            "value": {
                                "confId": value["confId"],
                                "isSpoken": IsSpoken
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnSetSpokenMemberFailure"](retEvent);
                    }
                }
            } else if (value["msgType"] == "ConfMuteConf") {
                if (value["params"] == "mute") {
                    if (statusValue == "4090") {
                        var retEvent = {
                            "eventName": "OnMuteConfSuccess",
                            "rsp": "0",
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnMuteConfSuccess"](retEvent);
                    } else if (statusValue == "4091") {
                        var retEvent = {
                            "eventName": "OnMuteConfFailure",
                            "rsp": event["value"]["rsp"],
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnMuteConfFailure"](retEvent);
                    }
                    break;
                } else if (value["params"] == "unmute") {
                    if (statusValue == "4090") {
                        var retEvent = {
                            "eventName": "OnUnmuteConfSuccess",
                            "rsp": "0",
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnUnmuteConfSuccess"](retEvent);
                    } else if (statusValue == "4091") {
                        var retEvent = {
                            "eventName": "OnUnmuteConfFailure",
                            "rsp": event["value"]["rsp"],
                            "value": {
                                "confId": value["confId"]
                            }
                        };
                        this.EVENT_LIST["PhoneConfNotify"]["OnUnmuteConfFailure"](retEvent);
                    }
                    break;
                }
            } else if (value["msgType"] == "ConfBroadcastMixPicture") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnBroadcastMixPictureSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnBroadcastMixPictureSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnBroadcastMixPictureFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnBroadcastMixPictureFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfCancelBroadcastMixPicture") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnCancelBroadcastMixPictureSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnCancelBroadcastMixPictureSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnCancelBroadcastMixPictureFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnCancelBroadcastMixPictureFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfBroadcastPicture") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnBroadcastConfMemberSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnBroadcastConfMemberSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnBroadcastConfMemberFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnBroadcastConfMemberFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfCancelBroadcastPicture") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnCancelBroadcastConfMemberSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnCancelBroadcastConfMemberSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnCancelBroadcastConfMemberFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnCancelBroadcastConfMemberFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfWatchMember") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnWatchConfMemberSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnWatchConfMemberSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnWatchConfMemberFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnWatchConfMemberFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfWatchMixPicture") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnWatchMixPictureSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnWatchMixPictureSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnWatchMixPictureFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                            "member": value["members"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnWatchMixPictureFailure"](retEvent);
                }
            } else if (value["msgType"] == "ConfQueryConfListByAttendee") {
                if (statusValue == "4090") {
                    var confInfos = [];
                    for (var index = 0; index < value["confInfos"].length; index++) {
                        confInfos.push({
                            "confId": value["confInfos"][index]["confInternalId"],
                            "isVideo": value["confInfos"][index]["isVideo"],
                            "passcode": value["confInfos"][index]["passcode"],
                            "unifiedAccessCode": value["confInfos"][index]["unifiedAccessCode"],
                        });

                        delete value["confInfos"][index].confExternalId;
                        var tmp = value["confInfos"][index]["confInternalId"];
                        value["confInfos"][index]["confId"] = tmp;
                        delete value["confInfos"][index].confInternalId;
                    }

                    var retEvent = {
                        "eventName": "OnQueryConfListByAttendeeResult",
                        "rsp": "0",
                        "value": {
                            "confInfos": value["confInfos"]
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnQueryConfListByAttendeeResult"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnQueryConfListByAttendeeResult",
                        "rsp": "-1",
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnQueryConfListByAttendeeResult"](retEvent);
                }
            } else if (value["msgType"] == "ConfAddMember") {
                if (statusValue == "4090") {
                    var retEvent = {
                        "eventName": "OnAddConfMembersSuccess",
                        "rsp": "0",
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnAddConfMembersSuccess"](retEvent);
                } else if (statusValue == "4091") {
                    var retEvent = {
                        "eventName": "OnAddConfMembersFailure",
                        "rsp": event["value"]["rsp"],
                        "value": {
                            "confId": value["confId"],
                        }
                    };
                    this.EVENT_LIST["PhoneConfNotify"]["OnAddConfMembersFailure"](retEvent);
                }
            }
            break;
        case "36":
            var retEvent = {
                "eventName": "OnQueryVWallDisplayMatrixInfoResult",
                "rsp": "0",
                "value": event["value"]
            };
            this.EVENT_LIST["PhoneConfNotify"]["OnQueryVWallDisplayMatrixInfoResult"](retEvent);
            break;
        case "37":
            if (statusValue == "4090") {
                // 上墙成功
                var retEvent = {
                    "eventName": "OnStartConfUploadWallSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confid"],
                        "number": event["value"]["number"],
                        "layerInfo": event["value"]["layerInfo"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnStartConfUploadWallSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 上墙失败
                var retEvent = {
                    "eventName": "OnStartConfUploadWallFailure",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnStartConfUploadWallFailure"](retEvent);
            }
            break;
        case "38":
            if (statusValue == "4090") {
                // 停止上墙成功
                var retEvent = {
                    "eventName": "OnStopConfUploadWallSuccess",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnStopConfUploadWallSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 停止上墙失败
                var retEvent = {
                    "eventName": "OnStopConfUploadWallFailure",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnStopConfUploadWallFailure"](retEvent);
            }
            break;
        case "39":
            // 当广播多画面的时候，smc传回的braodcast参数为"(%CP)"，需要改成"mix"
            if (event["value"]["confStatus"]["broadcast"] == "(%CP)") {
                event["value"]["confStatus"]["broadcast"] = "mix";
            }

            cloudICP.util.callStatusMgr.updateConfInfo(event);

            event["value"]["confStatus"]["confName"] = event["value"]["confStatus"]["name"];
            delete event["value"]["confStatus"]["name"];

            // 成员信息推送
            var retEvent = {
                "eventName": "OnConfStatusNotify",
                "rsp": "0",
                "value": event["value"]
            };
            this.EVENT_LIST["PhoneConfNotify"]["OnConfStatusNotify"](retEvent);
            break;
        case "40":
            if (statusValue == "4090") {
                // 订阅会议成功
                var retEvent = {
                    "eventName": "OnQueryConfWallInfoResult",
                    "rsp": "0",
                    "value": event["value"]
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnQueryConfWallInfoResult"](retEvent);
            } else if (statusValue == "4091") {
                // 订阅会议失败
                var retEvent = {
                    "eventName": "OnQueryConfWallInfoResult",
                    "rsp": "-1",
                    "value": ""
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnQueryConfWallInfoResult"](retEvent);
            }
            break;
        case "41":
            if (statusValue == "4090") {
                // 订阅会议成功
                var retEvent = {
                    "eventName": "OnSubscribeConfSuccess",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 订阅会议失败
                var retEvent = {
                    "eventName": "OnSubscribeConfFailure",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
            }
            break;
        case "42":
            if (statusValue == "4090") {
                // 去订阅会议成功
                var retEvent = {
                    "eventName": "OnUnsubscribeConfSuccess",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 去订阅会议失败
                var retEvent = {
                    "eventName": "OnUnsubscribeConfFailure",
                    "rsp": "0",
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
            }
            break;
        case "43":
            if (statusValue == "4090") {
                // 订阅会议成功
                var retEvent = {
                    "eventName": "OnHangupConfMemberSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    },
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnHangupConfMemberSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 订阅会议失败
                var retEvent = {
                    "eventName": "OnHangupConfMemberFailure",
                    "rsp": event["value"]["rsp"],
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    },
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnHangupConfMemberFailure"](retEvent);
            }
            break;
        case "44":
            if (statusValue == "4090") {
                // 订阅会议成功
                var retEvent = {
                    "eventName": "OnCallConfMemberSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    },
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnCallConfMemberSuccess"](retEvent);
            } else if (statusValue == "4091") {
                // 订阅会议失败
                var retEvent = {
                    "eventName": "OnCallConfMemberFailure",
                    "rsp": event["value"]["rsp"],
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    },
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnCallConfMemberFailure"](retEvent);
            }
            break;
        case "45":
            if (statusValue == "4090") {
                var retEvent = {
                    "eventName": "OnQueryRecordURLByConfIDResult",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confInternalId"],
                        "url": event["value"]["url"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnQueryRecordURLByConfIDResult"](retEvent);
            } else if (statusValue == "4091") {
                var retEvent = {
                    "eventName": "OnQueryRecordURLByConfIDResult",
                    "rsp": "-1",
                    "value": {
                        "confId": "",
                        "url": ""
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnQueryRecordURLByConfIDResult"](retEvent);
            }
            break;
        case "46":
            if (statusValue == "4090") {
                var retEvent = {
                    "eventName": "OnDelConfMembersSuccess",
                    "rsp": "0",
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnDelConfMembersSuccess"](retEvent);
            } else if (statusValue == "4091") {
                var retEvent = {
                    "eventName": "OnDelConfMembersFailure",
                    "rsp": event["value"]["rsp"],
                    "value": {
                        "confId": event["value"]["confId"],
                        "member": event["value"]["members"]
                    }
                };
                this.EVENT_LIST["PhoneConfNotify"]["OnDelConfMembersFailure"](retEvent);
            }
            break;
        default:
            break;
    }

    if (undefined != event["rid"]) {
        delete event.rid;
    }

    if ("4025" == event["statusvalue"] && "21" == event["statustype"]) {
        //动态组创建失败
        var cause = "";
        if (event["value"]) {
            cause = event["value"]["cause"];
        }
        var retEvent = { "eventName": "OnDynamicGroupOptFailed", "grpid": event["value"]["attaching"], "rsp": cause };
        this.EVENT_LIST["GroupNotify"]["OnDynamicGroupOptFailed"](retEvent);
        return;
    } else if ("4034" == event["statusvalue"] && "24" == event["statustype"]) {
        //派接组创建失败
        var cause = "";
        if (event["value"]) {
            cause = event["value"]["cause"];
        }
        var retEvent = { "eventName": "OnPatchGroupOptFailed", "rsp": cause };
        this.EVENT_LIST["GroupNotify"]["OnPatchGroupOptFailed"](retEvent);
        return;
    } else if (undefined != event["list"]) {
        for (var index = 0; index < event["list"].length; index++) {
            event["list"][index]["peerid"] = "";
        }
        var retEvent = { "eventName": "OnUserStatusNotify", "list": event["list"] }
        this.EVENT_LIST["VoiceNotify"]["OnUserStatusNotify"](retEvent);
    }

    if (event["statustype"] == "3") {
        var retEvent = {
            "eventName": "OnGroupCallStatusNotify",
            "rsp": event["statusvalue"],
            "value": {
                "grpid": event["isdn"],
                "name": event["value"]["name"],
                "speaker": event["value"]["speaker"]
            }
        }


        if (event["value"]["speaker"] == cloudICP.userInfo["isdn"]) {
            cloudICP.dispatch.group.isCurrentPtt = { "grpid": event["isdn"], "isPtt": true };
        } else {
            cloudICP.dispatch.group.isCurrentPtt = { "grpid": event["isdn"], "isPtt": false };
        }

        this.EVENT_LIST["GroupCallNotify"]["OnGroupCallStatusNotify"](retEvent);
    }
}

/**
 * 群组管理
 */
ICPSDK_Dispatch_Event.prototype.delCommonNotify = function(event) {
    var mo = event["mo"];
    if (undefined == mo) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delCommonNotify: mo is undefined." });
        return;
    }
    var opt = event["opt"];
    if (undefined == opt) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delCommonNotify: opt is undefined." });
        return;
    }
    var value = event["value"];
    if (undefined != value && undefined != value["servermode"]) {
        delete value.servermode;
    }

    if (undefined != value["vpnid"]) {
        delete value["vpnid"];
    }

    if (mo == "3") {

        var newEvent = {
            "eventName": "OnTalkingGroupStatusChange",
            "opt": opt,
            "groupinfo": value
        }
        this.EVENT_LIST["GroupNotify"]["OnTalkingGroupStatusChange"](newEvent);
    } else if (mo == "29") {
        //派接组的新建和删除
        if (undefined == value) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "delCommonNotify: value is undefined." });
            return;
        }

        if (undefined != value["vpnid"]) {
            delete value["vpnid"];
        }

        var newEvent = {
            "eventName": "OnPatchGroupStatusChange",
            "opt": opt,
            "groupinfo": value
        }
        this.EVENT_LIST["GroupNotify"]["OnPatchGroupStatusChange"](newEvent);
    } else if (mo == "7") {
        //动态组的成员的新增和删除
        if (undefined == value) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "delCommonNotify: value is undefined." });
            return;
        }

        // var newEvent = {
        //     "eventName": "OnTalkingGroupMemberChange",
        //     "opt": opt,
        //     "groupinfo": value
        // }
        // this.EVENT_LIST["GroupNotify"]["OnTalkingGroupMemberChange"](newEvent);
    } else if (mo == "30") {
        //派接组的成员的新增和删除
        if (undefined == value) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "delCommonNotify: value is undefined." });
            return;
        }

        var newEvent = {
            "eventName": "OnPatchGroupMemberChange",
            "opt": opt,
            "groupinfo": value
        }
        this.EVENT_LIST["GroupNotify"]["OnPatchGroupMemberChange"](newEvent);
    } else if (mo == "6") {
        //群组成员配置更新
        var newEvent = {
            "eventName": "OnTalkingGroupMemberChange",
            "opt": opt,
            "groupinfo": value
        }
        this.EVENT_LIST["GroupNotify"]["OnTalkingGroupMemberChange"](newEvent);
    } else if (mo == "5") {
        //群组终端用户配置更新
        var newEvent = {
            "eventName": "OnTalkingGroupMemberChange",
            "opt": opt,
            "groupinfo": value
        }
        this.EVENT_LIST["GroupNotify"]["OnTalkingGroupMemberChange"](newEvent);
    }


}

/**
 * 语音事件通知
 */
ICPSDK_Dispatch_Event.prototype.delVoiceNotify = function(event) {
    var rsp = event["rsp"];
    if (undefined == rsp) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delVoiceNotify: rsp is undefined." });
        return;
    }
    var value = event["value"];
    if (undefined == value) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "delVoiceNotify: value is undefined." });
        return;
    }

    // 建立音频媒体通道
    if (value["local"] != "0.0.0.0,0" && value["server"] != "0.0.0.0,0") {
        let localArr = value["local"].split(",");
        let serverArr = value["server"].split(",");

        var callNumber;
        if (event["value"]["callee"] != cloudICP.userInfo["isdn"]) {
            callNumber = event["value"]["callee"]
        } else {
            callNumber = event["value"]["caller"];
        }

        var param = "{\"description\":\"msp_create_audio_channel\", \"cmd\": 65537, \"param\":{\"resID\":{0}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"number\": \"{7}\"}}}".format(
            parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["audio"]), parseInt(value["audio_ssrc"]), parseInt(callNumber)
        )

        cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
    }


    if (undefined != value["from"]) {
        delete value.from;
    }

    if (undefined != value["to"]) {
        delete value.to;
    }

    var local = value["local"];
    if (undefined != local) {
        delete value.local;
    }

    var server = value["server"];
    if (undefined != server) {
        delete value.server;
    }

    var sipcode = value["sipcode"];
    if (undefined != sipcode) {
        delete value.sipcode;
    }

    var targeter = value["targeter"];
    if (undefined != targeter) {
        delete value.targeter;
    }

    var transfer = value["transfer"];
    if (undefined != transfer) {
        delete value.transfer;
    }

    var inserter = value["inserter"];
    if (undefined != inserter) {
        delete value.inserter;
    }

    var audio = value["audio"];
    if (undefined != audio) {
        delete value.audio;
    }

    var audio_ssrc = value["audio_ssrc"];
    if (undefined != audio_ssrc) {
        delete value.audio_ssrc;
    }

    var discreet_listenee = value["discreetListenee"];
    if (undefined != discreet_listenee) {
        delete value.discreetListenee;
    }

    var sub_type = value["sub_type"];
    if (undefined != sub_type) {
        delete value.sub_type;
    }

    var confInfo = value["confInfo"];
    if (undefined != confInfo) {
        delete value.confInfo;
    }

    var listentype = value["listentype"];
    if (undefined != confInfo) {
        delete value.listentype;
    }

    var newEvent = {
        "eventName": "",
        "rsp": rsp,
        "value": value
    }

    var caller = value["caller"];
    if (caller == cloudICP.userInfo["isdn"]) {
        //表示呼出
        switch (rsp) {
            case "2003":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;

                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfConnect";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfConnect"](newEvent);

                    var ajaxCfg = {
                        "type": "POST",
                        "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                        "data": {
                            "opt": "sub",
                            "confId": call["confId"]
                        },
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnSubscribeConfFailure",
                                    "rsp": data["rsp"],
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
                            } else {
                                cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] = true;
                            }
                        }
                    }
                    cloudICP.util.ajax(ajaxCfg);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.AMBIENCE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.CONNECTING, event);

                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.CONNECTING, event);

                callStatusMgr.holdCall(event["value"]["cid"]);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["value"]["fmt"] = "";
                newEvent["value"]["ptz"] = "";
                newEvent["value"]["mute"] = "";
                newEvent["eventName"] = "OnCallConnect";
                this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                break;
            case "2005":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.NEW, event, confInfo);
                    break;
                }

                if (sub_type && sub_type == "1") {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.NEW, event);
                    newEvent["value"]["calltype"] = "halfdial";
                } else if (listentype && listentype == "1") {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.NEW, event);
                    newEvent["value"]["calltype"] = "ambience";
                } else {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.NEW, event);
                    newEvent["value"]["calltype"] = "voice";
                }

                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnDialOutProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutProceeding"](newEvent);
                break;
            case "2006":
                // 播放回铃音
                var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":1, \"delay\":0, \"duration\": 0, \"playcount\":0}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RINGING, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfDialOutRinging";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfDialOutRinging"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RINGING, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialOutRinging";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutRinging"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.AMBIENCE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.RINGING, event);

                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialOutRinging";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutRinging"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RINGING, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnDialOutRinging";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutRinging"](newEvent);
                break;
            case "2009":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.AMBIENCE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["releasetype"] = "other";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "2010":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["releasetype"] = "self";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.AMBIENCE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["releasetype"] = "self";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "out";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, event);


                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["releasetype"] = "self";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "out";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "2013":
            case "2016":
            case "2017":
            case "2018":
            case "2024":
            case "2049":
            case "2052":
            case "2023":
            case "2033":
            case "2048":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                if (rsp == "2013") {
                    //对端正在通话中
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":3, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "2016" || rsp == "2024" || rsp == "2052") {
                    //对端无法接通
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":4, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "2018") {
                    //对端号码不存在
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":5, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //本段没有权限
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":6, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //对端没有权限
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":7, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "2017") {
                    //对端无应答
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":8, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "") {
                    //对端正忙
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":9, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                } else if (rsp == "2048" || rsp == "2023" || rsp == "2033" || rsp == "2049") {
                    //拨打业务无法支持
                    var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":10, \"delay\":0, \"duration\": 0, \"playcount\":1}}".format(
                        parseInt(value["cid"])
                    );

                    cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, event, confInfo);

                    newEvent["value"]["confId"] = confInfo["confInternalId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfFailure";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfFailure"](newEvent);
                    break;
                }

                if (listentype && listentype == "1") {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.RELEASE, event);
                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialOutFailure";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                    break;
                }

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialOutFailure";
                    this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnDialOutFailure";
                this.EVENT_LIST["VoiceNotify"]["OnDialOutFailure"](newEvent);
                break;
            case "2041":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.NEW, event);

                newEvent["eventName"] = "OnHalfDialConnectProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnHalfDialConnectProceeding"](newEvent);
                break;
            case "2042":
                // 关闭麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                newEvent["eventName"] = "OnStartRecvHalfDial";
                this.EVENT_LIST["VoiceNotify"]["OnStartRecvHalfDial"](newEvent);
                break;
            case "2043":
                // 关闭麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                // var callStatusMgr = cloudICP.util.callStatusMgr;
                // callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                newEvent["eventName"] = "OnStopRecvHalfDial";
                this.EVENT_LIST["VoiceNotify"]["OnStopRecvHalfDial"](newEvent);
                break;
            case "2045":
                // 打开麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":false}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                newEvent["eventName"] = "OnHalfDialSuccess";
                this.EVENT_LIST["VoiceNotify"]["OnHalfDialSuccess"](newEvent);
                break;
            case "2046":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                newEvent["eventName"] = "OnHalfDialFailure";
                this.EVENT_LIST["VoiceNotify"]["OnHalfDialFailure"](newEvent);
                break;
        }
    } else {
        //表示呼入
        switch (rsp) {
            case "2003":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;

                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfConnect";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfConnect"](newEvent);

                    var ajaxCfg = {
                        "type": "POST",
                        "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                        "data": {
                            "opt": "sub",
                            "confId": call["confId"]
                        },
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnSubscribeConfFailure",
                                    "rsp": data["rsp"],
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
                            } else {
                                cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] = true;
                            }
                        }
                    }
                    cloudICP.util.ajax(ajaxCfg);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                } else if (call && call.callType == callStatusMgr.AMBIENCE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.AMBIENCE, callStatusMgr.CONNECTING, event);

                    newEvent["value"]["calltype"] = "ambience";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.CONNECTING, event);

                callStatusMgr.holdCall(event["value"]["cid"]);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["fmt"] = "";
                newEvent["value"]["ptz"] = "";
                newEvent["value"]["mute"] = "";
                newEvent["eventName"] = "OnCallConnect";
                this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                break;
            case "2002":
                // 播放振铃音
                var param = "{\"description\":\"msp_play_tone\", \"cmd\": 131075, \"param\":{\"cid\": {0}, \"type\":0, \"delay\":0, \"duration\": 0, \"playcount\":0}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);


                if (discreet_listenee != undefined && discreet_listenee != "0" && discreet_listenee != "") {
                    var callStatusMgr = cloudICP.util.callStatusMgr;
                    callStatusMgr.updateCallStatus(callStatusMgr.DISCREET, callStatusMgr.RINGING, event);

                    newEvent["value"]["calltype"] = "discreetlisten";
                    newEvent["value"]["src"] = discreet_listenee;
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialInRinging";
                    this.EVENT_LIST["VoiceNotify"]["OnDialInRinging"](newEvent);
                    break;
                };

                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RINGING, event, confInfo);

                    newEvent["value"]["confId"] = confInfo["confInternalId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfDialInRinging";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfDialInRinging"](newEvent);
                    break;
                }

                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RINGING, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnDialInRinging";
                    this.EVENT_LIST["VoiceNotify"]["OnDialInRinging"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RINGING, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["src"] = "";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnDialInRinging";
                this.EVENT_LIST["VoiceNotify"]["OnDialInRinging"](newEvent);
                break;
            case "2007":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;


                if (discreet_listenee != undefined && discreet_listenee != "0" && discreet_listenee != "") {
                    var callStatusMgr = cloudICP.util.callStatusMgr;
                    callStatusMgr.updateCallStatus(callStatusMgr.DISCREET, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["calltype"] = "discreetlisten";
                    newEvent["value"]["src"] = discreet_listenee;
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                };

                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfConnect";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfConnect"](newEvent);

                    var ajaxCfg = {
                        "type": "POST",
                        "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                        "data": {
                            "opt": "sub",
                            "confId": call["confId"]
                        },
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnSubscribeConfFailure",
                                    "rsp": data["rsp"],
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnSubscribeConfFailure"](retEvent);
                            } else {
                                cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] = true;
                            }
                        }
                    }
                    cloudICP.util.ajax(ajaxCfg);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                    callStatusMgr.holdCall(event["value"]["cid"]);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["ptz"] = "";
                    newEvent["value"]["mute"] = "";
                    newEvent["eventName"] = "OnCallConnect";
                    this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.CONNECTING, event);

                callStatusMgr.holdCall(event["value"]["cid"]);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnCallConnect";
                this.EVENT_LIST["VoiceNotify"]["OnCallConnect"](newEvent);
                break;
            case "2040":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                if (confInfo != undefined) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.NEW, event, confInfo);
                    break;
                }
                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.NEW, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["src"] = "";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnConnectProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnConnectProceeding"](newEvent);
                break;
            case "2009":
            case "2011":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                if (event["rsp"] == "2009" && discreet_listenee != undefined && discreet_listenee != "0" && discreet_listenee != "") {
                    var callStatusMgr = cloudICP.util.callStatusMgr;
                    callStatusMgr.updateCallStatus(callStatusMgr.DISCREET, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "discreetlisten";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                };

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["releasetype"] = "other";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["releasetype"] = "other";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "2010":
                // 停止振铃音
                var param = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                // 删除音频媒体通道
                var param = "{\"description\":\"msp_delete_audio_channel\", \"cmd\": 65538, \"param\":{\"resID\":{0}}}".format(
                    parseInt(value["cid"])
                )

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[event["value"]["cid"]];
                if (call && call.callType == callStatusMgr.VOICECONF) {
                    callStatusMgr.updateCallStatus(callStatusMgr.VOICECONF, callStatusMgr.RELEASE, event);

                    newEvent["value"]["confId"] = call["confId"];
                    newEvent["value"]["isVideo"] = "false";
                    newEvent["value"]["fmt"] = "";
                    newEvent["eventName"] = "OnConfRelease";
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfRelease"](newEvent);

                    setTimeout(function() {
                        var mconfInfo = cloudICP.util.callStatusMgr.confMgr[call["confId"]];
                        if (mconfInfo != null && ((mconfInfo["isEnding"] != undefined && mconfInfo["isEnding"] == true) || (mconfInfo["value"]["confStatus"]["status"] == "End"))) {
                            return;
                        }
                        if (cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] == undefined || cloudICP.util.callStatusMgr.confSubMgr[call["confId"]] != true) {
                            return;
                        }
                        var ajaxCfg = {
                            "type": "POST",
                            "url": cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"],
                            "data": {
                                "opt": "unsub",
                                "confId": call["confId"]
                            },
                            "callback": function(data) {
                                if (data["rsp"] != "0") {
                                    var retEvent = {
                                        "eventName": "OnUnsubscribeConfFailure",
                                        "rsp": data["rsp"],
                                    }

                                    cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnUnsubscribeConfFailure"](retEvent);
                                }
                            }
                        }
                        cloudICP.util.ajax(ajaxCfg);
                    }, 500);
                    break;
                } else if (call && call.callType == callStatusMgr.HALFVOICE) {
                    callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                    newEvent["value"]["calltype"] = "halfdial";
                    newEvent["value"]["releasetype"] = "self";
                    newEvent["value"]["fmt"] = "";
                    newEvent["value"]["src"] = "";
                    newEvent["value"]["direction"] = "in";
                    newEvent["eventName"] = "OnCallRelease";
                    this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                    break;
                }

                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, event);

                newEvent["value"]["calltype"] = "voice";
                newEvent["value"]["releasetype"] = "self";
                newEvent["value"]["fmt"] = "";
                newEvent["value"]["src"] = "";
                newEvent["value"]["direction"] = "in";
                newEvent["eventName"] = "OnCallRelease";
                this.EVENT_LIST["VoiceNotify"]["OnCallRelease"](newEvent);
                break;
            case "2027":
                // 被人工转接通知
                newEvent["eventName"] = "OnTransferNotify";
                this.EVENT_LIST["VoiceNotify"]["OnTransferNotify"](newEvent);
                break;
            case "2041":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.NEW, event);

                newEvent["value"]["calltype"] = "halfdial";
                newEvent["value"]["direction"] = "in";
                newEvent["value"]["src"] = "";
                newEvent["value"]["fmt"] = "";
                newEvent["eventName"] = "OnConnectProceeding";
                this.EVENT_LIST["VoiceNotify"]["OnConnectProceeding"](newEvent);
                break;
            case "2042":
                // 关闭麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                newEvent["eventName"] = "OnStartRecvHalfDial";
                this.EVENT_LIST["VoiceNotify"]["OnStartRecvHalfDial"](newEvent);
                break;
            case "2043":
                // 关闭麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                // var callStatusMgr = cloudICP.util.callStatusMgr;
                // callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                newEvent["eventName"] = "OnStopRecvHalfDial";
                this.EVENT_LIST["VoiceNotify"]["OnStopRecvHalfDial"](newEvent);
                break;
            case "2045":
                // 打开麦克风
                var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":false}}".format(
                    parseInt(value["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.CONNECTING, event);

                newEvent["eventName"] = "OnHalfDialSuccess";
                this.EVENT_LIST["VoiceNotify"]["OnHalfDialSuccess"](newEvent);
                break;
            case "2046":
                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.HALFVOICE, callStatusMgr.RELEASE, event);

                newEvent["eventName"] = "OnHalfDialFailure";
                this.EVENT_LIST["VoiceNotify"]["OnHalfDialFailure"](newEvent);
                break;
        }
    }
};

/**
 * 语音事件通知
 */
ICPSDK_Dispatch_Event.prototype.delMSPNotify = function(event) {
    switch (event["rsp"]) {
        case 196612:
            var retEvent = {
                "eventName": "OnGetResolutionResult",
                "rsp": event["result"],
                "value": {
                    "mainScreen": event["mainScreen"],
                    "totalScreen": event["totalScreen"],
                    "screenNum": event["screenNum"]
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnGetResolutionResult"](retEvent);
            break;
        case 196610:
            //窗口创建成功
            var videoEvent = cloudICP.util.callStatusMgr.videoMediaInfoBuf[event["resID"].toString()];
            var value = videoEvent["value"];

            var recvOnly = false;
            if (videoEvent["value"]["camera"] != "-1" &&
                videoEvent["value"]["camera"] != "0") {
                recvOnly = true;
            }

            if (value && value["cid"] != undefined) {
                var callStatusMgr = cloudICP.util.callStatusMgr;
                var call = callStatusMgr.allCalls[value["cid"]];

                if (call && call.callType == callStatusMgr.VIDEOCONF) {
                    recvOnly = false;
                }

                if (call && (call.callType == callStatusMgr.MONITOR || call.callType == callStatusMgr.VIDEODISPATCH)) {
                    recvOnly = true;
                }
            }

            cloudICP.util.callStatusMgr.videoMediaInfoBuf[event["resID"].toString()]["hwnd"] = event["windowHandle"];

            let localArr = value["local_video"].split(",");
            let serverArr = value["server_video"].split(",");

            if (value["rts_ssrc"] != undefined) {
                var param = "{\"description\":\"msp_create_video_channel\", \"cmd\": 65539,  \"param\":{\"resID\":{0}, \"winHandle\":{9}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"fmt\":\"{7}\", \"recvOnly\":{8}, \"rtsSSrc\": {9} }}}".format(
                    parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["video"]), parseInt(value["video_ssrc"]), value["fmt"], recvOnly, parseInt(event["windowHandle"]), value["rts_ssrc"]
                )
            } else {
                var param = "{\"description\":\"msp_create_video_channel\", \"cmd\": 65539,  \"param\":{\"resID\":{0}, \"winHandle\":{9}, \"mediaInfo\":{\"localIP\":\"{1}\", \"localPort\":{2}, \"remoteIP\":\"{3}\",\"remotePort\":{4}, \"playload\":{5}, \"ssrc\":{6}, \"fmt\":\"{7}\", \"recvOnly\":{8} }}}".format(
                    parseInt(value["cid"]), cloudICP.config.localIP, localArr[1], serverArr[0], serverArr[1], parseInt(value["video"]), parseInt(value["video_ssrc"]), value["fmt"], recvOnly, parseInt(event["windowHandle"])
                )
            }

            cloudICP.dispatch.webSocket.sendDataToMediaSDK(param, true);
            break;
        case 131077:
            var retEvent = {
                "eventName": "OnGetSoundDeviceResult",
                "rsp": "0",
                "value": {
                    "speaker": event["output"],
                    "mic": event["input"]
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnGetSoundDeviceResult"](retEvent);
            break;
        case 65544:
            // var tempGain = event["AudioGain"]
            // var tempGain = Math.log(parseFloat(event["AudioGain"])) / Math.log(10)  * 10.0;
            var retEvent = {
                "eventName": "OnGetVolumeResult",
                "rsp": event["result"] == 0 ? "0" : "-1",
                "value": {
                    "VolumeDesc": event["AudioVolume"],
                    "cid": event["resID"].toString()
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnGetVolumeResult"](retEvent);
            break;
        case 65545:
            var retEvent = {
                "eventName": "OnSetVolumeResult",
                "rsp": event["result"] == 0 ? "0" : "-1",
                "value": {
                    "cid": event["resID"].toString(),
                    "Volume": event["newVolume"].toString(),
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnSetVolumeResult"](retEvent);
            break;
        case 65543:
            if (event["quiet"] && event["quiet"] == true) {
                var retEvent = {
                    "eventName": "OnMuteSpeakerResult",
                    "rsp": event["result"] == 0 ? "0" : "-1",
                    "value": {
                        "cid": event["resID"].toString()
                    }
                }

                this.EVENT_LIST["MSPNotify"]["OnMuteSpeakerResult"](retEvent);
            } else {
                var retEvent = {
                    "eventName": "OnUnmuteSpeakerResult",
                    "rsp": event["result"] == 0 ? "0" : "-1",
                    "value": {
                        "cid": event["resID"].toString()
                    }
                }

                this.EVENT_LIST["MSPNotify"]["OnUnmuteSpeakerResult"](retEvent);
            }

            break;
        case 65546:
            var retEvent = {
                "eventName": "OnAssignSoundDeviceResult",
                "rsp": event["result"] == 0 ? "0" : "-1",
                "value": {
                    "outputDev": event["mediaInfo"]["outputDev"],
                    "inputDev": event["mediaInfo"]["inputDev"]
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnAssignSoundDeviceResult"](retEvent);
            break;
        case 65547:
            var retEvent = {
                "eventName": "OnQuerySoundDeviceResult",
                "rsp": event["result"] == 0 ? "0" : "-1",
                "value": {
                    "devices": event["assignList"]
                }
            }

            this.EVENT_LIST["MSPNotify"]["OnQuerySoundDeviceResult"](retEvent);
            break;
        case 65542:
            if (event["mute"] != undefined && event["mute"] == false) {
                var retEvent = {
                    "eventName": "OnUnmuteMicResult",
                    "rsp": event["result"] == 0 ? "0" : "-1",
                    "value": {
                        "cid": event["resID"].toString()
                    }
                }

                this.EVENT_LIST["MSPNotify"]["OnUnmuteMicResult"](retEvent);
            } else {
                var retEvent = {
                    "eventName": "OnMuteMicResult",
                    "rsp": event["result"] == 0 ? "0" : "-1",
                    "value": {
                        "cid": event["resID"].toString()
                    }
                }

                this.EVENT_LIST["MSPNotify"]["OnMuteMicResult"](retEvent);
            }

            break;

        case 65548:
            cloudICP.dispatch.device.isDTMFDone = true;
            var retEvent = {
                "eventName": "OnSendToDTMFResult",
                "rsp": event["result"] == 0 ? "0" : "-1",
                "value": {
                    "cid": event["resID"].toString(),
                    "function": event["functionCode"].toString()
                }
            }
            this.EVENT_LIST["MSPNotify"]["OnSendToDTMFResult"](retEvent);

            break;
        case 16384: //0x4000
            if (event["resID"] == undefined) return;

            //不检查组呼
            //其它
            var callStatusMgr = cloudICP.util.callStatusMgr;
            var call = callStatusMgr.allCalls[event["resID"]];
            if (call) {
                if (call.callType == callStatusMgr.VOICE ||
                    call.callType == callStatusMgr.VIDEO ||
                    call.callType == callStatusMgr.HALFVOICE ||
                    call.callType == callStatusMgr.DISCREET ||
                    call.callType == callStatusMgr.MONITOR ||
                    call.callType == callStatusMgr.AMBIENCE) {

                    var retEvent = {
                        "eventName": "OnCallException",
                        "rsp": "20000",
                        "value": {
                            "callee": call["callee"],
                            "caller": call["caller"],
                            "cid": event["resID"].toString(),
                            "calltype": callStatusMgr.callTypeStr[call.callType]
                        }
                    }
                    this.EVENT_LIST["VoiceNotify"]["OnCallException"](retEvent);
                }


                if (call.callType == callStatusMgr.VOICECONF ||
                    call.callType == callStatusMgr.VIDEOCONF) {

                    var retEvent = {
                        "eventName": "OnConfException",
                        "rsp": "20000",
                        "value": {
                            "cid": event["resID"].toString(),
                            "confId": call["confId"]
                        }
                    }
                    this.EVENT_LIST["PhoneConfNotify"]["OnConfException"](retEvent);
                }
            }
            break;
        case 20480:
            var resID;
            Object.keys(cloudICP.util.callStatusMgr.videoMediaInfoBuf).forEach(function(key) {
                if (cloudICP.util.callStatusMgr.videoMediaInfoBuf[key].hwnd == event["windowHandle"]) {
                    resID = key;
                }
            });
            if (resID == undefined) return;
            var callStatusMgr = cloudICP.util.callStatusMgr;
            var call = callStatusMgr.allCalls[resID];
            if (call) {
                var param = {
                    cid: resID,
                    callback: function(data) {
                        setTimeout(function() {
                            cloudICP.util.sendLogOut("close [" + resID + "] window rsp: " + data);
                        }, 0);
                    }
                }
                if (call.callType == callStatusMgr.VIDEO || call.callType == callStatusMgr.MONITOR || call.callType == callStatusMgr.VIDEODISPATCH) {
                    cloudICP.dispatch.video.release(param);
                    return;
                }
                if (call.callType == callStatusMgr.VIDEOCONF) {
                    var confInfo = cloudICP.util.callStatusMgr.confMgr[cloudICP.util.callStatusMgr.currentGoingConf];
                    if (confInfo != undefined) {
                        if (cloudICP.userInfo["isdn"] == confInfo["value"]["confStatus"]["chair"]) {
                            param.confId = cloudICP.util.callStatusMgr.currentGoingConf;
                            cloudICP.dispatch.conf.endConf(param);
                            return;
                        }
                    }
                    cloudICP.dispatch.conf.exitVideoConf(param);
                }
            }
            break;
        case 65551:
            var retEvent = {
                "eventName": "OnWindowOnTopResult",
                "rsp": event["result"],
                "value": {
                    "cid": event["cid"],
                    "isOnTop": event["isOnTop"]
                }
            }
            this.EVENT_LIST["MSPNotify"]["OnWindowOnTopResult"](retEvent);
            break;
        default:
            break;
    }
};

function ICPSDK_Dispatch_GIS() {
    this.MAX_SUB_LIST = 200;
    this.MAX_ERPRIED_TIME = 120;

    this.MAX_SUB_NUMBER = 8000;

    // 保持订阅参数
    this.DEFAULT_EXPIRE_TIME = "90";
    this.INTERVAL_TIME = 3000000;

    this.subList = [];

    var me = this;

    // 由于gis订阅过期后不会立马刷新，经过讨论决定通过重复订阅的方式，将之保持订阅，直到被取消订阅
    setInterval(function() {
        var uelist = []
        for (var index = 0; index < me.subList.length; index++) {
            if (uelist.length < 190) {
                uelist.push({ "isdn": me.subList[index] });
            } else {
                me.subscribeGIS({
                    "uelist": uelist,
                    "callback": function() {}
                });

                uelist = [];
            }
        }

        if (uelist.length != 0) {
            me.subscribeGIS({
                "uelist": uelist,
                "callback": function() {}
            });

            uelist = [];
        }
    }, me.INTERVAL_TIME);
};

/**
 * subscribeGIS
 * @param {
 *  uelist :
 *  callback :
 * }
 */
ICPSDK_Dispatch_GIS.prototype.subscribeGIS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "subscribeGIS: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "subscribeGIS: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "subscribeGIS: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    var requestParam = {};
    if (!(param["uelist"] && Array.isArray(param["uelist"]) && param["uelist"].length > 0 && param["uelist"].length <= this.MAX_SUB_LIST)) {
        result["desc"] = "subscribeGIS: uelist is invalid";
        param["callback"](result);
        return;
    }

    var length = param["uelist"].length;

    if (length + this.subList.length > this.MAX_SUB_NUMBER) {
        result["rsp"] = "-4";
        result["desc"] = "subscribeGIS: The number of usbscribe user is limited to " + this.MAX_SUB_NUMBER;
        param["callback"](result);
        return;
    }

    for (var i = 0; i < length; i++) {
        var user = param["uelist"][i];
        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["desc"] = "subscribeGIS: isdn is invalid";
            param["callback"](result);
            return;
        }
    }

    requestParam["expiredtime"] = this.DEFAULT_EXPIRE_TIME;
    requestParam["uelist"] = param["uelist"];

    var url = cloudICP.getSdkServerUrl() + "/v1/gis/" + cloudICP.userInfo["isdn"] + "/sub";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);

}

/**
 * unsubscribeGIS
 * @param {
 *  uelist :
 *  callback :
 * }
 */
ICPSDK_Dispatch_GIS.prototype.unsubscribeGIS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unsubscribeGIS: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unsubscribeGIS: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unsubscribeGIS: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    var requestParam = {};
    if (!(param["uelist"] && Array.isArray(param["uelist"]) && param["uelist"].length > 0 && param["uelist"].length <= this.MAX_SUB_LIST)) {
        result["desc"] = "unsubscribeGIS: uelist is invalid";
        param["callback"](result);
        return;
    }

    var length = param["uelist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["uelist"][i];
        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["desc"] = "unsubscribeGIS: isdn is invalid";
            param["callback"](result);
            return;
        }
    }

    requestParam["uelist"] = param["uelist"];

    var url = cloudICP.getSdkServerUrl() + "/v1/gis/" + cloudICP.userInfo["isdn"] + "/unsub";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}


/**
 * query GIS SubList
 * @param {
 *  callback :
 * }
 */
ICPSDK_Dispatch_GIS.prototype.queryGISSubList = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryGISSubList: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "queryGISSubList: allback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryGISSubList: The user does not logined";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/gis/" + cloudICP.userInfo["isdn"] + "/sublist";
    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Group() {
    this.MAX_DYNAMICGROUP_ID = 9999999999999;
    this.MIN_DYNAMICGROUP_ID = 1;
    this.MAX_DYNAMICGROUP_MAXPERIOD = 65535;
    this.MAX_DYNAMICGROUP_PRIORITY = 255;
    this.MAX_DYNAMICGROUP_GROUPLIST_LENGTH = 8;
    this.MAX_DYNAMICGROUP_USERLIST_LENGTH = 200;
    this.MAX_PATCHGROUP_NAME_LENGTH = 32;
    this.MAX_PATCHGROUP_USERLIST_LENGTH = 20;
    // 最大支持组呼并发数
    this.MAX_GROUP_CALL_NUM = 30;

    // 当前组呼数量
    this.current_groupcall_num = 0;

    this.isCurrentPtt = { "grpid": "-1", "isPtt": false };
};

/**
 * 新增动态群组
 * @param param {
 *  "alias" : ,
 *  "grpid" : ,
 *  "maxperiod":,
 *  "priority" : ,
 *  "grouplist" : 
 *  "uelist" :
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.addDynamicGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addDynamicGroup: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addDynamicGroup: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "addDynamicGroup: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    var requestParam = {
        "opt": "create",
        "param": {}
    };
    if (!cloudICP.util.checkAliasOfGroup(param["alias"])) {
        result["desc"] = "addDynamicGroup: The alias is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["alias"] = param["alias"];
    requestParam["param"]["dcid"] = cloudICP.userInfo["isdn"];
    if (!(cloudICP.util.isNumber(param["grpid"]) &&
            (parseInt(param["grpid"]) == 0 || (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
                parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID)))) {
        result["desc"] = "addDynamicGroup: The grpid is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["grpid"] = param["grpid"];

    if (!(cloudICP.util.isNumber(param["maxperiod"]) &&
            (parseInt(param["maxperiod"]) >= 1 && parseInt(param["maxperiod"]) <= this.MAX_DYNAMICGROUP_MAXPERIOD))) {
        result["desc"] = "addDynamicGroup: The maxperiod is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["maxperiod"] = param["maxperiod"];

    if (!(cloudICP.util.isNumber(param["priority"]) &&
            (parseInt(param["priority"]) >= 1 && parseInt(param["priority"]) <= this.MAX_DYNAMICGROUP_PRIORITY))) {
        result["desc"] = "addDynamicGroup: The priority is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["priority"] = param["priority"];


    if (!Array.isArray(param["grouplist"]) || !Array.isArray(param["uelist"])) {
        result["desc"] = "addDynamicGroup: The grouplist or uelist is not array";
        param["callback"](result);
        return;
    }

    if (param["grouplist"].length == 0 && param["uelist"].length == 0) {
        result["desc"] = "addDynamicGroup: The grouplist or uelist must have one isdn at least";
        param["callback"](result);
        return;
    }

    if (param["grouplist"].length > this.MAX_DYNAMICGROUP_GROUPLIST_LENGTH) {
        result["desc"] = "addDynamicGroup: grouplist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["grouplist"].length;
    for (var i = 0; i < length; i++) {
        var group = param["grouplist"][i];
        if (!cloudICP.util.checkGroupID(group["isdn"])) {
            result["desc"] = "addDynamicGroup: isdn is invalid in grouplist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["grouplist"] = param["grouplist"];

    if (param["uelist"].length > this.MAX_DYNAMICGROUP_USERLIST_LENGTH) {
        result["desc"] = "addDynamicGroup: grouplist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["uelist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["uelist"][i];
        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["desc"] = "addDynamicGroup: isdn is invalid in uelist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["uelist"] = param["uelist"];

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/dynamicgroup";
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * 删除动态群组
 * @param param {
 *  "grpid" : ,
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.deleteDynamicGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deleteDynamicGroup: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deleteDynamicGroup: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "deleteDynamicGroup: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID))) {
        result["desc"] = "deleteDynamicGroup: The grpid is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/dynamicgroup/cancel/" + param["grpid"];
    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * 修改动态群组
 * @param param {
 *  "alias" : ,
 *  "grpid" : ,
 *  "maxperiod":,
 *  "priority" : ,
 *  "grouplist" : 
 *  "uelist" :
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.modifyDynamicGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "modifyDynamicGroup: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "modifyDynamicGroup: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "modifyDynamicGroup: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    var requestParam = {
        "opt": "modify",
        "param": {}
    };
    requestParam["param"]["dcid"] = cloudICP.userInfo["isdn"];
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID))) {
        result["desc"] = "modifyDynamicGroup: The grpid is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["grpid"] = param["grpid"];

    if (!Array.isArray(param["addlist"]) || !Array.isArray(param["dellist"])) {
        result["desc"] = "modifyDynamicGroup: The addlist or dellist is not array";
        param["callback"](result);
        return;
    }

    if (param["dellist"].length == 0 && param["addlist"].length == 0) {
        result["desc"] = "modifyDynamicGroup: The addlist or dellist must have one isdn at least";
        param["callback"](result);
        return;
    }

    if (param["addlist"].length > this.MAX_DYNAMICGROUP_USERLIST_LENGTH) {
        result["desc"] = "modifyDynamicGroup: addlist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["addlist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["addlist"][i];
        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["desc"] = "modifyDynamicGroup: isdn is invalid in grouplist in addlist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["addlist"] = param["addlist"];

    if (param["dellist"].length > this.MAX_DYNAMICGROUP_USERLIST_LENGTH) {
        result["desc"] = "modifyDynamicGroup: dellist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["dellist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["dellist"][i];
        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["desc"] = "modifyDynamicGroup: isdn is invalid in dellist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["dellist"] = param["dellist"];

    cloudICP.dispatch.query.queryDynamicGroupMembers({
        "grpid": requestParam["param"]["grpid"],
        "callback": function(data) {
            if (data["rsp"] != "-1" && data["list"] != null) {
                var memberlist = data["list"];
                var members = [];
                for (var index = 0; index < memberlist.length; index++) {
                    members.push(memberlist[index]["isdn"]);
                }

                for (var index = 0; index < requestParam["param"]["dellist"].length; index++) {
                    var isdn = requestParam["param"]["dellist"][index]["isdn"];

                    if (!cloudICP.util.includes(members, isdn)) {
                        result["rsp"] = "-2";
                        result["desc"] = "modifyDynamicGroup: dellist is invalid.";
                        param["callback"](result);
                        return;
                    }
                }

                for (var index = 0; index < requestParam["param"]["addlist"].length; index++) {
                    var isdn = requestParam["param"]["addlist"][index]["isdn"];

                    if (cloudICP.util.includes(members, isdn)) {
                        result["rsp"] = "-2";
                        result["desc"] = "modifyDynamicGroup: addlist is invalid.";
                        param["callback"](result);
                        return;
                    }
                }

                var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/dynamicgroup";
                var ajaxCfg = {
                    "type": "POST",
                    "url": url,
                    "data": requestParam,
                    "callback": param["callback"]
                }
                cloudICP.util.ajax(ajaxCfg);

            } else {
                result["rsp"] = "-2";
                result["desc"] = "modifyDynamicGroup: grpid is invalid";
                param["callback"](result);
                return;
            }
        }
    })
}

/**
 * 新增派接组
 */
ICPSDK_Dispatch_Group.prototype.addPatchGroup = function(param) {

    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addPatchGroup: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addPatchGroup: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "addPatchGroup: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    var requestParam = {
        "opt": "create",
        "param": {}
    };

    if (param["name"] == undefined || param["name"] == null) {
        result["desc"] = "addPatchGroup: name is invalid";
        param["callback"](result);
        return;
    }

    if (param["name"].length > this.MAX_PATCHGROUP_NAME_LENGTH) {
        result["desc"] = "addPatchGroup: name is invalid";
        param["callback"](result);
        return;
    }

    var regex = /^[0-9A-Za-z]+$/;
    if (param["name"] != "" && !regex.test(param["name"])) {
        result["desc"] = "addPatchGroup: name is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["name"] = param["name"];

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/patchgroup";
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * 删除派接组
 * @param param {
 *  "grpid" : ,
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.deletePatchGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deletePatchGroup: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deletePatchGroup: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "deletePatchGroup: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID))) {
        result["desc"] = "deletePatchGroup: The grpid is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/patchgroup/cancel/" + param["grpid"];
    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}


/**
 * 新增派接组成员
 * @param param {
 *  "grpid" : ,
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.addPatchGroupMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addPatchGroupMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "addPatchGroupMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "addPatchGroupMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    var requestParam = {
        "opt": "add",
        "param": {}
    };
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID))) {
        result["desc"] = "addPatchGroupMember: The grpid is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["grpid"] = param["grpid"];

    if (!Array.isArray(param["memberlist"]) ||
        param["memberlist"].length == 0 || param["memberlist"].length > this.MAX_PATCHGROUP_USERLIST_LENGTH) {
        result["desc"] = "addPatchGroupMember: memberlist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["memberlist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberlist"][i];
        if (!cloudICP.util.checkGroupID(user["isdn"])) {
            result["desc"] = "addPatchGroupMember: isdn is invalid in memberlist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["memberlist"] = param["memberlist"];

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/patchgroup";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}



/**
 * 删除派接组成员
 * @param param {
 *  "grpid" : ,
 *  "callback"
 * }
 */
ICPSDK_Dispatch_Group.prototype.deletePatchGroupMember = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deletePatchGroupMember: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "deletePatchGroupMember: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "deletePatchGroupMember: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";

    var requestParam = {
        "opt": "del",
        "param": {}
    };
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= this.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= this.MAX_DYNAMICGROUP_ID))) {
        result["desc"] = "deletePatchGroupMember: The grpid is invalid";
        param["callback"](result);
        return;
    }
    requestParam["param"]["grpid"] = param["grpid"];

    if (!Array.isArray(param["memberlist"]) ||
        param["memberlist"].length == 0 || param["memberlist"].length > this.MAX_PATCHGROUP_USERLIST_LENGTH) {
        result["desc"] = "deletePatchGroupMember: memberlist is invalid";
        param["callback"](result);
        return;
    }
    var length = param["memberlist"].length;
    for (var i = 0; i < length; i++) {
        var user = param["memberlist"][i];
        if (!cloudICP.util.checkGroupID(user["isdn"])) {
            result["desc"] = "deletePatchGroupMember: isdn is invalid in memberlist";
            param["callback"](result);
            return;
        }
    }
    requestParam["param"]["memberlist"] = param["memberlist"];

    var url = cloudICP.getSdkServerUrl() + "/v1/group/" + cloudICP.userInfo["isdn"] + "/patchgroup";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * subscribeTalkingGroup() subscribe talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.subscribeTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "subscribeTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "subscribeTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "subscribeTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "subscribeTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "sub";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}


/**
 * unsubscribeTalkingGroup() unsubscribe talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.unsubscribeTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "unsubscribeTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "unsubscribeTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unsubscribeTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "unsubscribeTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "unsub";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * subjoinTalkingGroup() subjoin talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.subjoinTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "subjoinTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "subjoinTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "subjoinTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "subjoinTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "subjoin";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * joinTalkingGroup() subjoin talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.joinTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "joinTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "joinTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "joinTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "joinTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "join";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * pttTalkingGroup() ptt talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.pttTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "pttTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "pttTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "pttTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "pttTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    if (cloudICP.dispatch.group.current_groupcall_num >= cloudICP.dispatch.group.MAX_GROUP_CALL_NUM) {
        result["rsp"] = "-4";
        result["desc"] = "pttTalkingGroup: Exceeded the maximum number of group calls.";
        param["callback"](result);
        return;
    }

    if (cloudICP.dispatch.group.isCurrentPtt["isPtt"]) {
        result["rsp"] = "-5";
        result["desc"] = "pttTalkingGroup: The number of ptt is limited to 1.";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0) {
        result["rsp"] = "-6";
        result["desc"] = "pttTalkingGroup: The group call ptt is confliced with halfdial.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "snatch";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * pttreleaseTalkingGroup() ptt release talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.pttreleaseTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "pttreleaseTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "pttreleaseTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "pttreleaseTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "pttreleaseTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "release";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * leaveTalkingGroup() ptt release talking group
 * @param {Object} param {
 *  "cid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.leaveTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "leaveTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "leaveTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "leaveTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "leaveTalkingGroup: The cid is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "hangup";
    resParam["cid"] = param["cid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * pttTalkingGroupEmergencyCall() ptt talking group emergency call
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.pttTalkingGroupEmergencyCall = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "pttTalkingGroupEmergencyCall": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "pttTalkingGroupEmergencyCall": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "pttTalkingGroupEmergencyCall: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "pttTalkingGroupEmergencyCall: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "emergency";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * breakoffTalkingGroup() break off talking group
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.breakoffTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "breakoffTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "breakoffTalkingGroup": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "breakoffTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "breakoffTalkingGroup: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"] + "/breakoff";
    resParam["opt"] = "group";
    resParam["to"] = param["grpid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * addTalkingGroupTempUser() add talking group temp user
 * @param {Object} param {
 *  "grpid": ,
 *  "userid" ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Group.prototype.addTalkingGroupTempUser = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "addTalkingGroupTempUser": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "addTalkingGroupTempUser": "callback is not a function" });
        return;
    }

    var resParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "addTalkingGroupTempUser: User not logged.";
        param["callback"](result);
        return;
    };

    if (!cloudICP.util.checkIsdn(param["userid"])) {
        result["rsp"] = "-2";
        result["desc"] = "addTalkingGroupTempUser: userid is invalid";
        param["callback"](result);
        return;
    }

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "addTalkingGroupTempUser: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/groupcall/" + cloudICP.userInfo["isdn"];
    resParam["opt"] = "adduser";
    resParam["to"] = param["grpid"];
    resParam["userid"] = param["userid"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": resParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Query() {};

/**
 * queryTalkingGroup() query talking group
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryTalkingGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroup": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryTalkingGroup: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/group/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryTalkingGroupMembers() query talking group members
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryTalkingGroupMembers = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupMembers": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupMembers": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryTalkingGroupMembers: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryTalkingGroupMembers: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/" + param["grpid"] + "/groupmember/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryDynamicGroupMembers() query talking group members
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryDynamicGroupMembers = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryDynamicGroupMembers": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryDynamicGroupMembers": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDynamicGroupMembers: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryDynamicGroupMembers: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/" + param["grpid"] + "/dynamicgroupmember/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}


/**
 * queryDynamicGroup() query dynamic group
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryDynamicGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryDynamicGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryDynamicGroup": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDynamicGroup: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/dynamicgroup/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            if (undefined != data["list"] && data["list"] != null) {
                var index = 0;
                for (var index = 0; index < data["list"].length; index++) {
                    if (undefined != data["list"][index]["speakerfixed"]) {
                        delete data["list"][index]["speakerfixed"];
                    }
                }
            }

            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryStaticGroup() query static group
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryStaticGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryStaticGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryStaticGroup": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryStaticGroup: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/staticgroup/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryPatchGroup() query patch group
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryPatchGroup = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroup": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroup": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryPatchGroup: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/patchgroup/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryPatchGroupMembers() query patch group members
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryPatchGroupMembers = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroupMembers": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroupMembers": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryPatchGroupMembers: User not logged.";
        param["callback"](result);
        return;
    };

    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryPatchGroupMembers: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/" + param["grpid"] + "/patchgroupmember/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryUserList() query user
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryUserList = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryUserList": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryUserList": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryUserList: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/user/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCameras() query cameras
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameras = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameras": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameras": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameras: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/camera/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryDecoder() query decoder
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryDecoder = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryDecoder": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryDecoder": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDecoder: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/decoder/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryDepartmentList() query department list
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryDepartmentList = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryDepartmentList": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryDepartmentList": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDepartmentList: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/department/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCameraLevel() query camera level
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameraLevel = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameraLevel": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameraLevel": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraLevel: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/cameralevel/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCameraLevelPermission() query camera level permission
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameraLevelPermission = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameraLevelPermission": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameraLevelPermission": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraLevelPermission: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/cameralevelpermission/-1";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryTalkingGroupInfo() query talking group info
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryTalkingGroupInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryTalkingGroupInfo: User not logged.";
        param["callback"](result);
        return;
    }
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryTalkingGroupInfo: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/group/" + param["grpid"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryPatchGroupInfo() query patch group info
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryPatchGroupInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroupInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryPatchGroupInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryPatchGroupInfo: User not logged.";
        param["callback"](result);
        return;
    }
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryPatchGroupInfo: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/patchgroup/" + param["grpid"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryTalkingGroupPatchedInfo() query patched info
 * @param {Object} param {
 *  "grpid": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryTalkingGroupPatchedInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupPatchedInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryTalkingGroupPatchedInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryTalkingGroupPatchedInfo: User not logged.";
        param["callback"](result);
        return;
    }
    if (!(cloudICP.util.isNumber(param["grpid"]) && (parseInt(param["grpid"]) >= cloudICP.dispatch.group.MIN_DYNAMICGROUP_ID &&
            parseInt(param["grpid"]) <= cloudICP.dispatch.group.MAX_DYNAMICGROUP_ID))) {
        result["rsp"] = "-2";
        result["desc"] = "queryTalkingGroupPatchedInfo: grpid is invalid.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/patched/" + param["grpid"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryUserInfo() query user info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryUserInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryUserInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryUserInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryUserInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryUserInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/user/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCameraInfo() query camera info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameraInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameraInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameraInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryCameraInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/camera/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCameraPermissionInfo() query camera permission info
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameraPermissionInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameraPermissionInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameraPermissionInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraPermissionInfo: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/camerapermission";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryCallInfo() query decoder info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCallInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCallInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCallInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCallInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryCallInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/decoder/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryDCInfo() query DC info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryDCInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryDCInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryDCInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDCInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryDCInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/dc/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryUEInfo() query UE info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryUEInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryUEInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryUEInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryUEInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryUEInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/ue/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * queryUEGisInfo() query UE gis info
 * @param {Object} param {
 *  "isdn": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryUEGisInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryUEGisInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryUEGisInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryUEGisInfo: User not logged.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["isdn"])) {
        result["rsp"] = "-2";
        result["desc"] = "queryUEGisInfo: isdn is invalid";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/queryattribute/" + cloudICP.userInfo["isdn"] + "/uegis/" + param["isdn"];

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryConfWallInfo() query department list
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryConfWallInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryConfWallInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryConfWallInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryDepartmentList: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/phoneconf/" + cloudICP.userInfo["isdn"] + "/querywallinfo";

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryRecord() query department list
 * @param {Object} param {
 *  "call_type": ,
 *  "callee": ,
 *  "caller": ,
 *  "resource_id": ,
 *  "start_sec": ,
 *  "end_sec": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryRecord = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryRecord": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryRecord": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryRecord: User not logged.";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";

    var types = ["0", "1", "2", "3", "5", "6", "7", "8"];
    if (!param["call_type"] || !cloudICP.util.includes(types, param["call_type"])) {
        result["desc"] = "queryRecord: The call_type is invalid";
        param["callback"](result);
        return;
    }

    if (!param["resource_id"] || (param["resource_id"] != "-1" && param["resource_id"] != cloudICP.userInfo["isdn"])) {
        result["desc"] = "queryRecord: resource_id is invalid";
        param["callback"](result);
        return;
    }

    switch (param["resource_id"]) {
        case "-1":
            if (param["caller"] != "" && !cloudICP.util.checkIsdn(param["caller"])) {
                result["desc"] = "queryRecord: caller is invalid";
                param["callback"](result);
                return;
            }

            if (param["callee"] != "" && !cloudICP.util.checkIsdn(param["callee"])) {
                result["desc"] = "queryRecord: callee is invalid";
                param["callback"](result);
                return;
            }
            break;
        case cloudICP.userInfo["isdn"]:
            if (param["call_type"] == "2") {
                if (!cloudICP.util.checkIsdn(param["callee"])) {
                    result["desc"] = "queryRecord: callee is invalid";
                    param["callback"](result);
                    return;
                }
            } else if (param["call_type"] == "3") {
                if (!cloudICP.util.checkIsdn(param["caller"])) {
                    result["desc"] = "queryRecord: caller is invalid";
                    param["callback"](result);
                    return;
                }
            } else if (param["call_type"] != "0" && param["call_type"] != "1") {
                if (!cloudICP.util.checkIsdn(param["caller"])) {
                    result["desc"] = "queryRecord: caller is invalid";
                    param["callback"](result);
                    return;
                }

                if (!cloudICP.util.checkIsdn(param["callee"])) {
                    result["desc"] = "queryRecord: callee is invalid";
                    param["callback"](result);
                    return;
                }
            }
            break;
        default:
            break;
    }

    if (!(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(param["end_sec"]))) {
        result["desc"] = "queryRecord: end_sec is invalid";
        param["callback"](result);
        return;
    } else {
        var tmpStr = param["end_sec"].replace(/-/g, "/")

        if (isNaN(Date.parse(tmpStr))) {
            result["desc"] = "queryRecord: end_sec is invalid";
            param["callback"](result);
            return;
        }
    }

    if (!(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(param["start_sec"]))) {
        result["desc"] = "queryRecord: start_sec is invalid";
        param["callback"](result);
        return;
    } else {
        var tmpStr = param["start_sec"].replace(/-/g, "/")

        if (isNaN(Date.parse(tmpStr))) {
            result["desc"] = "queryRecord: start_sec is invalid";
            param["callback"](result);
            return;
        }
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/recfileinfo";

    var requestParam = {
        "call_type": param["call_type"],
        "callee": param["callee"],
        "caller": param["caller"],
        "resource_id": param["resource_id"],
        "start_sec": param["start_sec"],
        "end_sec": param["end_sec"],
    };

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": true,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryCameraGPSInfo() query department list
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryCameraGPSInfo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryCameraGPSInfo": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryCameraGPSInfo": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryCameraGPSInfo: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/gisipc";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

/**
 * queryMRS() query department list
 * @param {Object} param {
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Query.prototype.queryMRS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "queryMRS": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "queryMRS": "callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "queryMRS: User not logged.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/querylist/" + cloudICP.userInfo["isdn"] + "/mrsnodes";

    var ajaxCfg = {
        "type": "GET",
        "url": url,
        "async": true,
        "data": null,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Sms() {
    this.MAX_MESSAGE_CONTENT = 10000;
    this.MAX_DEST_COUNT = 200;

    this.lastSendTime = 0;
};

/**
 * sendDispSMS() send short message
 * @param {Object} param {
 *  "dest": ,
 *  "content": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Sms.prototype.sendDispSMS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "sendDispSMS": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "sendDispSMS": "callback is not a function" });
        return;
    }

    var sendDispSMSParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    var oldTime = this.lastSendTime;
    this.lastSendTime = new Date().getTime();

    if (this.lastSendTime - oldTime <= 1000) {
        result["rsp"] = "-4";
        result["desc"] = "sendDispSMS: The interval of sending message should be larger than 1 second.";
        param["callback"](result);
        return;
    }

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "sendDispSMS: User not logged.";
        param["callback"](result);
        return;
    }

    if (!param["content"]) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispSMS: content is invalid.";
        param["callback"](result);
        return;
    } else {
        var clength = 0;
        for (var index = 0; index < param["content"].length; index++) {
            if (encodeURI(param["content"][index]).length > 1) {
                clength += 3;
            } else {
                clength += 1;
            }
        }

        if (clength > this.MAX_MESSAGE_CONTENT) {
            result["rsp"] = "-2";
            result["desc"] = "sendDispSMS: content is invalid.";
            param["callback"](result);
            return;
        }
    }

    if ((!param["dest"]) || cloudICP.util.includes(param["dest"], " ") || !(/^(([1-9]+[0-9]*)+;)*(([1-9]+[0-9]*)+)$/.test(param["dest"]))) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispSMS: dest is invalid.";
        param["callback"](result);
        return;
    }

    if (param["dest"].split(";").length > this.MAX_DEST_COUNT) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispSMS: dest is invalid.";
        param["callback"](result);
        return;
    }

    sendDispSMSParam["param"] = {};
    sendDispSMSParam["param"]["msgid"] = "";
    sendDispSMSParam["param"]["content"] = param["content"];
    sendDispSMSParam["param"]["dest"] = param["dest"];
    sendDispSMSParam["param"]["locationshare"] = param["locationshare"];

    var url = cloudICP.getSdkServerUrl() + "/v1/sds/" + cloudICP.userInfo["isdn"] + "/sms";

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": sendDispSMSParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
}

/**
 * sendDispMMS() send multi media message
 * @param {Object} param {
 *  "dest": [
 *   {
 *     "isdn": "",
 *     "msgid": "",
 *   }
 *  ],
 *  "content": ,
 *  "attach": ,
 *  "callback": ,
 * }
 */
ICPSDK_Dispatch_Sms.prototype.sendDispMMS = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "sendDispMMS": "param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "sendDispMMS": "callback is not a function" });
        return;
    }

    var sendDispMMSParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "sendDispMMS: User not logged.";
        param["callback"](result);
        return;
    }

    if (!param["content"]) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispMMS: content is invalid.";
        param["callback"](result);
        return;
    } else {
        var clength = 0;
        for (var index = 0; index < param["content"].length; index++) {
            if (encodeURI(param["content"][index]).length > 1) {
                clength += 3;
            } else {
                clength += 1;
            }
        }

        if (clength > this.MAX_MESSAGE_CONTENT) {
            result["rsp"] = "-2";
            result["desc"] = "sendDispMMS: content is invalid.";
            param["callback"](result);
            return;
        }
    }

    if (!(param["dest"] && Array.isArray(param["dest"])) || param["dest"].length >= this.MAX_DEST_COUNT || param["dest"].length <= 0) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispMMS: dest is invalid";
        param["callback"](result);
        return;
    }

    var dests = param["dest"];
    for (var item = 0; item < dests.length; item++) {
        if (!cloudICP.util.isNumber(dests[item]["msgid"])) {
            result["rsp"] = "-2";
            result["desc"] = "sendDispMMS: msgid is invalid";
            param["callback"](result);
            return;
        }
    }

    sendDispMMSParam["param"] = {};
    sendDispMMSParam["param"]["msgid"] = "";
    sendDispMMSParam["param"]["dest"] = "";

    var tmpArr = [];

    var length = param["dest"].length;
    for (var i = 0; i < length; i++) {
        var user = param["dest"][i];

        if (!cloudICP.util.checkIsdn(user["isdn"])) {
            result["rsp"] = "-2";
            result["desc"] = "sendDispMMS: isdn is invalid";
            param["callback"](result);
            return;
        }

        if (user["msgid"] == undefined || !user["msgid"]) {
            result["rsp"] = "-2";
            result["desc"] = "sendDispMMS: msgid is invalid";
            param["callback"](result);
            return;
        }

        tmpArr.push(user["msgid"]);

        if (i == length - 1) {
            sendDispMMSParam["param"]["msgid"] += user["msgid"];
            sendDispMMSParam["param"]["dest"] += user["isdn"];
        } else {
            sendDispMMSParam["param"]["msgid"] += user["msgid"] + ";";
            sendDispMMSParam["param"]["dest"] += user["isdn"] + ";";
        }
    }

    var retArr = cloudICP.util.findDuplicates(tmpArr);

    if (retArr.length != 0) {
        result["rsp"] = "-2";
        result["desc"] = "sendDispMMS: msgid is invalid";
        param["callback"](result);
        return;
    }

    // sendDispMMSParam["param"]["msgid"] = cloudICP.util.generateUUID();
    sendDispMMSParam["param"]["content"] = param["content"];
    // sendDispMMSParam["param"]["dest"] = param["dest"];
    sendDispMMSParam["param"]["attach"] = param["attach"];

    var url = cloudICP.getSdkServerUrl() + "/v1/sds/" + cloudICP.userInfo["isdn"] + "/mms";

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": sendDispMMSParam,
        "callback": function(data) {

            param["callback"](data);
        }
    }

    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Video() {
    this.MAX_DISPATCH_LIST = 100;

    this.MAX_VIDEO_ABILITY = 20;

    // 当前视频能力，目前最大支持20单位的视频能力。
    this.currentVideoAbility = 0;

    this.MAX_VIDEO_DIAL_NUM = 1;
};

/**
 * monitorVideo
 * @param {Object} param {
 *  to: ,
 *  monitorParam: {
 *      fmt: ,
 *      mute: ,
 *      confirm: ,
 *      camera: ,
 *  }
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.monitorVideo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "monitorVideo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "monitorVideo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "monitorVideo: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "monitorVideo: The to is invalid";
        param["callback"](result);
        return;
    }

    if (!param["monitorParam"]) {
        result["desc"] = "monitorVideo: The monitorParam is invalid";
        param["callback"](result);
        return;
    }

    if (!param["monitorParam"]["fmt"]) {
        param["monitorParam"]["fmt"] = "4K";
    }

    var fmts = ["4K", "2K", "1080P", "720P", "D1", "CIF", "GCIF"];
    if (!param["monitorParam"]["fmt"] || !cloudICP.util.includes(fmts, param["monitorParam"]["fmt"])) {
        result["desc"] = "monitorVideo: The fmt is invalid";
        param["callback"](result);
        return;
    }

    var mutes = ["0", "1"];
    if (!param["monitorParam"]["mute"] || !cloudICP.util.includes(mutes, param["monitorParam"]["mute"])) {
        result["desc"] = "monitorVideo: The mute is invalid";
        param["callback"](result);
        return;
    }

    var confirms = ["0", "1"];
    if (!param["monitorParam"]["confirm"] || !cloudICP.util.includes(confirms, param["monitorParam"]["confirm"])) {
        result["desc"] = "monitorVideo: The confirm is invalid";
        param["callback"](result);
        return;
    }

    var cameras = ["0", "1", "2"];
    if (!param["monitorParam"]["camera"] || !cloudICP.util.includes(cameras, param["monitorParam"]["camera"])) {
        result["desc"] = "monitorVideo: The camera is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (cloudICP.util.callStatusMgr.currentCallState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "monitorVideo: There is a call is ringing."
        param["callback"](result);
        return;
    }

    if (cloudICP.dispatch.video.currentVideoAbility >= cloudICP.dispatch.video.MAX_VIDEO_ABILITY) {
        result["rsp"] = "-5";
        result["desc"] = "monitorVideo: The ability of monitorVideo is limited";
        param["callback"](result);
        return;
    }

    param["monitorParam"]["fmt"] = "4K";

    var requestParam = {
        "opt": "monitor",
        "to": param["to"],
        "param": {
            "fmt": param["monitorParam"]["fmt"],
            "mute": param["monitorParam"]["mute"],
            "confirm": param["monitorParam"]["confirm"],
            "camera": param["monitorParam"]["camera"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * dialVideo
 * @param {Object} param {
 *  to: ,
 *  dialVideoParam: {
 *      fmt: ,
 *  }
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.dialVideo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dialVideo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dialVideo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "dialVideo: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "dialVideo: The to is invalid";
        param["callback"](result);
        return;
    }

    if (!param["dialVideoParam"]) {
        result["desc"] = "dialVideo: The dialVideoParam is invalid";
        param["callback"](result);
        return;
    }

    if (!param["dialVideoParam"]["fmt"]) {
        param["dialVideoParam"]["fmt"] = "4K";
    }

    var fmts = ["4K", "2K", "1080P", "720P", "D1", "CIF", "GCIF"];
    if (!param["dialVideoParam"]["fmt"] || !cloudICP.util.includes(fmts, param["dialVideoParam"]["fmt"])) {
        result["desc"] = "dialVideo: The fmt is invalid";
        param["callback"](result);
        return;
    }

    if (cloudICP.config.cameraInfo == 0) {
        result["rsp"] = "-6";
        result["desc"] = "dialVideo: The camera is unavailable."
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkFmt(param["dialVideoParam"]["fmt"])) {
        result["rsp"] = "-5";
        result["desc"] = "dialVideo: The fmt is not supported by the camera.";
        param["callback"](result);
        return;
    }

    if (cloudICP.util.callStatusMgr.currentCallState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "dialVideo: There is a call is ringing."
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.numberOfCall[callStatusMgr.VIDEO] + callStatusMgr.numberOfCall[callStatusMgr.VIDEOCONF] >= cloudICP.dispatch.video.MAX_VIDEO_DIAL_NUM ||
        cloudICP.dispatch.video.currentVideoAbility >= cloudICP.dispatch.video.MAX_VIDEO_ABILITY) {
        result["rsp"] = "-7";
        result["desc"] = "dialVideo: The ability of video call is limited";
        param["callback"](result);
        return;
    }

    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-8";
        result["desc"] = "dialVideo: The voice dial is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "dial",
        "to": param["to"],
        "param": {
            "fmt": param["dialVideoParam"]["fmt"],
            "video_format": cloudICP.config.cameraInfo.toString(),
            "audio_format": "1"
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * answer
 * @param {Object} param {
 *  cid: ,
 *  windowInfo: {
 *      width:
 *      height:
 *      posX:
 *      posY:
 *  }
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.answer = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "answer: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "answer: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "answer: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "answer: The cid is invalid";
        param["callback"](result);
        return;
    }

    if (param["windowInfo"] != undefined) {
        if (!cloudICP.util.isNumber(param["windowInfo"]["width"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "answer: The width is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["height"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "answer: The height is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posX"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "answer: The posX is invalid";
            param["callback"](result);
            return;
        }

        if (!cloudICP.util.isNumber(param["windowInfo"]["posY"]) || param["windowInfo"]["width"] > 2147483647) {
            result["desc"] = "answer: The posY is invalid";
            param["callback"](result);
            return;
        }

        var callStatusMgr = cloudICP.util.callStatusMgr;
        callStatusMgr.windowInfos[param["cid"]] = param["windowInfo"];
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        var str;
        if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.CONNECTING) {
            str = "answer: The cid is answered";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.HOLD) {
            str = "answer: The cid is holded";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.RELEASE) {
            str = "answer: The cid is ended";
        } else {
            str = "answer: The cid is invalid";
        }
        result["rsp"] = "-4";
        result["desc"] = str;
        param["callback"](result);
        return;
    }

    var call = calls[param["cid"]];
    if (call && call["callType"] == cloudICP.util.callStatusMgr.VIDEODISPATCH) {
        // current do nothing
    } else {
        if (cloudICP.config.cameraInfo == 0) {
            result["rsp"] = "-5";
            result["desc"] = "answer: The camera is unavailable."
            param["callback"](result);
            return;
        };

        var callStatusMgr = cloudICP.util.callStatusMgr;
        if (callStatusMgr.connectingCallMgr[callStatusMgr.VIDEO].length != 0 ||
            callStatusMgr.connectingCallMgr[callStatusMgr.DISCREET].length != 0 ||
            callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0 ||
            callStatusMgr.connectingCallMgr[callStatusMgr.VIDEOCONF].length != 0) {
            result["rsp"] = "-6";
            result["desc"] = "answer: The call is conflicted with other calls"
            param["callback"](result);
            return;
        };
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (cloudICP.dispatch.video.currentVideoAbility >= cloudICP.dispatch.video.MAX_VIDEO_ABILITY) {
        result["rsp"] = "-7";
        result["desc"] = "answer: The ability of video is limited";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "recv",
        "cid": param["cid"],
        "param": {
            "video_format": cloudICP.config.cameraInfo.toString(),
            "audio_format": "1"
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * reject
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.reject = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "reject: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "reject: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "reject: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "reject: The cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        var str;
        if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.CONNECTING) {
            str = "reject: The cid is answered";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.HOLD) {
            str = "reject: The cid is holded";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.RELEASE) {
            str = "reject: The cid is ended";
        } else {
            str = "reject: The cid is invalid";
        }
        result["rsp"] = "-4";
        result["desc"] = str;
        param["callback"](result);
        return;
    }
    var requestParam = {
        "opt": "reject",
        "cid": param["cid"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                // 停止振铃音
                var mediaParam = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(param["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VIDEO, callStatusMgr.RELEASE, { "value": { "cid": param["cid"] } });
            }

            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * release
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.release = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "release: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "release: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "release: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "release: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call["caller"] != cloudICP.userInfo["isdn"] && call.callState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "release: The callee can't release a ringing call.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "close",
        "cid": param["cid"]
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"] + "/close/" + param["cid"];
    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "1") {
                data["rsp"] = "0";
            }

            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * dispatchVideo
 * @param {Object} param {
 *  src: ,
 *  fmt: ,
 *  dest: [
 *      {"isdn": ,}
 *  ]
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.dispatchVideo = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dispatchVideo: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dispatchVideo: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "dispatchVideo: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["src"])) {
        result["desc"] = "dispatchVideo: The src is invalid";
        param["callback"](result);
        return;
    }

    if (!param["fmt"]) {
        param["fmt"] = "720P";
    }

    var fmts = ["720P", "D1", "CIF", "NO"];
    if (!param["fmt"] || !cloudICP.util.includes(fmts, param["fmt"])) {
        result["desc"] = "dispatchVideo: The fmt is invalid";
        param["callback"](result);
        return;
    }

    if (param["dest"] != undefined) {
        for (var item = 0; item < param["dest"].length; item++) {
            if (!cloudICP.util.checkCallNumber(param["dest"][item]["isdn"])) {
                result["desc"] = "dispatchVideo: reslist is invalid";
                param["callback"](result);
                return;
            }
        }
    }

    if (param["destGroups"] != undefined) {
        for (var item = 0; item < param["destGroups"].length; item++) {
            if (!cloudICP.util.checkCallNumber(param["destGroups"][item]["isdn"])) {
                result["desc"] = "dispatchVideo: destGroups is invalid";
                param["callback"](result);
                return;
            }
        }
    }


    var requestParam = {
        "opt": "dispatch",
        "param": {
            "src": param["src"],
            "fmt": param["fmt"],
            "dest": param["dest"],
            "destGroups": param["destGroups"]
        }
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * cancelVideoDispatch
 * @param {Object} param {
 *  src: ,
 *  dest: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.cancelVideoDispatch = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelVideoDispatch: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelVideoDispatch: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "cancelVideoDispatch: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["src"])) {
        result["desc"] = "cancelVideoDispatch: The src is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["dest"]) && !cloudICP.util.checkIsdn(param["destGroup"])) {
        result["desc"] = "cancelVideoDispatch: The dest is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "dispatchDelete",
        "param": {
            "src": param["src"],
            "dest": param["dest"],
            "destGroup": param["destGroup"]
        }
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * startVideoUploadWall
 * @param {Object} param {
 *  src: ,
 *  channel: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.startVideoUploadWall = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "startVideoUploadWall: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "startVideoUploadWall: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "startVideoUploadWall: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["src"])) {
        result["desc"] = "startVideoUploadWall: The src is invalid";
        param["callback"](result);
        return;
    }

    if (!param["channel"] || !cloudICP.util.isNumber(param["channel"])) {
        result["desc"] = "startVideoUploadWall: The channel is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "start",
        "param": {
            "src": param["src"],
            "channel": param["channel"]
        }
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"] + "/videowall";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * stopVideoUploadWall
 * @param {Object} param {
 *  src: ,
 *  channel: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.stopVideoUploadWall = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopVideoUploadWall: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "stopVideoUploadWall: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "stopVideoUploadWall: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["src"])) {
        result["desc"] = "stopVideoUploadWall: The src is invalid";
        param["callback"](result);
        return;
    }

    if (!param["channel"] || !cloudICP.util.isNumber(param["channel"])) {
        result["desc"] = "stopVideoUploadWall: The channel is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "stop",
        "param": {
            "src": param["src"],
            "channel": param["channel"]
        }
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"] + "/videowall";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * ptzctrlCamera
 * @param {Object} param {
 *  to: ,
 *  act: ,
 *  value: ,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Video.prototype.ptzctrlCamera = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "ptzctrlCamera: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "ptzctrlCamera: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "ptzctrlCamera: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "ptzctrlCamera: The to is invalid";
        param["callback"](result);
        return;
    }

    if (!param["act"] || !cloudICP.util.isNumber(param["act"]) || parseInt(param["act"]) < 1 || parseInt(param["act"]) > 18) {
        result["desc"] = "ptzctrlCamera: The act is invalid";
        param["callback"](result);
        return;
    }

    if (!param["value"] || !cloudICP.util.isNumber(param["value"]) || parseInt(param["value"]) < 1 || parseInt(param["value"]) > 10) {
        result["desc"] = "ptzctrlCamera: The value is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "to": param["to"],
        "param": {
            "act": param["act"],
            "value": param["value"]
        }
    };
    var url = cloudICP.getSdkServerUrl() + "/v1/video/" + cloudICP.userInfo["isdn"] + "/ptzcontrol";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_Voice() {
    this.MAX_SUB_LIST = 200;

    this.MAX_AMBIENCE_NUM = 1;
    this.MAX_HALF_DIAL_NUM = 1;
    this.MAX_VOICE_NUM = 30;
};

/**
 * subscribeUserStatus() subscribe users
 * @param {Object} param {
 *  reslist: [
 *      {isdn: ""},
 *  ],
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.subscribeUserStatus = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "subscribeUserStatus: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "subscribeUserStatus: callback is not a function" });
        return;
    }


    var subUserParam = {};
    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "subscribeUserStatus: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!(Array.isArray(param["reslist"]) && param["reslist"].length > 0 && param["reslist"].length <= this.MAX_SUB_LIST)) {
        result["desc"] = "subscribeUserStatus: reslist is invalid";
        param["callback"](result);
        return;
    }

    for (var item = 0; item < param["reslist"].length; item++) {
        if (!cloudICP.util.checkIsdn(param["reslist"][item]["isdn"])) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "subscribeUserStatus: isdn is invalid." });
            result["desc"] = "subscribeUserStatus: reslist is invalid";
            param["callback"](result);
            return;
        }
    }

    subUserParam["type"] = "sub";
    subUserParam["reslist"] = param["reslist"];
    var url = cloudICP.getSdkServerUrl() + "/v1/person/" + cloudICP.userInfo["isdn"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": subUserParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * unsubscribeUserStatus() unsubUser users
 * @param {Object} param {
 *  reslist: [
 *      {isdn: ""},
 *  ],
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.unsubscribeUserStatus = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unsubscribeUserStatus: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unsubscribeUserStatus: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unsubscribeUserStatus: The user does not logined";
        param["callback"](result);
        return;
    }

    //check param valid
    result["rsp"] = "-2";
    if (!(Array.isArray(param["reslist"]) && param["reslist"].length > 0 && param["reslist"].length <= this.MAX_SUB_LIST)) {
        result["desc"] = "unsubscribeUserStatus: reslist is is invalid";
        param["callback"](result);
        return;
    }

    for (var item = 0; item < param["reslist"].length; item++) {
        if (!cloudICP.util.checkIsdn(param["reslist"][item]["isdn"])) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "unsubscribeUserStatus: isdn is invalid." });
            result["desc"] = "unsubscribeUserStatus: isdn is invalid";
            param["callback"](result);
            return;
        }
    }

    var unsubUserParam = {};

    unsubUserParam["type"] = "unsub";
    unsubUserParam["reslist"] = param["reslist"];
    var url = cloudICP.getSdkServerUrl() + "/v1/person/" + cloudICP.userInfo["isdn"];

    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "async": false,
        "data": unsubUserParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}


/**
 * dial
 * @param {Object} param {
 *  to: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.dial = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dial: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dial: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "dial: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "dial: The to is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentCallState == callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "dial: There is a call is ringing."
        param["callback"](result);
        return;
    }

    if (callStatusMgr.numberOfCall[callStatusMgr.VOICE] + callStatusMgr.numberOfCall[callStatusMgr.VOICECONF] > cloudICP.dispatch.voice.MAX_VOICE_NUM) {
        result["rsp"] = "-5";
        result["desc"] = "dial: The number of voice call is limited to " + cloudICP.dispatch.voice.MAX_VOICE_NUM;
        param["callback"](result);
        return;
    }

    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "dial: The voice dial is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "dial",
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * answer
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.answer = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "answer: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "answer: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "answer: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "answer: The cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        result["rsp"] = "-40002";
        result["desc"] = "";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.connectingCallMgr[callStatusMgr.VIDEO].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.DISCREET].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.VIDEOCONF].length != 0) {
        result["rsp"] = "-5";
        result["desc"] = "answer: The call is conflicted with other calls"
        param["callback"](result);
        return;
    };

    var call = calls[param["cid"]];
    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (call) {
        var callType = call.callType;

        switch (callType) {
            case callStatusMgr.AMBIENCE:
                if (callStatusMgr.numberOfCall[callStatusMgr.AMBIENCE] >= cloudICP.dispatch.voice.MAX_AMBIENCE_NUM) {
                    result["rsp"] = "-4";
                    result["desc"] = "answer: The number of ambienceListen is limited to " + cloudICP.dispatch.voice.MAX_AMBIENCE_NUM;
                    param["callback"](result);
                    return;
                }
                break;
            case callStatusMgr.VOICE:
                if (callStatusMgr.numberOfCall[callStatusMgr.VOICE] + callStatusMgr.numberOfCall[callStatusMgr.VOICECONF] > cloudICP.dispatch.voice.MAX_VOICE_NUM) {
                    result["rsp"] = "-4";
                    result["desc"] = "answer: The number of voice call is limited to " + cloudICP.dispatch.voice.MAX_VOICE_NUM;
                    param["callback"](result);
                    return;
                }
                break;
            case callStatusMgr.HALFVOICE:
                if (callStatusMgr.numberOfCall[callStatusMgr.HALFVOICE] >= cloudICP.dispatch.voice.MAX_HALF_DIAL_NUM) {
                    result["rsp"] = "-4";
                    result["desc"] = "answer: The number of halfDial is limited to " + cloudICP.dispatch.voice.MAX_HALF_DIAL_NUM;
                    param["callback"](result);
                    return;
                }
                break;
            default:
                break;
        }
    }

    var requestParam = {
        "opt": "recv",
        "cid": param["cid"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * reject
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.reject = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "reject: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "reject: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "reject: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "reject: The cid is invalid";
        param["callback"](result);
        return;
    }

    var calls = cloudICP.util.callStatusMgr.allCalls;
    if (calls[param["cid"]] && calls[param["cid"]]["callState"] >= cloudICP.util.callStatusMgr.CONNECTING) {
        var str;
        if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.CONNECTING) {
            str = "reject: The cid is answered";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.HOLD) {
            str = "reject: The cid is holded";
        } else if (calls[param["cid"]]["callState"] == cloudICP.util.callStatusMgr.RELEASE) {
            str = "reject: The cid is ended";
        } else {
            str = "reject: The cid is invalid";
        }
        result["rsp"] = "-4";
        result["desc"] = str;
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "reject",
        "cid": param["cid"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                // 停止振铃音
                var mediaParam = "{\"description\":\"msp_stop_tone\", \"cmd\": 131076, \"param\":{\"cid\": {0}}}".format(
                    parseInt(param["cid"])
                );

                cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam, true);

                var callStatusMgr = cloudICP.util.callStatusMgr;
                callStatusMgr.updateCallStatus(callStatusMgr.VOICE, callStatusMgr.RELEASE, { "value": { "cid": param["cid"] } });
            }

            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * release
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.release = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "release: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "release: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "release: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "release: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call["caller"] != cloudICP.userInfo["isdn"] && call.callState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "release: The callee can't release a ringing call.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/close/" + param["cid"];
    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "callback": function(data) {
            if (data["rsp"] == "1") {
                data["rsp"] = "0";
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * transfer
 * @param {Object} param {
 *  to:,
 *  speaker:
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.transfer = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "transfer: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "transfer: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "transfer: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "transfer: The to is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["speaker"])) {
        result["desc"] = "transfer: The speaker is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "transfer",
        "to": param["to"],
        "speaker": param["speaker"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);

            if (data["rsp"] != 0) {
                var retEvent = {
                    "eventName": "OnTransferFailure",
                    "rsp": "0"
                }
                cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnTransferFailure"](retEvent);
            }
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}


/**
 * cancelTransfer
 * @param {Object} param {
 *  to:,
 *  speaker:
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.cancelTransfer = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelTransfer: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "cancelTransfer: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "cancelTransfer: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "cancelTransfer: The to is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["speaker"])) {
        result["desc"] = "cancelTransfer: The speaker is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "transfercancel",
        "to": param["to"],
        "speaker": param["speaker"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * breakOff
 * @param {Object} param {
 *  to:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.breakOff = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "breakOff: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "breakOff: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "breakOff: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "breakOff: The to is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "P2P",
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/breakoff";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);

            if (data["rsp"] != 0) {
                var retEvent = {
                    "eventName": "OnBreakOffFailure",
                    "rsp": "0"
                }
                cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnBreakOffFailure"](retEvent);
            }
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * halfDial
 * @param {Object} param {
 *  to:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.halfDial = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "halfDial: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "halfDial: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "halfDial: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "halfDial: The to is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentCallState == callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "halfDial: There is a call is ringing."
        param["callback"](result);
        return;
    }


    if (callStatusMgr.numberOfCall[callStatusMgr.HALFVOICE] >= cloudICP.dispatch.voice.MAX_HALF_DIAL_NUM) {
        var cid = callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE][0];
        var call = callStatusMgr.allCalls[cid];
        if (call["callee"] != param["to"] && call["caller"] != param["to"]) {
            result["rsp"] = "-5";
            result["desc"] = "halfDial: The number of halfDial is limited to " + cloudICP.dispatch.voice.MAX_HALF_DIAL_NUM;
            param["callback"](result);
            return;
        }
    }

    if (callStatusMgr.connectingCallMgr[callStatusMgr.VIDEO].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.DISCREET].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0 ||
        callStatusMgr.connectingCallMgr[callStatusMgr.VIDEOCONF].length != 0) {

        if (callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0) {
            var cid = callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE][0];
            var call = callStatusMgr.allCalls[cid];
            if (call["callee"] != param["to"] && call["caller"] != param["to"]) {
                result["rsp"] = "-6";
                result["desc"] = "halfDial: The voice call is conflicted with other calls";
                param["callback"](result);
                return;
            }
        }
    }

    if (callStatusMgr.isAnyCallExisted()) {
        if (callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE].length != 0) {
            var cid = callStatusMgr.connectingCallMgr[callStatusMgr.HALFVOICE][0];
            var call = callStatusMgr.allCalls[cid];
            if (call["callee"] != param["to"] && call["caller"] != param["to"]) {
                result["rsp"] = "-6";
                result["desc"] = "halfDial: The voice call is conflicted with other calls";
                param["callback"](result);
                return;
            }
        } else {
            result["rsp"] = "-6";
            result["desc"] = "halfDial: The voice call is conflicted with other calls";
            param["callback"](result);
            return;
        }
    }

    if (cloudICP.dispatch.group.isCurrentPtt["isPtt"]) {
        result["rsp"] = "-6";
        result["desc"] = "halfDial: The The voice call is conflicted with other calls.";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "halfDial",
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * releaseHalfDial
 * @param {Object} param {
 *  cid:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.releaseHalfDial = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "releaseHalfDial: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "releaseHalfDial: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "releaseHalfDial: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "releaseHalfDial: The cid is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "halfDialRelease",
        "cid": param["cid"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            // 关闭麦克风
            var mediaParam = "{\"description\":\"msp_mute_audio_channel\", \"cmd\": 65549, \"param\":{\"resID\": {0}, \"mute\":true}}".format(
                parseInt(param["cid"])
            );

            cloudICP.dispatch.webSocket.sendDataToMediaSDK(mediaParam, true);

            param["callback"](data)
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * closeHalfDial
 * @param {Object} param {
 *  cid:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.closeHalfDial = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "closeHalfDial: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "closeHalfDial: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "closeHalfDial: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "closeHalfDial: The cid is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "close",
        "cid": param["cid"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data)
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * discreetListen
 * @param {Object} param {
 *  opType :  start|stop
 *  to:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.discreetListen = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "discreetListen: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "discreetListen: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "discreetListen: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if ("start" != param["opType"] && "stop" != param["opType"]) {
        result["opType"] = "discreetListen: opType is invalid";
        param["callback"](result);
        return;
    }

    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "discreetListen: The to is invalid";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": param["opType"],
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/discreetlisten";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            param["callback"](data);

            if (param["opType"] == "start") {
                if (data["rsp"] == 0) {
                    var retEvent = {
                        "eventName": "OnStartDiscreetlistenSuccess",
                        "rsp": 0,
                    }
                    cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnStartDiscreetlistenSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnStartDiscreetlistenFailure",
                        "rsp": 0,
                    }
                    cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnStartDiscreetlistenFailure"](retEvent);
                }
            } else {
                if (data["rsp"] == 0) {
                    var retEvent = {
                        "eventName": "OnStopDiscreetlistenSuccess",
                        "rsp": 0,
                    }
                    cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnStopDiscreetlistenSuccess"](retEvent);
                } else {
                    var retEvent = {
                        "eventName": "OnStopDiscreetlistenFailure",
                        "rsp": 0,
                    }
                    cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnStopDiscreetlistenFailure"](retEvent);
                }
            }
        }
    }
    cloudICP.util.ajax(ajaxCfg);
}

/**
 * ambienceListen
 * @param {Object} param {
 *  to:,
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.ambienceListen = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "ambienceListen: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "ambienceListen: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "ambienceListen: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "ambienceListen: The to is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentCallState == callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "ambienceListen: There is a call is ringing."
        param["callback"](result);
        return;
    }

    if (callStatusMgr.numberOfCall[callStatusMgr.AMBIENCE] >= cloudICP.dispatch.voice.MAX_AMBIENCE_NUM) {
        result["rsp"] = "-5";
        result["desc"] = "ambienceListen: The number of ambienceListen is limited to " + cloudICP.dispatch.voice.MAX_AMBIENCE_NUM;
        param["callback"](result);
        return;
    }

    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "ambienceListen: The voice dial is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/ambiencelisten";
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * dialout
 * @param {Object} param {
 *  to: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.dialout = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dialout: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "dialout: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "dialout: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "dialout: The to is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentCallState == callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "dialout: There is a call is ringing."
        param["callback"](result);
        return;
    }

    if (callStatusMgr.numberOfCall[callStatusMgr.VOICE] + callStatusMgr.numberOfCall[callStatusMgr.VOICECONF] > cloudICP.dispatch.voice.MAX_VOICE_NUM) {
        result["rsp"] = "-5";
        result["desc"] = "dialout: The number of voice call is limited to " + cloudICP.dispatch.voice.MAX_VOICE_NUM;
        param["callback"](result);
        return;
    }

    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "dialout: The voice dial is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "ticDial",
        "to": param["to"]
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "data": requestParam,
        "callback": param["callback"]
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * releaseDialout
 * @param {Object} param {
 *  cid: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.releaseDialout = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "releaseDialout: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "releaseDialout: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "releaseDialout: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "releaseDialout: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (call && call["caller"] != cloudICP.userInfo["isdn"] && call.callState == cloudICP.util.callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "releaseDialout: The callee can't release a ringing call.";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/ticclose/" + param["cid"];
    var ajaxCfg = {
        "type": "DELETE",
        "url": url,
        "callback": function(data) {
            if (data["rsp"] == "1") {
                data["rsp"] = "0";
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * intercept
 * @param {Object} param {
 *  to: 
 *  callback: ,
 * }
 */
ICPSDK_Dispatch_Voice.prototype.intercept = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "intercept: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "intercept: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "intercept: The user does not logined";
        param["callback"](result);
        return;
    }

    result["rsp"] = "-2";
    if (!cloudICP.util.checkIsdn(param["to"])) {
        result["desc"] = "intercept: The to is invalid";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (callStatusMgr.currentCallState == callStatusMgr.RINGING) {
        result["rsp"] = "-4";
        result["desc"] = "intercept: There is a call is ringing."
        param["callback"](result);
        return;
    }

    if (callStatusMgr.numberOfCall[callStatusMgr.VOICE] + callStatusMgr.numberOfCall[callStatusMgr.VOICECONF] > cloudICP.dispatch.voice.MAX_VOICE_NUM) {
        result["rsp"] = "-5";
        result["desc"] = "intercept: The number of voice call is limited to " + cloudICP.dispatch.voice.MAX_VOICE_NUM;
        param["callback"](result);
        return;
    }

    if (callStatusMgr.isAnyCallExisted()) {
        result["rsp"] = "-6";
        result["desc"] = "intercept: The voice dial is conflicted with other calls";
        param["callback"](result);
        return;
    }

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"] + "/breakin/" + param["to"];
    var ajaxCfg = {
        "type": "PUT",
        "url": url,
        "callback": function(data) {
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * hold
 * @param {
 *  cid:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Voice.prototype.hold = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "hold: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "hold: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "hold: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "hold: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (!call) {
        result["rsp"] = "-4";
        result["desc"] = "hold: The call is not existed";
        param["callback"](result);
        return;
    } else if (call["callState"] != cloudICP.util.callStatusMgr.CONNECTING) {
        result["rsp"] = "-4";
        result["desc"] = "hold: The call is not existed";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "hold",
        "param": {
            type: "0",
            cid: param["cid"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                cloudICP.util.callStatusMgr.holdMgr.push(param["cid"]);
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

/**
 * unhold
 * @param {
 *  cid:
 *  callback:
 * }
 */
ICPSDK_Dispatch_Voice.prototype.unhold = function(param) {
    if (undefined == param) {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unhold: param is invalid" });
        return;
    }

    if (undefined == param["callback"] || typeof param["callback"] != "function") {
        cloudICP.util.log({ "logLevel": "error", "logMsg": "unhold: callback is not a function" });
        return;
    }

    var result = {
        "rsp": "-3",
        "desc": ""
    };

    if (!cloudICP.userInfo["isdn"]) {
        result["desc"] = "unhold: The user does not logined";
        param["callback"](result);
        return;
    }
    //check param valid
    result["rsp"] = "-2";
    if (!cloudICP.util.checkCid(param["cid"])) {
        result["desc"] = "unhold: The cid is invalid";
        param["callback"](result);
        return;
    }

    var call = cloudICP.util.callStatusMgr.allCalls[param["cid"]];
    if (!call) {
        result["rsp"] = "-4";
        result["desc"] = "unhold: The call is not existed";
        param["callback"](result);
        return;
    } else if (call["callState"] != cloudICP.util.callStatusMgr.HOLD) {
        result["rsp"] = "-2";
        result["desc"] = "unhold: The cid is not holded";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (cloudICP.util.callStatusMgr.numberOfCall[callStatusMgr.VIDEO] + cloudICP.util.callStatusMgr.numberOfCall[callStatusMgr.VIDEOCONF] > 0) {
        result["rsp"] = "-7";
        result["desc"] = "unhold: There is a video existed";
        param["callback"](result);
        return;
    }

    var callStatusMgr = cloudICP.util.callStatusMgr;
    if (cloudICP.util.callStatusMgr.numberOfCall[callStatusMgr.DISCREET] + cloudICP.util.callStatusMgr.numberOfCall[callStatusMgr.HALFVOICE] > 0) {
        result["rsp"] = "-8";
        result["desc"] = "unhold: There is a discreet or halfdial existed";
        param["callback"](result);
        return;
    }

    var requestParam = {
        "opt": "unhold",
        "param": {
            type: "0",
            cid: param["cid"]
        }
    };

    var url = cloudICP.getSdkServerUrl() + "/v1/voicecall/" + cloudICP.userInfo["isdn"];
    var ajaxCfg = {
        "type": "POST",
        "url": url,
        "data": requestParam,
        "callback": function(data) {
            if (data["rsp"] == "0") {
                cloudICP.util.callStatusMgr.holdMgr.push(param["cid"]);
            }
            param["callback"](data);
        }
    }
    cloudICP.util.ajax(ajaxCfg);
};

function ICPSDK_Dispatch_WebSocket() {
    this._sdkServerWs = null;
    this._localDeamonWs = null;
    this._medisServerWs = null;
    this._mediaSdkRspFuncs = {};

    this.reconnectMediaServiceId = -1;
    this.reconnectLocalDeamonId = -1;

    this.isMSPConflicted = false;
};



/**
 * 连接本地Deamon线程
 */
ICPSDK_Dispatch_WebSocket.prototype.connectToLocalDeamon = function() {
    if (this._localDeamonWs) {
        return;
    }

    if (cloudICP.config.debugMode == "true") {
        console.log("connectToLocalDeamon: WebSocket connection begin");
    }

    if (typeof MozWebSocket != "undefined") {
        this._localDeamonWs = new MozWebSocket(cloudICP.getLocalDeamonUrl());
    } else {
        this._localDeamonWs = new WebSocket(cloudICP.getLocalDeamonUrl());
    }
    // 监听sdkserver websocket建立事件
    this._localDeamonWs.onopen = function(event) {
        clearInterval(cloudICP.dispatch.webSocket.reconnectLocalDeamonId);
        cloudICP.dispatch.webSocket.reconnectLocalDeamonId = -1;
        clearInterval(cloudICP.dispatch.webSocket.reconnectMediaServiceId);
        cloudICP.dispatch.webSocket.reconnectMediaServiceId = -1;

        if (cloudICP.config.debugMode == "true") {
            console.log("connectToLocalDeamon: WebSocket connection open");
        }
    };

    this._localDeamonWs.onclose = function(event) {
        if (cloudICP.config.debugMode == "true") {
            console.log("connectToLocalDeamon: WebSocket connection closed " + event.data);
        }
        cloudICP.dispatch.webSocket._localDeamonWs = null;
        clearInterval(cloudICP.dispatch.webSocket.reconnectMediaServiceId);
        cloudICP.dispatch.webSocket.reconnectMediaServiceId = -1;

        if (cloudICP.dispatch.webSocket.reconnectLocalDeamonId == -1) {
            cloudICP.dispatch.webSocket.reconnectLocalDeamonId = setInterval(function() {
                if (cloudICP.dispatch.webSocket._localDeamonWs == null) {
                    cloudICP.dispatch.webSocket.connectToLocalDeamon();
                }
            }, 5000);
        }

        cloudICP.reportDispatchSdkStatus({ "status": "1", "desc": "connect to deamon thread failed." });
    };

    // 监听sdkserver websocket错误事件
    this._localDeamonWs.onerror = function(event) {
        if (cloudICP.config.debugMode == "true") {
            console.log("connectToLocalDeamon: WebSocket error observed: " + event.data);
        }
    };

    // 监听sdkserver websocket消息事件
    this._localDeamonWs.onmessage = function(event) {
        if (cloudICP.config.debugMode == "true") {
            console.log("connectToLocalDeamon: WebSocket message received: " + event.data);
        }
        cloudICP.dispatch.webSocket.connectToMediaServer();

        var data = JSON.parse(event.data);

        if (data["rsp"] != "131074") {
            setTimeout(function() {
                cloudICP.util.sendLogOut("connectToLocalDeamon: WebSocket message received: " + event.data);
            }, 0);
        }

        if (data["msgType"] == "MspServiceStartUp") {
            cloudICP.userInfo["mspVersion"] = data["version"];
        }

        cloudICP.dispatch.event.delMSPNotify(data);

    };
}

/**
 * 连接本地媒体线程
 */
ICPSDK_Dispatch_WebSocket.prototype.connectToMediaServer = function() {
    if (this._medisServerWs) {
        return;
    }
    if (cloudICP.config.debugMode == "true") {
        console.log("connectToMediaServer: WebSocket connection begin");
    }

    if (typeof MozWebSocket != "undefined") {
        this._medisServerWs = new MozWebSocket(cloudICP.getMediaServerUrl());
    } else {
        this._medisServerWs = new WebSocket(cloudICP.getMediaServerUrl());
    }
    // 监听sdkserver websocket建立事件
    this._medisServerWs.onopen = function(event) {
        clearInterval(cloudICP.dispatch.webSocket.reconnectMediaServiceId);
        cloudICP.dispatch.webSocket.reconnectMediaServiceId = -1;

        if (cloudICP.config.debugMode == "true") {
            console.log("connectToMediaServer: WebSocket connection open");
        }

        this._medisServerWs.send("Login");
    }.bind(this);

    this._medisServerWs.onclose = function(event) {
        if (cloudICP.config.debugMode == "true") {
            console.log("connectToMediaServer: WebSocket connection closed: " + event.data);
        }

        cloudICP.dispatch.webSocket._medisServerWs = null;

        if (cloudICP.dispatch.webSocket.reconnectMediaServiceId == -1 && cloudICP.dispatch.webSocket.reconnectLocalDeamonId == -1) {
            cloudICP.dispatch.webSocket.reconnectMediaServiceId = setInterval(function() {
                if (cloudICP.dispatch.webSocket._medisServerWs == null) {
                    cloudICP.dispatch.webSocket.connectToMediaServer();
                }
            }, 5000);
        }

        cloudICP.reportDispatchSdkStatus({ "status": "2", "desc": "connect to media server failed." });
    };

    // 监听sdkserver websocket错误事件
    this._medisServerWs.onerror = function(event) {
        if (cloudICP.config.debugMode == "true") {
            console.log("connectToMediaServer: WebSocket error observed: " + event.data);
        }
    };

    // 监听sdkserver websocket消息事件
    this._medisServerWs.onmessage = function(event) {
        var ret = this.dealMSPEvent(event);

        if (ret == true) {
            return;
        }

        var data = JSON.parse(event.data);

        if (data["rsp"] != "131074") {
            setTimeout(function() {
                cloudICP.util.sendLogOut("connectToMediaServer: WebSocket message received: " + event.data);
            }, 0);
        }
        var cmd = data["rsp"] + "";
        if (typeof this._mediaSdkRspFuncs[cmd] == "function") {
            this._mediaSdkRspFuncs[cmd](data);
        } else {
            cloudICP.dispatch.event.delMSPNotify(data);
        }
    }.bind(this);
}

/**
 * 发送消息给本地媒体
 */
ICPSDK_Dispatch_WebSocket.prototype.sendDataToMediaSDK = function(data, isLog) {
    var sendStr;
    if (isLog == true) {
        setTimeout(function() {
            cloudICP.util.sendLogOut("send message to msp_s " + data);
        }, 0);
    }
    if (undefined != data["cmd"]) {
        sendStr = JSON.stringify(data);
    } else {
        sendStr = "" + data;
    }
    this._medisServerWs.send(sendStr);
}

/**
 * 发送消息给本地媒体
 */
ICPSDK_Dispatch_WebSocket.prototype.sendDataToDeamonSDK = function(data, isLog) {
    if (isLog == true) {
        setTimeout(function() {
            cloudICP.util.sendLogOut("send message to msp_d " + JSON.stringify(data));
        }, 0);
    }
    if (undefined != data["cmd"]) {
        var sendStr = JSON.stringify(data);

        this._localDeamonWs.send(sendStr);

    } else {
        this._localDeamonWs.send(data);

    }
}



/**
 * 获取ip
 * @param param {
 * callback : 
 * }
 */
ICPSDK_Dispatch_WebSocket.prototype.getLocalIp = function(param) {
    var msg = { "description": "msp_get_local_ip", "cmd": 0x20001, "param": { "server": cloudICP.config["serverAddress"] } };
    this._mediaSdkRspFuncs[msg.cmd + ""] = this.getLocalIpCallBack;
    this.sendDataToMediaSDK(msg, true);
}

/**
 * 获取摄像头信息
 * @param param {
 * callback : 
 * }
 */
ICPSDK_Dispatch_WebSocket.prototype.getCameraInfo = function(param) {
    var msg = { "description": "msp_get_video_support", "cmd": 0x20007 };
    this._mediaSdkRspFuncs[msg.cmd + ""] = this.getCameraInfoCallBack;
    this.sendDataToMediaSDK(msg, true);
}

/**
 * 处理获取IP的结果
 */
ICPSDK_Dispatch_WebSocket.prototype.getCameraInfoCallBack = function(data) {
    if (0 == data["result"]) {
        if (data["support"] == 0) {
            data["support"] = 127;
        }
        cloudICP.config["cameraInfo"] = data["support"];
        if (cloudICP.config["cameraInfo"] && cloudICP.config["localIP"]) {
            cloudICP.reportDispatchSdkStatus({ "status": "0", "desc": "get localip and cameraInfo success" });
        }
    } else {
        cloudICP.reportDispatchSdkStatus({ "status": "4", "desc": "get cameraInfo failed" });
    }
}

ICPSDK_Dispatch_WebSocket.prototype.getLocalIpCallBack = function(data) {
    if (0 == data["result"]) {
        cloudICP.config["localIP"] = data["localIP"];
        if (cloudICP.config["cameraInfo"] && cloudICP.config["localIP"]) {
            cloudICP.reportDispatchSdkStatus({ "status": "0", "desc": "get localip and cameraInfo success" });
        }
    } else {
        cloudICP.reportDispatchSdkStatus({ "status": "3", "desc": "get localIP failed" });
    }
}


/**
 * connectToSDKServer()
 */
ICPSDK_Dispatch_WebSocket.prototype.connectToSDKServer = function() {
    if (this._sdkServerWs) {
        this._sdkServerWs.close();
        this._sdkServerWs = null;
    }
    if (typeof MozWebSocket != "undefined") {
        this._sdkServerWs = new MozWebSocket(cloudICP.getSdkServerWssUrl());
    } else {
        this._sdkServerWs = new WebSocket(cloudICP.getSdkServerWssUrl());
    }
    // 监听sdkserver websocket建立事件
    this._sdkServerWs.onopen = function(event) {
        var request = {
            cmd: 'registerEvents',
            isdn: cloudICP.userInfo.isdn,
            session: cloudICP.userInfo.session
        }
        this.sendAuthToSDKServer(request);
    }.bind(this);

    this._sdkServerWs.onclose = function(event) {
        cloudICP.util.sendLogOut("connectToSDKServer: WebSocket connection closed:" + event.data);
    };

    // 监听sdkserver websocket错误事件
    this._sdkServerWs.onerror = function(event) {
        cloudICP.util.sendLogOut("connectToSDKServer: WebSocket error observed:" + event.data);
    };

    // 监听sdkserver websocket消息事件
    this._sdkServerWs.onmessage = function(event) {
        if (cloudICP.config.debugMode == "true") {
            setTimeout(function() {

                // var param = "{\"description\":\"msp_client_log_out\", \"cmd\": 131074, \"param\":{\"logLevel\": \"info\", \"logMsg\":\"{0}\"}}".format(msg);
                cloudICP.util.sendLogOut("connectToSDKServer: WebSocket message received:" + event.data);
            }, 0);
        }

        this.dealMessage(event.data);
    }.bind(this);
}

/**
 * handle the websocket event
 */
ICPSDK_Dispatch_WebSocket.prototype.dealMessage = function(event) {
    var jsonObject = JSON.parse(event);
    var cmd = jsonObject["cmd"];
    var rid = jsonObject["rid"];
    if (undefined == cmd) {
        cloudICP.util.sendLogOut("dealMessage: cmd is invalid");
        return;
    }
    if (undefined != jsonObject["rid"]) {
        delete jsonObject.rid;
    }
    if (undefined != jsonObject["seq"]) {
        delete jsonObject.seq;
    }
    delete jsonObject.cmd;
    switch (cmd) {
        case "voiceNotify": //语音状态通知处理
            cloudICP.dispatch.event.delVoiceNotify(jsonObject);
            break;
        case "videoNotify": //视频状态通知处理
            cloudICP.dispatch.event.delVideoNotify(jsonObject);
        case "groupCallNotify": //组呼状态通知处理
            cloudICP.dispatch.event.delGroupCallNotify(jsonObject);
            break;
        case "commonNotify": //群组更新通知处理
            cloudICP.dispatch.event.delCommonNotify(jsonObject);
            break;
        case "msNotify": //短彩信更新通知处理
            cloudICP.dispatch.event.delMsNotify(jsonObject);
            break;
        case "gisNotify": //gis状态通知处理
            cloudICP.dispatch.event.delGisNotify(jsonObject);
            break;
        case "resourceNotify": //资源状态通知处理
            jsonObject["rid"] = rid;
            cloudICP.dispatch.event.delResourceNotify(jsonObject);
            break;
        case "moduleNotify": //模块状态通知处理
            cloudICP.dispatch.event.delModuleNotify(jsonObject);
            break;
        case "phoneConfNotify": //音视频会议通知
            break;
        case "200006": //组呼音频通知
            cloudICP.dispatch.event.delResourceNotify(JSON.parse(event));
            break;
        default:
            cloudICP.util.sendLogOut("dealMessage: unknow event. The event is " + event);
    }
}

/**
 * send() send request by websocket
 * @param {Object} req request
 */
ICPSDK_Dispatch_WebSocket.prototype.sendAuthToSDKServer = function(req) {
    this._sdkServerWs.send(JSON.stringify(req));
};

ICPSDK_Dispatch_WebSocket.prototype.dealMSPEvent = function(event) {
    if (event != undefined && event.data != undefined) {
        if (event.data == "LoginSuccessful") {
            this.getLocalIp();
            this.getCameraInfo();

            cloudICP.dispatch.webSocket.isMSPConflicted = false;
            return true;
        } else if (event.data == "LoginFailed") {
            var event = {};
            event["eventName"] = "OnDisConnection";
            event["moduleType"] = "4";
            cloudICP.dispatch.event.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);

            cloudICP.dispatch.webSocket.isMSPConflicted = true;
            delete cloudICP.config["localIP"];
            delete cloudICP.config["cameraInfo"];

            return true;
        } else if (event.data == "this session has been downgraded") {
            var event = {};
            event["eventName"] = "OnDisConnection";
            event["moduleType"] = "4";
            cloudICP.dispatch.event.EVENT_LIST["ModuleNotify"]["OnDisConnection"](event);

            cloudICP.dispatch.webSocket.isMSPConflicted = true;
            delete cloudICP.config["localIP"];
            delete cloudICP.config["cameraInfo"];

            cloudICP.dispatch.auth.unifiedLogout({
                "callback": function(data) {
                    // Do nothing
                }
            });

            return true;
        } else if (event.data == "this session has been downgraded, cannot make any process") {
            delete cloudICP.config["localIP"];
            delete cloudICP.config["cameraInfo"];
            return true;
        }

        return false;
    } else {
        return false;
    }
};

function ICPSDK_Util() {
    this.callStatusMgr = new CALL_STATUS_MGR();
    this.sensitiveInfo = new SENSITIVE_INFOS();
};

/**
 * logParam is json object
 * {
 *   "logLevel" : debug|info|warn|error
 *   "logMsg" : message
 * }
 */
ICPSDK_Util.prototype.log = function(logParam) {
    var date = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (logParam["logLevel"] == "debug") {
        console.debug("HuaweiICPSDK's Log: " + date + " " + logParam["logMsg"]);
    }
    if (logParam["logLevel"] == "info") {
        console.info("HuaweiICPSDK's Log: " + date + " " + logParam["logMsg"]);
    }
    if (logParam["logLevel"] == "warn") {
        console.warn("HuaweiICPSDK's Log: " + date + " " + logParam["logMsg"]);
    }
    if (logParam["logLevel"] == "error") {
        console.error("HuaweiICPSDK's Log: " + date + " " + logParam["logMsg"]);
    }
};


/**
 * @param cfg {
 *  "type" : "POST|PUT|DELETE|GET"
 *  "url" : 
 *  "async" : 
 *  "timeout" : 
 *  "contentType" : 
 *  "data" : //post和put请求时设置
 *  "callback" : 
 * }
 */
ICPSDK_Util.prototype.ajax = function(cfg) {
    var settings = {};
    settings.type = cfg.type;
    settings.timeout = parseInt(cloudICP.config["sdkServerHttpTimeout"]);
    settings.async = cfg.async != false;
    var methodName = null;
    var moduleName = null;
    if (cfg.data) {
        settings.data = JSON.stringify(cfg.data);

        // 打印接口发送日志
        var tmpStr;
        try {
            throw new Error();
        } catch (n) {
            tmpStr = n.stack.split("\n");
        }

        for (var index = 0; index < tmpStr.length; index++) {
            if (tmpStr[index].indexOf("ICPSDK_Dispatch") != -1) {
                methodName = tmpStr[index].split(/\W/)[6];
                moduleName = tmpStr[index].split(/\W/)[5];
                if (moduleName != "ICPSDK_Dispatch_Event") {
                    cloudICP.util.sendLogOut("ICPSDK request: " + "[interface: " + methodName + ", param: " + settings.data + " ]");
                }
                break;
            }
        }
    }

    settings.contentType = cfg.contentType || "application/json";
    if (typeof cfg.callback === "function") {
        settings.success = function(data) {
            var jsonObject = JSON.parse(data);
            if (undefined != jsonObject["cmd"]) {
                delete jsonObject.cmd;
            }
            if (undefined == jsonObject["desc"]) {
                jsonObject["desc"] = "";
            }

            if (undefined != jsonObject["list"] && jsonObject["list"] != null) {
                for (var index = 0; index < jsonObject["list"].length; index++) {
                    if (undefined != jsonObject["list"][index]["vpnid"]) {
                        delete jsonObject["list"][index]["vpnid"];
                    }

                    if (undefined != jsonObject["list"][index]["vpnin"]) {
                        delete jsonObject["list"][index]["vpnin"];
                    }

                    if (undefined != jsonObject["list"][index]["vpnout"]) {
                        delete jsonObject["list"][index]["vpnout"];
                    }
                }
            }

            if (undefined != jsonObject["value"] && jsonObject["value"] != null) {
                if (undefined != jsonObject["value"]["vpnid"]) {
                    delete jsonObject["value"]["vpnid"];
                }

                if (undefined != jsonObject["value"]["vpnin"]) {
                    delete jsonObject["value"]["vpnin"];
                }

                if (undefined != jsonObject["value"]["vpnout"]) {
                    delete jsonObject["value"]["vpnout"];
                }
            }

            if (moduleName != null && moduleName != "ICPSDK_Dispatch_Event") {
                cloudICP.util.sendLogOut("ICPSDK request: " + "[interface: " + methodName + ", response: " + JSON.stringify(jsonObject) + " ]");
            }

            cfg.callback(jsonObject);
        }

        settings.error = function(data) {
            var result = {
                "rsp": "-1",
                "desc": "unkown exception when send request. See the brower's console."
            };
            cfg.callback(result);
            cloudICP.util.log({ "logLevel": "error", "logMsg": "unkown exception when send request. See the brower's console." + JSON.stringify(data) });
        }

    } else {
        settings.error = function(data) {
            cloudICP.util.log({ "logLevel": "error", "logMsg": "unkown exception when send request. See the brower's console." });
        }
    }


    settings.beforeSend = function(XMLHttpRequest) {
        var session = cloudICP.userInfo["session"];
        if (session) {
            XMLHttpRequest.setRequestHeader("session", session);
        }
    };

    settings.cache = false;

    $.ajax(cfg["url"], settings);
}

/**
 * check the string param is number
 * @param param 
 */
ICPSDK_Util.prototype.isNumber = function(param) {
    if (undefined == param) {
        return false;
    }
    var regex = /^[1-9]+[0-9]*$/;
    if (regex.test(param) || /^0$/.test(param)) {
        return true;
    }
    return false;
}

/**
 * check the struiing param is letter
 * @param param
 */
ICPSDK_Util.prototype.isLetter = function(param) {
    if (undefined == param) {
        return false;
    }
    var regex = /^[A-Za-z]+[A-Za-z]*$/
    if (regex.test(param)) {
        return true;
    }
    return false;
}

/**
 * check the string is one of str in array
 * @param array
 */
ICPSDK_Util.prototype.isStrInArray = function(str, array) {
    for (var type = 0; type < array.length; type++) {
        if (array[type] === str) {
            return true;
        }
    }
    return false;
}

/**
 * check the string is legal: number or letter
 * @param param
 */
ICPSDK_Util.prototype.isStrLegal = function(param) {
    if (undefined == param) {
        return false;
    }
    var regex = /^[A-Za-z0-9]+[A-Za-z0-9]*$/
    if (regex.test(param)) {
        return true;
    }
    return false;
}

/**
 * check the string param is number(int or float)
 * @param param 
 */
ICPSDK_Util.prototype.checkRate = function(param) {
    if (undefined == param) {
        return false;
    }

    if (isNaN(parseInt(param)) || isNaN(parseFloat(param))) {
        return false;
    }

    return true;
}


/**
 * check the string param is bool
 * @param param 
 */
ICPSDK_Util.prototype.isBool = function(param) {
    if (undefined == param) {
        return false;
    }

    if (param == "true" || param == "false") {
        return true;
    }
    return false;
}

/**
 * check isdn is valid
 * @param isdn
 */
ICPSDK_Util.prototype.checkIsdn = function(isdn) {
    if (isdn && isdn.length <= 19) {
        return true;
    }
    return false;
}


ICPSDK_Util.prototype.checkCallNumber = function(isdn) {
    if (isdn && isdn.length <= 13 && this.isNumber(isdn)) {
        return true;
    }
    return false;
}

ICPSDK_Util.prototype.checkGroupID = function(grpid) {
    if (grpid && grpid.length <= 13 && this.isNumber(grpid)) {
        return true;
    }
    return false;
}

/**
 * check cid is valid
 * @param cid
 */
ICPSDK_Util.prototype.checkCid = function(cid) {
    if (cid && cid.length <= 32 && this.isNumber(cid) && (parseInt(cid, 10) <= 2147483647)) {
        return true;
    }
    return false;
}

/**
 * check ip is valid
 * @param ip
 */
ICPSDK_Util.prototype.checkIp = function(ip) {
    if (undefined == ip) {
        return false;
    }

    var regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (regex.test(ip)) {
        return true;
    }

    if (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(ip)) {
        return true;
    }

    return false;
}

/**
 * check port is valid
 * @param port
 */
ICPSDK_Util.prototype.checkPort = function(port) {
    if (undefined == port) {
        return false;
    }
    var regex = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (regex.test(port)) {
        return true;
    }
    return false;
}

/**
 * check vpnid is valid
 * @param {int} vpnid
 */
ICPSDK_Util.prototype.checkVpnid = function(vpnid) {
    if (undefined == vpnid || vpnid == null) {
        return false;
    }

    if (typeof vpnid != "number") {
        return false;
    }

    if (vpnid < -1 || vpnid >= 65535) {
        return false;
    }

    return true;
}

/**
 * check the alias of group
 */
ICPSDK_Util.prototype.checkAliasOfGroup = function(alias) {
    if (undefined == alias) {
        return false;
    }
    if ("" == alias.trim()) {
        return false;
    }
    var realLength = 0;
    var encodeStr = encodeURI(alias);
    var len = encodeStr.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = encodeStr.charCodeAt(i);
        realLength += 3;
        if (charCode == 37) {
            i += 2;
        }
    }

    if (realLength > (3 * 32)) {
        return false;
    }

    //不能为空，字符串最大长度为32个字节，不能用中英文逗号、单引号、双引号、分号、/、\符号、&符号、<符号、>符号，不能有连续的空格及连续的百分号，3个字节对应1个中文字。
    if (!(/[,\/\&\'\"\;<>\\\uff1b\u2019\u2018\uff0c\u201d\u201c\u3008\u3009\uff1e\uff1c]/.test(alias)) && !(/\s{2}/.test(alias)) && !(/\%{2}/.test(alias))) {
        return true;
    }
    return false;
}

/**
 * check the user name
 */
ICPSDK_Util.prototype.checkUserName = function(user) {
    if (undefined == user) {
        return false;
    }

    if (user == "") {
        return false;
    }

    var clength = 0;
    for (var index = 0; index < user.length; index++) {
        if (encodeURI(user[index]).length > 1) {
            clength += 3;
        } else {
            clength += 1;
        }
    }

    if (clength >= 33) {
        return false;
    }

    if (!(/[,\/\&\'\"\;<>\\\uff1b\u2019\u2018\uff0c\u201d\u201c\u3008\u3009\uff1e\uff1c]/.test(user)) && !(/\s{2}/.test(user)) && !(/\%{2}/.test(user))) {
        return true;
    }
    return false;
}




Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k = 0; k < o.length; k++) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};



String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

ICPSDK_Util.prototype.generateUUID = function() {
    return new Date().setMilliseconds(0).toString();
};

/**
 * resolve fmt
 * @param {string} fmt
 */
ICPSDK_Util.prototype.resolveFmt = function(fmt) {
    var ret = "720P"
    var fmtNum = parseInt(fmt);

    if (((fmtNum >> 4 & 1) == 1) && ((cloudICP.config.cameraInfo >> 4 & 1) == 1)) {
        ret = "1080P";
    } else if (((fmtNum >> 3 & 1) == 1) && ((cloudICP.config.cameraInfo >> 3 & 1) == 1)) {
        ret = "720P";
    } else if (((fmtNum >> 2 & 1) == 1) && ((cloudICP.config.cameraInfo >> 2 & 1) == 1)) {
        ret = "D1";
    } else if (((fmtNum >> 1 & 1) == 1) && ((cloudICP.config.cameraInfo >> 1 & 1) == 1)) {
        ret = "CIF";
    } else if (((fmtNum & 1) == 1) && ((cloudICP.config.cameraInfo & 1) == 1)) {
        ret = "GCIF";
    }

    return ret;
};

/**
 * resolve fmt
 * @param {string} fmt
 */
ICPSDK_Util.prototype.checkFmt = function(fmt) {
    var fmts = {
        "GCIF": 0,
        "CIF": 1,
        "D1": 2,
        "720P": 3,
        "1080P": 4,
        "2K": 5,
        "4K": 6
    };

    if ((cloudICP.config.cameraInfo >> fmts[fmt] & 1) == 1) {
        return true;
    } else {
        false;
    }
};

/**
 * includes implement
 * @param {string} fmt
 */
ICPSDK_Util.prototype.includes = function(arr, element) {
    for (var index = 0; index < arr.length; index++) {

        if (arr[index] == element) {
            return true;
        }
    }

    return false;
};

/**
 * save log message to msp log files
 * @param {string} fmt
 */
ICPSDK_Util.prototype.sendLogOut = function(msg) {
    if (cloudICP.config.debugMode == "true") {
        if (cloudICP.dispatch.webSocket._medisServerWs &&
            cloudICP.dispatch.webSocket._medisServerWs.readyState == cloudICP.dispatch.webSocket._medisServerWs.OPEN) {
            var param = {
                "description": "msp_client_log_out",
                "cmd": 131074,
                "param": {
                    "logLevel": "info",
                    "logMsg": msg,
                }
            }

            var logStr = cloudICP.util.sensitiveInfo.moveSensitiveInfo(JSON.stringify(param));
            cloudICP.dispatch.webSocket.sendDataToMediaSDK(logStr, false);
        }
    }

};

ICPSDK_Util.prototype.findDuplicates = function(arr) { return arr.filter(function(item, index) { return arr.indexOf(item) != index }) };

/**
 * save log message to msp log files
 * @param {string} fmt
 */
ICPSDK_Util.prototype.checkConfId = function(param) {
    if (!param || param == undefined) {
        return false;
    }

    if (typeof param != "string") {
        return false;
    }

    if (!cloudICP.util.isNumber(param)) {
        return false;
    }

    if (parseInt(param) < 0) {
        return false;
    }

    if (param.length > cloudICP.dispatch.conf.MAX_CONF_ID.length) {
        return false;
    } else if (param.length < cloudICP.dispatch.conf.MAX_CONF_ID.length) {
        return true;
    } else {
        var index = 0;
        var i;
        var j;
        while (index < param.length) {
            i = param.charAt(index);
            j = cloudICP.dispatch.conf.MAX_CONF_ID.charAt(index);

            if (parseInt(i) > parseInt(j)) {
                return false;
            } else if (parseInt(i) < parseInt(j)) {
                return true;
            }

            index += 1
        }

        return true;
    }

    return true;
};

function CALL_STATUS_MGR() {
    var _mthis = this;
    // 通话状态码
    this.IDLE = -1;
    this.NEW = 0;
    this.RINGING = 1;
    this.CONNECTING = 2;
    this.HOLD = 3;
    this.RELEASE = 4;

    // 通话类型 TODO
    this.VOICE = 0;
    this.VIDEO = 1;
    this.HALFVOICE = 2;
    this.DISCREET = 3;
    this.MONITOR = 4;
    this.VIDEODISPATCH = 5;
    this.AMBIENCE = 6;
    this.VOICECONF = 7;
    this.VIDEOCONF = 8;
    this.GROUP = 9;

    //
    this.callTypeStr = [
        "voice", // 0 voice
        "video", // 1 video
        "halfdial", // 2 halfvoice
        "discreenlisten", // 3 discreet
        "monitor", // 4 monitor
        "dispatch", // 5 videodispatch
        "ambience", // 6 ambience
        "voiceconf", // 7 voiceconf
        "videoconf", // 8 videoconf
        "group", // 8 group
    ];

    // 当前存在的各个通话的数量
    this.numberOfCall = [
        0, // voice
        0, // video
        0, // halfvoice
        0, // discreet
        0, // monitor
        0, // videodispatch
        0, // ambience
        0, // voiceconf
        0, // videoconf
    ];

    // 正在通话的call
    this.connectingCallMgr = [
        [], // voice
        [], // video
        [], // halfvoice
        [], // discreet
        [], // monitor
        [], // videodispatch
        [], // ambience
        [], // voiceconf
        [], // videoconf
    ];

    // 视频媒体信息
    // 由于创建窗口到创建视频通道是由不同事件驱动的，所以维护该信息用于传输
    this.videoMediaInfoBuf = {};

    // 维护保持去保持接口调用的关系。
    this.holdMgr = [];

    // 保存组呼的cid用于与msp进行交互。
    // 主要是规避有些场景，只能获取group id不能获取组呼cid的问题。
    this.groupCallMgr = {};

    // 维护推送的会议状态信息
    this.confMgr = {
        "accessInfo": {}
    };

    // 当前用户通话状态信息
    this.userStatusMgr = {};

    // 当前正在接通的会议，0表示无会议，其余value位会议id
    this.currentGoingConf = 0;

    // 当前订阅的会议
    this.confSubMgr = {};

    // 视频窗口信息
    this.windowInfos = [];

    // 所有通话信息
    this.allCalls = {
        "-1": {
            // 通话状态
            callState: -1,

            // 通话接收时间
            startTime: new Date().getTime(),

            caller: "0",

            callee: "0",

            callType: 0,

            fmt: "0",

            grpid: "0",

            members: null
        }
    };

    // 正在呼叫通话
    this.callingCid = -1;

    // 当前通话状态
    this.currentCallState = this.IDLE;

    this.updateConfInfo = function(data, isSaveAccessInfo) {
        if (isSaveAccessInfo == true) {
            if (_mthis.confMgr["accessInfo"] == undefined) {
                _mthis.confMgr["accessInfo"] = {};
            }
            _mthis.confMgr["accessInfo"][data["confId"]] = data;
        } else {
            _mthis.confMgr[data["value"]["confId"]] = data;
        }
    }

    this.updateUserStatus = function(data) {
        _mthis.userStatusMgr[data["value"]["peerid"]] = data["statusvalue"];
        _mthis.userStatusMgr[data["value"]["isdn"]] = data["statusvalue"];

        // 用于规避问题
        // 当通话被转接或抢话的时候，caller和callee的信息会出错，需要icpsdk来矫正。
        if (cloudICP.util.callStatusMgr.connectingCallMgr[0].length != 0 && data["statusvalue"] == "4022") {
            var cid = cloudICP.util.callStatusMgr.connectingCallMgr[0][cloudICP.util.callStatusMgr.connectingCallMgr[0].length - 1];

            var call = cloudICP.util.callStatusMgr.allCalls[cid];

            if (data["value"]["isdn"] == cloudICP.userInfo["isdn"]) {
                call["callee"] = data["value"]["isdn"];
                call["caller"] = data["value"]["peerid"];
            } else {
                call["callee"] = data["value"]["peerid"];
                call["caller"] = data["value"]["isdn"];
            }
        }
    }

    this.updateCallStatus = function(callType, callState, data, confInfo) {
        var cid = data["value"]["cid"];

        if (callType == _mthis.GROUP) {
            _mthis.groupCallMgr[data["grpid"]] = cid;
            return;
        }

        if (_mthis.allCalls[cid] == undefined) {
            _mthis.allCalls[cid] = {
                callType: callType,
                caller: data["value"]["caller"],
                callee: data["value"]["callee"],
                startTime: new Date().getTime(),
            };

            _mthis.numberOfCall[callType] += 1;
        }

        var call = _mthis.allCalls[cid];

        call["callState"] = callState;

        if (callType == _mthis.VIDEOCONF) {
            call.callType = _mthis.VIDEOCONF;
        } else {
            callType = call.callType;
        }

        if (confInfo) {
            call["confId"] = confInfo["confInternalId"];
        } else if (data["value"] && data["value"]["confInfo"] != undefined) {
            call["confId"] = data["value"]["confInfo"]["confInternalId"];
        }

        switch (callState) {
            case _mthis.RINGING:
                _mthis.callingCid = cid;
                _mthis.currentCallState = _mthis.RINGING;
                break;
            case this.CONNECTING:
                // 对视频能力进行维护
                if (call.callType == _mthis.VIDEOCONF || call.callType == _mthis.VIDEO || call.callType == _mthis.MONITOR || call.callType == _mthis.VIDEODISPATCH) {
                    call["fmt"] = data["value"]["fmt"];

                    switch (data["value"]["fmt"]) {
                        case "0":
                            cloudICP.dispatch.video.currentVideoAbility += 0.5
                            break;
                        case "1":
                            cloudICP.dispatch.video.currentVideoAbility += 0.5
                            break;
                        case "2":
                            cloudICP.dispatch.video.currentVideoAbility += 1
                            break;
                        case "3":
                            cloudICP.dispatch.video.currentVideoAbility += 2
                            break;
                        case "4":
                            cloudICP.dispatch.video.currentVideoAbility += 4
                            break;
                        case "5":
                            cloudICP.dispatch.video.currentVideoAbility += 8
                            break;
                        case "6":
                            cloudICP.dispatch.video.currentVideoAbility += 16
                            break;
                        default:
                            break;
                    }
                }
                _mthis.callingCid = cid;
                _mthis.currentCallState = _mthis.CONNECTING;

                if (!cloudICP.util.includes(_mthis.connectingCallMgr[callType], cid)) {
                    _mthis.connectingCallMgr[callType].push(cid);
                }

                if (call.callType == _mthis.VIDEOCONF || call.callType == _mthis.VOICECONF) {
                    _mthis.currentGoingConf = call["confId"];
                }
                break;
            case _mthis.RELEASE:
                // 对视频能力进行维护
                if (call.callType == _mthis.VIDEOCONF || call.callType == _mthis.VIDEO || call.callType == _mthis.MONITOR || call.callType == _mthis.VIDEODISPATCH) {
                    switch (call["fmt"]) {
                        case "0":
                            cloudICP.dispatch.video.currentVideoAbility -= 0.5
                            break;
                        case "1":
                            cloudICP.dispatch.video.currentVideoAbility -= 0.5
                            break;
                        case "2":
                            cloudICP.dispatch.video.currentVideoAbility -= 1
                            break;
                        case "3":
                            cloudICP.dispatch.video.currentVideoAbility -= 2
                            break;
                        case "4":
                            cloudICP.dispatch.video.currentVideoAbility -= 4
                            break;
                        case "5":
                            cloudICP.dispatch.video.currentVideoAbility -= 8
                            break;
                        case "6":
                            cloudICP.dispatch.video.currentVideoAbility -= 16
                            break;
                        default:
                            break;
                    }
                }
                if (_mthis.callingCid == cid) {
                    _mthis.callingCid = -1;
                    _mthis.currentCallState = _mthis.IDLE;
                }
                _mthis.numberOfCall[callType] -= 1;
                var index = _mthis.connectingCallMgr[callType].indexOf(cid);
                if (index != -1) {
                    _mthis.connectingCallMgr[callType].splice(index, 1);
                }

                if (call.callType == _mthis.VIDEOCONF || call.callType == _mthis.VOICECONF) {
                    if (_mthis.currentGoingConf == call["confId"]) {
                        _mthis.currentGoingConf = 0;
                    }
                }
                break;
            case _mthis.HOLD:
                var index = _mthis.connectingCallMgr[callType].indexOf(cid);
                if (index != -1) {
                    _mthis.connectingCallMgr[callType].splice(index, 1);
                }
                break;
            default:
                break;
        }

        return true;
    };

    this.holdCall = function(cid) {
        var currentCall = _mthis.allCalls[cid];

        // 因为视频监控和视频分发可并发，所以不需要进行自动保持
        if (
            currentCall.callType == _mthis.MONITOR ||
            currentCall.callType == _mthis.VIDEODISPATCH
        ) {
            return false;
        }

        if (currentCall.callType != _mthis.DISCREET &&
            currentCall.callType != _mthis.HALFVOICE &&
            currentCall.callType != _mthis.VIDEO &&
            currentCall.callType != _mthis.VIDEOCONF) {
            if (_mthis.connectingCallMgr[_mthis.VIDEO].length != 0 ||
                _mthis.connectingCallMgr[_mthis.DISCREET].length != 0 ||
                _mthis.connectingCallMgr[_mthis.HALFVOICE].length != 0 ||
                _mthis.connectingCallMgr[_mthis.VIDEOCONF].length != 0) {
                return _mthis.holdHelper(currentCall, cid);
            };
        }

        var toHoldCall;
        var checkArr = [_mthis.VOICE, _mthis.VOICECONF, _mthis.AMBIENCE];
        for (var i = 0; i < checkArr.length; i++) {
            var type = checkArr[i];

            for (var j = 0; j < _mthis.connectingCallMgr[type].length; j++) {
                if (_mthis.connectingCallMgr[type][j] != cid) {
                    toHoldCall = _mthis.allCalls[_mthis.connectingCallMgr[type][j]];

                    var ret = _mthis.holdHelper(toHoldCall, _mthis.connectingCallMgr[type][j]);
                    if (ret == true) {
                        var index = _mthis.connectingCallMgr[type].indexOf(_mthis.connectingCallMgr[type][j]);
                        if (index != -1) {
                            _mthis.connectingCallMgr[type].splice(index, 1);
                        }
                    }

                    return ret;
                }
            }
        }

        return false;
    };

    this.unholdCall = function(cid) {
        var currentCall = this.allCalls[cid];

        if (_mthis.connectingCallMgr[_mthis.VIDEO].length != 0 ||
            _mthis.connectingCallMgr[_mthis.DISCREET].length != 0 ||
            _mthis.connectingCallMgr[_mthis.HALFVOICE].length != 0 ||
            _mthis.connectingCallMgr[_mthis.VIDEOCONF].length != 0) {
            return false;
        };

        var toHoldCall;
        var checkArr = [_mthis.VOICE, _mthis.VOICECONF, _mthis.AMBIENCE];
        for (var i = 0; i < checkArr.length; i++) {
            var type = checkArr[i];

            for (var j = 0; j < _mthis.connectingCallMgr[type].length; j++) {
                if (_mthis.connectingCallMgr[type][j] != cid) {
                    toHoldCall = _mthis.allCalls[_mthis.connectingCallMgr[type][j]];

                    var ret = _mthis.holdHelper(toHoldCall, _mthis.connectingCallMgr[type][j]);
                    if (ret == true) {
                        if (currentCall) {
                            var type = currentCall.callType;
                            _mthis.connectingCallMgr[type].push(cid);
                        }

                        var index = _mthis.connectingCallMgr[type].indexOf(_mthis.connectingCallMgr[type][j]);
                        if (index != -1) {
                            _mthis.connectingCallMgr[type].splice(index, 1);
                        }
                    }

                    return ret;
                }
            }
        }

        return false;
    }

    this.holdHelper = function(call, cid) {
        if (call) {
            if (call["callee"] && call["callee"] == cloudICP.userInfo["isdn"]) {
                if (call.callType != _mthis.VOICECONF) {
                    cloudICP.dispatch.voice.hold({
                        "to": call["caller"],
                        "cid": cid,
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnHoldFailure",
                                    "rsp": data["rsp"],
                                    "value": {
                                        "peerid": "",
                                        "cid": ""
                                    }
                                }

                                cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnHoldFailure"](retEvent);
                            }
                        }
                    });
                } else {
                    cloudICP.dispatch.conf.holdConf({
                        "to": call["caller"],
                        "cid": cid,
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnHoldFailure",
                                    "rsp": data["rsp"],
                                    "value": {
                                        "peerid": "",
                                        "cid": ""
                                    }
                                }

                                cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnHoldFailure"](retEvent);
                            }
                        }
                    });
                }
                return true;
            } else if (call["caller"] && call["caller"] == cloudICP.userInfo["isdn"]) {
                if (call.callType != _mthis.VOICECONF) {
                    cloudICP.dispatch.voice.hold({
                        "to": call["callee"],
                        "cid": cid,
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnHoldFailure",
                                    "rsp": data["rsp"],
                                    "value": {
                                        "peerid": "",
                                        "cid": ""
                                    }
                                }

                                cloudICP.dispatch.event.EVENT_LIST["VoiceNotify"]["OnHoldFailure"](retEvent);
                            }
                        }
                    });
                } else {
                    cloudICP.dispatch.conf.holdConf({
                        "to": call["callee"],
                        "cid": cid,
                        "callback": function(data) {
                            if (data["rsp"] != "0") {
                                var retEvent = {
                                    "eventName": "OnHoldConfFailure",
                                    "rsp": data["rsp"],
                                    "value": {
                                        "confCode": "",
                                        "cid": ""
                                    }
                                }

                                cloudICP.dispatch.event.EVENT_LIST["PhoneConfNotify"]["OnHoldConfFailure"](retEvent);
                            }
                        }
                    });
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // 确认是否有无法并发的通话存在
    this.isAnyCallExisted = function() {
        return (_mthis.connectingCallMgr[_mthis.VIDEO].length != 0 ||
            _mthis.connectingCallMgr[_mthis.DISCREET].length != 0 ||
            _mthis.connectingCallMgr[_mthis.HALFVOICE].length != 0 ||
            _mthis.connectingCallMgr[_mthis.VOICE].length != 0 ||
            _mthis.connectingCallMgr[_mthis.AMBIENCE].length != 0 ||
            _mthis.connectingCallMgr[_mthis.VOICECONF].length != 0 ||
            _mthis.connectingCallMgr[_mthis.VIDEOCONF].length != 0)
    }

    this.cleanUp = function() {
        _mthis.currentGoingConf = 0;
        _mthis.currentCallState = _mthis.IDLE;
        _mthis.callingCid = -1;
        _mthis.allCalls = {};


        _mthis.numberOfCall = [
            0, // voice
            0, // video
            0, // halfvoice
            0, // discreet
            0, // monitor
            0, // videodispatch
            0, // ambience
            0, // voiceconf
            0, // videoconf
        ];

        _mthis.connectingCallMgr = [
            [], // voice
            [], // video
            [], // halfvoice
            [], // discreet
            [], // monitor
            [], // videodispatch
            [], // ambience
            [], // voiceconf
            [], // videoconf
        ];

        _mthis.videoMediaInfoBuf = {

        }

        _mthis.holdMgr = [];

        _mthis.groupCallMgr = {};

        _mthis.confMgr = {};

        _mthis.userStatusMgr = {}
    }
};

function SENSITIVE_INFOS() {
    //敏感信息关键字,false表示部分保留，true便是全去敏
    this.infos = [
        ["isdn", false], //成员号
        ["seq", false], //序列号
        ["session", true],
        ["user", false],
        ["localIP", false], //本地ip和端口
        ["serverIP", false], //服务器ip和端口
        ["remoteIP", false], //服务器ip和端口
        ["password", true], //密码
        ["serverip", false], //服务器ip和端口
        ["ssotoken", true], //ssotoken
        ["ipccserveripport", true], //服务器ip和端口
        //语音状态通知
        ["callee", false], //主叫号
        ["caller", false], //被叫号
        ["targeter", false], //转接方
        ["transfer", false], //被转接方
        ["local", false], //本地ip和端口
        ["server", false], //服务器ip和端口
        //视频状态通知
        ["from", false], //主叫号
        ["to", false], //被叫号
        ["local_audio", false], //本地语音ip和端口
        ["local_video", false], //本地视频ip和端口
        ["server_audio", false], //服务器语音ip和端口
        ["server_video", false], //服务器视频ip和端口
        //群组配置更新通知
        ["departmentid", false], //部门id
        ["group", false], //群组号
        ["name", false], //群组名
        ["setupdcid", false], //创建者用户号
        ["rid", false], //接收方用户号，0：表示广播
        ["dcpatchindex", false], //派接组序列号
        ["grpnumber", false], //群组号
        ["pgname", false], //群组名
        ["groupnumber", false], //群组号
        ["membergroup", false], //成员群组号
        ["vpnid", false], //vpn号
        //短彩信更新通知
        ["content", true], //消息内容
        ["emerg_groupid", false], //紧急状态的群组ID
        ["emerg_ueid", false], //紧急状态的终端ID
        ["groupid", false], //群组号
        ["attach", false], //彩信附件地址
        //GIS状态通知
        ["cellname", false], //终端名称
        ["location", false], //位置信息
        ["cellid", false],

        //资源状态通知
        ["speaker", false], //组呼状态通知，发言人
        ["attaching", false], //注册状态通知,用户当前加入的组号
        ["peerid", false],
        ["speakid", false],
        ["resid", false],
        ["memberid", false],
        ["localip", false],
        ["newip", false],
        //创建会议通知
        ["passcode", true], //密码
        ["ObhId", false],
        ["SpeakerId", false],
        //音视频会议通知
        ["Number", false], //成员号码
        ["Name", false], //成员名称
        ["number", false],
        ["owner", false], //上墙发起者名称
        ["termName", false], //终端名称
    ];

    /**
     * 处理敏感信息
     */
    this.moveSensitiveInfo = function(data) {
        var strReturn = ('' + data).slice(0);
        for (var i = 0; i < this.infos.length; i++) {
            var targetInfo = this.infos[i][0];
            var isSecret = this.infos[i][1];
            var patternStr = '"' + targetInfo + '[\\\\"]"?.?:.?[\\\\"]?"?([\\w\\.]*?)[\\\\"]?"?[,}]';
            var parten = new RegExp(patternStr);
            var resArr = strReturn.match(parten);
            for (var it in resArr) {
                var strReplace = resArr[it];
                var reg = /:.*?([\w\.]+).*?[,}]/;
                var texts = reg.exec(strReplace);
                if (!texts) {
                    break;
                }
                var text = "";
                if (!isSecret) {
                    text = '****' + texts[1].charAt(texts[1].length - 1);
                } else {
                    text = '*****';
                }
                var strRes = strReplace.replace(texts[1], text);
                strReturn = strReturn.replace(strReplace, strRes);
            }
        }
        return strReturn;
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}
if (window) window.ICPSDK = ICPSDK;