/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};

    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {

        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId])
        /******/ 			return installedModules[moduleId].exports;

        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			exports: {},
            /******/ 			id: moduleId,
            /******/ 			loaded: false
            /******/ 		};

        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ 		// Flag the module as loaded
        /******/ 		module.loaded = true;

        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
/************************************************************************/
/******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

        var log4js = __webpack_require__(1);
        var AnyChatSDKConstant = __webpack_require__(2);
        var AnyChatSDKEventTarget = __webpack_require__(3);
        var AnyChatSDKUserHandler = __webpack_require__(4);
        var AnyChatSDKQueueHandler = __webpack_require__(7);
        var AnyChatSDKEventDispatcher = __webpack_require__(8);
        var AnyChatSDKAudioHandler = __webpack_require__(13);
        var AnyChatSDKVideoHandler = __webpack_require__(14);
        var AnyChatSDKDualRecordHandler = __webpack_require__(15);
        var AnyChatSDKRecordHandler = __webpack_require__(16);
        var AnyChatSDKFileHandler = __webpack_require__(9);
        var AnyChatSDKVideoCallHandler = __webpack_require__(10);
        var AnyChatSDKAreaHandler = __webpack_require__(6);
        var AnyChatSDKErrorCode = __webpack_require__(5);
        var AnyChatSDKSettingHandler = __webpack_require__(17);
        var AnyChatSDKFriendHandler = __webpack_require__(11);
        var AnyChatSDKStreamPlayHandler = __webpack_require__(12);
        var AnyChatSDKAI =__webpack_require__(18);
        var AnyChatSDKAIManagement =__webpack_require__(19);
        var AnyChatWhiteBoard =__webpack_require__(20);
        // var AnyChatDetachableService = __webpack_require__(21)
        var logger = log4js.getLogger("main");



        var info = {}; // 保存信息

        var getIntUserId = AnyChatSDKUserHandler.getIntUserId;
        var getStrUserId = AnyChatSDKUserHandler.getStrUserId;

        /*--------------------------------------------------------
	 * AnyChatSDKInstance
	 * AnyChat SDK实例，全局唯一
	 *
	 * -------------------------------------------------------
	 */
        function AnyChatSDKInstance() {
            this.anychat = null; // AnyChat插件DOM对象
            this.eventTarget = AnyChatSDKEventTarget.instance;
            this.isInitDone = false;
            this.curConnectStatus = AnyChatSDKConstant.instance.ConnectStatus.INIT;
            this.disconnectResultCode = 0;
            this.eventDispatcher = AnyChatSDKEventDispatcher.instance;
            this.constant = AnyChatSDKConstant.instance;
            this.strUserId = info.strUserId;

            this.bSupportStreamRecordCtrlEx = false; // 是否支持录像扩展API接口
            this.bSupportObjectBusiness = false; // 是否支持业务对象API接口
            this.bSupportMultiStream = false; // 是否支持多路流（多摄像头）API接口
            this.bSupportScriptObject = false; // 是否支持JavaScript对象
            this.bSupportCluster = false; // 是否支持集群系统

            this.isCluster = 0; //判断是否用集群或云平台登录
            //创建的机器人管理类
            this.AnyChatAIManagement=null;
            this.AnyChatWhiteBoard = null;
        }

        //初始化AnyChat SDK DOM对象
        AnyChatSDKInstance.prototype.init = function(apilevel) {

            var errorcode = BRAC_InitSDK("0");
            logger.invokeLog("init", errorcode);
            var that = this;
            setTimeout(function(){
                if (errorcode === 0) {
                    that.eventDispatcher.callbackinit(that, anychat);
                    that.isInitDone = true;
                    if (info.logSavepath) {
                        var logObj = {};
                        logObj.logSavepath = info.logSavepath;
                        logObj.logFileRule = info.logFileRule;
                        setLogSavePath(logObj);
                    }
                    that.curConnectStatus = that.constant.ConnectStatus.INITIALIZED;
                    that.anychat = anychat;
                    if(info.hasOwnProperty("appId") && info.appId != "") {
                        BRAC_SetSDKOption(BRAC_SO_CLOUD_APPGUID, info.appId);
                    }
                    var connectCode = BRAC_Connect(info.serverIp, info.serverPort);
                    // H5模式下，不可以这样一起调用，Login要写在Connect的回调里
                    if (connectCode == 0) {
                        that.login();
                    }

                    if (bSupportScriptObject)
                        that.eventDispatcher.h5On(that, anychat);
                    if (info.openNativeScreenCamera == 1) {
                        //打开虚拟桌面摄像头
                        BRAC_SetSDKOption(BRAC_SO_CORESDK_SCREENCAMERACTRL, 1);
                    }
                } else {
                    that.eventTarget.fireEvent({
                        type: "onDisConnect",
                        result: {
                            code: errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(errorcode)
                        }
                    });
                }
            },10)
        };

        //断开连接
        AnyChatSDKInstance.prototype.disConnect = function() {
            //logger.debug("AnyChatSDKInstance disconnect...");

            var errorCode = BRAC_Logout();
            if (errorCode == 0) {
                errorCode = 101;
                var errorMsg = AnyChatSDKErrorCode.checkErrorMsg(errorCode);
            }
            var result = {
                errorCode: errorCode,
                msg: errorMsg
            };
            instance.eventTarget.fireEvent({
                type: "onDisConnect",
                result: result
            });
            logger.invokeLog("disConnect", errorCode);
        };

        //用户登录
        AnyChatSDKInstance.prototype.login = function() {
            var userLoginObj = {
                nickName: info.nickName,
                userId: info.userId,
                strUserId: info.strUserId,
                password: info.password,
                appId: info.appId,
                timeStamp: info.timeStamp,
                signData: info.sign
            };
            var errorCode = AnyChatSDKUserHandler.instance.login(userLoginObj);
            var userLoginObj2 = JSON.parse(JSON.stringify(userLoginObj));
            delete userLoginObj2.password;
            logger.invokeLog("login", errorCode, userLoginObj2);
            return errorCode;
        };

        //用户退出
        AnyChatSDKInstance.prototype.logout = function() {
            var errorCode = AnyChatSDKUserHandler.instance.logout(this);
            // if (errorCode == 0) {
            info = {};
            AnyChatSDKAreaHandler.instance.areaIdArray = [];
            AnyChatSDKAreaHandler.instance.areaIdIndex = 0;
            AnyChatSDKUserHandler.instance.userType = -1;
            if(!bSupportScriptObject/*  && getBrowser()!="IE" */){
                // BRAC_Release();
                var _anychatSDKDiv = BRAC_GetDmoObject("AnyChatSDKPluginDiv");
                if (_anychatSDKDiv) {
                    if (getBrowserInfo() == "IE") {
                        var eles = document.getElementsByTagName('script');
                        for(var i = 0; i < eles.length ; i++){
                            var ele = eles[i];
                            if(ele.getAttribute('for') == 'AnyChatSDKPlugin'){
                                ele.parentNode.removeChild(ele);
                                i--;
                            }
                        }
                        _anychatSDKDiv.parentNode.removeChild(_anychatSDKDiv);
                        _anychatSDKDiv = null;
                        anychat = null;
                        AnyChatWebSDK.anychatSDKInstance.anychat = null;
                        var objectPlugins = document.getElementsByTagName("object");
                        while (objectPlugins.length > 0 &&
                        objectPlugins[0].classid == "clsid:B685A393-905F-45B5-B26E-FF199EEE2FD7") {
                            objectPlugins[0].parentNode.removeChild(objectPlugins[0]);
                        }
                        setTimeout(CollectGarbage, 1);
                        return;
                    }
                    document.body.removeChild(_anychatSDKDiv);
                }
            }
            AnyChatSDKEventTarget.instance.removeAll();
            AnyChatWebSDK.anychatSDKInstance = null;
            if (getBrowser() == "IE") {
                AnyChatWebSDK.anychatSDKInstance.anychat = null;
                setTimeout(CollectGarbage(),1) ;
            }
            logger.invokeLog("logout", errorCode);
            return errorCode;
        };

        //用户进入房间
        AnyChatSDKInstance.prototype.enterRoom = function(roomObj) {
            //logger.debug("AnyChatSDKInstance enterRoom...");
            if (!roomObj.roomId) return false;
            info.roomId = roomObj.roomId;
            (typeof(roomObj.done) === "function") && this.setCallBack("OnAnyChatEnterRoom", roomObj.done, true);
            var errorCode = AnyChatSDKUserHandler.instance.enterRoom(roomObj);
            logger.invokeLog("enterRoom", errorCode, { roomId: roomObj.roomId });
        };

        //获取房间中的用户列表
        AnyChatSDKInstance.prototype.getRoomUsers = function() {
            //logger.debug("AnyChatSDKInstance getRoomUsers...");
            logger.invokeLog("getRoomUsers");
            var list = AnyChatSDKUserHandler.instance.getRoomUsers();
            // list.userList = list.userList.map(getStrUserId);
            return list;
        };

        //用户退出房间
        AnyChatSDKInstance.prototype.leaveRoom = function() {
            //logger.debug("AnyChatSDKInstance leaveRoom...");
            // (typeof(roomObj.done) === "function") && this.setCallBack("onAnyChatLeaveRoom", roomObj.done, true);
            var errorCode = AnyChatSDKUserHandler.instance.leaveRoom(this);
            logger.invokeLog("leaveRoom", errorCode);
            return errorCode;
        };

        //发送文本消息
        AnyChatSDKInstance.prototype.sendMsg = function(opt) {
            //logger.debug("AnyChatSDKInstance sendMsg...");
            if (opt.targetUsers)
                opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var errorCode = AnyChatSDKUserHandler.instance.sendMsg(opt);
            logger.invokeLog("sendMsg", errorCode, opt);
        };

        //发送透明通道消息
        AnyChatSDKInstance.prototype.transBuffer = function(opt) {
            //logger.debug("AnyChatSDKInstance TransBuffer...");
            if (opt.targetUsers) {
                opt.targetUsers = opt.targetUsers.map(getIntUserId);
            }
            (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone", opt.done, true);
            var taskId = AnyChatSDKUserHandler.instance.transBuffer(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("TransBuffer", errorCode, params);
        };

        //发送透明通道消息(扩展)
        AnyChatSDKInstance.prototype.transBufferEx = function(opt) {
            //logger.debug("AnyChatSDKInstance TransBuffer...");
            if (opt.targetUsers) {
                opt.targetUsers = opt.targetUsers.map(getIntUserId);
            }
            (typeof(opt.done) === "function") && this.setCallBack("onTransBufferDone", opt.done, true);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("TransBuffer", errorCode, params);
        };

        //获取本地麦克风对象列表
        AnyChatSDKInstance.prototype.getMicrophones = function() {
            //logger.debug("getMicrophoneList...");
            logger.invokeLog("getMicrophoneList");
            var microDevices = [];
            microDevices = BRAC_EnumDevices(BRAC_DEVICE_AUDIOCAPTURE);
            if(bSupportScriptObject && microDevices.length == 0) {
                microDevices.push("1-Virtual Microphone");
            }
            var mDeviceObj = [];
            for (var i = 0; i < microDevices.length; i++) {
                mDeviceObj.push(new AnyChatSDKAudioHandler.instance(microDevices[i]));
            }
            return mDeviceObj;
        };

        //获取本地扬声器对象列表
        AnyChatSDKInstance.prototype.getSpeaks = function() {
            logger.invokeLog("getSpeakList");
            var microDevices = BRAC_EnumDevices(BRAC_DEVICE_AUDIOPLAYBACK);
            var mDeviceObj = [];
            for (var i = 0; i < microDevices.length; i++) {
                mDeviceObj.push(new AnyChatSDKAudioHandler.instance(microDevices[i]));
            }
            return mDeviceObj;
        };

        //获取摄像头设备对象
        AnyChatSDKInstance.prototype.getCameras = function() {
            //logger.debug("getCameraList...");
            logger.invokeLog("getCameraList");
            var mDevices = [];
            mDevices = BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE);
            if(bSupportScriptObject && mDevices.length == 0){
                mDevices.push("1-Virtual Camera");
            }
            var mDeviceObj = [];
            for (var i = 0; i < mDevices.length; i++) {
                var deviceIndex = "";
                if (bSupportScriptObject)
                    deviceIndex = (parseInt(i+1)) + "-";
                mDeviceObj.push(new AnyChatSDKVideoHandler.instance(deviceIndex + mDevices[i]));
            }
            return mDeviceObj;
        };

        //接收对方音频流
        AnyChatSDKInstance.prototype.getRemoteAudioStream = function(opt) {
            //logger.debug("getRemoteAudioStream,id:" + opt.remoteUserId);
            var errorCode = AnyChatSDKAudioHandler.openAudio(getIntUserId(opt.remoteUserId));
            logger.invokeLog("getRemoteAudioStream", errorCode, opt);
            return errorCode;
        };

        //终止对方音频流
        AnyChatSDKInstance.prototype.cancelRemoteAudioStream = function(opt) {
            var errorCode = AnyChatSDKAudioHandler.closeAudio(getIntUserId(opt.remoteUserId));
            logger.invokeLog("cancelRemoteAudioStream", errorCode, opt);
            return errorCode;
        };

        //接收对方视频流
        AnyChatSDKInstance.prototype.getRemoteVideoStream = function(opt) {
            var params = {
                userId: getIntUserId(opt.remoteUserId),
                deviceName: "",
                demoId: opt.renderId
            };
            if (opt.hasOwnProperty("streamIndex")) {
                params.streamIndex = opt.streamIndex;
            }
            var errorCode = AnyChatSDKVideoHandler.openVideo(params);
            logger.invokeLog("getRemoteVideoStream", errorCode, opt);
            return errorCode;
        };

        //终止对方视频流
        AnyChatSDKInstance.prototype.cancelRemoteVideoStream = function(opt) {
            var params = {
                userId: getIntUserId(opt.remoteUserId)
            };
            if (opt.hasOwnProperty("streamIndex")) {
                params.streamIndex = opt.streamIndex;
            }
            var errorCode = AnyChatSDKVideoHandler.closeVideo(params);
            logger.invokeLog("cancelRemoteVideoStream", errorCode, opt);
            return errorCode;
        };

        //开始录像
        AnyChatSDKInstance.prototype.startRecord = function(opt) {
            (typeof(opt.done) === "function") && this.setCallBack("onRecordDone", opt.done, true);
            (typeof(opt.OnRecordStatus) === "function") && this.setCallBack("OnRecordStatusDone", opt.OnRecordStatus, false);
            var errorCode = AnyChatSDKRecordHandler.instance.start(opt);
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("startRecord", errorCode, params);
        };

        //更新录像参数
        AnyChatSDKInstance.prototype.updateRecordParam = function(opt) {
            logger.invokeLog("updateRecordParam");
            return AnyChatSDKRecordHandler.instance.updateRecordParam(opt);
        };

        //结束录像
        AnyChatSDKInstance.prototype.stopRecord = function() {
            var errorCode = AnyChatSDKRecordHandler.instance.stop();
            logger.invokeLog("stopRecord", errorCode);
        };

        //取消录像
        AnyChatSDKInstance.prototype.cancelRecord = function () {
            var errorCode = AnyChatSDKRecordHandler.instance.cancel();
            logger.invokeLog("cancelRecord", errorCode);
        };
        //给录像文件打标签
        AnyChatSDKInstance.prototype.recordTag=function(opt){
            var errorCode = AnyChatSDKRecordHandler.instance.recordtag(opt);
            logger.invokeLog("recordTag", errorCode);
        }

        //在录像中插入图片
        AnyChatSDKInstance.prototype.insertFileDuringRecord = function(opt) {
            var errorCode = AnyChatSDKRecordHandler.instance.insertFile(opt);
            logger.invokeLog("insertFileDuringRecord", errorCode);
        };

        //拍照
        AnyChatSDKInstance.prototype.takeSnapShot = function(opt) {
            (typeof(opt.done) === "function") && this.setCallBack("onSnapshotDone", opt.done, true);
            var errorCode = AnyChatSDKRecordHandler.instance.snapshot(opt);
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("takeSnapShot", errorCode, params);
            return errorCode;
        };

        //文件上传对象
        AnyChatSDKInstance.prototype.createFileUploadTask = function(opt) {
            logger.invokeLog("createFileUploadTask");
            opt.action = "upload";
            var taskObj = new AnyChatSDKFileHandler.instance(opt);
            (typeof(opt.done) === "function") && this.setCallBack(taskObj.guid, opt.done, true);
            (typeof(opt.onTaskStatusChanged) === "function") && this.setCallBack("onTaskStatusChanged", opt.onTaskStatusChanged, false);
            return taskObj;
        };

        //文件发送对象
        AnyChatSDKInstance.prototype.createFileTransferTask = function(opt) {
            logger.invokeLog("createFileTransferTask");
            opt.action = "upload";
            opt.userId = getIntUserId(opt.userId);
            var taskObj = new AnyChatSDKFileHandler.instance(opt);
            (typeof(opt.done) === "function") && this.setCallBack("onFileTransferDone", opt.done, true);
            (typeof(opt.onTaskStatusChanged) === "function") && this.setCallBack("onTaskStatusChanged", opt.onTaskStatusChanged, false);
            return taskObj;
        };

        //文件下载对象
        AnyChatSDKInstance.prototype.createFileDownloadTask = function(opt) {
            logger.invokeLog("createFileDownloadTask");
            opt.action = "download";
            var taskObj = new AnyChatSDKFileHandler.instance(opt);
            (typeof(opt.done) === "function") && this.setCallBack(opt.fileid, opt.done, true);
            (typeof(opt.onDownloadTaskStatusChanged) === "function") && this.setCallBack("onDownloadTaskStatusChanged", opt.onDownloadTaskStatusChanged, false);
            taskObj.downloadInit();
            return taskObj;
        };

        //呼叫目标用户
        AnyChatSDKInstance.prototype.requestVideoCall = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.request(opt);
            (typeof(opt.done) === "function") && this.setCallBack("onRequestVideoCallDone", opt.done, true);
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("requestVideoCall", errorCode, params);
        };

        //接受呼叫请求
        AnyChatSDKInstance.prototype.acceptVideoCall = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.accept(opt);
            logger.invokeLog("acceptVideoCall", errorCode, opt);
        };

        //拒绝视频呼叫请求
        AnyChatSDKInstance.prototype.rejectVideoCall = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.reject(opt);
            logger.invokeLog("rejectVideoCall", errorCode, opt);
        };

        //挂断视频通话
        AnyChatSDKInstance.prototype.hangupVideoCall = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.hangup(opt);
            logger.invokeLog("hangupVideoCall", errorCode, opt);
        };

        //取消视频呼叫
        AnyChatSDKInstance.prototype.cancelVideoCall = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.cancel(opt);
            logger.invokeLog("cancelVideoCall", errorCode, opt);
        };

        //获取系统配置的营业厅列表
        AnyChatSDKInstance.prototype.getAreas = function(opt) {
            var errorCode = AnyChatSDKAreaHandler.instance.getAreas(opt);
            (typeof(opt.done) === "function") && this.setCallBack("onSyncAreasDone", opt.done, true);
            logger.invokeLog("getAreas", errorCode);
        };

        //进入营业厅
        AnyChatSDKInstance.prototype.enterArea = function(opt) {
            var errorCode = AnyChatSDKAreaHandler.instance.inArea(this, opt);
            (typeof(opt.done) === "function") && this.setCallBack("onEnterAreaDone", opt.done, true);
            var params = JSON.parse(JSON.stringify(opt));
            (typeof(params.done) === "function") && delete params.done;
            logger.invokeLog("enterArea", errorCode, params);
        };

        //离开营业厅
        AnyChatSDKInstance.prototype.leaveArea = function(opt) {
            var errorCode = AnyChatSDKAreaHandler.instance.outArea(this);
            (typeof(opt.done) === "function") && this.setCallBack("onLeaveAreaDone", opt.done, true);
            logger.invokeLog("leaveArea", errorCode);
        };

        //进入队列
        AnyChatSDKInstance.prototype.enqueue = function(opt) {
            var errorCode = AnyChatSDKQueueHandler.instance.inQueue(this, opt);
            (typeof(opt.done) === "function") && this.setCallBack("onEnqueueDone", opt.done, true);
            // (typeof (opt.onQueueTimeout) === "function") && this.setCallBack("onQueueTimeout", opt.onQueueTimeout, true);
            (typeof(opt.onProcessChanged) === "function") && this.setCallBack("onProcessChanged", opt.onProcessChanged, false);
            logger.invokeLog("enqueue", errorCode, { queueId: opt.queueId });
        };

        //离开队列
        AnyChatSDKInstance.prototype.cancelQueuing = function(opt) {
            var errorCode = AnyChatSDKQueueHandler.instance.outQueue(this);
            (typeof(opt.done) === "function") && this.setCallBack("onCancelQueuingDone", opt.done, true);
            logger.invokeLog("cancelQueuing", errorCode);
        };

        //坐席服务控制
        AnyChatSDKInstance.prototype.agentServiceCtrl = function(opt) {
            var errorCode = AnyChatSDKAreaHandler.instance.agentServiceCtrl(this, opt);
            (typeof(opt.done) === "function") && this.setCallBack("onServiceCtrlDone", opt.done, true);
            (typeof(opt.onAgentStatusChanged) === "function") && this.setCallBack("onAgentStatusChanged", opt.onAgentStatusChanged, false);
            (typeof(opt.onAgentServiceInfoNotify) === "function") && this.setCallBack("onAgentServiceInfoNotify", opt.onAgentServiceInfoNotify, false);
            logger.invokeLog("agentServiceCtrl", errorCode, { ctrlCode: opt.ctrlCode });
        };

        //主动查询坐席服务状态数据
        AnyChatSDKInstance.prototype.getAgentStatus = function() {
            var data = AnyChatSDKAreaHandler.instance.getAgentStatus(this);
            if (data) var errorCode = 0;
            logger.invokeLog("getAgentStatus", errorCode);
            return data;
        };

        //查询排队时长
        AnyChatSDKInstance.prototype.getQueueTime = function(opt) {
            var second = AnyChatSDKQueueHandler.instance.getQueueTime(opt);
            return second;
        };

        //查询队列排队人数
        AnyChatSDKInstance.prototype.getQueueLength = function(opt) {
            var length = AnyChatSDKQueueHandler.instance.getQueueLength(opt);
            return length;
        };

        //查询排队的位置
        AnyChatSDKInstance.prototype.getQueuePos = function(opt) {
            var pos = AnyChatSDKQueueHandler.instance.getQueuePos(opt);
            return pos;
        };

        //查询队列排队用户的详细信息
        AnyChatSDKInstance.prototype.getQueueUserInfo = function(opt) {
            var userList = AnyChatSDKQueueHandler.instance.getQueueUserInfo(opt);
            return userList;
        };

        //查询服务区域内排队的用户数
        AnyChatSDKInstance.prototype.getAreaQueueUserCount = function(opt) {
            var count = AnyChatSDKAreaHandler.instance.getAreaQueueUserCount(opt);
            return count;
        };

        //请求桌面共享
        AnyChatSDKInstance.prototype.requestShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "requestShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("requestShareDesktop", errorCode, opt);
        };

        //取消请求桌面共享
        AnyChatSDKInstance.prototype.cancelRequestShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "cancelRequestShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("cancelRequestShareDesktop", errorCode, opt);
        };

        //同意桌面共享
        AnyChatSDKInstance.prototype.acceptShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "acceptShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId,
                streamIndex: opt.streamIndex
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("acceptShareDesktop", errorCode, opt);
        };

        //拒绝桌面共享
        AnyChatSDKInstance.prototype.rejectShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "rejectShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("rejectShareDesktop", errorCode, opt);
        };

        //中断对方的桌面共享
        AnyChatSDKInstance.prototype.cancelShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "cancelShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("cancelShareDesktop", errorCode, opt);
        };

        //关闭自己的桌面共享
        AnyChatSDKInstance.prototype.closeShareDesktop = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "closeShareDesktop",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("closeShareDesktop", errorCode, opt);
        };

        //请求远程协助
        AnyChatSDKInstance.prototype.requestRemoteControl = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "requestRemoteControl",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("requestRemoteControl", errorCode, opt);
        };

        //取消请求远程协助
        AnyChatSDKInstance.prototype.cancelRequestRemoteControl = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "cancelRequestRemoteControl",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("requestRemoteControl", errorCode, opt);
        };

        //同意远程协助
        AnyChatSDKInstance.prototype.acceptRemoteControl = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "acceptRemoteControl",
                srcUserId: AnyChatSDKUserHandler.instance.userId,
                streamIndex: opt.streamIndex
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("acceptRemoteControl", errorCode, opt);
        };

        //拒绝远程协助
        AnyChatSDKInstance.prototype.rejectRemoteControl = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "rejectRemoteControl",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            var taskId = AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("rejectRemoteControl", errorCode, opt);
        };

        //结束远程协助
        AnyChatSDKInstance.prototype.finishRemoteControl = function(opt) {
            var jsonObj = {
                level: "BRAC",
                action: "finishRemoteControl",
                srcUserId: AnyChatSDKUserHandler.instance.userId
            };
            opt.msg = JSON.stringify(jsonObj);
            opt.targetUsers = opt.targetUsers.map(getIntUserId);
            AnyChatSDKUserHandler.instance.transBufferEx(opt);
            var taskId = AnyChatSDKVideoCallHandler.instance.finishRemoteControl(opt);
            var errorCode = taskId > 0 ? 0 : -1;
            logger.invokeLog("finishRemoteControl", errorCode, opt);
        };

        //打开远程协助
        AnyChatSDKInstance.prototype.openRemoteControl = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var errorCode = AnyChatSDKVideoCallHandler.instance.openRemoteControl(opt);
            logger.invokeLog("openRemoteControl", errorCode, opt);
        };

        //设置SDK参数
        AnyChatSDKInstance.prototype.setSDKOption = function(opt) {
            AnyChatSDKSettingHandler.instance.setSDKOption(opt);
        };

        //获取SDK参数
        AnyChatSDKInstance.prototype.getSDKOptionInt = function(infoName) {
            return AnyChatSDKSettingHandler.instance.getSDKOptionInt(infoName);
        };
        AnyChatSDKInstance.prototype.getSDKOptionString = function(infoName) {
            return AnyChatSDKSettingHandler.instance.getSDKOptionString(infoName);
        };

        //查询用户多媒体流参数
        AnyChatSDKInstance.prototype.getStreamInfo = function(opt) {
            var data = AnyChatSDKVideoHandler.getUserStreamInfo(opt);
            return data;
        };

        //查询插件版本
        AnyChatSDKInstance.prototype.getVersionInfo = function() {
            return AnyChatSDKSettingHandler.instance.getVersionInfo();
        };

        //查询指定用户相关状态
        AnyChatSDKInstance.prototype.getUserState = function(opt) {
            opt.userId = getIntUserId(opt.userId);
            var data = AnyChatSDKSettingHandler.instance.getState(opt);
            return data;
        };

        //设置屏幕旋转
        AnyChatSDKInstance.prototype.setRotation = function(opt) {
            AnyChatSDKSettingHandler.instance.setRotation(opt);
        };


        AnyChatSDKInstance.prototype.setCallBack = function(type, callback, isDoneEvent) {
            this.eventTarget.addEvent(type, callback, isDoneEvent);
        };

        //动态注册回调事件
        AnyChatSDKInstance.prototype.callbackFunctionRegister = function(option) {
            if (typeof option === "object") {
                var keys = [];
                for (var p in option) {
                    if (option.hasOwnProperty(p) && typeof(option[p]) === "function")
                        keys.push(p);
                }
                for (var p in keys) {
                    var key = keys[p];
                    this.setCallBack(key, option[key], false);
                }
            }
        };

        //动态销毁回调事件
        AnyChatSDKInstance.prototype.callbackFunctionDestroy = function(option) {
            if (typeof option === "object") {
                for (var p in option) {
                    if (option.hasOwnProperty(p) && typeof(option[p]) === "function")
                        this.eventTarget.removeEvent({
                            type: p
                        });
                }
            }
        };

        AnyChatSDKInstance.prototype.getInitDone = function() {
            return this.isInitDone;
        };

        AnyChatSDKInstance.prototype.turnPathToUrl = function(opt) {
            var url = BRAC_GetSDKOptionStringEx(BRAC_SO_LOCALPATH2URL, opt.path, 0);
            return url;
        };

        AnyChatSDKInstance.prototype.getAgentCount = function(opt) {
            var data = {};
            data.allAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, opt.areaId, ANYCHAT_AREA_INFO_AGENTCOUNT);
            data.idleAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, opt.areaId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);
            return data;
        };

        AnyChatSDKInstance.prototype.getIntUserId = function(strUserId) {
            return AnyChatSDKUserHandler.getIntUserId(strUserId);
        };

        AnyChatSDKInstance.prototype.getUserName = function(opt) {
            // var userName = "";
            var userName = BRAC_GetUserName(opt.userId);
            if(userName == ""){
                userName = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_NAMEBYUSERID, opt.userId);
                if(userName == ""){
                    userName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, opt.userId, ANYCHAT_OBJECT_INFO_NAME);
                }
            }

            return userName;
        };

        AnyChatSDKInstance.prototype.getUserInfos = function(opt) {
            var useridlist = {},opt = opt || '';
            if((typeof opt == 'object')&&opt.constructor == Array){
                useridlist.useridlist = opt;
            }else if((typeof opt == 'string')&&opt.constructor == String){
                useridlist.userstrid = opt;
            }else if((typeof opt=='number')&&opt.constructor==Number){
                useridlist.userid = opt;
            };
            var userDatas = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERINFOBYID, JSON.stringify(useridlist));
            return userDatas;
        };

        AnyChatSDKInstance.prototype.getUserFriends = function() {
            return AnyChatSDKFriendHandler.instance.getUserFriends();
        };

        AnyChatSDKInstance.prototype.getFriendInfo = function(opt) {
            return AnyChatSDKFriendHandler.instance.getFriendInfo(opt);
        };

        AnyChatSDKInstance.prototype.getFriendNickName = function(opt) {
            return AnyChatSDKFriendHandler.instance.getFriendNickName(opt);
        };

        AnyChatSDKInstance.prototype.getFriendIP = function(opt) {
            return AnyChatSDKFriendHandler.instance.getFriendIP(opt);
        };

        AnyChatSDKInstance.prototype.selectVideoCapture = function(opt) {
            BRAC_SelectVideoCapture(BRAC_DEVICE_VIDEOCAPTURE, opt.deviceName);
        };

        // 获取GUID字符串
        AnyChatSDKInstance.prototype.createGuid = function(){
            return BRAC_NewGuid();
        };

        // 设置虚拟背景
        AnyChatSDKInstance.prototype.setVirtualBgImg = function(opt){
            return AnyChatSDKSettingHandler.instance.setVirtualBkImg(opt);
        };

        // 获取媒体播放对象
        AnyChatSDKInstance.prototype.createStreamPlay = function(opt){
            logger.invokeLog("createStreamPlay");
            var spObj = new AnyChatSDKStreamPlayHandler.instance(opt);

            (typeof (opt.onStop) === "function") && this.setCallBack("onStreamPlayStop", opt.onStop, false);
            (typeof (opt.onPlay) === "function") && this.setCallBack("onStreamPlayStart", opt.onPlay, false);
            spObj.initStreamPlay();
            return spObj;
        };

        // 文件删除
        AnyChatSDKInstance.prototype.deleteFile = function(opt){
            var errorCode =  AnyChatSDKFileHandler.deleteFile(opt);
            logger.invokeLog("deleteFile", errorCode, opt);
            return errorCode;
        };

        // 文件加密
        AnyChatSDKInstance.prototype.encryptFile = function(opt){
            var errorCode = AnyChatSDKFileHandler.encryptFile(opt);
            logger.invokeLog("encryptFile", errorCode, opt);
            return errorCode;
        };

        // 文件解密
        AnyChatSDKInstance.prototype.decryptFile = function (opt) {
            var errorCode = AnyChatSDKFileHandler.decryptFile(opt);
            logger.invokeLog("decryptFile", errorCode, opt);
            return errorCode;
        };

        // 获取磁盘空间
        AnyChatSDKInstance.prototype.getDiskSize = function(opt) {
            logger.invokeLog("getDiskSize");
            return AnyChatSDKFileHandler.getDiskSize(opt);
        };

        //初始化机器人
        AnyChatSDKInstance.prototype.createRobot = function(option) {
            if(this.AnyChatAIManagement==null){

                this.AnyChatAIManagement=AnyChatSDKAIManagement.instance;
            }
            var flags= this.AnyChatAIManagement.createRobot();
            (typeof(option.event) === "function") && this.setCallBack(flags.guid, option.event, true);
            (typeof(option.errorevent) === "function") && this.setCallBack("err"+flags.guid, option.errorevent, true);
            return flags;
        };
        //查询所有机器人
        AnyChatSDKInstance.prototype.getAllRobot = function() {
            return this.AnyChatAIManagement.getAllRobot();

        };
        //销毁所有机器人
        AnyChatSDKInstance.prototype.destoryAllRobot = function() {
            this.AnyChatAIManagement.destoryAllRobot();

        };
        //销毁机器人
        AnyChatSDKInstance.prototype.destroyRobot  = function(robotId) {
            this.AnyChatAIManagement.destroyRobot(robotId);

        };
        //创建白板实例
        AnyChatSDKInstance.prototype.initWhiteBoard = function (option) {
            console.log(this.strUserId)
            option.userId = this.strUserId;
            //回调注册：
            // (typeof (option.onDrawing) === "function") && this.setCallBack('wbCallback', option.onDrawing, false);
            (typeof (option.onWhiteboardOpen) === "function") && this.setCallBack("onWhiteboardOpen", option.onWhiteboardOpen, false);
            (typeof (option.onWhiteboardClose) === "function") && this.setCallBack("onWhiteboardClose", option.onWhiteboardClose, false);
            (typeof (option.onWhiteboardCreate) === "function") && this.setCallBack("onWhiteboardCreate", option.onWhiteboardCreate, false);
            (typeof (option.onWhiteboardPageCreate) === "function") && this.setCallBack("onWhiteboardPageCreate", option.onWhiteboardPageCreate, false);
            (typeof (option.onWhiteboardDelete) === "function") && this.setCallBack("onWhiteboardDelete", option.onWhiteboardDelete, false);
            (typeof (option.onWhiteBoardSwitch) === "function") && this.setCallBack("onWhiteBoardSwitch", option.onWhiteBoardSwitch, false);
            (typeof (option.onWhiteBoardPageSwitch) === "function") && this.setCallBack("onWhiteBoardPageSwitch", option.onWhiteBoardPageSwitch, false);
            (typeof (option.onWhiteBoardUpdate) === "function") && this.setCallBack("onWhiteBoardUpdate", option.onWhiteBoardUpdate, false);
            (typeof (option.onAnyChatWhiteBoardHistoryDataReceive) === "function") && this.setCallBack("onAnyChatWhiteBoardHistoryDataReceive", option.onAnyChatWhiteBoardHistoryDataReceive, false);
            this.AnyChatWhiteBoard = new AnyChatWhiteBoard.instance(option);
            // logger.invokeLog("createWhiteBoard", errorCode, params);
            return this.AnyChatWhiteBoard
        };
        //创建插拔式服务实例
        AnyChatSDKInstance.prototype.InitDetachableService = function (option) {
            if(!this.AnyChatDetachableService){
                //回调注册：
                (typeof (option.onAnyChatDetachableServiceConnect) === "function") && this.setCallBack('onAnyChatDetachableServiceConnect', option.onAnyChatDetachableServiceConnect, false);
                (typeof (option.onAnyChatDetachableServiceReConnect) === "function") && this.setCallBack('onAnyChatDetachableServiceReConnect', option.onAnyChatDetachableServiceReConnect, false);
                (typeof (option.onAnyChatDetachableServiceReceiveData) === "function") && this.setCallBack("onAnyChatDetachableServiceReceiveData", option.onAnyChatDetachableServiceReceiveData, false);
                (typeof (option.onAnyChatDetachableServiceDisConnect) === "function") && this.setCallBack("onAnyChatDetachableServiceDisConnect", option.onAnyChatDetachableServiceDisConnect, false);

                this.AnyChatDetachableService = new AnyChatDetachableService(option);
                this.AnyChatDetachableService.detachableServiceManger.push(option.detachableId)
            }else{
                this.AnyChatDetachableService.detachableServiceManger.push(option.detachableId)
            }

            // logger.invokeLog("createWhiteBoard", errorCode, params);
            // this.DetachableServiceManger[option.serverGuid] = this.AnyChatDetachableService;
            return this.AnyChatDetachableService
        };
        /*----------------------------------------------------------
	 * AnyChatSDK
	 * 函数说明:AnyChatSDK 工厂,用于创建AnyChatSDK实例
	 *
	 * ---------------------------------------------------------
	 */
        function AnyChatWebSDK() {
            // this.anychatSDKInstance = new AnyChatSDKInstance();
            this.anychatSDKInstance = null;
        }

        AnyChatWebSDK.prototype.sdkInit = function(option) {
            // if (this.anychatSDKInstance.getInitDone()) {
            //     return this.anychatSDKInstance;
            // }

            this.anychatSDKInstance = new AnyChatSDKInstance();

            AnyChatSDKEventTarget.instance.removeAll();

            info.serverIp = option.serverIp ? option.serverIp : "demo.anychat.cn";

            info.serverPort = option.serverPort ? option.serverPort : 8906;

            info.appId = option.appId ? option.appId : "";

            info.timeStamp = option.timeStamp ? option.timeStamp : 0;


            info.nickName = option.nickName;

            info.userId = option.userId ? option.userId : -1;

            info.strUserId = option.strUserId ? option.strUserId : "";

            info.password = option.password ? option.password : "";

            info.sign = option.sign ? option.sign : "";
            if(info.sign != ""){
                AnyChatWebSDK.anychatSDKInstance.isCluster = 1;
            } else {
                AnyChatWebSDK.anychatSDKInstance.isCluster = option.password ? 0: 1;
            }

            if (typeof option.queueOpt === "object") {
                if (option.queueOpt.hasOwnProperty("role")) {
                    AnyChatSDKUserHandler.instance.userType = parseInt(option.queueOpt.role);
                    info.role = option.queueOpt.role;
                }
                if (option.queueOpt.hasOwnProperty("name")) {
                    AnyChatSDKQueueHandler.instance.name = option.queueOpt.name;
                    info.name = option.queueOpt.name;
                }
                if (option.queueOpt.hasOwnProperty("priority")) {
                    AnyChatSDKQueueHandler.instance.priority = option.queueOpt.priority;
                    info.priority = option.queueOpt.priority;
                }
                if (option.queueOpt.hasOwnProperty("attribute")) {
                    AnyChatSDKQueueHandler.instance.attribute = option.queueOpt.attribute ? option.queueOpt.attribute : "";
                    info.attribute = option.queueOpt.attribute ? option.queueOpt.attribute : "";
                }
                if (option.queueOpt.hasOwnProperty("isAutoMode")) {
                    AnyChatSDKQueueHandler.instance.isAutoMode = option.queueOpt.isAutoMode;
                    info.isAutoMode = option.queueOpt.isAutoMode;
                }
                if (option.queueOpt.hasOwnProperty("isGlobal")) {
                    AnyChatSDKQueueHandler.instance.isGlobal = option.queueOpt.isGlobal;
                    info.isGlobal = option.queueOpt.isGlobal;
                }
                if (option.queueOpt.hasOwnProperty("isGlobalAgent")) {
                    AnyChatSDKQueueHandler.instance.isGlobalAgent = option.queueOpt.isGlobalAgent;
                    info.isGlobalAgent = option.queueOpt.isGlobalAgent;
                }

            }
            if (typeof option.cameraOpt === "object") {
                info.openNativeScreenCamera = option.cameraOpt.openNativeScreenCamera;
            }
            if (typeof option.logOpt === "object") {
                info.logSavepath = option.logOpt.logSavepath;
                info.logFileRule = option.logOpt.logFileRule;
            }



            AnyChatSDKUserHandler.instance.callbackFunctionRegister(this, option);

            AnyChatSDKVideoCallHandler.instance.callbackFunctionRegister(this, option);

            AnyChatSDKQueueHandler.instance.callbackFunctionRegister(this, option);

            AnyChatSDKFriendHandler.instance.callbackFunctionRegister(this, option);

            this.anychatSDKInstance.init();

            return this.anychatSDKInstance;
        };

        function setLogSavePath(opt) {
            // 日志不覆盖
            BRAC_SetSDKOption(BRAC_SO_CORESDK_LOGFILERULE, opt.logFileRule);
            // 重定向日志输出路径
            BRAC_SetSDKOption(BRAC_SO_CORESDK_LOGFILEROOTPATH, opt.logSavepath);
        }

        function audioCallback(devices) {
            var audioDevices = [];
            for (var d in devices) {
                if (devices[d].kind == "audioinput") {
                    audioDevices.push(devices[d].deviceId);
                }
            }
            return audioDevices;
        }

        function videoCallback(devices) {
            var videoDevices = [];
            for (var d in devices) {
                if (devices[d].kind == "videoinput") {
                    videoDevices.push(devices[d].deviceId);
                }
            }
            return videoDevices;
        }

        function getBrowserInfo(){
            var browser = "unknown browser";
            var ua = navigator.userAgent.toLowerCase();

            var info = {
                ie: /msie/.test(ua) && !/opera/.test(ua),
                op: !/msie/.test(ua) && /opera/.test(ua),
                sa: /version.*safari/.test(ua),
                ch: /chrome/.test(ua) && window.navigator.webkitPersistentStorage,
                ff: /firefox/.test(ua),
                qh360: /chrome/.test(ua) && !window.navigator.webkitPersistentStorage,
                qq: /qqbrowser/.test(ua),
                sg: /metasr/.test(ua)
            };
            if (info.ch){
                browser = "Chrome";
            }else if (info.ie || (!!window.ActiveXObject || "ActiveXObject" in window) ){
                browser = "IE";
            }else if (info.ff){
                browser = "Firefox";
            }else if (info.sa){
                browser = "Safari";
            }else if (info.qh360){
                browser = "360浏览器";
            }else if (info.op){
                browser = "Opera";
            }else if (info.qq){
                browser = "QQ浏览器";
            }else if (info.sg){
                browser = "搜狗浏览器";
            }
            return browser;
        }

        var AnyChatWebSDK = new AnyChatWebSDK();

        window.AnyChatWebSDK = AnyChatWebSDK;

        /***/ }),
    /* 1 */
    /***/ (function(module, exports) {

        /*-----------------------------------------------------------
	 * AnyChat接口调用日志
	 * 函数说明:AnyChatSDK接口相关操作与回调事件的日志输出
	 *
	 *
	 * ----------------------------------------------------------
	 */


        /**
         * Create a new logger
         * @constructor
         * @class The main Log class.  Create a new instance of this class to send all logging events.
         * @param level The cut-off logger level.  You can adjust this level in the constructor and leave all other logging events in place.  Defaults to {@link Log#WARN}.
         * @param logger The logger to use.  The logger is a function that accepts the logging events and informs the user or developer. Defaults to {@link Log#writeLogger}.
         */
        function Log(level,logger,prefix) {
            var _currentLevel = Log.WARN;
            var _logger = Log.writeLogger; // default to write Logger
            var _prefix = false;
            /**
             * Sets the current logger prefix
             * @param {String} prefix This prefix will be prepended to all messages.
             */
            this.setPrefix = function(pre) {
                if (pre!='undefined') { _prefix = pre; }
                else { _prefix = false; }
            };
            /**
             * Sets the current logger function
             * @param logger The function that will be called when a log event needs to be displayed
             */
            this.setLogger = function(logger) {
                if (logger!='undefined') { _logger = logger; }
            };

            /**
             * Sets the current threshold log level for this Log instance.  Only events that have a priority of this level or greater are logged.
             * @param level The new threshold priority level for logging events.  This can be one of the static members {@link Log#DEBUG},  {@link Log#INFO}, {@link Log#WARN}, {@link Log#ERROR}, {@link Log#FATAL}, {@link Log#NONE}, or it can be one of the strings ["debug", "info", "warn", "error", "fatal", "none"].
             */
            this.setLevel = function(level) {
                if (level!='undefined' && typeof level =='number') {
                    _currentLevel = level;
                } else if (level!='undefined') {
                    if (level=='debug') { _currentLevel = Log.DEBUG; }
                    else if (level=='info') { _currentLevel = Log.INFO; }
                    else if (level=='error') { _currentLevel = Log.ERROR; }
                    else if (level=='fatal') { _currentLevel = Log.FATAL; }
                    else if (level=='warn') { _currentLevel = Log.WARN; }
                    else { _currentLevel = Log.NONE; }
                }
            };

            /**
             * Gets the current prefix
             * @return current prefix
             */

            this.getPrefix = function() { return _prefix; };

            /**
             * Gets the current event logger function
             * @return current logger
             */

            this.getLogger = function() { return _logger; };

            /**
             * Gets the current threshold priority level
             * @return current level
             */

            this.getLevel = function() { return _currentLevel; };

            if (level!='undefined') { this.setLevel(level); }
            if (logger!='undefined') { this.setLogger(logger); }
            if (prefix!='undefined') { this.setPrefix(prefix); }
        }
        /**
         * Log an event with priority of "debug"
         * @param s the log message
         */
        Log.prototype.debug     = function(s) { if (this.getLevel()<=Log.DEBUG) { this._log(s,"DEBUG",this); } };
        /**
         * Log an event with priority of "info"
         * @param s the log message
         */
        Log.prototype.info      = function(s) { if (this.getLevel()<=Log.INFO ) { this._log(s,"INFO",this); } };
        /**
         * Log an event with priority of "warn"
         * @param s the log message
         */
        Log.prototype.warn      = function(s) { if (this.getLevel()<=Log.WARN ) { this._log(s,"WARN",this); } };
        /**
         * Log an event with priority of "error"
         * @param s the log message
         */
        Log.prototype.error     = function(s) { if (this.getLevel()<=Log.ERROR) { this._log(s,"ERROR",this); } };
        /**
         * Log an event with priority of "fatal"
         * @param s the log message
         */
        Log.prototype.fatal     = function(s) { if (this.getLevel()<=Log.FATAL) { this._log(s,"FATAL",this); } };

        /**
         * _log is the function that actually calling the configured logger function.
         * It is possible that this function could be extended to allow for more
         * than one logger.
         *
         * This method is used by {@link Log#debug}, {@link Log#info}, {@link Log#warn}, {@link Log#error}, and {@link Log#fatal}
         * @private
         * @param {String} msg The message to display
         * @param level The priority level of this log event
         * @param {Log} obj The originating {@link Log} object.
         */
        Log.prototype._log = function(msg,level,obj) {
            if (this.getPrefix()) {
                this.getLogger()(this.getPrefix()+" - "+msg,level,obj);
            } else {
                this.getLogger()(msg,level,obj);
            }

        };

        Log.DEBUG       = 1;
        Log.INFO        = 2;
        Log.WARN        = 3;
        Log.ERROR       = 4;
        Log.FATAL       = 5;
        Log.NONE		= 6;

        /**
         * Static alert logger method.  This logger will display a javascript alert (messagebox) with the message.
         * @param {String} msg The message to display
         * @param level The priority level of this log event
         */
        Log.alertLogger = function(msg,level) { alert(level+" - "+msg); };
        /**
         * Static write logger method.  This logger will print the message out to the web page using document.writeln.
         * @param {String} msg The message to display
         * @param level The priority level of this log event
         */
        Log.writeLogger = function(msg,level) { document.writeln(level+"&nbsp;-&nbsp;"+msg+"<br/>"); }


        /**
         * Static Safari WebKit console logger method. This logger will write messages to the Safari javascript console, if available.
         * If this browser doesn't have a javascript console (IE/Moz), then it degrades gracefully to {@link Log#popupLogger}
         * @param {String} msg The message to display
         * @param level The priority level of this log event
         * @param {Log} obj The originating {@link Log} object.
         */
        Log.consoleLogger = function(msg,level,obj) {
            if (window.console) {
                var d = new Date();
                var h = d.getHours();
                if (h<10) { h="0"+h; }
                var m = d.getMinutes();
                if (m<10) { m="0"+m; }
                var s = d.getSeconds();
                if (s<10) { s="0"+s; }
                var date = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+h+":"+m+":"+s;

                window.console.log("Time:"+date +" Level:"+level+" Message:"+msg);
                Log.printLogger(msg,level,obj,date);
            } /*else {
	     Log.popupLogger(msg,level,obj);
	     }*/
        };

        Log.printLogger = function(msg,level,obj,date){
            if(!window.document.getElementById("logger")){
                return;
            }else{
                var getDiv = window.document.getElementById("logger");
                var createFont = document.createElement("font");
                createFont.innerHTML = date+"&nbsp;&nbsp;"+msg;
                getDiv.appendChild(createFont);
            }

        };

        /**
         * Static popup logger method.  This logger will popup a new window (if necessary), and add the log message to the end of a list.
         * @param {String} msg The message to display
         * @param level The priority level of this log event
         * @param {Log} obj The originating {@link Log} object.
         */
        Log.popupLogger = function(msg,level,obj) {
            if (obj.popupBlocker) {
                return;
            }
            if (!obj._window || !obj._window.document) {
                obj._window = window.open("",'logger_popup_window','width=420,height=320,scrollbars=1,status=0,toolbars=0,resizable=1');
                if (!obj._window) { obj.popupBlocker=true; alert("You have a popup window manager blocking the log4js log popup display.\n\nThis must be disabled to properly see logged events."); return; }
                if (!obj._window.document.getElementById('loggerTable')) {
                    obj._window.document.writeln("<table width='100%' id='loggerTable'><tr><th align='left'>Time</th><th width='100%' colspan='2' align='left'>Message</th></tr></table>");
                    obj._window.document.close();
                }
            }
            var tbl = obj._window.document.getElementById("loggerTable");
            var row = tbl.insertRow(-1);

            var cell_1 = row.insertCell(-1);
            var cell_2 = row.insertCell(-1);
            var cell_3 = row.insertCell(-1);

            var d = new Date();
            var h = d.getHours();
            if (h<10) { h="0"+h; }
            var m = d.getMinutes();
            if (m<10) { m="0"+m; }
            var s = d.getSeconds();
            if (s<10) { s="0"+s; }
            var date = (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+"&nbsp;-&nbsp;"+h+":"+m+":"+s;

            cell_1.style.fontSize="8pt";
            cell_1.style.fontWeight="bold";
            cell_1.style.paddingRight="6px";

            cell_2.style.fontSize="8pt";

            cell_3.style.fontSize="8pt";
            cell_3.style.whiteSpace="nowrap";
            cell_3.style.width="100%";

            if (tbl.rows.length % 2 == 0) {
                cell_1.style.backgroundColor="#eeeeee";
                cell_2.style.backgroundColor="#eeeeee";
                cell_3.style.backgroundColor="#eeeeee";
            }

            cell_1.innerHTML=date
            cell_2.innerHTML=level;
            cell_3.innerHTML=msg;
        };

        /**
         * This method is a utility function that takes an object and creates a string representation of it's members.
         * @param {Object} the Object that you'd like to see
         * @return {String} a String representation of the object passed
         */
        Log.dumpObject=function (obj,indent) {
            if (!indent) { indent="";}
            if (indent.length>20) { return ; } // don't go too far...
            var s="{\n";
            for (var p in obj) {
                s+=indent+p+":";
                var type=typeof(obj[p]);
                type=type.toLowerCase();
                if (type=='object') {
                    s+= Log.dumpObject(obj[p],indent+"----");
                } else {
                    s+= obj[p];
                }
                s+="\n";
            }
            s+=indent+"}";
            return s;
        };


        //构造函数
        function AnyChatSDKInterfaceLog(prefix) {
            this.logObj = new Log("debug",Log.consoleLogger,prefix);
        }

        AnyChatSDKInterfaceLog.prototype = {
            constructor: AnyChatSDKInterfaceLog,

            //调用接口日志
            invokeLog: function(funName,errorcode,params) {
                var str ="";
                if(params){
                    var keys = [];
                    for (var p in params) {
                        if (params.hasOwnProperty(p))
                            keys.push(p);
                    }
                    str ="(";
                    for (var p in keys) {
                        var key = keys[p] ;
                        if(p ==(keys.length -1)){
                            str += " " +key + ":" + params[key] +" )";
                        }else{
                            str += " " +key + ":" + params[key] +",";
                        }
                    }
                }
                var logStr = "invoke AnyChatSDKInstance "+ funName + str;
                var errorTips ="";
                if(errorcode >= 0){
                    errorTips = errorcode;
                    logStr +="="+errorTips;
                }else{
                    logStr +="...";
                }
                this.logObj.debug(logStr);
            },

            //回调事件接口日志
            callbackLog:function(funName,errorcode,params) {
                var str ="";
                if(params){
                    var keys = [];
                    for (var p in params) {
                        if (params.hasOwnProperty(p)) {
                            keys.push(p);
                        }
                    }
                    str ="(";
                    for (var p in keys) {
                        var key = keys[p] ;
                        if(p ==(keys.length -1)){
                            str += " " +key + ":" + params[key] +" )";
                        }else{
                            str += " " +key + ":" + params[key] +",";
                        }
                    }
                }
                var logStr = "callback AnyChatSDKInstance "+ funName;
                var errorTips ="";
                if(errorcode >= 0){
                    errorTips = errorcode;
                    logStr +=", errorCode:"+errorTips;
                }else{
                    logStr +="...";
                }
                this.logObj.debug(logStr);
            }

        };







        var instance = new AnyChatSDKInterfaceLog();
        exports.getLogger = function(prefix){
            return new AnyChatSDKInterfaceLog(prefix);
            //return new Log("debug",Log.consoleLogger,prefix);
        };



        /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

        /*-----------------------------------------------------------
	 * AnyChat常量
	 * 函数说明:定义AnyChat SDK的常量
	 *
	 *
	 * ----------------------------------------------------------
	 */

        //构造函数
        function AnyChatSDKConstant() {


        }

        AnyChatSDKConstant.prototype = {
            constructor: AnyChatSDKConstant,
            //链路连接状态枚举值
            ConnectStatus: {
                'ERROR': -1,//链路出错
                'INIT': 0,//初始值
                'INITIALIZED': 1,//已初始化
                'OPEN': 2,//登录成功
                'OFFLINE': 3,//链路断开
                'OPENING': 4//连接中
            },
            //出错类型定义
            ErrorType: {
                'CONNECT_ERROR': 1,  //连接出错
                'LOGIN_ERROR': 2     //登录出错
            }
        }


        var instance = new AnyChatSDKConstant();

        exports.instance = instance;


        /***/ }),
    /* 3 */
    /***/ (function(module, exports) {

        /*-----------------------------------------------------------
	 * AnyChatSDKEventTarget
	 * 函数说明:用户回调函数存储器
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //事件构造函数
        function AnyChatSDKEventTarget() {
            // 事件处理程序数组集合
            this.handlers = {};
            this.doneHandlers = [];
        }

        //事件的原型对象
        AnyChatSDKEventTarget.prototype = {
            // 设置原型构造函数链
            constructor: AnyChatSDKEventTarget,

            // 注册给定类型的事件处理程序，
            addEvent: function(type, handler, isDoneEvent) {
                // 判断事件处理数组是否有该类型事件
                if (typeof this.handlers[type] == 'undefined') {
                    this.handlers[type] = [];
                    // 将处理事件push到事件处理数组里面
                    this.handlers[type].push(handler);

                }else{
                    if(isDoneEvent){
                        this.handlers[type].push(handler);
                    }else{
                        this.handlers[type].length = 0;
                        this.handlers[type].push(handler);
                    }
                }

                if (isDoneEvent) {
                    this.doneHandlers.push(type);
                }

            },

            // 触发一个事件
            fireEvent: function(event) {
                // 模拟真实事件的event
                if (!event.target) {
                    event.target = this;
                }
                // 判断是否存在该事件类型
                if (this.handlers[event.type] instanceof Array) {
                    var handlers = this.handlers[event.type];
                    // 在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
                    for (var i = 0; i < handlers.length; i++) {
                        // 执行触发
                        var args = [];
                        for (var k in event) {
                            if (k != 'type') {
                                args.push(event[k]);
                            }
                        }
                        //(args);
                        handlers[i].apply(null, args);
                    }
                    for (var j = 0; j < this.doneHandlers.length; j++) {
                        if (event.type == this.doneHandlers[j]) {
                            this.removeEvent(event);
                            this.doneHandlers.splice(j, 1);
                            break;
                        }
                    }
                }
            },

            // 注销事件
            removeEvent: function(event) {
                // 模拟真实事件的event
                if (!event.target) {
                    event.target = this;
                }
                // 判断是否存在该事件类型
                if (this.handlers[event.type] instanceof Array) {
                    delete this.handlers[event.type];
                }
            },

            //清空所有
            removeAll: function() {
                this.handlers = {};
                this.doneHandlers = [];
            }
        };

        var instance = new AnyChatSDKEventTarget();
        exports.instance = instance;

        /***/ }),
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat用户处理器
	 * 函数说明:用户相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKUserHandler");

        var AnyChatSDKConstant = __webpack_require__(2);
        var AnyChatSDKErrorCode = __webpack_require__(5);
        var AnyChatSDKAreaHandler = __webpack_require__(6);
        var CONSTANT = AnyChatSDKConstant.instance;

        //构造函数
        function AnyChatSDKUserHandler() {
            this.atRoomUserList = []; //在房间内的用户列表
            this.userType = -1; //用户身份：1--客户  2--坐席
            this.userId = -1; //用户int型userId，内部封装用
            this.strUserId = "";
            this.isSupportEx = true;
            this.currentMsgTaskId = []; //存放当前执行的透明通道消息ID
        }

        AnyChatSDKUserHandler.prototype = {
            constructor: AnyChatSDKUserHandler,

            //用户登录
            login: function(userLoginObj) {
                var _password = "";
                //if (userLoginObj.appId) {
                //    BRAC_LoginEx(userLoginObj.nickName, -1, userLoginObj.strUserId,
                //        userLoginObj.appId, userLoginObj.timeStamp, "", "");
                //} else {
                //    if (userLoginObj.password)
                //        _password = userLoginObj.password;
                //
                //    BRAC_Login(userLoginObj.nickName, _password, 0);
                //}
                // var errorCode = BRAC_LoginEx(userLoginObj.nickName, -1, userLoginObj.strUserId, userLoginObj.appId, userLoginObj.timeStamp, "", "");
                var errorCode = -1;
                if (!AnyChatWebSDK.anychatSDKInstance.isCluster) {
                    errorCode = BRAC_Login(userLoginObj.nickName, userLoginObj.password, 0);
                } else {
                    errorCode = BRAC_LoginEx(userLoginObj.nickName, userLoginObj.userId, userLoginObj.strUserId, userLoginObj.appId, userLoginObj.timeStamp, userLoginObj.signData, JSON.stringify({'objectflags':ANYCHAT_OBJECT_FLAGS_QUEUEUSERLIST}));
                }
                this.strUserId = userLoginObj.strUserId;
                return errorCode;
            },

            //用户退出
            logout: function(anychatSDKInstance) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var errorCode = BRAC_Logout();

                if (errorCode == 0) {
                    _sdk.curConnectStatus == CONSTANT.ConnectStatus.INITIALIZED;
                    AnyChatSDKAreaHandler.instance.areaIdArray = [];
                    AnyChatSDKAreaHandler.instance.areaIdIndex = 0;
                }
                return errorCode;
            },

            //进房间
            enterRoom: function(params) {
                var roomPwd = "";
                if (params.hasOwnProperty("password")) {
                    roomPwd = params.password;
                }
                if (bSupportScriptObject)
                    return BRAC_EnterRoom(params.roomId, roomPwd, 0);
                else {
                    var re = /^[1-9]+[0-9]*]*$/; //判断是否纯数字
                    if (re.test(params.roomId))
                        return BRAC_EnterRoom(parseInt(params.roomId), roomPwd, 0);
                    else
                        return BRAC_EnterRoomEx(params.roomId + "", roomPwd);
                }
            },

            //获取房间中的用户列表
            getRoomUsers: function() {
                this.atRoomUserList = [];
                var list = BRAC_GetOnlineUser();
                list.push(this.userId);
                var userList = list.map(getStrUserId);
                for (var i = 0; i < userList.length; i++) {
                    this.atRoomUserList[i] = { intUserId: list[i], strUserId: userList[i] };
                }
                return userList;

            },

            //离开房间
            leaveRoom: function(anychatSDKInstance) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var errorCode = BRAC_LeaveRoom(-1);
                return errorCode;
            },

            //控制用户本地的视频设备
            controlLocalVideo: function(anychatSDKInstance, controlInfoObj) {

            },

            //请求其他用户的视频设备
            requestOtherUserVideo: function(anychatSDKInstance, controlInfoObj) {

            },

            //文字消息
            sendMsg: function(opt) {
                if (opt.hasOwnProperty("targetUsers")) {
                    if (opt.targetUsers.length == 0){
                        return BRAC_SendTextMessage(-1, 0, opt.msg);
                    }else{
                        var errorCode=0;
                        for (var i=0; i< opt.targetUsers.length;i++) {
                            errorCode= BRAC_SendTextMessage(opt.targetUsers[i], 1, opt.msg);
                        }
                        return errorCode;
                    }

                } else {
                    return BRAC_SendTextMessage(-1, 0, opt.msg);
                }

            },



            //透明通道
            transBuffer: function(opt) {
                if (opt.hasOwnProperty("targetUsers")) {
                    if (opt.targetUsers.length == 0) {
                        return 21; //参数错误
                    }
                    var errorCode=0;
                    for (var i = 0; i < opt.targetUsers.length; i++) {

                        var timestamp = new Date().getTime();
                        var original = opt.msg;
                        opt.msg = timestamp + "#" + original;

                        var timer = setTimeout(function() { clearTimer(timestamp) }, (opt.time ? opt.time : 10) * 1000);
                        var msgTaskObj = {
                            msgId: timestamp,
                            targetId: opt.targetUsers[i],
                            msgContent: original,
                            timer: timer
                        };
                        this.currentMsgTaskId.push(msgTaskObj);
                        errorCode= BRAC_TransBuffer(opt.targetUsers[i], base64.encode(opt.msg));
                    }
                    return errorCode;
                } else {
                    return BRAC_TransBuffer(-1, base64.encode(opt.msg));
                }
            },

            //透明通道扩展
            transBufferEx: function(opt) {
                if (opt.hasOwnProperty("targetUsers")) {
                    if (opt.targetUsers.length == 0) {
                        return 21; //参数错误
                    }
                    var errorCode=0;
                    for (var i = 0; i < opt.targetUsers.length; i++) {
                        var timestamp = new Date().getTime();
                        var msg = timestamp + "#" + opt.msg ;
                        var timer = setTimeout(function() { clearTimer(timestamp) }, (opt.time ? opt.time : 10) * 1000);
                        var msgTaskObj = {
                            msgId: timestamp,
                            targetId: opt.targetUsers[i],
                            msgContent: opt.msg,
                            timer: timer
                        };
                        this.currentMsgTaskId.push(msgTaskObj);
                        errorCode= BRAC_TransBufferEx(opt.targetUsers[i], base64.encode(opt.msg),opt.wParam || 0,opt.lParam || 0,opt.dwFlags ||0);
                    }
                    return errorCode;
                } else {
                    return BRAC_TransBufferEx(-1, base64.encode(opt.msg),opt.wParam || 0,opt.lParam || 0,opt.dwFlags ||0);
                }
            }
        };



        AnyChatSDKUserHandler.prototype.callbackFunctionRegister = function(AnyChatWebSDK, option) {

            if (typeof(option.onDisConnect) === 'function') {
                AnyChatWebSDK.anychatSDKInstance.setCallBack("onDisConnect", option.onDisConnect, false);
            }

            if (option.onUpdateUserInfo) {
                AnyChatWebSDK.anychatSDKInstance.setCallBack("onUpdateUserInfo", option.onUpdateUserInfo, false);
            }

            if (option.onLogin) {
                AnyChatWebSDK.anychatSDKInstance.setCallBack("onLogin", option.onLogin, false);
            }

            if (typeof option.bufferOpt === "object") {
                typeof(option.bufferOpt.onReceiveBuffer) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveBuffer", option.bufferOpt.onReceiveBuffer, false);
            }

            //if (option.userMsgAtRoom) {
            //    AnyChatWebSDK.anychatSDKInstance.setCallBack("onAnyChatUserMsgAtRoom", option.userMsgAtRoom, false);
            //}


            if (typeof option.roomOpt === "object") {
                typeof(option.roomOpt.onRoomUserInAndOut) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserInAndOut", option.roomOpt.onRoomUserInAndOut, false);
                typeof(option.roomOpt.onRoomUserChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserChanged", option.roomOpt.onRoomUserChanged, false);
                typeof(option.roomOpt.onRoomUserMsgReceived) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onRoomUserMsgReceived", option.roomOpt.onRoomUserMsgReceived, false);
            }

            if (typeof option.fileOpt === "object") {
                typeof(option.fileOpt.onFileReceived) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onFileReceived", option.fileOpt.onFileReceived, false);
            }

        };

        function Base64() {

            // private property
            _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            // public method for encoding
            this.encode = function(input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = _utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                }
                return output;
            }

            // public method for decoding
            this.decode = function(input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = _utf8_decode(output);
                return output;
            }

            // private method for UTF-8 encoding
            _utf8_encode = function(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }
                return utftext;
            }

            // private method for UTF-8 decoding
            _utf8_decode = function(utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;
                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return string;
            }
        }

        // 从服务器查询strUserId
        function getStrUserIdFromServer(intUserId) {
            if (intUserId == instance.userId) {
                return instance.strUserId;
            }
            if (bSupportScriptObject || !AnyChatWebSDK.anychatSDKInstance.isCluster) {
                var userName = BRAC_GetUserInfo(intUserId, 1);
                if (userName == "")
                    userName = BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_NAMEBYUSERID, intUserId);
                return userName;
            } else {
                return BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_STRIDBYUSERID, intUserId);
            }
        }

        // 从服务器查询intUserId
        function getIntUserIdFromServer(strUserId) {
            if (strUserId == instance.strUserId) {
                return instance.userId;
            }
            if (bSupportScriptObject || !AnyChatWebSDK.anychatSDKInstance.isCluster) {
                return parseInt(BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERIDBYNAME, strUserId));
            } else {
                return BRAC_QueryInfoFromServer(ANYCHAT_SERVERQUERY_USERIDBYSTRID, strUserId);
            }
        }

        //从房间用户列表中查询strUserId
        function getStrUserIdInRoom(intUserId) {
            var strUserId = "";
            for (var i = 0; i < instance.atRoomUserList.length; i++) {
                if (instance.atRoomUserList[i].intUserId == intUserId) {
                    strUserId = instance.atRoomUserList[i].strUserId;
                    break;
                }
            }
            return strUserId;
        }

        //从房间用户列表中查询intUserId
        function getIntUserIdInRoom(strUserId) {
            var intUserId = "";
            for (var i = 0; i < instance.atRoomUserList.length; i++) {
                if (instance.atRoomUserList[i].strUserId == strUserId) {
                    intUserId = instance.atRoomUserList[i].intUserId;
                    break;
                }
            }
            return intUserId;
        }

        //先从房间内获取intUserId, 获取不了再从服务器查询
        function getIntUserId(strUserId) {
            // var intUserId = getIntUserIdInRoom(strUserId);
            // if (intUserId == "") {
            //     return getIntUserIdFromServer(strUserId);
            // }
            return strUserId;
        }

        //先从房间内获取strUserId, 获取不了再从服务器查询
        function getStrUserId(intUserId) {
            // var strUserId = getStrUserIdInRoom(intUserId);
            // if (strUserId == "") {
            //     return getStrUserIdFromServer(intUserId);
            // }
            return intUserId;
        }

        function clearTimer(id) {
            for (var i = 0; i < instance.currentMsgTaskId.length; i++) {
                if (instance.currentMsgTaskId[i].msgId == id) {
                    var content = instance.currentMsgTaskId[i].msgContent;
                    var targetId = instance.currentMsgTaskId[i].targetId;
                    var data = {
                        userId: targetId,
                        msg: content
                    };
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onTransBufferDone",
                        result: {
                            code: -1,
                            msg: "发送失败"
                        },
                        data: data
                    });
                    instance.currentMsgTaskId.slice(i, 1);
                    break;
                }
            }
        }

        var instance = new AnyChatSDKUserHandler();
        var base64 = new Base64();
        exports.instance = instance;
        exports.Base64 = base64;
        exports.getStrUserId = getStrUserId;
        exports.getIntUserId = getIntUserId;

        /***/ }),
    /* 5 */
    /***/ (function(module, exports) {

        var errorObjList = [];
        var AC_ERROR_UNKNOW = { errorCode: -1, errorMsg: "未知错误" };

        var AC_ERROR_SUCCESS = { errorCode: 0, errorMsg: "成功" };

        var AC_ERROR_DB_ERROR = { errorCode: 1, errorMsg: "数据库错误" };
        var AC_ERROR_NOTINIT = { errorCode: 2, errorMsg: "系统没有初始化" };
        var AC_ERROR_NOTINRM = { errorCode: 3, errorMsg: "还未进入房间" };
        var AC_ERROR_MEMORYFAIL = { errorCode: 4, errorMsg: "not enough memory" };
        var AC_ERROR_EXCEPTION = { errorCode: 5, errorMsg: "出现异常" };
        var AC_ERROR_CANCEL = { errorCode: 6, errorMsg: "操作被取消" };
        var AC_ERROR_PROTOCOLFAIL = { errorCode: 7, errorMsg: "通信协议出错" };
        var AC_ERROR_SESSIONNOTEXIST = { errorCode: 8, errorMsg: "会话不存在" };
        var AC_ERROR_DATANOTEXIST = { errorCode: 9, errorMsg: "数据不存在" };
        var AC_ERROR_DATAEXIST = { errorCode: 10, errorMsg: "数据已经存在" };
        var AC_ERROR_INVALIDGUID = { errorCode: 11, errorMsg: "无效GUID" };
        var AC_ERROR_RESOURCERECOVER = { errorCode: 12, errorMsg: "资源被回收" };
        var AC_ERROR_RESOURCEUSED = { errorCode: 13, errorMsg: "资源被占用" };
        var AC_ERROR_JSONFAIL = { errorCode: 14, errorMsg: "Json解析出错" };
        var AC_ERROR_OBJECTDELETE = { errorCode: 15, errorMsg: "对象被删除" };
        var AC_ERROR_SESSIONEXIST = { errorCode: 16, errorMsg: "会话已存在" };
        var AC_ERROR_SESSIONNOTINIT = { errorCode: 17, errorMsg: "会话没有初始化" };

        var AC_ERROR_FUNCNOTALLOW = { errorCode: 20, errorMsg: "函数功能不允许" };
        var AC_ERROR_FUNCOPTERROR = { errorCode: 21, errorMsg: "function parameters error" };
        var AC_ERROR_DEVICEOPENFAIL = { errorCode: 22, errorMsg: "device open failed or device no install" };
        var AC_ERROR_NOENOUGHRESOURCE = { errorCode: 23, errorMsg: "没有足够的资源" };
        var AC_ERROR_PIXFMTNOTSUPPORT = { errorCode: 24, errorMsg: "指定的格式不能被显示设备所支持" };
        var AC_ERROR_NOTMULTICASTADDR = { errorCode: 25, errorMsg: "指定的IP地址不是有效的组播地址" };
        var AC_ERROR_MULTIRUNERROR = { errorCode: 26, errorMsg: "不支持多实例运行" };
        var AC_ERROR_FILETRUSTFAILED = { errorCode: 27, errorMsg: "文件签名验证失败" };
        var AC_ERROR_CERTVERIFYFAILED = { errorCode: 28, errorMsg: "授权验证失败" };
        var AC_ERROR_CERTUSERFAILED = { errorCode: 29, errorMsg: "授权证书用户数验证失败" };
        var AC_ERROR_MASTERISSLAVE = { errorCode: 30, errorMsg: "所指定的主服务器是热备服务器，不支持再次热备" };
        var AC_ERROR_MASTERNOTCREDIT = { errorCode: 31, errorMsg: "主服务器没有经过授权认证，不支持热备" };
        var AC_ERROR_VERSIONNOTMATCH = { errorCode: 32, errorMsg: "版本不匹配" };
        var AC_ERROR_CERTFAILSECOND = { errorCode: 33, errorMsg: "第二次授权验证失败" };
        var AC_ERROR_SERVERVERIFYFAIL = { errorCode: 34, errorMsg: "服务器安全验证失败" };
        var AC_ERROR_CLIENTCERTFAILED = { errorCode: 35, errorMsg: "客户端授权验证失败" };
        var AC_ERROR_CERTSUMFAILED = { errorCode: 36, errorMsg: "授权功能校验失败" };
        var AC_ERROR_REMOTECTRL = { errorCode: 37, errorMsg: "远程控制" };
        var AC_ERROR_DUPLICATESERVICEID = { errorCode: 38, errorMsg: "ServiceGuid重复" };
        var AC_ERROR_DIRENTERROR = { errorCode: 39, errorMsg: "目录错误" };
        var AC_ERROR_EXTRACTFILEERROR = { errorCode: 40, errorMsg: "解压文件失败" };
        var AC_ERROR_STARTPROCESSFAILED = { errorCode: 41, errorMsg: "启动进程失败" };
        var AC_ERROR_SERVICEISRUNNING = { errorCode: 42, errorMsg: "服务已启动" };
        var AC_ERROR_DISKSPACELIMITED = { errorCode: 43, errorMsg: "磁盘空间不足" };
        var AC_ERROR_REQUESTFAILED = { errorCode: 44, errorMsg: "业务服务发送请求失败" };
        var AC_ERROR_INVALIDMACHINE = { errorCode: 45, errorMsg: "无效的物理机对象" };
        var AC_ERROR_GETCERTINFOFAILED = { errorCode: 46, errorMsg: "获取授权信息失败" };
        var AC_ERROR_CLUSTERNOTMATCH = { errorCode: 47, errorMsg: "集群属性不匹配" };
        var AC_ERROR_NONECLUSTERID = { errorCode: 48, errorMsg: "集群ID为空" };
        var AC_ERROR_CREATESERVICE_MORE = { errorCode: 49, errorMsg: "同台物理机创建多个相同服务，一类服务暂时不允许创建多个" };
        var AC_ERROR_COPYFILEFAILED = { errorCode: 50, errorMsg: "拷贝文件失败" };
        var AC_ERROR_CLOUDNATIVEDBFAIL = { errorCode: 51, errorMsg: "云平台内部数据库出错" };
        var AC_ERROR_CLOUDOSSUPLOADFAIL = { errorCode: 52, errorMsg: "云平台OSS文件上传失败" };
        var AC_ERROR_SERVICEBINDCHANGE = { errorCode: 53, errorMsg: "服务绑定关系变化" };
        var AC_ERROR_SERVICENOTBIND = { errorCode: 54, errorMsg: "服务没有被绑定" };
        var AC_ERROR_SERVICEBINDFAIL = { errorCode: 55, errorMsg: "服务绑定失败" };
        var AC_ERROR_PIPELINEUSERFAIL = { errorCode: 56, errorMsg: "PipeLine通信用户ID出错" };
        var AC_ERROR_PIPELINESESSFAIL = { errorCode: 57, errorMsg: "PipeLine通信会话出错" };
        var AC_ERROR_SERVICECLOSED = { errorCode: 58, errorMsg: "服务被关闭" };
        var AC_ERROR_FILEENCRYPTED = { errorCode: 59, errorMsg: "文件已被加密过" };
        var AC_ERROR_FILEHEADINVAILD = { errorCode: 60, errorMsg: "解密无效（文件校验不通过）" };
        var AC_ERROR_FILEDECODE_PASSERR = { errorCode: 61, errorMsg: "解密失败，可能密码错误" };

        //连接部分
        var AC_ERROR_CONNECT_TIMEOUT = { errorCode: 100, errorMsg: "连接服务器超时" };
        var AC_ERROR_CONNECT_ABORT = { errorCode: 101, errorMsg: "与服务器的连接中断" };
        var AC_ERROR_CONNECT_AUTHFAIL = { errorCode: 102, errorMsg: "连接服务器认证失败（服务器设置了认证密码）" };
        var AC_ERROR_CONNECT_DNSERROR = { errorCode: 103, errorMsg: "域名解析失败" };
        var AC_ERROR_CONNECT_OVERFLOW = { errorCode: 104, errorMsg: "超过授权用户数" };
        var AC_ERROR_CONNECT_FUNCLIMIT = { errorCode: 105, errorMsg: "服务器功能受限制（演示模式）" };
        var AC_ERROR_CONNECT_INTRANET = { errorCode: 106, errorMsg: "只能在内网使用" };
        var AC_ERROR_CONNECT_OLDVERSION = { errorCode: 107, errorMsg: "版本太旧，不允许连接" };
        var AC_ERROR_CONNECT_SOCKETERR = { errorCode: 108, errorMsg: "Socket出错" };
        var AC_ERROR_CONNECT_DEVICELIMIT = { errorCode: 109, errorMsg: "设备连接限制（没有授权）" };
        var AC_ERROR_CONNECT_PAUSED = { errorCode: 110, errorMsg: "服务已被暂停" };
        var AC_ERROR_CONNECT_HOTSERVER = { errorCode: 111, errorMsg: "热备服务器不支持连接（主服务在启动状态）" };
        var AC_ERROR_CONNECT_ERRCERUSER = { errorCode: 112, errorMsg: "授权用户数校验出错，可能内存被修改" };
        var AC_ERROR_CONNECT_IPFORBID = { errorCode: 113, errorMsg: "IP被禁止连接" };
        var AC_ERROR_CONNECT_TYPEWRONG = { errorCode: 114, errorMsg: "连接类型错误，服务器不支持当前类型的连接" };
        var AC_ERROR_CONNECT_ERRORIP = { errorCode: 115, errorMsg: "服务器IP地址不正确" };
        var AC_ERROR_CONNECT_SELFCLOSE = { errorCode: 116, errorMsg: "连接被主动关闭" };
        var AC_ERROR_CONNECT_NOSVRLIST = { errorCode: 117, errorMsg: "没有获取到服务器列表" };
        var AC_ERROR_CONNECT_LBTIMEOUT = { errorCode: 118, errorMsg: "连接负载均衡服务器超时" };
        var AC_ERROR_CONNECT_NOTWORK = { errorCode: 119, errorMsg: "服务器不在工作状态" };
        var AC_ERROR_CONNECT_OFFLINE = { errorCode: 120, errorMsg: "服务器不在线" };
        var AC_ERROR_CONNECT_NETLIMITED = { errorCode: 121, errorMsg: "网络带宽受限" };
        var AC_ERROR_CONNECT_LOWTRAFFIC = { errorCode: 122, errorMsg: "网络流量不足" };
        var AC_ERROR_CONNECT_IPV6FAIL = { errorCode: 123, errorMsg: "不支持IPv6 Only网络" };
        var AC_ERROR_CONNECT_NOMASTER = { errorCode: 124, errorMsg: "没有Master服务器在线" };
        var AC_ERROR_CONNECT_NOSTATUS = { errorCode: 125, errorMsg: "没有上报工作状态" };

        //登录部分
        var AC_ERROR_CERTIFY_FAIL = { errorCode: 200, errorMsg: "认证失败，用户名或密码有误" };
        var AC_ERROR_ALREADY_LOGIN = { errorCode: 201, errorMsg: "该用户已登录" };
        var AC_ERROR_ACCOUNT_LOCK = { errorCode: 202, errorMsg: "帐户已被暂时锁定" };
        var AC_ERROR_IPADDR_LOCK = { errorCode: 203, errorMsg: "IP地址已被暂时锁定" };
        var AC_ERROR_VISITOR_DENY = { errorCode: 204, errorMsg: "游客登录被禁止（登录时没有输入密码）" };
        var AC_ERROR_INVALID_USERID = { errorCode: 205, errorMsg: "无效的用户ID（用户不存在）" };
        var AC_ERROR_SERVERSDK_FAIL = { errorCode: 206, errorMsg: "与业务服务器连接失败，认证功能失效" };
        var AC_ERROR_SERVERSDK_TIMEOUT = { errorCode: 207, errorMsg: "业务服务器执行任务超时" };
        var AC_ERROR_NOTLOGIN = { errorCode: 208, errorMsg: "没有登录" };
        var AC_ERROR_LOGIN_NEWLOGIN = { errorCode: 209, errorMsg: "该用户在其它计算机上登录" };
        var AC_ERROR_LOGIN_EMPTYNAME = { errorCode: 210, errorMsg: "用户名为空" };
        var AC_ERROR_KICKOUT = { errorCode: 211, errorMsg: "被服务器踢掉" };
        var AC_ERROR_SERVER_RESTART = { errorCode: 212, errorMsg: "业务服务器重启" };
        var AC_ERROR_FORBIDDEN = { errorCode: 213, errorMsg: "操作被禁止，没有权限" };
        var AC_ERROR_SIGSTREMPTY = { errorCode: 214, errorMsg: "签名信息为空，禁止登录" };
        var AC_ERROR_SIGVERIFYFAIL = { errorCode: 215, errorMsg: "签名验证失败" };
        var AC_ERROR_SIGPUBLICKEYEMPTY = { errorCode: 216, errorMsg: "签名验证公钥为空" };
        var AC_ERROR_SIGPRIVATEKEYEMPTY = { errorCode: 217, errorMsg: "签名私钥为空" };
        var AC_ERROR_SIGPARAMEMPTY = { errorCode: 218, errorMsg: "签名参数为空" };
        var AC_ERROR_SIGPARAMFAIL = { errorCode: 219, errorMsg: "签名参数出错" };
        var AC_ERROR_SIGTIMEFAILURE = { errorCode: 220, errorMsg: "签名时间失效" };
        var AC_ERROR_APPNOTACTIVE = { errorCode: 221, errorMsg: "应用没有被激活" };
        var AC_ERROR_APPPAUSED = { errorCode: 222, errorMsg: "应用被用户暂停" };
        var AC_ERROR_APPLOCKED = { errorCode: 223, errorMsg: "应用被用户锁定" };
        var AC_ERROR_APPEXPIRED = { errorCode: 224, errorMsg: "应用已过期" };
        var AC_ERROR_APPUNKNOWSTATUS = { errorCode: 225, errorMsg: "应用未知状态" };
        var AC_ERROR_SIGALREADYUSED = { errorCode: 226, errorMsg: "签名已经被使用" };
        var AC_ERROR_USERROLE_FAIL = { errorCode: 227, errorMsg: "获取用户角色失败" };
        var AC_ERROR_INVALID_AGENT = { errorCode: 228, errorMsg: "坐席无效(不存在)" };

        //进入房间
        var AC_ERROR_RM_LOCK = { errorCode: 300, errorMsg: "房间已被锁住，禁止进入" };
        var AC_ERROR_RM_PASSERR = { errorCode: 301, errorMsg: "房间密码错误，禁止进入" };
        var AC_ERROR_RM_FULLUSER = { errorCode: 302, errorMsg: "房间已满员，不能进入" };
        var AC_ERROR_RM_INVALID = { errorCode: 303, errorMsg: "房间不存在" };
        var AC_ERROR_RM_EXPIRE = { errorCode: 304, errorMsg: "房间服务时间已到期" };
        var AC_ERROR_RM_REJECT = { errorCode: 305, errorMsg: "房主拒绝进入" };
        var AC_ERROR_RM_OWNERBEOUT = { errorCode: 306, errorMsg: "房主不在，不能进入房间" };
        var AC_ERROR_RM_ENTERFAIL = { errorCode: 307, errorMsg: "不能进入房间" };
        var AC_ERROR_RM_ALREADIN = { errorCode: 308, errorMsg: "已经在房间里面了，本次进入房间请求忽略" };
        var AC_ERROR_RM_NOTIN = { errorCode: 309, errorMsg: "不在房间中，对房间相关的API操作失败" };

        //数据流
        var AC_ERROR_STREAM_OLDPACK = { errorCode: 350, errorMsg: "过期数据包" };
        var AC_ERROR_STREAM_SAMEPAK = { errorCode: 351, errorMsg: "相同的数据包" };
        var AC_ERROR_STREAM_PACKLOSS = { errorCode: 352, errorMsg: "数据包丢失" };
        var AC_ERROR_STREAM_MISTAKE = { errorCode: 353, errorMsg: "数据包出错，帧序号存在误差" };
        var AC_ERROR_STREAM_LACKBUFFER = { errorCode: 354, errorMsg: "媒体流缓冲时间不足" };

        //私聊
        var AC_ERROR_RM_PRINULL = { errorCode: 401, errorMsg: "用户已经离开房间" };
        var AC_ERROR_RM_REJECTPRI = { errorCode: 402, errorMsg: "用户拒绝了私聊邀请" };
        var AC_ERROR_RM_PRIDENY = { errorCode: 403, errorMsg: "不允许与该用户私聊，或是用户禁止私聊" };

        var AC_ERROR_RM_PRIREQIDERR = { errorCode: 420, errorMsg: "私聊请求ID号错误，或请求不存在" };
        var AC_ERROR_RM_PRIALRCHAT = { errorCode: 421, errorMsg: "已经在私聊列表中" };

        var AC_ERROR_RM_PRITIMEOUT = { errorCode: 431, errorMsg: "私聊请求超时" };
        var AC_ERROR_RM_PRICHATBUSY = { errorCode: 432, errorMsg: "对方正在私聊中，繁忙状态" };
        var AC_ERROR_RM_PRIUSERCLOSE = { errorCode: 433, errorMsg: "对方用户关闭私聊" };
        var AC_ERROR_RM_PRISELFCLOSE = { errorCode: 434, errorMsg: "用户自己关闭私聊" };
        var AC_ERROR_RM_PRIREQCANCEL = { errorCode: 435, errorMsg: "私聊请求被取消" };

        //视频呼叫
        var AC_ERROR_VIDEOCALL_INCHAT = { errorCode: 440, errorMsg: "正在通话中" };

        //Mic控制权
        var AC_ERROR_MICLOSE_TIMEOUT = { errorCode: 500, errorMsg: "说话时间太长，请休息一下" };
        var AC_ERROR_MICLOSE_HIGHUSER = { errorCode: 501, errorMsg: "有高级别用户需要发言，请休息一下" };


        //集群总线
        var AC_ERROR_COMMBUS_SELFMASTER = { errorCode: 610, errorMsg: "本地总线为Master状态" };
        var AC_ERROR_COMMBUS_OTHERMASTER = { errorCode: 611, errorMsg: "有其它总线存在" };
        var AC_ERROR_COMMBUS_LOWPRIORITY = { errorCode: 612, errorMsg: "优先级不够" };

        //传输部分
        var AC_ERROR_TRANSBUF_CREATEFAIL = { errorCode: 700, errorMsg: "创建任务失败" };
        var AC_ERROR_TRANSBUF_NOTASK = { errorCode: 701, errorMsg: "没有该任务，或是任务已完成" };

        var AC_ERROR_TRANSFILE_OPENFAIL = { errorCode: 710, errorMsg: "打开文件出错" };
        var AC_ERROR_TRANSFILE_ZEROLEN = { errorCode: 711, errorMsg: "文件长度为0" };
        var AC_ERROR_TRANSFILE_TLARGE = { errorCode: 712, errorMsg: "文件长度太大" };
        var AC_ERROR_TRANSFILE_READFAIL = { errorCode: 713, errorMsg: "读文件出错" };
        var AC_ERROR_TRANSFILE_DOWNLOADING = { errorCode: 714, errorMsg: "文件正在下载中" };
        var AC_ERROR_TRANSFILE_FAILED = { errorCode: 715, errorMsg: "文件下载失败" };
        var AC_ERROR_TRANSFILE_NOTASK = { errorCode: 716, errorMsg: "没有该任务，或是任务已完成" };

        //录像部分
        var AC_ERROR_RECORD_NOTASK = { errorCode: 720, errorMsg: "没有录像任务" };
        var AC_ERROR_RECORD_CREATEFAIL = { errorCode: 721, errorMsg: "创建录像任务失败" };
        var AC_ERROR_RECORD_WAITINFO = { errorCode: 722, errorMsg: "等待用户相关信息，暂时不能录像" };

        //队列部分
        var AC_ERROR_QUEUE_INVALID = { errorCode: 750, errorMsg: "无效的队列ID" };
        var AC_ERROR_QUEUE_PREPARESERVICE = { errorCode: 751, errorMsg: "准备接受服务，离开队列" };
        var AC_ERROR_QUEUE_TIMEOUT = { errorCode: 752, errorMsg: "排队超时，离开队列" };

        //SDK警告
        var AC_ERROR_WARNING_UDPFAIL = { errorCode: 780, errorMsg: "与服务器的UDP通信异常，流媒体服务将不能正常工作" };
        var AC_ERROR_WARNING_MISCUTILFAIL = { errorCode: 781, errorMsg: "SDK加载brMiscUtil.dll动态库失败，部分功能将失效" };
        var AC_ERROR_WARNING_MEDIAUTILFAIL = { errorCode: 782, errorMsg: "SDK加载brMediaUtil.dll动态库失败，部分功能将失效" };
        var AC_ERROR_WARNING_MEDIACOREFAIL = { errorCode: 783, errorMsg: "SDK加载brMediaCore.dll动态库失败，部分功能将失效" };
        var AC_ERROR_WARNING_MEDIASHOWFAIL = { errorCode: 784, errorMsg: "SDK加载brMediaShow.dll动态库失败，部分功能将失效" };

        //video device error code define
        var AC_ERROR_VIDEO_OPENFAIL = { errorCode: 10001, errorMsg: "Open video device fail" };
        var AC_ERROR_VIDEO_UNKNOWFMT = { errorCode: 10002, errorMsg: "Unknow output video pix format" };
        var AC_ERROR_VIDEO_VIDIOC_G_FMT = { errorCode: 10003, errorMsg: "Driver Not supported VIDIOC_G_FMT" };
        var AC_ERROR_VIDEO_VIDIOC_S_FMT = { errorCode: 10004, errorMsg: "Driver Not supported VIDIOC_S_FMT" };
        var AC_ERROR_VIDEO_VIDIOC_G_PARM = { errorCode: 10005, errorMsg: "Driver Not supported VIDIOC_G_PARM" };
        var AC_ERROR_VIDEO_VIDIOC_S_PARM = { errorCode: 10006, errorMsg: "Driver Not supported VIDIOC_S_PARM" };
        var AC_ERROR_VIDEO_VIDIOC_QUERYCAP = { errorCode: 10007, errorMsg: "Driver Not supported VIDIOC_QUERYCAP" };
        var AC_ERROR_VIDEO_V4L2_CAP_VIDEO = { errorCode: 10008, errorMsg: "This is not a capture video device" };
        var AC_ERROR_VIDEO_PREP_CAPBUFFER_FALL = { errorCode: 10009, errorMsg: "For acquisition error" };
        var AC_ERROR_VIDEO_VIDIOC_REQBUFS = { errorCode: 10010, errorMsg: "Device Not supported for mmap and usermap mode" };
        var AC_ERROR_VIDEO_VIDIOC_QUERYBUF = { errorCode: 10011, errorMsg: "get physaddr to block fail" };
        var AC_ERROR_VIDEO_MAP_FAILED = { errorCode: 10012, errorMsg: "physaddr map to viraddr fail" };
        var AC_ERROR_VIDEO_VIDIOC_QBUF = { errorCode: 10013, errorMsg: "QBUF fail" };
        var AC_ERROR_VIDEO_PREPBUF = { errorCode: 10013, errorMsg: "video prepbuff fail" };
        var AC_ERROR_VIDEO_GETVIDEO_FAIL = { errorCode: 10014, errorMsg: "get video fail" };
        var AC_ERROR_VIDEO_VIDIOC_DQBUF = { errorCode: 10015, errorMsg: "QBUF fail" };
        var AC_ERROR_VIDEO_VIDIOC_STREAMON = { errorCode: 10016, errorMsg: "VIDIOC_STREAMON fail" };
        var AC_ERROR_VIDEO_VIDIOC_STREAMOFF = { errorCode: 10017, errorMsg: "VIDIOC_STREAMOFF fail" };
        var AC_ERROR_VIDEO_CAMERA_EBUSY = { errorCode: 10018, errorMsg: "May be camera is used by other progress now" };
        var AC_ERROR_VIDEO_UNSUPPORTMODE = { errorCode: 10019, errorMsg: "unsupport video capture mode" };
        var AC_ERROR_VIDEO_CAMERA_EINVAL = { errorCode: 10020, errorMsg: "the requested buffer type not supported, or VIDIOC_TRY_FMT was called and is not supported with this buffer type." };

        //Audio device error code define
        var AC_ERROR_AUDIO_OPENFAIL = { errorCode: 10500, errorMsg: "Open Audio device fail" };
        var AC_ERROR_AUDIO_ALLOCHWPARAMS = { errorCode: 10501, errorMsg: "alloc hwparams fail" };
        var AC_ERROR_AUDIO_INTERLEAVED = { errorCode: 10502, errorMsg: "set interleaved mode fail" };
        var AC_ERROR_AUDIO_FORMAT = { errorCode: 10503, errorMsg: "set wBitsPerSample  fail" };
        var AC_ERROR_AUDIO_SAMPLESPERSEC = { errorCode: 10504, errorMsg: "set SamplesPerSec   fail" };
        var AC_ERROR_AUDIO_CHANNELS = { errorCode: 10505, errorMsg: "set channels fail" };
        var AC_ERROR_AUDIO_PERIODS = { errorCode: 10506, errorMsg: "set periods  fail" };
        var AC_ERROR_AUDIO_BUFFERSIZE = { errorCode: 10507, errorMsg: "set buffer size fail" };
        var AC_ERROR_AUDIO_PARAMS = { errorCode: 10508, errorMsg: "function :snd_pcm_hw_params fail" };
        var AC_ERROR_AUDIO_BUFFERTIME = { errorCode: 10509, errorMsg: "set rebuffer time fail" };
        var AC_ERROR_AUDIO_BUFFERFRAME = { errorCode: 10510, errorMsg: "get rebuffer frames fail" };
        var AC_ERROR_AUDIO_PERIODTIME = { errorCode: 10511, errorMsg: "get period time fail" };
        var AC_ERROR_AUDIO_PERIODFRAME = { errorCode: 10512, errorMsg: "get period time fail" };
        var AC_ERROR_AUDIO_ALLOCSWPARAMS = { errorCode: 10513, errorMsg: "alloc swparams fail" };
        var AC_ERROR_AUDIO_START_THRESHOID = { errorCode: 10514, errorMsg: "set start threshoid fail" };
        var AC_ERROR_AUDIO_START_AVAIL_MIN = { errorCode: 10515, errorMsg: "set start avail min fail" };
        var AC_ERROR_AUDIO_PCMPREPARE = { errorCode: 10516, errorMsg: "function snd_pcm_prepare fail" };
        var AC_ERROR_AUDIO_READFAIL = { errorCode: 10517, errorMsg: "function read fail" };
        var AC_ERROR_AUDIO_CAPMODE = { errorCode: 10518, errorMsg: "音频capmode出错" };


        var AC_ERROR_PLAY_INVALIDSTREAM = { errorCode: 20000, errorMsg: "无效的流" };

        var AC_ERROR_STREAM_SESSIONFAILED = { errorCode: 30000, errorMsg: "创建会话失败" };

        //插件出错代码
        var GV_ERR_PLUGINNOINSTALL = { errorCode: 1010000, errorMsg: "插件没有安装" };
        var GV_ERR_PLUGINOLDVERSION = { errorCode: 1010001, errorMsg: "插件版本太低" };

        //视频呼叫
        var AC_ERROR_VIDEOCALL_CANCEL = { errorCode: 100101, errorMsg: "源用户主动放弃会话" };
        var AC_ERROR_VIDEOCALL_OFFLINE = { errorCode: 100102, errorMsg: "目标用户不在线" };
        var AC_ERROR_VIDEOCALL_BUSY = { errorCode: 100103, errorMsg: "目标用户忙" };
        var AC_ERROR_VIDEOCALL_REJECT = { errorCode: 100104, errorMsg: "目标用户拒绝会话" };
        var AC_ERROR_VIDEOCALL_TIMEOUT = { errorCode: 100105, errorMsg: "会话请求超时" };
        var AC_ERROR_VIDEOCALL_DISCONNECT = { errorCode: 100106, errorMsg: "网络断线" };
        var AC_ERROR_VIDEOCALL_NOTINCALL = { errorCode: 100107, errorMsg: "用户不在呼叫状态" };

        //业务对象
        var AC_ERROR_OBJECT_EXISTAREA = { errorCode: 100201, errorMsg: "已经进入一个服务区域" };
        var AC_ERROR_OBJECT_EXISTQUEUE = { errorCode: 100202, errorMsg: "已经进入一个服务队列" };


        //应用ID
        var AC_ERROR_APPID_DEFAULTNOTSUPPORT = { errorCode: 100300, errorMsg: "默认的应用ID（空）不被支持" };
        var AC_ERROR_APPID_SIGNEED = { errorCode: 100301, errorMsg: "应用登录需要签名" };
        var AC_ERROR_APPID_SIGFAILED = { errorCode: 100302, errorMsg: "应用签名校验失败" };
        var AC_ERROR_APPID_NOTEXIST = { errorCode: 100303, errorMsg: "应用ID不存在" };
        var AC_ERROR_APPID_SYSLOCK = { errorCode: 100304, errorMsg: "应用ID被系统锁定" };
        var AC_ERROR_APPID_NOTMATCH = { errorCode: 100305, errorMsg: "应用ID与当前服务不匹配" };
        var AC_ERROR_APPID_NOTCLOUDSERVER = { errorCode: 100306, errorMsg: "连接的服务器不是云平台地址" };
        var AC_ERROR_APPID_CHARGEMACHINELACK = { errorCode: 100307, errorMsg: "应用所对应的计费服务器不足" };
        var AC_ERROR_APPID_CHARGEMODECHANGE = { errorCode: 100308, errorMsg: "应用计费模式改变" };

        //创建用户
        var AC_ERROR_USERCFG_PASSWDLEN_SMALL = { errorCode: 100400, errorMsg: "用户密码长度过短" };
        var AC_ERROR_USERCFG_USERNAME_SAME = { errorCode: 100401, errorMsg: "用户名重名" };
        var AC_ERROR_USERCFG_ACCESSLIMIT = { errorCode: 100402, errorMsg: "权限受限" };
        var AC_ERROR_USERCFG_USERNAME_LIMIT = { errorCode: 100403, errorMsg: "不允许创建该用户名" };

        //升级服务过程
        var AC_ERROR_LIVEUPDATE_BEGIN = { errorCode: 100500, errorMsg: "升级服务开始" };
        var AC_ERROR_LIVEUPDATE_STOPING = { errorCode: 100501, errorMsg: "升级服务，正在停止当前服务..." };
        var AC_ERROR_LIVEUPDATE_BACKUPING = { errorCode: 100502, errorMsg: "升级服务，正在备份当前服务..." };
        var AC_ERROR_LIVEUPDATE_DELETEING = { errorCode: 100503, errorMsg: "升级服务，正在删除当前服务..." };
        var AC_ERROR_LIVEUPDATE_COPYING = { errorCode: 100504, errorMsg: "升级服务，正在拷贝新服务..." };
        var AC_ERROR_LIVEUPDATE_STARTING = { errorCode: 100505, errorMsg: "升级服务，正在启动新服务..." };
        var AC_ERROR_LIVEUPDATE_RECOVERING = { errorCode: 100506, errorMsg: "升级服务，正在恢复老版本..." };
        var AC_ERROR_LIVEUPDATE_ISTAGVER = { errorCode: 100507, errorMsg: "升级服务，已经是目标版本" };
        var AC_ERROR_LIVEUPDATE_SERVICENEEDSTOP = { errorCode: 100508, errorMsg: "升级服务，当前服务需要停止，才能执行升级操作" };
        var AC_ERROR_LIVEUPDATE_BACKUPFAIL = { errorCode: 100509, errorMsg: "升级服务，备份失败" };
        var AC_ERROR_LIVEUPDATE_DELETEFAIL = { errorCode: 100510, errorMsg: "升级服务，删除失败" };
        var AC_ERROR_LIVEUPDATE_COPYFAIL = { errorCode: 100511, errorMsg: "升级服务，拷贝失败" };
        var AC_ERROR_LIVEUPDATE_RECOVERYFAIL = { errorCode: 100512, errorMsg: "升级服务，恢复老版本失败" };
        var AC_ERROR_LIVEUPDATE_BRIDGENOTREGISTER = { errorCode: 100513, errorMsg: "升级服务，通讯桥未注册" };
        var AC_ERROR_LIVEUPDATE_WRITECONFIGFILEFAILED = { errorCode: 100514, errorMsg: "升级服务，写入配置文件失败" };
        var AC_ERROR_LIVEUPDATE_CANTGETBACKUPDIR = { errorCode: 100515, errorMsg: "升级服务，获取备份文件夹失败" };
        var AC_ERROR_LIVEUPDATE_FINISH = { errorCode: 100516, errorMsg: "升级服务结束" };
        var AC_ERROR_LIVEUPDATE_UNABLETOGETMAINTAINIFO = { errorCode: 100517, errorMsg: "无法获取维护信息" };
        var AC_ERROR_LIVEUPDATE_NOTRENAMEDIR = { errorCode: 100518, errorMsg: "不能重命名文件夹" };

        //停止进程过程
        var AC_ERROR_STOPPROCESS_TIMEOUT = { errorCode: 100600, errorMsg: "停止进程，超时" };
        var AC_ERROR_STOPPROCESS_FAIL = { errorCode: 100601, errorMsg: "停止进程，失败(被回复失败)" };
        var AC_ERROR_STOPPROCESS_FORCEFAIL = { errorCode: 100602, errorMsg: "停止进程，强行杀死失败" };

        //启动进程
        var AC_ERROR_STARTPROCESS_TIMEOUT = { errorCode: 100603, errorMsg: "启动进程,规定时间内没有收到通讯桥通知" };

        var AC_ERROR_SERVICE_CONTROLLED = { errorCode: 100604, errorMsg: "service 正在被控制中(e.g 正在执行升级任务的时候，还收到了其他控制命令)" };
        var AC_ERROR_SERVICE_EXISTELSEVER = { errorCode: 100605, errorMsg: "在启动或解压之前，发现除目标之外还存在其他版本" };
        var AC_ERROR_SERVICE_NOTSUPPORT = { errorCode: 100606, errorMsg: "不支持此操作（e.g 对PMServer下达挂起命令等 ）" };
        var AC_ERROR_NONEXISTENCE_THE_VERSION = { errorCode: 100607, errorMsg: "不存在该版本的升级包" };
        var AC_ERROR_NONEXISTENCE_THE_SERVICE = { errorCode: 100608, errorMsg: "升级包中不存在该服务" };
        var AC_ERROR_ILLEGAL_EXTRA_CONFIG = { errorCode: 100609, errorMsg: "扩展的配置参数非法（e.g LUServer 的 serviceBaseInfo 的扩展参数解析错误）" };
        var AC_ERROR_MOVETEMPFILE_FAIL = { errorCode: 100610, errorMsg: "移动临时文件到升级目录时失败" };
        var AC_ERROR_INCOMPATIBLE_CURRENT_PLATFORM = { errorCode: 100611, errorMsg: "不兼容当前OS平台" };
        var AC_ERROR_GETRT_CONNECT_FAIL = { errorCode: 100612, errorMsg: "获取 rtserverconnect 失败" };

        //业务服务器错误代码
        var AC_ERROR_BUSINESS_PARAM_INVALID = { errorCode: 100701, errorMsg: "无效参数" };
        var AC_ERROR_BUSINESS_APPID_NOTEXIST = { errorCode: 100702, errorMsg: "应用ID不存在" };
        var AC_ERROR_BUSINESS_BODY_INVALID = { errorCode: 100703, errorMsg: "Body无效" };
        var AC_ERROR_BUSINESS_SIGVERIFYFAIL = { errorCode: 100704, errorMsg: "签名验证失败" };
        var AC_ERROR_BUSINESS_SIGTIMEINVALID = { errorCode: 100705, errorMsg: "签名时间戳无效" };
        var AC_ERROR_BUSINESS_MEMORYFAIL = { errorCode: 100706, errorMsg: "not enough memory" };
        var AC_ERROR_BUSINESS_EXCEPTION = { errorCode: 100707, errorMsg: "出现异常" };
        var AC_ERROR_BUSINESS_PROTOCOLFAIL = { errorCode: 100708, errorMsg: "通信协议出错" };
        var AC_ERROR_BUSINESS_TIMEOUT = { errorCode: 100709, errorMsg: "业务服务器执行任务超时" };
        var AC_ERROR_BUSINESS_FILENOEXIST = { errorCode: 100710, errorMsg: "文件不存在" };

        //数据库服务器错误代码
        var AC_ERROR_DB_EXECUTE_ERROR = { errorCode: 100801, errorMsg: "数据库执行错误" };
        var AC_ERROR_DB_SELECT_NODATA = { errorCode: 100802, errorMsg: "数据库查询不到数据" };
        var AC_ERROR_DB_FETCH_ERROR = { errorCode: 100803, errorMsg: "数据库读取行数据错误" };
        var AC_ERROR_DB_EXCEPTION = { errorCode: 100804, errorMsg: "出现异常" };
        var AC_ERROR_DB_CONNECT_ERROR = { errorCode: 100805, errorMsg: "连接异常" };

        //PPT播放相关错误码
        var AC_ERROR_PPTHELPER_INVALIAD_URL = { errorCode: 100901, errorMsg: "无效URL地址" };
        var AC_ERROR_PPTHELPER_RETURNED_ERROR = { errorCode: 100902, errorMsg: "页面不存在" };
        var AC_ERROR_PPTHELPER_COULDNT_CONNECT = { errorCode: 100903, errorMsg: "主机或代理失败" };
        //AI能力错误码
        var AC_ERROR_AI_ABILITY_AIROBOTIDEXIST = { errorCode: 200000, errorMsg: "机器人ID已存在" };
        var AC_ERROR_AI_ABILITY_AITASKIDEXIST = { errorCode: 200001, errorMsg: "ai任务ID已存在" };
        var AC_ERROR_AI_ABILITY_AIOBJNOTEXIST = { errorCode: 200002, errorMsg: "ai对象不存在" };
        var AC_ERROR_AI_ABILITY_PARAMINVALID = { errorCode: 200003, errorMsg: "ai参数错误" };
        var AC_ERROR_AI_ABILITY_FUNCTIONNOTSUPPORT = { errorCode: 200004, errorMsg: "ai能力不支持" };
        var AC_ERROR_AI_ABILITY_UNKNOWAIFUNCTION = { errorCode: 200005, errorMsg: "未知AI能力" };
        var AC_ERROR_AI_ABILITY_HTTPREQUESTFAIL = { errorCode: 200006, errorMsg: "HTTP请求失败" };
        var AC_ERROR_AI_ABILITY_AIREQUESTINITFAIL = { errorCode: 200007, errorMsg: "ai请求初始化失败" };
        var AC_ERROR_AI_ABILITY_AIREQUESTFAIL = { errorCode: 200008, errorMsg: "ai请求失败" };
        var AC_ERROR_AI_ABILITY_AIREQUESTTIMEOUT = { errorCode: 200009, errorMsg: "ai请求超时" };
        var AC_ERROR_AI_ABILITY_AITHREADDATAINVALID = { errorCode: 200010, errorMsg: "ai线程数据信息无效" };
        var AC_ERROR_AI_ABILITY_AITHREADOBJINVALID = { errorCode: 200011, errorMsg: "ai线程对象无效" };
        var AC_ERROR_AI_ABILITY_AIRELATEDATAINVALID = { errorCode: 200012, errorMsg: "ai关联数据无效" };
        var AC_ERROR_AI_ABILITY_HEARTBEATTIMEOUT = { errorCode: 200013, errorMsg: "心跳超时" };
        var AC_ERROR_AI_ABILITY_ROBOTOFFLINE = { errorCode: 200014, errorMsg: "机器人离线" };
        var AC_ERROR_AI_ABILITY_CONTENTOVERLENGTH = { errorCode: 200015, errorMsg: "内容超长" };
        var AC_ERROR_AI_ABILITY_COMMANDOVERLENGTH = { errorCode: 200016, errorMsg: "信令超长" };
        var AC_ERROR_AI_ABILITY_AIOVERCUNCURRENCY = { errorCode: 200017, errorMsg: "ai请求超过并发数" };
        var AC_ERROR_AI_ABILITY_MEDIAPARAMINVALID = { errorCode: 200018, errorMsg: "媒体参数无效" };
        var AC_ERROR_AI_ABILITY_REQUESTIDEXIST = { errorCode: 200019, errorMsg: "请求ID已存在" };
        var AC_ERROR_AI_ABILITY_ABNORMALERROR = { errorCode: 200020, errorMsg: "ai异常错误" };


        errorObjList = [
            AC_ERROR_UNKNOW,
            AC_ERROR_SUCCESS,
            AC_ERROR_DB_ERROR,
            AC_ERROR_NOTINIT,
            AC_ERROR_NOTINRM,
            AC_ERROR_MEMORYFAIL,
            AC_ERROR_EXCEPTION,
            AC_ERROR_CANCEL,
            AC_ERROR_PROTOCOLFAIL,
            AC_ERROR_SESSIONNOTEXIST,
            AC_ERROR_DATANOTEXIST,
            AC_ERROR_DATAEXIST,
            AC_ERROR_INVALIDGUID,
            AC_ERROR_RESOURCERECOVER,
            AC_ERROR_RESOURCEUSED,
            AC_ERROR_JSONFAIL,
            AC_ERROR_OBJECTDELETE,
            AC_ERROR_SESSIONEXIST,
            AC_ERROR_SESSIONNOTINIT,
            AC_ERROR_FUNCNOTALLOW,
            AC_ERROR_FUNCOPTERROR,
            AC_ERROR_DEVICEOPENFAIL,
            AC_ERROR_NOENOUGHRESOURCE,
            AC_ERROR_PIXFMTNOTSUPPORT,
            AC_ERROR_NOTMULTICASTADDR,
            AC_ERROR_MULTIRUNERROR,
            AC_ERROR_FILETRUSTFAILED,
            AC_ERROR_CERTVERIFYFAILED,
            AC_ERROR_CERTUSERFAILED,
            AC_ERROR_MASTERISSLAVE,
            AC_ERROR_MASTERNOTCREDIT,
            AC_ERROR_VERSIONNOTMATCH,
            AC_ERROR_CERTFAILSECOND,
            AC_ERROR_SERVERVERIFYFAIL,
            AC_ERROR_CLIENTCERTFAILED,
            AC_ERROR_CERTSUMFAILED,
            AC_ERROR_REMOTECTRL,
            AC_ERROR_DUPLICATESERVICEID,
            AC_ERROR_DIRENTERROR,
            AC_ERROR_EXTRACTFILEERROR,
            AC_ERROR_STARTPROCESSFAILED,
            AC_ERROR_SERVICEISRUNNING,
            AC_ERROR_DISKSPACELIMITED,
            AC_ERROR_REQUESTFAILED,
            AC_ERROR_INVALIDMACHINE,
            AC_ERROR_GETCERTINFOFAILED,
            AC_ERROR_CLUSTERNOTMATCH,
            AC_ERROR_NONECLUSTERID,
            AC_ERROR_CREATESERVICE_MORE,
            AC_ERROR_COPYFILEFAILED,
            AC_ERROR_CLOUDNATIVEDBFAIL,
            AC_ERROR_CLOUDOSSUPLOADFAIL,
            AC_ERROR_SERVICEBINDCHANGE,
            AC_ERROR_SERVICENOTBIND,
            AC_ERROR_SERVICEBINDFAIL,
            AC_ERROR_PIPELINEUSERFAIL,
            AC_ERROR_PIPELINESESSFAIL,
            AC_ERROR_SERVICECLOSED,
            AC_ERROR_FILEENCRYPTED,
            AC_ERROR_FILEHEADINVAILD,
            AC_ERROR_FILEDECODE_PASSERR,
            AC_ERROR_CONNECT_TIMEOUT,
            AC_ERROR_CONNECT_ABORT,
            AC_ERROR_CONNECT_AUTHFAIL,
            AC_ERROR_CONNECT_DNSERROR,
            AC_ERROR_CONNECT_OVERFLOW,
            AC_ERROR_CONNECT_FUNCLIMIT,
            AC_ERROR_CONNECT_INTRANET,
            AC_ERROR_CONNECT_OLDVERSION,
            AC_ERROR_CONNECT_SOCKETERR,
            AC_ERROR_CONNECT_DEVICELIMIT,
            AC_ERROR_CONNECT_PAUSED,
            AC_ERROR_CONNECT_HOTSERVER,
            AC_ERROR_CONNECT_ERRCERUSER,
            AC_ERROR_CONNECT_IPFORBID,
            AC_ERROR_CONNECT_TYPEWRONG,
            AC_ERROR_CONNECT_ERRORIP,
            AC_ERROR_CONNECT_SELFCLOSE,
            AC_ERROR_CONNECT_NOSVRLIST,
            AC_ERROR_CONNECT_LBTIMEOUT,
            AC_ERROR_CONNECT_NOTWORK,
            AC_ERROR_CONNECT_OFFLINE,
            AC_ERROR_CONNECT_NETLIMITED,
            AC_ERROR_CONNECT_LOWTRAFFIC,
            AC_ERROR_CONNECT_IPV6FAIL,
            AC_ERROR_CONNECT_NOMASTER,
            AC_ERROR_CONNECT_NOSTATUS,
            AC_ERROR_CERTIFY_FAIL,
            AC_ERROR_ALREADY_LOGIN,
            AC_ERROR_ACCOUNT_LOCK,
            AC_ERROR_IPADDR_LOCK,
            AC_ERROR_VISITOR_DENY,
            AC_ERROR_INVALID_USERID,
            AC_ERROR_SERVERSDK_FAIL,
            AC_ERROR_SERVERSDK_TIMEOUT,
            AC_ERROR_NOTLOGIN,
            AC_ERROR_LOGIN_NEWLOGIN,
            AC_ERROR_LOGIN_EMPTYNAME,
            AC_ERROR_KICKOUT,
            AC_ERROR_SERVER_RESTART,
            AC_ERROR_FORBIDDEN,
            AC_ERROR_SIGSTREMPTY,
            AC_ERROR_SIGVERIFYFAIL,
            AC_ERROR_SIGPUBLICKEYEMPTY,
            AC_ERROR_SIGPRIVATEKEYEMPTY,
            AC_ERROR_SIGPARAMEMPTY,
            AC_ERROR_SIGPARAMFAIL,
            AC_ERROR_SIGTIMEFAILURE,
            AC_ERROR_APPNOTACTIVE,
            AC_ERROR_APPPAUSED,
            AC_ERROR_APPLOCKED,
            AC_ERROR_APPEXPIRED,
            AC_ERROR_APPUNKNOWSTATUS,
            AC_ERROR_SIGALREADYUSED,
            AC_ERROR_USERROLE_FAIL,
            AC_ERROR_INVALID_AGENT,
            AC_ERROR_RM_LOCK,
            AC_ERROR_RM_PASSERR,
            AC_ERROR_RM_FULLUSER,
            AC_ERROR_RM_INVALID,
            AC_ERROR_RM_EXPIRE,
            AC_ERROR_RM_REJECT,
            AC_ERROR_RM_OWNERBEOUT,
            AC_ERROR_RM_ENTERFAIL,
            AC_ERROR_RM_ALREADIN,
            AC_ERROR_RM_NOTIN,
            AC_ERROR_STREAM_OLDPACK,
            AC_ERROR_STREAM_SAMEPAK,
            AC_ERROR_STREAM_PACKLOSS,
            AC_ERROR_STREAM_MISTAKE,
            AC_ERROR_STREAM_LACKBUFFER,
            AC_ERROR_RM_PRINULL,
            AC_ERROR_RM_REJECTPRI,
            AC_ERROR_RM_PRIDENY,
            AC_ERROR_RM_PRIREQIDERR,
            AC_ERROR_RM_PRIALRCHAT,
            AC_ERROR_RM_PRITIMEOUT,
            AC_ERROR_RM_PRICHATBUSY,
            AC_ERROR_RM_PRIUSERCLOSE,
            AC_ERROR_RM_PRISELFCLOSE,
            AC_ERROR_RM_PRIREQCANCEL,
            AC_ERROR_VIDEOCALL_INCHAT,
            AC_ERROR_MICLOSE_TIMEOUT,
            AC_ERROR_MICLOSE_HIGHUSER,
            AC_ERROR_COMMBUS_SELFMASTER,
            AC_ERROR_COMMBUS_OTHERMASTER,
            AC_ERROR_COMMBUS_LOWPRIORITY,
            AC_ERROR_TRANSBUF_CREATEFAIL,
            AC_ERROR_TRANSBUF_NOTASK,
            AC_ERROR_TRANSFILE_OPENFAIL,
            AC_ERROR_TRANSFILE_ZEROLEN,
            AC_ERROR_TRANSFILE_TLARGE,
            AC_ERROR_TRANSFILE_READFAIL,
            AC_ERROR_TRANSFILE_DOWNLOADING,
            AC_ERROR_TRANSFILE_FAILED,
            AC_ERROR_TRANSFILE_NOTASK,
            AC_ERROR_RECORD_NOTASK,
            AC_ERROR_RECORD_CREATEFAIL,
            AC_ERROR_RECORD_WAITINFO,
            AC_ERROR_QUEUE_INVALID,
            AC_ERROR_QUEUE_PREPARESERVICE,
            AC_ERROR_WARNING_UDPFAIL,
            AC_ERROR_WARNING_MISCUTILFAIL,
            AC_ERROR_WARNING_MEDIAUTILFAIL,
            AC_ERROR_WARNING_MEDIACOREFAIL,
            AC_ERROR_WARNING_MEDIASHOWFAIL,
            AC_ERROR_VIDEO_OPENFAIL,
            AC_ERROR_VIDEO_UNKNOWFMT,
            AC_ERROR_VIDEO_VIDIOC_G_FMT,
            AC_ERROR_VIDEO_VIDIOC_S_FMT,
            AC_ERROR_VIDEO_VIDIOC_G_PARM,
            AC_ERROR_VIDEO_VIDIOC_S_PARM,
            AC_ERROR_VIDEO_VIDIOC_QUERYCAP,
            AC_ERROR_VIDEO_V4L2_CAP_VIDEO,
            AC_ERROR_VIDEO_PREP_CAPBUFFER_FALL,
            AC_ERROR_VIDEO_VIDIOC_REQBUFS,
            AC_ERROR_VIDEO_VIDIOC_QUERYBUF,
            AC_ERROR_VIDEO_MAP_FAILED,
            AC_ERROR_VIDEO_VIDIOC_QBUF,
            AC_ERROR_VIDEO_PREPBUF,
            AC_ERROR_VIDEO_GETVIDEO_FAIL,
            AC_ERROR_VIDEO_VIDIOC_DQBUF,
            AC_ERROR_VIDEO_VIDIOC_STREAMON,
            AC_ERROR_VIDEO_VIDIOC_STREAMOFF,
            AC_ERROR_VIDEO_CAMERA_EBUSY,
            AC_ERROR_VIDEO_UNSUPPORTMODE,
            AC_ERROR_VIDEO_CAMERA_EINVAL,
            AC_ERROR_AUDIO_OPENFAIL,
            AC_ERROR_AUDIO_ALLOCHWPARAMS,
            AC_ERROR_AUDIO_INTERLEAVED,
            AC_ERROR_AUDIO_FORMAT,
            AC_ERROR_AUDIO_SAMPLESPERSEC,
            AC_ERROR_AUDIO_CHANNELS,
            AC_ERROR_AUDIO_PERIODS,
            AC_ERROR_AUDIO_BUFFERSIZE,
            AC_ERROR_AUDIO_PARAMS,
            AC_ERROR_AUDIO_BUFFERTIME,
            AC_ERROR_AUDIO_BUFFERFRAME,
            AC_ERROR_AUDIO_PERIODTIME,
            AC_ERROR_AUDIO_PERIODFRAME,
            AC_ERROR_AUDIO_ALLOCSWPARAMS,
            AC_ERROR_AUDIO_START_THRESHOID,
            AC_ERROR_AUDIO_START_AVAIL_MIN,
            AC_ERROR_AUDIO_PCMPREPARE,
            AC_ERROR_AUDIO_READFAIL,
            AC_ERROR_AUDIO_CAPMODE,
            AC_ERROR_PLAY_INVALIDSTREAM,
            AC_ERROR_STREAM_SESSIONFAILED,
            GV_ERR_PLUGINNOINSTALL,
            GV_ERR_PLUGINOLDVERSION,
            AC_ERROR_VIDEOCALL_CANCEL,
            AC_ERROR_VIDEOCALL_OFFLINE,
            AC_ERROR_VIDEOCALL_BUSY,
            AC_ERROR_VIDEOCALL_REJECT,
            AC_ERROR_VIDEOCALL_TIMEOUT,
            AC_ERROR_VIDEOCALL_DISCONNECT,
            AC_ERROR_VIDEOCALL_NOTINCALL,
            AC_ERROR_OBJECT_EXISTAREA,
            AC_ERROR_OBJECT_EXISTQUEUE,
            AC_ERROR_APPID_DEFAULTNOTSUPPORT,
            AC_ERROR_APPID_SIGNEED,
            AC_ERROR_APPID_SIGFAILED,
            AC_ERROR_APPID_NOTEXIST,
            AC_ERROR_APPID_SYSLOCK,
            AC_ERROR_APPID_NOTMATCH,
            AC_ERROR_APPID_NOTCLOUDSERVER,
            AC_ERROR_APPID_CHARGEMACHINELACK,
            AC_ERROR_APPID_CHARGEMODECHANGE,
            AC_ERROR_USERCFG_PASSWDLEN_SMALL,
            AC_ERROR_USERCFG_USERNAME_SAME,
            AC_ERROR_USERCFG_ACCESSLIMIT,
            AC_ERROR_USERCFG_USERNAME_LIMIT,
            AC_ERROR_LIVEUPDATE_BEGIN,
            AC_ERROR_LIVEUPDATE_STOPING,
            AC_ERROR_LIVEUPDATE_BACKUPING,
            AC_ERROR_LIVEUPDATE_DELETEING,
            AC_ERROR_LIVEUPDATE_COPYING,
            AC_ERROR_LIVEUPDATE_STARTING,
            AC_ERROR_LIVEUPDATE_RECOVERING,
            AC_ERROR_LIVEUPDATE_ISTAGVER,
            AC_ERROR_LIVEUPDATE_SERVICENEEDSTOP,
            AC_ERROR_LIVEUPDATE_BACKUPFAIL,
            AC_ERROR_LIVEUPDATE_DELETEFAIL,
            AC_ERROR_LIVEUPDATE_COPYFAIL,
            AC_ERROR_LIVEUPDATE_RECOVERYFAIL,
            AC_ERROR_LIVEUPDATE_BRIDGENOTREGISTER,
            AC_ERROR_LIVEUPDATE_WRITECONFIGFILEFAILED,
            AC_ERROR_LIVEUPDATE_CANTGETBACKUPDIR,
            AC_ERROR_LIVEUPDATE_FINISH,
            AC_ERROR_LIVEUPDATE_UNABLETOGETMAINTAINIFO,
            AC_ERROR_LIVEUPDATE_NOTRENAMEDIR,
            AC_ERROR_STOPPROCESS_TIMEOUT,
            AC_ERROR_STOPPROCESS_FAIL,
            AC_ERROR_STOPPROCESS_FORCEFAIL,
            AC_ERROR_STARTPROCESS_TIMEOUT,
            AC_ERROR_SERVICE_CONTROLLED,
            AC_ERROR_SERVICE_EXISTELSEVER,
            AC_ERROR_SERVICE_NOTSUPPORT,
            AC_ERROR_NONEXISTENCE_THE_VERSION,
            AC_ERROR_NONEXISTENCE_THE_SERVICE,
            AC_ERROR_ILLEGAL_EXTRA_CONFIG,
            AC_ERROR_MOVETEMPFILE_FAIL,
            AC_ERROR_INCOMPATIBLE_CURRENT_PLATFORM,
            AC_ERROR_GETRT_CONNECT_FAIL,
            AC_ERROR_BUSINESS_PARAM_INVALID,
            AC_ERROR_BUSINESS_APPID_NOTEXIST,
            AC_ERROR_BUSINESS_BODY_INVALID,
            AC_ERROR_BUSINESS_SIGVERIFYFAIL,
            AC_ERROR_BUSINESS_SIGTIMEINVALID,
            AC_ERROR_BUSINESS_MEMORYFAIL,
            AC_ERROR_BUSINESS_EXCEPTION,
            AC_ERROR_BUSINESS_PROTOCOLFAIL,
            AC_ERROR_BUSINESS_TIMEOUT,
            AC_ERROR_BUSINESS_FILENOEXIST,
            AC_ERROR_DB_EXECUTE_ERROR,
            AC_ERROR_DB_SELECT_NODATA,
            AC_ERROR_DB_FETCH_ERROR,
            AC_ERROR_DB_EXCEPTION,
            AC_ERROR_DB_CONNECT_ERROR,
            AC_ERROR_PPTHELPER_INVALIAD_URL,
            AC_ERROR_PPTHELPER_RETURNED_ERROR,
            AC_ERROR_PPTHELPER_COULDNT_CONNECT,
            AC_ERROR_AI_ABILITY_AIROBOTIDEXIST ,
            AC_ERROR_AI_ABILITY_AITASKIDEXIST ,
            AC_ERROR_AI_ABILITY_AIOBJNOTEXIST,
            AC_ERROR_AI_ABILITY_PARAMINVALID,
            AC_ERROR_AI_ABILITY_FUNCTIONNOTSUPPORT,
            AC_ERROR_AI_ABILITY_UNKNOWAIFUNCTION,
            AC_ERROR_AI_ABILITY_HTTPREQUESTFAIL,
            AC_ERROR_AI_ABILITY_AIREQUESTINITFAIL,
            AC_ERROR_AI_ABILITY_AIREQUESTFAIL,
            AC_ERROR_AI_ABILITY_AIREQUESTTIMEOUT ,
            AC_ERROR_AI_ABILITY_AITHREADDATAINVALID ,
            AC_ERROR_AI_ABILITY_AITHREADOBJINVALID ,
            AC_ERROR_AI_ABILITY_AIRELATEDATAINVALID ,
            AC_ERROR_AI_ABILITY_HEARTBEATTIMEOUT ,
            AC_ERROR_AI_ABILITY_ROBOTOFFLINE ,
            AC_ERROR_AI_ABILITY_CONTENTOVERLENGTH ,
            AC_ERROR_AI_ABILITY_COMMANDOVERLENGTH ,
            AC_ERROR_AI_ABILITY_AIOVERCUNCURRENCY ,
            AC_ERROR_AI_ABILITY_MEDIAPARAMINVALID ,
            AC_ERROR_AI_ABILITY_REQUESTIDEXIST ,
            AC_ERROR_AI_ABILITY_ABNORMALERROR,
        ];

        var errorObjMap;

        try {
            errorObjMap = new Map();
            for (var errorObj in errorObjList) {
                errorObjMap.set(errorObjList[errorObj].errorCode, errorObjList[errorObj].errorMsg);
            }
        } catch (e) {

        }

        function checkErrorMsg(errorCode) {
            if (errorObjMap) {
                return errorObjMap.get(errorCode);
            } else {
                for (var errorObj in errorObjList) {
                    if (errorObjList[errorObj].errorCode == errorCode) {
                        return errorObjList[errorObj].errorMsg;
                    }
                }
            }
        }

        exports.checkErrorMsg = checkErrorMsg;

        /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat营业厅处理器
	 * 函数说明:AnyChat营业厅相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKAreaHandler");
        var AnyChatSDKConstant = __webpack_require__(2);
        var AnyChatSDKErrorCode = __webpack_require__(5);
        var AnyChatSDKUserHandler = __webpack_require__(4);
        var AnyChatSDKQueueHandler = __webpack_require__(7);
        var CONSTANT = AnyChatSDKConstant.instance;

        // 自定义指令构造函数
        function AnyChatSDKAreaHandler() {
            this.agentStatus = 0; //坐席状态：0--关闭  1--等待中  2--服务中  3--暂停服务  10--关闭
            this.currentAgentID; //当前坐席ID
            this.areaId; //当前营业厅ID

            this.areaIdArray = [];
            this.areaIdIndex = 0;
        }

        AnyChatSDKAreaHandler.prototype = {
            constructor: AnyChatSDKAreaHandler,
            //进入营业厅
            inArea: function(anychatSDKInstance, opt) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var errorCode = enterArea({
                    areaId: opt.areaId
                });
                if (errorCode == 0) {
                    this.areaId = opt.areaId;
                }
                return errorCode;
            },
            //退出营业厅
            outArea: function(anychatSDKInstance) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var errorCode = leaveArea({
                    areaId: this.areaId
                });
                if (errorCode == 0) {
                    this.areaId = "";
                }
                return errorCode;
            },
            getAreas: function() {
                return getAreaData({
                    userId: AnyChatSDKUserHandler.instance.userId
                });
            },
            agentServiceCtrl: function(anychatSDKInstance, opt) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var statusCode = 0;
                switch (opt.ctrlCode) {
                    case 0:
                        statusCode = 1;
                        break;
                    case 1:
                        statusCode = 0;
                        break;
                    case 2:
                        statusCode = 3;
                        break;
                    case 3:
                        statusCode = 100105;
                        break;
                    case 4:
                        statusCode = 4;
                        break;
                }
                var errorCode = agentStatusCtrl({
                    userId: AnyChatSDKUserHandler.instance.userId,
                    ctrlCode: statusCode
                });
                var result = {
                    code: errorCode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(errorCode)
                };
                _sdk.eventTarget.fireEvent({
                    type: "onServiceCtrlDone",
                    result: result
                });
                return errorCode;
            },
            getAgentStatus: function() {
                var data = {};
                data.serviceUserCount = getServiceUserCount({ userId: AnyChatSDKUserHandler.instance.userId });
                data.serviceBeginTime = getServiceBeginTime({ userId: AnyChatSDKUserHandler.instance.userId });
                data.serviceTotalTime = getServiceTotalTime({ userId: AnyChatSDKUserHandler.instance.userId });
                return data;
            },
            getAgentCount: function(opt) {
                return getAgentCount(opt);
            },
            getIdleAgentCount: function(opt) {
                return getIdleAgentCount(opt);
            },
            getAreaQueueUserCount:function(opt){
                return getAreaQueueUserCount(opt);
            }
        };

        /*
	以下是营业厅的操作
	*/
        // 向服务器同步营业厅信息
        function getAreaData(params) {
            var erroCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, ANYCHAT_INVALID_OBJECT_ID, ANYCHAT_OBJECT_CTRL_SYNCDATA, params.userId, 0, 0, 0, "");
            return erroCode;
        }

        // 进入营业厅
        function enterArea(params) {
            var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_CTRL_USERENTER, 0, 0, 0, 0, "");
            return errorCode;
        }

        // 离开营业厅
        function leaveArea(params) {
            var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_CTRL_USERLEAVE, 0, 0, 0, 0, "");
            return errorCode;
        }

        // 获取营业厅名称
        function getAreaName(params) {
            var areaName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_OBJECT_INFO_NAME);
            return areaName;
        }

        // 获取营业厅描述
        function getAreaDescription(params) {
            var areaDescription = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
            return areaDescription;
        }


        /*
	以下是坐席操作
	*/
        // 坐席操作
        function agentStatusCtrl(params) {
            var errorCode = 0;
            if (AnyChatSDKQueueHandler.instance.isAutoMode == 1) {
                if(params.ctrlCode == 100105)  {
                    BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, params.ctrlCode, 0, 0, 0, "");
                    errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, 0, 0, 0, 0, "");
                } else {
                    errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, params.ctrlCode, 0, 0, 0, "");
                }
                return errorCode;
            } else {
                if (params.ctrlCode == 1) {
                    errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_SERVICEREQUEST, 0, 0, 0, 0, "");
                    return errorCode;
                } else if (params.ctrlCode == 0) {
                    errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, 0, 0, 0, 0, "");
                    return errorCode;
                }
            }
        }

        // 获取累计服务用户总数
        function getServiceUserCount(params) {
            var serviceUserCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICETOTALNUM);
            return serviceUserCount;
        }

        // 获取当前服务开始时间
        function getServiceBeginTime(params) {
            var serviceBeginTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICEBEGINTIME);
            return serviceBeginTime;
        }

        // 获取累计服务时长
        function getServiceTotalTime(params) {
            var serviceTotalTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICETOTALTIME);
            return serviceTotalTime;
        }

        // 获取当前服务状态
        function getAgentServiceStatus(params) {
            var agentServiceStatus = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, params.userId, ANYCHAT_AGENT_INFO_SERVICESTATUS);
            return agentServiceStatus;
        }


        /*
	以下是客户操作
	*/
        // 获取队列列表
        function getQueueList() {
            var queueList = BRAC_ObjectGetIdList(ANYCHAT_OBJECT_TYPE_QUEUE);
            return queueList;
        }

        //获取服务区域客服用户数
        function getAgentCount(params) {
            return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_AGENTCOUNT);
        }

        //获取服务区域空闲坐席数量
        function getIdleAgentCount(params) {
            return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);
        }

        //获取服务区域内排队的用户数
        function getAreaQueueUserCount(params) {
            return BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, params.areaId, ANYCHAT_AREA_INFO_QUEUEUSERCOUNT);
        }

        var instance = new AnyChatSDKAreaHandler();

        exports.instance = instance;
        exports.getAreaName = getAreaName;
        exports.getAreaDescription = getAreaDescription;

        /***/ }),
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat队列处理器
	 * 函数说明:AnyChat队列相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKQueueHandler");
        var AnyChatSDKConstant = __webpack_require__(2);
        var CONSTANT = AnyChatSDKConstant.instance;

        // 自定义指令构造函数
        function AnyChatSDKQueueHandler() {
            this.isAutoMode = 1;
            this.isGlobal = 0;
            this.name; //对象名称
            this.priority = 5;
            this.attribute = -1;
            this.currentQueueId = "";
            this.waitingTimer;
        }

        AnyChatSDKQueueHandler.prototype = {
            constructor: AnyChatSDKQueueHandler,
            //进队列
            inQueue: function(anychatSDKInstance, opt) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var timeout = 0;
                if (opt.hasOwnProperty("timeout")) {
                    timeout = opt.timeout;
                }
                var errorCode = enterQueue({
                    queueId: opt.queueId,
                    timeout: timeout
                });
                if (errorCode == 0) {
                    this.currentQueueId = opt.queueId;
                }
                return errorCode;
            },
            //取消队列
            outQueue: function(anychatSDKInstance) {
                var _sdk = anychatSDKInstance;
                if (_sdk.curConnectStatus == CONSTANT.ConnectStatus.OFFLINE) {
                    return;
                }
                var errorCode = leaveQueue({
                    queueId: this.currentQueueId
                });
                return errorCode;
            },
            //插队
            jumpQueue: function(anychatSDKInstance) {

            },
            //查询排队时长
            getQueueTime: function(params) {
                return getQueueTime(params);
            },
            //查询队列长度
            getQueueLength: function(params) {
                return getQueueLength(params);
            },
            //查询排队的位置
            getQueuePos: function(params) {
                return getQueuePos(params);
            },
            //查询队列排队用户的详细信息
            getQueueUserInfo:function(params){
                return getQueueUserInfo(params);
            }
        };

        // 进入服务队列
        function enterQueue(params) {
            var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_CTRL_USERENTER, params.timeout, 0, 0, 0, "");
            return errorCode;
        }

        // 离开服务队列
        function leaveQueue(params) {
            var errorCode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_CTRL_USERLEAVE, 0, 0, 0, 0, "");
            return errorCode;
        }

        // 获取队列名
        function getQueueName(params) {
            var queueName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_OBJECT_INFO_NAME);
            return queueName;
        }

        // 获取队列描述
        function getQueueInfo(params) {
            var queueInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
            return queueInfo;
        }

        // 获取队列排队人数
        function getQueueLength(params) {
            var queueLength = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_LENGTH);
            return queueLength;
        }

        // 获取当前在队列中的位置
        function getQueuePos(params) {
            var beforeUserNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_BEFOREUSERNUM);
            beforeUserNum = beforeUserNum < 0 ? 0 : beforeUserNum;
            return beforeUserNum++;
        }

        // 获取排队时间（单位：秒）
        function getQueueTime(params) {
            var seconds = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_WAITTIMESECOND);
            return seconds;
        }

        //获取队列排队用户的详细信息
        function getQueueUserInfo(params){
            var userInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, params.queueId, ANYCHAT_QUEUE_INFO_USERINFOLIST);
            var userArr=[];
            if(userInfo){
                var userObj=JSON.parse(userInfo);
                var queuelength=userObj.queuelength;
                if(queuelength>0){
                    for(var i=0;i<queuelength;i++){
                        var obj={
                            'entertime':userObj.entertimelist[i], //用户进入队列的时间
                            'strid':userObj.stridlist[i],  //struserid
                            'userid':userObj.useridlist[i], //userid
                            'username':userObj.usernamelist[i], //用户名
                        }
                        userArr.push(obj);
                    }
                }
            }
            return userArr;
        }
        AnyChatSDKQueueHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {

            if (typeof option.queueOpt === "object") {
                typeof(option.queueOpt.onAreaChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAreaChanged", option.queueOpt.onAreaChanged, false);
                typeof(option.queueOpt.onQueueChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onQueueChanged", option.queueOpt.onQueueChanged, false);
                typeof(option.queueOpt.onServiceNotify) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onServiceNotify", option.queueOpt.onServiceNotify, false);
                typeof(option.queueOpt.onElseAgentStatusChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onElseAgentStatusChanged", option.queueOpt.onElseAgentStatusChanged, false);
                typeof (option.queueOpt.onLeaveQueue) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onLeaveQueue", option.queueOpt.onLeaveQueue, false);
                typeof (option.queueOpt.OnQueueUserInfoChanged) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("OnQueueUserInfoChanged", option.queueOpt.OnQueueUserInfoChanged, false);
            }
        };


        var instance = new AnyChatSDKQueueHandler();

        exports.instance = instance;

        /***/ }),
    /* 8 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChatSDKEventDispatcher
	 * 函数说明:AnyChat内部回调函数处理器
	 *
	 *
	 * ----------------------------------------------------------
	 */
        var AnyChatSDKConstant = __webpack_require__(2);
        var AnyChatSDKEventTarget = __webpack_require__(3);
        var AnyChatSDKFileHandler = __webpack_require__(9);
        var AnyChatSDKUserHandler = __webpack_require__(4);
        var AnyChatSDKQueueHandler = __webpack_require__(7);
        var AnyChatSDKAreaHandler = __webpack_require__(6);
        var AnyChatSDKErrorCode = __webpack_require__(5);
        var AnyChatSDKVideoCallHandler = __webpack_require__(10);
        var AnyChatSDKFriendHandler = __webpack_require__(11);
        var AnyChatSDKStreamPlayHandler = __webpack_require__(12);
        var AnyChatWhiteBoard =__webpack_require__(20);
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKEventDispatcher");
        var CONSTANT = AnyChatSDKConstant.instance;

        var getStrUserId = AnyChatSDKUserHandler.getStrUserId;


        //事件构造函数
        function AnyChatSDKEventDispatcher() {
            // 事件处理程序数组集合
            this.handlers = {};
            this.eventTarget = AnyChatSDKEventTarget.instance;
            this.constant = AnyChatSDKConstant.instance;
            this.anychatSDKInstance = null;
            this.roomId = null;

            window.OnAnyChatNotifyMessage     = OnAnyChatNotifyMessage;
            window.OnAnyChatTextMessage       = OnAnyChatTextMessage;
            window.OnAnyChatTransBuffer       = OnAnyChatTransBuffer;
            window.OnAnyChatTransBufferEx     = OnAnyChatTransBufferEx;
            window.OnAnyChatTransFile         = OnAnyChatTransFile;
            window.OnAnyChatVolumeChange      = OnAnyChatVolumeChange;
            window.OnAnyChatSDKFilterData     = OnAnyChatSDKFilterData;
            window.OnAnyChatVideoCallEvent   = OnAnyChatVideoCallEvent;
            window.OnAnyChatRecordSnapShot    = OnAnyChatRecordSnapShot;
            window.OnAnyChatRecordSnapShotEx  = OnAnyChatRecordSnapShotEx;
            window.OnAnyChatRecordSnapShotEx2 = OnAnyChatRecordSnapShotEx2;
            window.OnAnyChatCoreSDKEvent      = OnAnyChatCoreSDKEvent;
            window.OnAnyChatObjectEvent       = OnAnyChatObjectEvent;
        }

        // 自定义事件的原型对象
        AnyChatSDKEventDispatcher.prototype = {
            // 设置原型构造函数链
            constructor: AnyChatSDKEventDispatcher,

            callbackinit: function(anychatSDKInstance, anychat) {
                this.anychatSDKInstance = anychatSDKInstance;
                //     if (typeof(this.OnAnyChatNotifyMessage) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnNotifyMessage', this.OnAnyChatNotifyMessage);
                //     if (typeof(OnAnyChatTextMessage) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnTextMessage', OnAnyChatTextMessage);
                //     if (typeof(OnAnyChatTransBuffer) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnTransBuffer', OnAnyChatTransBuffer);
                //     if (typeof(OnAnyChatTransBufferEx) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnTransBufferEx', OnAnyChatTransBufferEx);
                //     if (typeof(OnAnyChatTransFile) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnTransFile', OnAnyChatTransFile);
                //     if (typeof(OnAnyChatVolumeChange) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnVolumeChange', OnAnyChatVolumeChange);
                //     if (typeof(OnAnyChatSDKFilterData) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnSDKFilterData', OnAnyChatSDKFilterData);
                //     if (typeof(OnAnyChatVideoCallEvent) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnVideoCallEvent', OnAnyChatVideoCallEvent);
                //     if (typeof(OnAnyChatRecordSnapShot) == "function")
                //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShot', OnAnyChatRecordSnapShot);
                //     if (typeof(OnAnyChatRecordSnapShotEx) == "function" && bSupportStreamRecordCtrlEx)
                //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShotEx', OnAnyChatRecordSnapShotEx);
                //     if (typeof(OnAnyChatRecordSnapShotEx2) == "function" && bSupportCluster)
                //         BRAC_RegisterCallBack(anychat, 'OnRecordSnapShotEx2', OnAnyChatRecordSnapShotEx2);
                //     if (typeof(OnAnyChatCoreSDKEvent) == "function" && CUR_ANYCHAT_PLUGIN_VAR >= "1.0.6.0")
                //         BRAC_RegisterCallBack(anychat, 'OnAnyChatCoreSDKEvent', OnAnyChatCoreSDKEvent);
                //     if (typeof(this.OnAnyChatObjectEvent) == "function" && bSupportObjectBusiness)
                //         BRAC_RegisterCallBack(anychat, 'OnObjectEvent', this.OnAnyChatObjectEvent);
            }
        };
        function h5On(anychatSDKInstance, anychat) {
            this.anychatSDKInstance = anychatSDKInstance;

            if (typeof(this.OnAnyChatNotifyMessage) == "function")
                anychat.on("OnNotifyMessage", this.OnAnyChatNotifyMessage);
            if (typeof(OnAnyChatVideoCallEvent) == "function")
                anychat.on("OnVideoCallEvent", OnAnyChatVideoCallEvent);
            if (typeof(OnAnyChatTransBuffer) == "function")
                anychat.on("OnTransBuffer", OnAnyChatTransBuffer);
            if (typeof(OnAnyChatTextMessage) == "function")
                anychat.on("OnTextMessage", OnAnyChatTextMessage);
            if (typeof(this.OnAnyChatObjectEvent) == "function")
                anychat.on("OnObjectEvent", this.OnAnyChatObjectEvent);
            if (typeof (OnAnyChatTransBufferEx) == "function")
                anychat.on("OnTransBufferex", OnAnyChatTransBufferEx);
        }

        function OnAnyChatNotifyMessage(dwNotifyMsg, wParam, lParam) {
            switch (dwNotifyMsg) {
                case WM_GV_CONNECT:
                    OnAnyChatConnect(wParam, lParam);
                    break;
                case WM_GV_LOGINSYSTEM:
                    OnAnyChatLoginSystem(wParam, lParam);
                    break;
                case WM_GV_ENTERROOM:
                    OnAnyChatEnterRoom(wParam, lParam);
                    break;
                case WM_GV_ONLINEUSER:
                    OnAnyChatRoomOnlineUser(wParam, lParam);
                    break;
                case WM_GV_USERATROOM:
                    OnAnyChatUserAtRoom(wParam, lParam);
                    break;
                case WM_GV_LINKCLOSE:
                    OnAnyChatLinkClose(wParam, lParam);
                    break;
                case WM_GV_MICSTATECHANGE:
                    OnAnyChatMicStateChange(wParam, lParam);
                    break;
                case WM_GV_CAMERASTATE:
                    OnAnyChatCameraStateChange(wParam, lParam);
                    break;
                case WM_GV_P2PCONNECTSTATE:
                    OnAnyChatP2PConnectState(wParam, lParam);
                    break;
                case WM_GV_PRIVATEREQUEST:
                    OnAnyChatPrivateRequest(wParam, lParam);
                    break;
                case WM_GV_PRIVATEECHO:
                    OnAnyChatPrivateEcho(wParam, lParam);
                    break;
                case WM_GV_PRIVATEEXIT:
                    OnAnyChatPrivateExit(wParam, lParam);
                    break;
                case WM_GV_USERINFOUPDATE:
                    OnAnyChatUserInfoUpdate(wParam, lParam);
                    break;
                case WM_GV_FRIENDSTATUS:
                    OnAnyChatFriendStatus(wParam, lParam);
                    break;
                case WM_GV_VIDEOSIZECHG:
                    OnAnyChatVideoSizeChange(wParam, lParam);
                    break;
                default:
                    break;
            }
        }

        function OnAnyChatObjectEvent(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam) {
            console.log("OnAnyChatObjectEvent dwEventType: " + dwEventType);
            switch (dwEventType) {
                case ANYCHAT_OBJECT_EVENT_UPDATE:
                    OnAnyChatObjectUpdate(dwObjectType, dwObjectId);
                    break;
                case ANYCHAT_OBJECT_EVENT_SYNCDATAFINISH:
                    OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId);
                    break;
                case ANYCHAT_AREA_EVENT_ENTERRESULT:
                    OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_AREA_EVENT_LEAVERESULT:
                    OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_AREA_EVENT_STATUSCHANGE:
                    OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_QUEUE_EVENT_STATUSCHANGE:
                    OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId);
                    break;
                case ANYCHAT_QUEUE_EVENT_ENTERRESULT:
                    OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_QUEUE_EVENT_LEAVERESULT:
                    OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_QUEUE_EVENT_USERINFOLISTCHG:
                    OnAnyChatQueueUserInfoChanged(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam);
                    break;
                case ANYCHAT_AGENT_EVENT_STATUSCHANGE:
                    OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1);
                    break;
                case ANYCHAT_AGENT_EVENT_SERVICENOTIFY:
                    OnAnyChatServiceStart(dwParam1, dwParam2, dwParam3);
                    break;
                case ANYCHAT_AGENT_EVENT_WAITINGUSER:
                    OnAnyChatAgentWaitingUser();
                    break;
                case ANYCHAT_AGENT_EVENT_ISREADY:
                    OnAnyChatAgentprepared(dwParam1, dwParam2, dwParam3);
                    break;
                default:
                    break;
            }
        }

        function OnAnyChatConnect(wParam, lParam) {
            logger.callbackLog("Connect", lParam);
            if (lParam != 0) {
                //lParam = 101;
                var result = {
                    code: lParam,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
                };
                instance.eventTarget.fireEvent({
                    type: "onDisConnect",
                    result: result
                });
            }
            // else {
            //        instance.anychatSDKInstance.login();
            //    }

        }

        function OnAnyChatLoginSystem(wParam, lParam) {

            if (lParam == 0) {
                instance.anychatSDKInstance.curConnectStatus = CONSTANT.ConnectStatus.OPEN;
            }

            AnyChatSDKUserHandler.instance.userId = wParam;
            var strUserId = getStrUserId(wParam);
            if (strUserId == "") {
                strUserId = wParam;
                AnyChatSDKUserHandler.instance.isSupportEx = false;
            }
            if (!bSupportScriptObject)
                instance.anychatSDKInstance.strUserId = strUserId;

            var dwAgentFlags = -1; //身份标识
            if (lParam == 0) {

                switch (AnyChatSDKUserHandler.instance.userType) {
                    case ANYCHAT_OBJECT_FLAGS_CLIENT:
                        dwAgentFlags = 0; //客户标识
                        //mCurrentStatus = CLIENT_STATUS_AREA;
                        break;
                    case ANYCHAT_OBJECT_FLAGS_AGENT:
                        AnyChatSDKAreaHandler.instance.currentAgentID = wParam;
                        dwAgentFlags = ANYCHAT_OBJECT_FLAGS_AGENT+ANYCHAT_OBJECT_FLAGS_QUEUEUSERLIST;  // 坐席标识

                        if (AnyChatSDKQueueHandler.instance.isAutoMode == 1) {
                            dwAgentFlags = dwAgentFlags + ANYCHAT_OBJECT_FLAGS_AUTOMODE; //坐席标识
                        }
                        if (AnyChatSDKQueueHandler.instance.isGlobal == 1) {
                            dwAgentFlags = dwAgentFlags + ANYCHAT_OBJECT_FLAGS_GLOBAL; //坐席标识
                        }

                    default:
                        break;
                }

                if (dwAgentFlags != -1) {
                    var dwPriority = AnyChatSDKQueueHandler.instance.priority;

                    //技能分组初始值
                    var dwAttribute = AnyChatSDKQueueHandler.instance.attribute ? AnyChatSDKQueueHandler.instance.attribute : "";

                    //队列组初始值
                    // dwAttribute = "";
                    // var queueGroupValue = [2001];
                    // dwAttribute = { queuegroups: queueGroupValue };

                    //身份信息设置
                    BRAC_SetSDKOption(BRAC_SO_OBJECT_INITFLAGS, dwAgentFlags);

                    if (dwAgentFlags == 0) {
                        //客户端用户对象优先级
                        BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_PRIORITY, dwPriority);
                        var dwAttributeClient = -1;
                        BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_ATTRIBUTE, dwAttributeClient);
                    } else {
                        BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_PRIORITY, dwPriority);
                        if(AnyChatSDKQueueHandler.instance.isGlobalAgent == 1){
                            BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, wParam, ANYCHAT_OBJECT_INFO_ATTRIBUTE, -1);
                        }
                        BRAC_ObjectSetValue(ANYCHAT_OBJECT_TYPE_CLIENTUSER, AnyChatSDKUserHandler.instance.userId, ANYCHAT_OBJECT_INFO_STRINGTAG, AnyChatSDKQueueHandler.instance.attribute);
                    }
                }
                var result = {
                    code: lParam,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
                };
                var data = {
                    userId: strUserId
                };
                //虚拟背景初始化
                var IMAGE_FILTER_TYPE_BACKGROUND_OBS = 0x10;
                var szControlJson = "{\"filtertype\":" + IMAGE_FILTER_TYPE_BACKGROUND_OBS + "}";
                BRAC_SDKControl( ANYCHAT_SDKCTRL_MEDIAFILTERINIT, szControlJson );
                instance.eventTarget.fireEvent({
                    type: "onLogin",
                    data: data
                });
            } else {
                var result = {
                    code: lParam,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
                };
                instance.eventTarget.fireEvent({
                    type: "onDisConnect",
                    result: result
                });
            }

            logger.callbackLog("LoginSystem", lParam, data);

        }

        function OnAnyChatLinkClose(wParam, lParam) {
            var result = {
                code: lParam,
                msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
            };
            instance.eventTarget.fireEvent({
                type: "onDisConnect",
                result: result
            });
            instance.anychatSDKInstance.curConnectStatus = CONSTANT.ConnectStatus.OFFLINE;
            if (instance.eventTarget.doneHandlers.length > 0) {
                for (var i = 0; i < instance.eventTarget.doneHandlers.length; i++) {
                    instance.eventTarget.fireEvent({
                        type: instance.eventTarget.doneHandlers[i],
                        result: result
                    });
                }
            }
            logger.callbackLog("LinkClose", lParam);
        }

        // 客户端进入房间，dwRoomId表示所进入房间的ID号，errorcode表示是否进入房间：0成功进入，否则为出错代码
        function OnAnyChatEnterRoom(wParam, lParam) {
            AnyChatSDKEventDispatcher.roomId = wParam;
            var arguement1 = {
                code: lParam,
                msg: AnyChatSDKErrorCode.checkErrorMsg(lParam)
            };

            var arguement2 = {
                roomId: wParam
            };
            instance.eventTarget.fireEvent({
                type: "OnAnyChatEnterRoom",
                result: arguement1,
                data: arguement2
            });
            logger.callbackLog("EnterRoom", lParam, arguement2);
        }

        // 收到当前房间的在线用户信息，进入房间后触发一次，dwUserCount表示在线用户数（包含自己），dwRoomId表示房间ID
        function OnAnyChatRoomOnlineUser(dwUserCount, dwRoomId) {
            //instance.anychatSDKInstance.getRoomUsers();
        }

        // 用户进入（离开）房间，dwUserId表示用户ID号，bEnterRoom表示该用户是进入（1）或离开（0）房间
        function OnAnyChatUserAtRoom(dwUserId, bEnterRoom) {
            var strUserId = dwUserId+"";
            if (bEnterRoom) {
                strUserId = getStrUserId(dwUserId);
                AnyChatSDKUserHandler.instance.atRoomUserList.push({ intUserId: dwUserId, strUserId: strUserId });
            } else {
                for (var i = 0; i < AnyChatSDKUserHandler.instance.atRoomUserList.length; i++) {
                    if (AnyChatSDKUserHandler.instance.atRoomUserList[i].intUserId == dwUserId) {
                        strUserId = AnyChatSDKUserHandler.instance.atRoomUserList[i].strUserId;
                        AnyChatSDKUserHandler.instance.atRoomUserList.splice(i, 1);
                        break;
                    }
                }
            }
            var list = AnyChatSDKUserHandler.instance.atRoomUserList;
            var userData = {
                userId: strUserId,
                roomId: AnyChatSDKEventDispatcher.roomId,
                action: bEnterRoom
            };
            instance.eventTarget.fireEvent({
                type: "onRoomUserInAndOut",
                result: userData
            });

            var data = {
                userList: list,
                userNum: list.length,
                roomId: AnyChatSDKEventDispatcher.roomId
            };


            instance.eventTarget.fireEvent({
                type: "onRoomUserChanged",
                data: data
            });

            logger.callbackLog("onRoomUserChanged", 0, userData);
        }

        // 收到文字消息
        function OnAnyChatTextMessage(dwFromUserId, dwToUserId, bSecret, lpMsgBuf, dwLen) {

            var fromStrUserId = getStrUserId(dwFromUserId);
            var toStrUserId = getStrUserId(dwToUserId);
            var data = {
                userId: fromStrUserId,
                toUserId: toStrUserId,
                msg: lpMsgBuf
            };
            instance.eventTarget.fireEvent({
                type: "onRoomUserMsgReceived",
                data: data
            });
            logger.callbackLog("TextMessage", 0, data);
        }

        // 收到透明通道传输数据
        function OnAnyChatTransBuffer(dwUserId, lpBuf, dwLen) {
            var strUserId = getStrUserId(dwUserId);

            if (lpBuf != "") {
                var msg = AnyChatSDKUserHandler.Base64.decode(lpBuf);
                if (msg.indexOf("#") == -1) {
                    var msgId = msg;
                    for (var i = 0; i < AnyChatSDKUserHandler.instance.currentMsgTaskId.length; i++) {
                        if (AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgId == msgId) {
                            var content = AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgContent;
                            clearTimeout(AnyChatSDKUserHandler.instance.currentMsgTaskId[i].timer);
                            AnyChatSDKUserHandler.instance.currentMsgTaskId.slice(i, 1);
                            break;
                        }
                    }
                    var data = {
                        userId: strUserId,
                        msg: content
                    };
                    instance.eventTarget.fireEvent({
                        type: "onTransBufferDone",
                        result: {
                            code: 0,
                            msg: "发送成功"
                        },
                        data: data
                    });
                    logger.callbackLog("TransBuffer", 0, data);
                    return;
                } else {
                    var msgId = msg.substring(0, msg.indexOf("#"));
                    var msgData = msg.substring(msg.indexOf("#") + 1, msg.length);
                    try {
                        msgData = JSON.parse(msgData);
                    } catch (error) {

                    }
                    BRAC_TransBuffer(dwUserId, AnyChatSDKUserHandler.Base64.encode(msgId));

                    var data = {
                        userId: strUserId,
                        msg: msgData
                    };
                    instance.eventTarget.fireEvent({
                        type: "onReceiveBuffer",
                        data: data
                    });
                    logger.callbackLog("ReceiveBuffer", 0, data);
                }

            }
        }

        // 收到透明通道（扩展）传输数据
        function OnAnyChatTransBufferEx(dwUserId, lpBuf, dwLen) {
            var strUserId = getStrUserId(dwUserId);

            if (lpBuf != "") {
                var msg = AnyChatSDKUserHandler.Base64.decode(lpBuf);
                if (msg.indexOf("#") == -1) {
                    var msgId = msg;
                    for (var i = 0; i < AnyChatSDKUserHandler.instance.currentMsgTaskId.length; i++) {
                        if (AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgId == msgId) {
                            var content = AnyChatSDKUserHandler.instance.currentMsgTaskId[i].msgContent;
                            clearTimeout(AnyChatSDKUserHandler.instance.currentMsgTaskId[i].timer);
                            AnyChatSDKUserHandler.instance.currentMsgTaskId.slice(i, 1);
                            break;
                        }
                    }
                    var data = {
                        userId: strUserId,
                        msg: content
                    };
                    instance.eventTarget.fireEvent({
                        type: "onTransBufferDone",
                        result: {
                            code: 0,
                            msg: "发送成功"
                        },
                        data: data
                    });
                    logger.callbackLog("TransBuffer", 0, data);
                    return;
                } else {
                    var msgId = msg.substring(0, msg.indexOf("#"));
                    var msgData = msg.substring(msg.indexOf("#") + 1, msg.length);
                    try {
                        msgData = JSON.parse(msgData);
                    } catch (error) {

                    }
                    BRAC_TransBufferEx(dwUserId, AnyChatSDKUserHandler.Base64.encode(msgId),0,0,0);

                    var data = {
                        userId: strUserId,
                        msg: msgData
                    };
                    instance.eventTarget.fireEvent({
                        type: "onReceiveBuffer",
                        data: data
                    });
                    logger.callbackLog("ReceiveBuffer", 0, data);
                }

            }
        }

        // 用户信息更新通知，dwUserId表示用户ID号，dwType表示更新类别
        function OnAnyChatUserInfoUpdate(dwUserId, dwType) {

        }

        // 好友在线状态变化，dwUserId表示好友用户ID号，dwStatus表示用户的当前活动状态：0 离线， 1 上线
        function OnAnyChatFriendStatus(dwUserId, dwStatus) {
            var result = {
                userId: dwUserId,
                status: dwStatus
            };

            instance.eventTarget.fireEvent({
                type: "onAnyChatFriendStatus",
                result: result
            });
        }

        // 用户的音频设备状态变化消息，dwUserId表示用户ID号，State表示该用户是否已打开音频采集设备（0：关闭，1：打开）
        function OnAnyChatMicStateChange(dwUserId, State) {

        }

        // 用户摄像头状态发生变化，dwUserId表示用户ID号，State表示摄像头的当前状态（0：没有摄像头，1：有摄像头但没有打开，2：打开）
        function OnAnyChatCameraStateChange(dwUserId, State) {

        }

        // 本地用户与其它用户的P2P网络连接状态发生变化，dwUserId表示其它用户ID号，State表示本地用户与其它用户的当前P2P网络连接状态（0：没有连接，1：仅TCP连接，2：仅UDP连接，3：TCP与UDP连接）
        function OnAnyChatP2PConnectState(dwUserId, State) {

        }

        // 用户发起私聊请求，dwUserId表示发起者的用户ID号，dwRequestId表示私聊请求编号，标识该请求
        function OnAnyChatPrivateRequest(dwUserId, dwRequestId) {

        }

        // 用户回复私聊请求，dwUserId表示回复者的用户ID号，errorcode为出错代码
        function OnAnyChatPrivateEcho(dwUserId, errorcode) {

        }

        // 用户退出私聊，dwUserId表示退出者的用户ID号，errorcode为出错代码
        function OnAnyChatPrivateExit(dwUserId, errorcode) {

        }

        // 用户视频分辩率发生变化，dwUserId（INT）表示用户ID号，dwResolution（INT）表示用户的视频分辨率组合值（低16位表示宽度，高16位表示高度）
        function OnAnyChatVideoSizeChange(dwUserId, dwResolution) {

        }

        // 系统音量改变通知
        function OnAnyChatVolumeChange(device, dwCurrentVolume) {

        }

        // 收到服务器发送的SDK Filter数据
        function OnAnyChatSDKFilterData(lpBuf, dwLen) {

        }

        // 收到录像或拍照完成事件
        function OnAnyChatRecordSnapShot(dwUserId, lpFileName, dwParam, dwFlags) {

        }

        // 收到录像或拍照完成事件（扩展）
        function OnAnyChatRecordSnapShotEx(dwUserId, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {

        }

        // 收到录像或拍照完成事件
        function OnAnyChatRecordSnapShotEx2(dwUserId, dwErrorCode, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {
            var userStr = {filelength: ''};
            try{
                userStr = JSON.parse(lpUserStr);
            }catch(e){
                if(typeof console !== undefined && typeof console.log === "function")
                    console.log('Error: json err');
            }
            var filelength = userStr.filelength;
            var strUserId = getStrUserId(dwUserId);
            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };

            if (dwFlags & 0x400) {
                if (result.code == 0) {
                    var data = {
                        userid: strUserId,
                        filePath: lpFileName
                    };
                    instance.eventTarget.fireEvent({
                        type: "onSnapshotDone",
                        result: result,
                        data: data
                    });
                    logger.callbackLog("Snapshot", dwErrorCode, data);
                } else {
                    instance.eventTarget.fireEvent({
                        type: "onSnapshotDone",
                        result: result
                    });
                    logger.callbackLog("Snapshot", dwErrorCode);
                }

            } else {

                var VADCtrol = 1;
                BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);

                if (result.code == 0) {
                    var arguement2 = {
                        userid: strUserId,
                        filePath: lpFileName,
                        elapse: dwElapse,
                        filelength: filelength,
                        filemd5:userStr.filemd5
                    };
                    instance.eventTarget.fireEvent({
                        type: "onRecordDone",
                        result: result,
                        data: arguement2
                    });
                    logger.callbackLog("Record", dwErrorCode, data);
                } else {
                    instance.eventTarget.fireEvent({
                        type: "onRecordDone",
                        result: result
                    });
                    logger.callbackLog("Record", dwErrorCode);
                }

            }
        }

        // 文件传输完成通知
        function OnAnyChatTransFile(dwUserId, lpFileName, lpTempFilePath, dwFileLength, wParam, lParam, dwTaskId) {

            if (AnyChatSDKUserHandler.instance.userId == dwUserId) {
                var result = {
                    code: 0,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(0)
                };

                var data = {
                    filename: lpFileName,
                    filePath: lpTempFilePath,
                    fileLength: dwFileLength
                };
                instance.eventTarget.fireEvent({
                    type: "onFileUploadDone",
                    result: result,
                    data: data
                });
                logger.callbackLog("FileUpload", 0, data);
            } else {
                var result = {
                    code: 0,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(0)
                };

                var strUserId = getStrUserId(dwUserId);
                var data = {
                    userid: strUserId,
                    filename: lpFileName,
                    filePath: lpTempFilePath,
                    fileLength: dwFileLength
                };
                instance.eventTarget.fireEvent({
                    type: "onFileReceived",
                    result: result,
                    data: data
                });
                logger.callbackLog("FileReceive", 0, data);
            }
        }

        // AnyChatCoreSDK异步事件
        function OnAnyChatCoreSDKEvent(dwEventType, lpEventJsonStr) {
            var ANYCHAT_CORESDKEVENT_RECORDSTATUS = 13 //录像状态事件
            switch (parseInt(dwEventType)) {
                case ANYCHAT_CORESDKEVENT_PPTHELPER:
                    OnAnyChatPPT(lpEventJsonStr);
                    break;
                //   自己加
                case  ANYCHAT_CORESDKEVENT_BUSINESS:
                    if (JSON.parse(lpEventJsonStr).cmd == "meetingcmd" ){
                        OnAnyChatMeetingBusiness(lpEventJsonStr);
                    } else if (JSON.parse(lpEventJsonStr).cmd == "whiteboardcmd" ){
                        AnyChatWhiteBoard.OnAnyChatWhiteBoardBusiness(lpEventJsonStr);
                    }

                    break;
                case  ANYCHAT_SDKCTRL_SERVEROBJECT:
                    handleDetachableServiceData(lpEventJsonStr);
                    break;
                //   自己加
                case ANYCHAT_CORESDKEVENT_TRANSFILE:
                    OnTransfromDataDone(lpEventJsonStr);
                    break;
                case ANYCHAT_CORESDKEVENT_STREAMPLAY:
                    if (JSON.parse(lpEventJsonStr).playevent == ANYCHAT_STREAMPLAY_EVENT_START){
                        OnStreamPlayStart(lpEventJsonStr);
                    } else if (JSON.parse(lpEventJsonStr).playevent == ANYCHAT_STREAMPLAY_EVENT_FINISH) {
                        OnStreamPlayStop(lpEventJsonStr);
                    }
                    break;
                case ANYCHAT_CORESDKEVENT_RECORDSTATUS:
                    OnRecordStatus(lpEventJsonStr);
                    break;
                case ANYCHAT_CORESDKEVENT_AIABILITY:
                    var lpEventJsonStrbean=JSON.parse(lpEventJsonStr);
                    if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_INITRESULT){

                        OnAnyChatAI(lpEventJsonStr);
                    }
                    else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_STATUS){
                        AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].isAlive=false;//修改机器人状态
                        AnyChatWebSDK.anychatSDKInstance.destroyRobot(lpEventJsonStrbean.robotid);//销毁机器人
                        var result = {
                            AnyChatResult : {
                                code: lpEventJsonStrbean.errorcode,
                            },
                        };
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type:"err"+lpEventJsonStrbean.robotid,
                            result: result,
                        });


                    }
                    else  if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ROBOT_ACTIVERET){


                    }
                    else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_RESULT){


                        if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].asrtaskid[lpEventJsonStrbean.taskid]){

                            if(lpEventJsonStrbean.status===1){//能力准备

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIPrepare"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===2){//结果返回

                                var result={
                                    taskId:lpEventJsonStrbean.taskid,
                                    result:lpEventJsonStrbean.result
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIResult"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===3){//能力停止

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIFinish"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }

                        }

                        else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].ttstaskid[lpEventJsonStrbean.taskid]){

                            if(lpEventJsonStrbean.status===1){//能力准备

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIPreparetts"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===2){//结果返回

                                var result={
                                    taskId:lpEventJsonStrbean.taskid,
                                    result:lpEventJsonStrbean.result
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIResulttts"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===3){//能力停止

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIFinishtts"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }

                        }
                        else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].doOcrImagetaskid[lpEventJsonStrbean.taskid]){

                            if(lpEventJsonStrbean.status===1){//能力准备

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIPrepareocr"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===2){//结果返回

                                var result={
                                    taskId:lpEventJsonStrbean.taskid,
                                    result:lpEventJsonStrbean.result
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIResulocr"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===3){//能力停止

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIFinishocr"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }

                        }
                        else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].facetaskid[lpEventJsonStrbean.taskid]){

                            if(lpEventJsonStrbean.status===1){//能力准备

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIPrepareface"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===2){//结果返回

                                var result={
                                    taskId:lpEventJsonStrbean.taskid,
                                    result:lpEventJsonStrbean.result
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIResulface"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===3){//能力停止

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIFinishface"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }

                        }
                        else if(lpEventJsonStrbean.taskid == AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonStrbean.robotid].capturetaskid[lpEventJsonStrbean.taskid]){

                            if(lpEventJsonStrbean.status===1){//能力准备

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIPreparecapture"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===2){//结果返回

                                var result={
                                    taskId:lpEventJsonStrbean.taskid,
                                    result:lpEventJsonStrbean.result
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIResulcapture"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                            else if(lpEventJsonStrbean.status===3){//能力停止

                                var result={
                                    taskId:lpEventJsonStrbean.taskid
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onAIFinishcapture"+lpEventJsonStrbean.taskid,
                                    result: result,
                                });
                            }
                        }
                    }
                    else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_STATUS){ }
                    else if(lpEventJsonStrbean.aievent == ANYCHAT_AI_EVENT_ABILITY_ACTIVERET){}
                    break;
            }

        }


        /********************************************
         *		AnyChat SDK核心业务流程				*
         *******************************************/
        // 下载完成事件通知
        function OnAnyChatPPT(lpEventJsonStr) {
            AnyChatSDKFileHandler.downLoadCallBack(lpEventJsonStr);
        }
        // 文件传输完成时间通知
        function OnTransfromDataDone(lpEventJsonStr) {
            AnyChatSDKFileHandler.transfromCallBack(lpEventJsonStr);
        }
        //创建机器人完成回调
        function OnAnyChatAI(lpEventJsonStr) {

            var lpEventJsonObj = JSON.parse(lpEventJsonStr);
            var result = {
                AnyChatResult : {
                    code: lpEventJsonObj.errorcode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                },
                robotId:lpEventJsonObj.robotid
            };

            AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].robotId=lpEventJsonObj.robotid;
            AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].isAlive=true;
            AnyChatWebSDK.anychatSDKInstance.AnyChatAIManagement.AnyChatAIRobot[lpEventJsonObj.robotid].robotUserId=lpEventJsonObj.userid;

            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                type:lpEventJsonObj.robotid,
                result: result,
            });
        }
        // StreamPlay播放开始事件通知
        function OnStreamPlayStart(lpEventJsonStr) {
            var eventJsonObj = JSON.parse(lpEventJsonStr);
            instance.eventTarget.fireEvent({
                type: "onStreamPlayStart",
                data: {guid: eventJsonObj.taskguid}
            });
        }

        // StreamPlay播放结束事件通知
        function OnStreamPlayStop(lpEventJsonStr) {
            var eventJsonObj = JSON.parse(lpEventJsonStr);
            var errorObj = JSON.parse(eventJsonObj.strparam);
            errorObj.errorcode = parseInt(errorObj.errorcode);
            var result = {
                code: errorObj.errorcode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
            };
            instance.eventTarget.fireEvent({
                type: "onStreamPlayStop",
                result: result,
                data: { guid: eventJsonObj.taskguid }
            });
        }

        function OnRecordStatus(lpEventJsonStr){
            var eventJsonObj = JSON.parse(lpEventJsonStr);
            var errorcode = parseInt(eventJsonObj.errorcode);
            var result = {
                errorcode: errorcode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(errorcode)
            };
            instance.eventTarget.fireEvent({
                type: "OnRecordStatusDone",
                result: result,
                data: {guid: eventJsonObj.taskid}
            });
        }

        // 视频通话消息通知回调函数
        function OnAnyChatVideoCallEvent(dwEventType, dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
            switch (dwEventType) {
                case BRAC_VIDEOCALL_EVENT_REQUEST:
                    //收到视频呼叫请求
                    onVideoCallControlRequest(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
                    break;
                case BRAC_VIDEOCALL_EVENT_REPLY:
                    ////视频呼叫请求回复
                    onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
                    break;
                case BRAC_VIDEOCALL_EVENT_START:
                    //通话开始
                    onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
                    break;
                case BRAC_VIDEOCALL_EVENT_FINISH:
                    //视频通话结束
                    onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr);
                    break;

            }
        }

        //收到视频呼叫请求
        function onVideoCallControlRequest(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
            var strUserId = getStrUserId(dwUserId);
            var data = {
                userId: strUserId,
                userStr: szUserStr
            };
            instance.eventTarget.fireEvent({
                type: "onReceiveVideoCallRequest",
                data: data
            });
            logger.callbackLog("ReceiveVideoCallRequest", 0, data);
        }

        //视频呼叫请求回复
        function onVideoCallControlReply(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
            var strUserId = getStrUserId(dwUserId);
            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };
            var data = {
                userId: strUserId,
                userStr: szUserStr
            };
            switch (dwErrorCode) {
                case GV_ERR_SUCCESS: //成功的情况
                    //onSendVideoCallRequestSucess(dwUserId);
                    instance.eventTarget.fireEvent({
                        type: "onRequestVideoCallDone",
                        result: result,
                        data: data
                    });
                    logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
                    break;
                case GV_ERR_SESSION_QUIT:
                    var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, ""); // 挂断
                    //result.errorCode = dwErrorCode;
                    instance.eventTarget.fireEvent({
                        type: "onReceiveVideoCallError",
                        result: result
                    });
                    logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
                    break;
                case GV_ERR_SESSION_OFFLINE:
                    //result.errorCode = dwErrorCode;
                    instance.eventTarget.fireEvent({
                        type: "onRequestVideoCallDone",
                        result: result,
                        data: data
                    });
                    logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
                    break;
                case GV_ERR_SESSION_BUSY:
                    var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, "");
                    instance.eventTarget.fireEvent({
                        type: "onRequestVideoCallDone",
                        result: result,
                        data: data
                    });
                    logger.callbackLog("RequestVideoCallDone", dwErrorCode, data);
                    break;
                case GV_ERR_SESSION_REFUSE:
                    var errorcode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, dwUserId, 0, 0, 0, "");
                    instance.eventTarget.fireEvent({
                        type: "onReceiveVideoCallError",
                        result: result
                    });
                    logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
                    break;
                case GV_ERR_SESSION_TIMEOUT:
                    // if (AnyChatSDKUserHandler.instance.userType == 2 ) {
                    //     BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, dwErrorCode, 0, 0, 0, "");
                    // }
                    instance.eventTarget.fireEvent({
                        type: "onReceiveVideoCallError",
                        result: result
                    });
                    logger.callbackLog("ReceiveVideoCallError", dwErrorCode);
                    break;
                case GV_ERR_SESSION_DISCONNECT:
                    instance.eventTarget.fireEvent({
                        type: "onReceiveVideoCallError",
                        result: result,
                        data: data
                    });
                    logger.callbackLog("ReceiveVideoCallError", dwErrorCode, data);
                    break;
                default:
                    break;
            }

        }

        //通话开始
        function onVideoCallControlStart(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
            var strUserId = getStrUserId(dwUserId);
            AnyChatSDKVideoCallHandler.instance.isVideoCall = true;
            var data = {
                userId: strUserId,
                roomId: dwParam,
                userStr: szUserStr
            };
            instance.eventTarget.fireEvent({
                type: "onReceiveVideoCallStart",
                data: data
            });
            logger.callbackLog("ReceiveVideoCallStart", dwErrorCode, data);
        }

        //视频通话结束
        function onVideoCallControlFinish(dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
            AnyChatSDKVideoCallHandler.instance.isVideoCall = false;

            if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
                //客服结束服务
                BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_FINISHSERVICE, 0, 0, 0, 0, "");
            }
            var strUserId = getStrUserId(dwUserId);
            var data = {
                userId: strUserId,
                userStr: szUserStr
            };
            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };
            instance.eventTarget.fireEvent({
                type: "onReceiveVideoCallFinish",
                result: result,
                data: data
            });
            logger.callbackLog("ReceiveVideoCallFinish", dwErrorCode, data);
        }



        //业务对象数据更新事件
        function OnAnyChatObjectUpdate(dwObjectType, dwObjectId) {

            if (dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {
                var areaInfo = {};
                areaInfo.areaId = dwObjectId;
                areaInfo.areaName = AnyChatSDKAreaHandler.getAreaName({
                    areaId: dwObjectId
                });
                areaInfo.areaDesc = AnyChatSDKAreaHandler.getAreaDescription({
                    areaId: dwObjectId
                });
                AnyChatSDKAreaHandler.instance.areaIdArray[AnyChatSDKAreaHandler.instance.areaIdIndex] = areaInfo;
                AnyChatSDKAreaHandler.instance.areaIdIndex++;
            } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_QUEUE) {

            } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT) {

            }
        }

        //业务对象同步完成事件
        function OnAnyChatObjectSyncDataFinish(dwObjectType, dwObjectId) {

            if (dwObjectType == ANYCHAT_OBJECT_TYPE_AREA) {
                //mCurrentStatus = CLIENT_STATUS_AREA;
                //showSerivceArea();
                var result = {
                    code: 0,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(0)
                };
                var data = {
                    areas: AnyChatSDKAreaHandler.instance.areaIdArray
                };
                instance.eventTarget.fireEvent({
                    type: "onSyncAreasDone",
                    result: result,
                    data: data
                });
                logger.callbackLog("SyncAreasDone", 0, data);
            }
        }

        // 进入服务区域通知事件
        function OnAnyChatEnterAreaResult(dwObjectType, dwObjectId, dwErrorCode) {

            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };

            var data = {};
            data.areaId = dwObjectId;
            data.areaName = AnyChatSDKAreaHandler.getAreaName({
                areaId: dwObjectId
            });
            data.areaDesc = AnyChatSDKAreaHandler.getAreaDescription({
                areaId: dwObjectId
            });



            if (dwErrorCode == 0) {

                data.guestCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_GUESTCOUNT);
                var queueList = BRAC_ObjectGetIdList(ANYCHAT_OBJECT_TYPE_QUEUE);

                data.agentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_AGENTCOUNT);
                data.idleAgentCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_IDLEAGENTCOUNT);

                var queningUserCount = 0;
                var queues = [];

                for (var i=0;i< queueList.length;i++) {
                    var queueObj = {};
                    var queueListId = parseInt(queueList[i]);
                    /**获取队列名称*/
                    var queueName = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_NAME);
                    /**获取队列排队人数*/
                    var queueLength = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_QUEUE_INFO_LENGTH);
                    queueLength = queueLength < 0 ? 0 : queueLength;
                    queningUserCount = queningUserCount + queueLength;
                    /**获取队列信息*/
                    var queueInfo = BRAC_ObjectGetStringValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_DESCRIPTION);
                    //var attributeValue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, queueListId, ANYCHAT_OBJECT_INFO_ATTRIBUTE);

                    queueObj.id = queueListId;
                    queueObj.name = queueName;
                    queueObj.desc = queueInfo;

                    queues.push(queueObj);

                }
                data.queueCount = queueList.length;
                data.queningUserCount = queningUserCount;
                data.queues = queues;

                //坐席
                if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
                    refreshAgentServiceInfo();
                    //坐席进入营业厅的初始状态为"关闭"
                    var errorcode = BRAC_ObjectControl(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKUserHandler.instance.userId, ANYCHAT_AGENT_CTRL_SERVICESTATUS, ANYCHAT_AGENT_STATUS_CLOSEED, 0, 0, 0, "");
                }
            }

            instance.eventTarget.fireEvent({
                type: "onEnterAreaDone",
                result: result,
                data: data
            });
            logger.callbackLog("EnterAreaDone", dwErrorCode, data);
        }

        // 离开服务区域通知事件
        function OnAnyChatLeaveAreaResult(dwObjectType, dwObjectId, dwErrorCode) {
            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };
            instance.eventTarget.fireEvent({
                type: "onLeaveAreaDone",
                result: result
            });
            logger.callbackLog("LeaveAreaDone", dwErrorCode);
        }

        //营业厅状态变化
        function OnAnyChatAreaStatusChange(dwObjectType, dwObjectId, dwErrorCode) {

            if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
                refreshAgentServiceInfo();
            }
            var data = {};
            data.areaId = dwObjectId;
            //获取当前营业厅用户数
            data.userCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AREA, dwObjectId, ANYCHAT_AREA_INFO_GUESTCOUNT);

            instance.eventTarget.fireEvent({
                type: "onAreaChanged",
                data: data
            });
            logger.callbackLog("AreaChanged", dwErrorCode, data);
        }

        // 队列状态变化
        function OnAnyChatQueueStatusChanged(dwObjectType, dwObjectId) {

            if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {
                refreshAgentServiceInfo();
            }
            var data = {};
            data.queueId = dwObjectId;
            //获取当前队列人数
            data.userCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);

            instance.eventTarget.fireEvent({
                type: "onQueueChanged",
                data: data
            });
            logger.callbackLog("QueueChanged", 0, data);
        }

        // 本地用户进入队列结果
        function OnAnyChatEnterQueueResult(dwObjectType, dwObjectId, dwErrorCode) {

            var result = {
                code: dwErrorCode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
            };
            var data = {};
            if (dwErrorCode == 0) {
                data.userNumInQueue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);
                var beforeMeNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_MYSEQUENCENO);
                beforeMeNum = beforeMeNum < 0 ? 0 : beforeMeNum;
                beforeMeNum++;
                data.currentPos = beforeMeNum;
                data.enqueueTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_MYENTERQUEUETIME);
            }

            instance.eventTarget.fireEvent({
                type: "onEnqueueDone",
                result: result,
                data: data
            });
            logger.callbackLog("EnqueueDone", dwErrorCode, data);

            if (dwErrorCode == 0) {     // AnyChatSDKQueueHandler.instance.currentQueueId == dwObjectId
                if (AnyChatSDKQueueHandler.instance.waitingTimer) {
                    AnyChatSDKQueueHandler.instance.waitingTimer = 10011;
                }
                AnyChatSDKQueueHandler.instance.waitingTimer = setInterval(function() {
                    var myQueueData = {};
                    myQueueData.userNumInQueue = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_LENGTH);
                    var beforeUserNum = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_BEFOREUSERNUM);
                    beforeUserNum = beforeUserNum < 0 ? 0 : beforeUserNum;
                    beforeUserNum++;
                    myQueueData.currentPos = beforeUserNum;
                    myQueueData.waitingTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_QUEUE, dwObjectId, ANYCHAT_QUEUE_INFO_WAITTIMESECOND);

                    var result = {
                        code: 0,
                        msg: AnyChatSDKErrorCode.checkErrorMsg(0)
                    };
                    instance.eventTarget.fireEvent({
                        type: "onProcessChanged",
                        result: result,
                        data: myQueueData
                    });
                }, 1000);

            }

        }

        // 本地用户离开队列结果
        function OnAnyChatLeaveQueueResult(dwObjectType, dwObjectId, dwErrorCode) {
            if (dwErrorCode == 0) {
                var result = {
                    code: dwErrorCode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
                };
                instance.eventTarget.fireEvent({
                    type: "onCancelQueuingDone",
                    result: result
                });
                logger.callbackLog("CancelQueuingDone", dwErrorCode);

            } else {
                var result = {
                    code: dwErrorCode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(dwErrorCode)
                };
                instance.eventTarget.fireEvent({
                    type: "onLeaveQueue",
                    result: result
                });
                logger.callbackLog("onLeaveQueue", dwErrorCode);
            }
            if (AnyChatSDKQueueHandler.instance.waitingTimer) {
                clearInterval(AnyChatSDKQueueHandler.instance.waitingTimer);
                AnyChatSDKQueueHandler.instance.waitingTimer = null;
            }
            AnyChatSDKQueueHandler.instance.currentQueueId = "";

        }
        //队列用户信息更新
        function OnAnyChatQueueUserInfoChanged(dwObjectType, dwObjectId, dwEventType, dwParam1, dwParam2, dwParam3, dwParam4, strParam){
            var result = {
                queueId: dwObjectId  //变化队列id
            };
            var params={
                queueId:dwObjectId
            };
            result.userList=AnyChatSDKQueueHandler.instance.getQueueUserInfo(params);
            instance.eventTarget.fireEvent({
                type: "OnQueueUserInfoChanged",
                result: result
            });
            logger.callbackLog("OnQueueUserInfoChanged",0);
        }

        // 坐席状态变化
        function OnAnyChatAgentStatusChanged(dwObjectType, dwObjectId, dwParam1) {

            if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT && AnyChatSDKUserHandler.instance.userId == dwObjectId) {
                if (dwParam1 == ANYCHAT_AGENT_STATUS_WAITTING) {
                    refreshAgentServiceInfo();

                } else if (dwParam1 == ANYCHAT_AGENT_STATUS_WORKING) {

                } else if (dwParam1 == ANYCHAT_AGENT_STATUS_PAUSED) {

                } else if (dwParam1 == ANYCHAT_AGENT_STATUS_CLOSEED) {

                }

                var result = {
                    status: dwParam1
                };
                instance.eventTarget.fireEvent({
                    type: "onAgentStatusChanged",
                    result: result
                });
                logger.callbackLog("AgentStatusChanged", 0, result);
            } else if (dwObjectType == ANYCHAT_OBJECT_TYPE_AGENT && AnyChatSDKUserHandler.instance.userId != dwObjectId) {
                var result = {
                    status: dwParam1,
                    userId: getStrUserId(dwObjectId)
                };
                instance.eventTarget.fireEvent({
                    type: "onElseAgentStatusChanged",
                    result: result
                });
                logger.callbackLog("ElseAgentStatusChanged", 0, result);
            }
        }

        //刷新坐席进入服务区域后的显示信息
        function refreshAgentServiceInfo() {
            if (AnyChatSDKUserHandler.instance.userType == ANYCHAT_OBJECT_FLAGS_AGENT) {

                //当前服务的开始时间
                var serviceStartTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICEBEGINTIME);

                //累计服务时长
                var serviceTotalTime = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICETOTALTIME);

                //累计服务的用户数
                var serviceUserCount = BRAC_ObjectGetIntValue(ANYCHAT_OBJECT_TYPE_AGENT, AnyChatSDKAreaHandler.instance.currentAgentID, ANYCHAT_AGENT_INFO_SERVICETOTALNUM);

                var result = {
                    serviceBeginTime: serviceStartTime,
                    serviceTotalTime: serviceTotalTime,
                    serviceUserCount: serviceUserCount
                };
                instance.eventTarget.fireEvent({
                    type: "onAgentServiceInfoNotify",
                    result: result
                });
                logger.callbackLog("AgentServiceInfoNotify", 0, result);
            }
        }

        // 坐席服务开始
        function OnAnyChatServiceStart(dwAgentId, clientId, dwQueueId) {
            if (AnyChatSDKUserHandler.instance.userId == clientId) {
                if (AnyChatSDKQueueHandler.instance.waitingTimer) {
                    clearInterval(AnyChatSDKQueueHandler.instance.waitingTimer);
                    AnyChatSDKQueueHandler.instance.waitingTimer = null;
                }
                AnyChatSDKQueueHandler.instance.currentQueueId = "";
            }

            var agentStrUserId = getStrUserId(dwAgentId);
            var clientStrUserId = getStrUserId(clientId);
            var data = {
                queueId: dwQueueId,
                agentId: agentStrUserId,
                customerId: clientStrUserId,
                eventType:"serviceStart"
            };

            instance.eventTarget.fireEvent({
                type: "onServiceNotify",
                data: data
            });
            logger.callbackLog("ServiceNotify", 0, data);

        }

        //队列里没有客户，坐席端处理方式
        function OnAnyChatAgentWaitingUser() {
            console.log("队列里没有客户");
        }

        //客户收到坐席准备好
        function OnAnyChatAgentprepared(dwAgentId, clientId, dwQueueId) {
            var agentStrUserId = getStrUserId(dwAgentId);
            var clientStrUserId = getStrUserId(clientId);
            var data = {
                queueId: dwQueueId,
                agentId: agentStrUserId,
                customerId: clientStrUserId,
                eventType:"agentPrepared"
            };
            instance.eventTarget.fireEvent({
                type: "onServiceNotify",
                result: data
            });
            logger.callbackLog("ServiceNotify", 0, data);
        }


        var instance = new AnyChatSDKEventDispatcher();
        exports.instance = instance;

        /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat文件处理器
	 * 函数说明:文件传输与文件上传
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKFileHandler");

        var AnyChatSDKErrorCode = __webpack_require__(5);

        var ANYCHAT_SDKCTRL_PPTHELPERINIT = 90; ///< PPT播报环境初始化
        var ANYCHAT_SDKCTRL_PPTFILECTRL = 91; ///< PPT文件控制
        var ANYCHAT_SDKCTRL_PPTFILEINFO = 92; ///< PPT文件信息

        var BRPPT_FILETYPE_PPT = 0x01; ///< ppt文件
        var BRPPT_FILETYPE_VIDEO = 0x02; ///< 视频文件
        var BRPPT_FILETYPE_AUDIO = 0x03; ///< 音频文件
        var BRPPT_FILETYPE_COMMZIP = 0x04; ///< 普通zip文件

        //构造函数
        function AnyChatSDKFileHandler(opt) {
            this.guid = BRAC_NewGuid();
            this.objParam = opt;
            this.action = this.objParam.action;
            this.fileParams = 0;
            this.timer;
            this.statusInfo = {
                process: 0,
                bitRate: 0,
                status: 1
            };
            this.mediaDataInfo = [];
        }

        AnyChatSDKFileHandler.prototype = {
            constructor: AnyChatSDKFileHandler,
            start: function() {
                var params = {};
                params.taskGuid = this.guid;
                this.objParam.userId && (params.userId = this.objParam.userId);
                this.objParam.localPath && (params.localPath = this.objParam.localPath);
                this.objParam.category && (params.category = this.objParam.category);
                this.objParam.filename && (params.filename = this.objParam.filename);
                this.objParam.fileurl && (params.fileurl = this.objParam.fileurl);
                this.objParam.filetype && (params.filetype = this.objParam.filetype);
                this.objParam.filemd5 && (params.filemd5 = this.objParam.filemd5);
                this.objParam.fileid && (params.fileid = this.objParam.fileid);
                this.objParam.strJson && (params.strJson = this.objParam.strJson);

                var time = 1000;
                this.objParam.intervalTime && (time = this.objParam.intervalTime * 1000);
                var guid = this.guid;
                //var timer;
                var opt = this.objParam;
                var that = this;
                if (that.timer) {
                    clearInterval(that.timer);
                }
                if (this.action == "upload") {
                    var errorCode = fileTrans(params);
                    if (errorCode == 0) {
                        that.timer = setInterval(function() {
                            that.statusInfo = queryTaskStatus({
                                taskGuid: params.taskGuid
                            });

                            if (typeof(opt.onTaskStatusChanged) === "function") {
                                var resStatus = that.statusInfo;
                                resStatus.taskId = params.taskGuid;
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onTaskStatusChanged",
                                    data: resStatus
                                });
                            }

                            if (that.statusInfo.progress == 100) {
                                // if (that.objParam.userId) {
                                //     var filename = that.objParam.localPath.substring(that.objParam.localPath.lastIndexOf('\\') + 1, that.objParam.localPath.length);
                                //     var result = {
                                //         code: 0,
                                //         msg: ''
                                //     };
                                //     var data = {
                                //         targetId: that.objParam.userId,
                                //         filePath: that.objParam.localPath,
                                //         filename: filename
                                //     };
                                //     AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                //         type: "onFileTransferDone",
                                //         result: result,
                                //         data: data
                                //     });
                                // }
                                clearInterval(that.timer);
                                that.timer = null;
                            }
                        }, time);
                    }


                    var funName = "FileUploadStart";
                    params.userId && (funName = "FileTransferStart");
                    logger.invokeLog(funName, errorCode, params);
                    return errorCode;
                } else {
                    that.timer = setInterval(function() {
                        that.statusInfo = getDownLoadStatus({
                            taskGuid: that.objParam.fileid
                        });

                        if (typeof(opt.onDownloadTaskStatusChanged) === "function") {
                            var resStatus = that.statusInfo;
                            resStatus.taskId = that.objParam.fileid;
                            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                type: "onDownloadTaskStatusChanged",
                                data: resStatus
                            });
                        }

                        if (that.statusInfo.progress == 100) {
                            clearInterval(that.timer);
                            that.timer = null;
                        }

                    }, time);
                    var errorCode = startDownload(params, that);
                    logger.invokeLog("FileDownloadStart", errorCode, params);
                    return errorCode;
                }

            },
            cancel: function() {
                var errorCode;

                if (this.action == "upload") {
                    errorCode = cancelTransFile({
                        taskGuid: this.guid
                    });
                    var funName = "FileUploadCancel";
                    this.objParam.userId && (funName = "FileTransferCancel");
                    AnyChatWebSDK.anychatSDKInstance.callbackFunctionDestroy({
                        onTaskStatusChanged:this.objParam.onTaskStatusChanged
                    });
                    logger.invokeLog(funName, errorCode);
                } else {
                    errorCode = cancelDownload({
                        taskGuid: this.objParam.fileid
                    });
                    logger.invokeLog("FileDownloadCancel", errorCode);
                    AnyChatWebSDK.anychatSDKInstance.callbackFunctionDestroy({
                        onDownloadTaskStatusChanged:this.objParam.onDownloadTaskStatusChanged
                    });

                }
                if(this.timer != null){
                    clearInterval(this.timer);
                    this.timer = null;

                }
                this.guid = "";
                return errorCode;
            },
            getStatus: function() {
                if (this.action == "upload") {
                    var currentStatus = queryTaskStatus({
                        taskGuid: this.guid
                    });
                    return currentStatus;
                } else {
                    var currentStatus = getDownLoadStatus({
                        taskGuid: this.objParam.fileid
                    });
                    return currentStatus;
                }
            },
            downloadInit: function() {
                var json = { "savepath": this.objParam.savepath };
                BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTHELPERINIT, JSON.stringify(json));
            }

        };

        // 文件上传/发送
        function fileTrans(params) {
            var userId = 0;
            var string = {};
            if (params.userId) {
                userId = params.userId;
            }
            var path = "";
            if (params.localPath) {
                path = params.localPath;
                string.localPath = params.localPath;
            }
            if (params.category) {
                string.category = params.category;
            }
            if (params.filename) {
                string.filename = params.filename;
            }
            if (params.strJson) {
                string.strJson = params.strJson;
            }
            var errorCode = BRAC_TransFileEx(params.taskGuid, userId, path, 0, JSON.stringify(string));
            return errorCode;
        }

        // 取消文件传输任务
        function cancelTransFile(params) {
            return BRAC_CancelTransTaskEx(params.taskGuid, 0, 0);
        }

        // 查询文件传输进度
        function queryTaskStatus(params) {
            var statusInfo = {};
            statusInfo.progress = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_PROGRESS);
            statusInfo.bitRate = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_BITRATE);
            statusInfo.status = BRAC_QueryTransTaskInfoEx(params.taskGuid, BRAC_TRANSTASK_STATUS);
            return statusInfo;
        }

        //文件下载
        function startDownload(params, fileObj) {
            var json = {
                "ctrlcode": BRPPT_FILECTRL_DOWNLOAD,
                "fileid": params.fileid,
                "fileurl": params.fileurl,
                "filemd5": params.filemd5 ? params.filemd5:"",
                "filetype": params.filetype
            };
            var res = JSON.parse(BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILECTRL, JSON.stringify(json)));
            if (res.errorcode == 0) {
                var obj = {};
                obj.fileid = params.fileid;
                obj.type = params.filetype;
                fileObj.mediaDataInfo.push(obj);
            }
            return res.errorcode;
        }

        //取消文件下载
        function cancelDownload(params) {
            var json = { "ctrlcode": BRPPT_FILECTRL_CANCEL, "fileid": params.taskGuid };
            return BRAC_SetSDKOption(BRAC_SO_CORESDK_PPTFILECTRL, JSON.stringify(json));
        }

        //查询文件下载状态
        function getDownLoadStatus(params) {
            var json = { "infocode": BRPPT_FILEINFO_DOWNLOAD_STATUS, "fileid": params.taskGuid };
            var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
            return JSON.parse(result);
        }

        // 文件传输完成事件
        function transfromCallBack(lpEventJsonStr){
            var lpEventJsonObj = JSON.parse(lpEventJsonStr);
            if (lpEventJsonObj.errorcode != 0) {
                var result = {
                    code: lpEventJsonObj.errorcode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
                };
                var data = {};
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: lpEventJsonObj.taskguid,
                    result: result,
                    data: data
                });
                return;
            }
            var result = {
                code: lpEventJsonObj.errorcode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
            };
            var data = {
                fileLength: lpEventJsonObj.length,
                filePath: lpEventJsonObj.pathname,
                filename: lpEventJsonObj.filename
            };
            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                type: lpEventJsonObj.taskguid,
                result: result,
                data: data
            });
        }

        //下载回调事件
        function downLoadCallBack(lpEventJsonStr) {

            var lpEventJsonObj = JSON.parse(lpEventJsonStr);
            var json = get_ppt_info(lpEventJsonObj.fileid);
            var obj = {};
            if (lpEventJsonObj.errorcode != 0) {

                var result = {
                    code: lpEventJsonObj.errorcode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
                };

                var data = {};
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: json.fileid,
                    result: result,
                    data: data
                });
                return;
            }



            obj.dataInfo = json;
            obj.downloadResult = lpEventJsonObj;
            var newJson = init_media_address(json);


            var result = {
                code: lpEventJsonObj.errorcode,
                msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode)
            };

            var data = newJson;
            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                type:  data.fileid,
                result: result,
                data: data
            });

        }

        /**
         * 初始化媒体地址
         */
        function init_media_address(json) {
            var filePath = json.filepath;
            var fileDetail = json.details;
            switch (fileDetail.file_type) {
                case BRPPT_FILETYPE_PPT:
                    var audio_address = filePath + fileDetail.audio_address;
                    var pptList = [];
                    var pptDetail_list = fileDetail.pptlist;
                    for (var i = 0; i < pptDetail_list.length; i++) {
                        var obj = {};
                        obj.ppt_address = filePath + pptDetail_list[i].ppt_address;
                        obj.audio_start = pptDetail_list[i].audio_start;
                        obj.audio_end = pptDetail_list[i].audio_end;
                        pptList.push(obj);
                    }
                    json.details.audio_address = audio_address;
                    json.details.pptlist = pptList;
                    break;
                case BRPPT_FILETYPE_VIDEO:
                    //var video_address = filePath;
                    //json.details.video_address = video_address;
                    break;
                case BRPPT_FILETYPE_AUDIO:
                    //var audio_address = filePath+fileDetail.audio_address;
                    //json.details.audio_address = audio_address;
                    break;
            }

            return json;
        }


        /**
         * 解压完成后获取ppt详细信息
         */
        function get_ppt_info(fileid) {
            var json = { "infocode": BRPPT_FILEINFO_PPTDETAILS, "fileid": fileid };
            var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_PPTFILEINFO, JSON.stringify(json));
            return JSON.parse(result);
        }

        // 删除文件
        function deleteFile(opt) {
            var json = { "filename": opt.filename };
            var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_FILEDELETE, JSON.stringify(json));
            return JSON.parse(result).errorcode;
        }

        // 文件加密
        function encryptFile(opt) {
            var enckey = opt.enckey;
            var filename = opt.filename;
            var targetfile = opt.targetfile ? opt.targetfile : "";
            var flags = 0x1;
            var json = {
                enckey: enckey,
                filename: filename,
                targetfile: targetfile,
                flags: flags
            };
            var ret = BRAC_SetSDKOption(BRAC_SO_CORESDK_FILEENCANDDEC, JSON.stringify(json));
            return ret;
        }
        // 文件解密
        function decryptFile(opt) {
            var enckey = opt.enckey;
            var filename = opt.filename;
            var targetfile = opt.targetfile ? opt.targetfile : "";
            var flags = 0x2;
            var json = {
                enckey: enckey,
                filename: filename,
                targetfile: targetfile,
                flags: flags
            };
            var ret = BRAC_SetSDKOption(BRAC_SO_CORESDK_FILEENCANDDEC, JSON.stringify(json));
            return ret;
        }

        // 获取磁盘空间
        function getDiskSize(opt) {
            var json = {pathname: opt.pathname};
            var result = BRAC_SDKControl(ANYCHAT_SDKCTRL_DISKSIZE, JSON.stringify(json));
            return result;
        }


        exports.instance = AnyChatSDKFileHandler;
        exports.downLoadCallBack = downLoadCallBack;
        exports.transfromCallBack = transfromCallBack;
        exports.deleteFile = deleteFile;
        exports.encryptFile = encryptFile;
        exports.decryptFile = decryptFile;
        exports.getDiskSize = getDiskSize;

        /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat视频呼叫处理器
	 * 函数说明:视频呼叫相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKVideoCallHandler");

        //构造函数
        function AnyChatSDKVideoCallHandler() {
            this.isVideoCall = false;
            this.cameraObjList = [];
        }

        AnyChatSDKVideoCallHandler.prototype = {
            constructor: AnyChatSDKVideoCallHandler,
            request: function(opt) {
                return requestVideoCall(opt);
            },
            accept: function(opt) {
                return acceptVideoCall(opt);
            },
            reject: function(opt) {
                return rejectVideoCall(opt);
            },
            hangup: function(opt) {
                return hangupVideoCall(opt);
            },
            cancel: function(opt) {
                return cancelVideoCall(opt);
            },
            openRemoteControl: openRemoteControl,
            finishRemoteControl: finishRemoteControl
        };


        // 向指定用户发送呼叫请求
        function requestVideoCall(params) {
            var szUserStr = "";
            if(params.hasOwnProperty("szUserStr")){
                szUserStr = params.szUserStr;
            }
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REQUEST, params.userId, 0, 0, 0, szUserStr);
            return errorCode;
        }

        // 同意接收到的呼叫请求
        function acceptVideoCall(params) {
            var szUserStr = "";
            if(params.hasOwnProperty("szUserStr")){
                szUserStr = params.szUserStr;
            }
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, 0, 0, 0, szUserStr);
            return errorCode;
        }

        // 拒绝接收到的呼叫请求
        function rejectVideoCall(params) {
            var szUserStr = "";
            if(params.hasOwnProperty("szUserStr")){
                szUserStr = params.szUserStr;
            }
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, GV_ERR_SESSION_REFUSE, 0, 0, szUserStr);
            return errorCode;
        }

        // 放弃呼叫请求
        function cancelVideoCall(params) {
            var szUserStr = "";
            if(params.hasOwnProperty("szUserStr")){
                szUserStr = params.szUserStr;
            }
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REPLY, params.userId, GV_ERR_SESSION_QUIT, 0, 0, szUserStr);
            return errorCode;
        }

        // 挂断视频通话
        function hangupVideoCall(params) {
            var szUserStr = "";
            if(params.hasOwnProperty("szUserStr")){
                szUserStr = params.szUserStr;
            }
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, params.userId, 0, 0, 0, szUserStr);
            return errorCode;
        }

        // 远程协助
        function openRemoteControl(params) {
            var videoobj = GetID(params.objId);
            GetID(params.renderId).removeChild(videoobj);
            BRAC_SetVideoPosEx(params.userId, GetID(params.renderId), params.objId, params.streamIndex);
            var errorCode = GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_VIDEODISPMODE, 1);
            errorCode = GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_REMOTEASSIST, 1);
            return errorCode;

        }

        // 关闭远程协助
        function finishRemoteControl(params) {
            GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_VIDEODISPMODE, 0);
            GetID(params.objId).SetSDKOptionInt(ANYCHATWEB_VIDEO_SO_REMOTEASSIST, 0);
        }

        // 远程协助请求
        function requestRemoteControl(params) {
            var errorCode = BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_REQUEST, params.userId, 0, 0, 0, "remoteControl");
            return errorCode;
        }

        AnyChatSDKVideoCallHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {
            if (typeof option.videoCallOpt === "object") {
                typeof(option.videoCallOpt.onReceiveVideoCallRequest) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallRequest", option.videoCallOpt.onReceiveVideoCallRequest, false);
                typeof(option.videoCallOpt.onReceiveVideoCallStart) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallStart", option.videoCallOpt.onReceiveVideoCallStart, false);
                typeof(option.videoCallOpt.onReceiveVideoCallFinish) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallFinish", option.videoCallOpt.onReceiveVideoCallFinish, false);
                typeof(option.videoCallOpt.onReceiveVideoCallError) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onReceiveVideoCallError", option.videoCallOpt.onReceiveVideoCallError, false);
            }
        };

        //获取DOM对象
        function GetID(id) {
            if (document.getElementById) {
                return document.getElementById(id);
            } else if (window[id]) {
                return window[id];
            }
            return null;
        }

        var instance = new AnyChatSDKVideoCallHandler();

        exports.instance = instance;

        /***/ }),
    /* 11 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat好友处理器
	 * 函数说明:提供获取好友信息、获取好友列表功能
	 *
	 *
	 * ----------------------------------------------------------
	 */

        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKFileHandler");

        var AnyChatSDKErrorCode = __webpack_require__(5);

        var USERINFO_NAME = 1; // 用户昵称信息
        var USERINFO_IP = 2; // 用户IP地址信息


        //构造函数
        function AnyChatSDKFriendHandler() {

        }

        AnyChatSDKFriendHandler.prototype = {
            constructor: AnyChatSDKFriendHandler,

            getUserFriends: function() {
                var list = [];
                list = BRAC_GetUserFriends();
                return list;
            },
            getFriendInfo: function(opt) {
                return BRAC_GetUserInfo(opt.userId, opt.infoId);
            },
            getFriendNickName: function(opt) {
                return BRAC_GetUserInfo(opt.userId, USERINFO_NAME);
            },
            getFriendIP: function(opt) {
                return BRAC_GetUserInfo(opt.userId, USERINFO_IP);
            }
        }

        AnyChatSDKFriendHandler.prototype.callbackFunctionRegister = function(AnyChatSDK, option) {
            if (typeof option.friendOpt === "object") {
                typeof(option.friendOpt.onAnyChatFriendStatus) === "function" && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAnyChatFriendStatus", option.friendOpt.onAnyChatFriendStatus, false);
            }
        };

        var instance = new AnyChatSDKFriendHandler();

        exports.instance = instance;

        /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat媒体流播放模块
	 * 函数说明:媒体流的初始化、播放与控制
	 *
	 *
	 * ----------------------------------------------------------
	 */

        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKStreamPlayHandler");

        var AnyChatSDKErrorCode = __webpack_require__(5);

        // 自定义指令构造函数
        function AnyChatSDKStreamPlayHandler(opt) {
            this.guid = opt.guid ? opt.guid : BRAC_NewGuid();
            this.streamType = opt.streamType; // 1 音频  2 视频  3 音视频  4 ppt
            this.streamPath = opt.streamPath; // 媒体流地址
            this.strParam = opt.strParam ? JSON.parse(opt.strParam) : {}; // 扩展参数
            this.streamindex = opt.streamindex ? opt.streamindex : 0; // 占用的流号
            this.strParam.streamindex = this.streamindex;
            this.divId = opt.divId;  // 在指定的div渲染
        }

        AnyChatSDKStreamPlayHandler.prototype = {
            constructor: AnyChatSDKStreamPlayHandler,
            initStreamPlay: function(){
                if(this.streamType == 4){
                    var ANYCHAT_STREAMPLAY_FLAGS_PPTPLAY = 0x00000080 ;    ///< ppt播放,临时定义
                    var dwBitrate = 400000;
                    BRAC_SetUserStreamInfo(-1, this.streamindex, BRAC_SO_LOCALVIDEO_BITRATECTRL, dwBitrate);

                    //开启扩展输入
                    var dwEnabled = 1;
                    BRAC_SetUserStreamInfo(-1, this.streamindex, BRAC_SO_CORESDK_EXTVIDEOINPUT, dwEnabled);
                    this.streamType = ANYCHAT_STREAMPLAY_FLAGS_REPLACEAUDIOINPUT | ANYCHAT_STREAMPLAY_FLAGS_REPLACEVIDEOINPUT | ANYCHAT_STREAMPLAY_FLAGS_PPTPLAY;
                }
                return BRAC_StreamPlayInit(this.guid, this.streamPath, this.streamType, JSON.stringify(this.strParam));
            },
            setPos: function(){
                BRAC_StreamPlaySetVideoPos(this.guid, document.getElementById(this.divId), "ANYCHAT_STREAMPLAY_" + this.divId);
            },
            play: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_START, 0, 0, strParam);
            },
            pause: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_PAUSE, 0, 0, strParam);
            },
            stop: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_STOP, 0, 0, strParam);
            },
            seek: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_SEEK, opt.seekPos, 0, strParam);
            },
            speedCtrl: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_SPEEDCTRL, opt.speed, 0, strParam);
            },
            loopCtrl: function(opt){
                var strParam = '';
                if(opt && opt.strParam)
                    strParam = opt.strParam;
                if(opt.loop){
                    return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_OPENLOOP, 0, 0, strParam);
                } else {
                    return BRAC_StreamPlayControl(this.guid, ANYCHAT_STREAMPLAY_CTRL_CLOSELOOP, 0, 0, strParam);
                }
            },
            getInfo: function(){
                return BRAC_StreamPlayGetInfo(this.guid, ANYCHAT_STREAMPLAY_INFO_JSONVALUE);
            },
            destory: function(){
                document.getElementById(this.divId).innerHTML = "";
                return BRAC_StreamPlayDestroy(this.guid, 0);
            },
            onPlay: function (lpEventJsonStr){
                var eventJsonObj = JSON.parse(lpEventJsonStr);
                if (this.guid == eventJsonObj.taskguid) {
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onStreamPlayStart"
                    });
                }
            },
            onStop: function(lpEventJsonStr){
                var eventJsonObj = JSON.parse(lpEventJsonStr);
                if(this.guid == eventJsonObj.taskguid){
                    var errorObj = eventJsonObj.strparam;
                    var result = {
                        code: errorObj.errorcode,
                        msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
                    };
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onStreamPlayStop",
                        result: result
                    });
                }
            }
        };

        function onPlay(lpEventJsonStr) {
            var eventJsonObj = JSON.parse(lpEventJsonStr);
            if (this.guid == eventJsonObj.taskguid) {
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onStreamPlayStart"
                });
            }
        }

        function onStop(lpEventJsonStr) {
            var eventJsonObj = JSON.parse(lpEventJsonStr);
            if (this.guid == eventJsonObj.taskguid) {
                var errorObj = eventJsonObj.strparam;
                var result = {
                    code: errorObj.errorcode,
                    msg: AnyChatSDKErrorCode.checkErrorMsg(errorObj.errorcode)
                };
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onStreamPlayStop",
                    result: result
                });
            }
        }

        exports.instance = AnyChatSDKStreamPlayHandler;

        /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat音频设备处理器
	 * 函数说明:音频相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKAudioHandler");

        var AnyChatSDKUserHandler = __webpack_require__(4);

        // 自定义指令构造函数
        function AnyChatSDKAudioHandler(deviceName) {
            this.deviceName = deviceName;
            this.name = deviceName.substring(deviceName.indexOf('-') + 1, deviceName.length);
            this.idx = deviceName.substring(0, deviceName.indexOf('-'));
            this.vadctrl = 1; // 音频静音检测控制
            this.nsctrl = 1; // 音频噪音抑制控制
            this.echoctrl = 1; // 音频回音消除控制
            this.agcctrl = 1; // 音频自动增益控制
            this.capturemode = 0; // 音频采集模式设置（参数为：int型：0 发言模式，1 放歌模式，2 卡拉OK模式，3 线路输入模式）
        }

        AnyChatSDKAudioHandler.prototype = {
            constructor: AnyChatSDKAudioHandler,
            config: function(opt) {
                if (opt.hasOwnProperty("vadctrl")) {
                    this.vadctrl = opt.vadctrl;
                    BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, opt.vadctrl);
                }
                if (opt.hasOwnProperty("nsctrl")) {
                    this.nsctrl = opt.nsctrl;
                    BRAC_SetSDKOption(BRAC_SO_AUDIO_NSCTRL, opt.nsctrl);
                }
                if (opt.hasOwnProperty("echoctrl")) {
                    this.echoctrl = opt.echoctrl;
                    BRAC_SetSDKOption(BRAC_SO_AUDIO_ECHOCTRL, opt.echoctrl);
                }
                if (opt.hasOwnProperty("agcctrl")) {
                    this.agcctrl = opt.agcctrl;
                    BRAC_SetSDKOption(BRAC_SO_AUDIO_AGCCTRL, opt.agcctrl);
                }
                if (opt.hasOwnProperty("capturemode")) {
                    this.capturemode = opt.capturemode;
                    BRAC_SetSDKOption(BRAC_SO_AUDIO_CAPTUREMODE, opt.capturemode);
                }
            },
            open: function() {
                var errorCode = openAudio(AnyChatSDKUserHandler.instance.userId);
                var params = { userId: AnyChatSDKUserHandler.instance.userId };
                logger.invokeLog("localMicrophoneOpen", errorCode, params);
                return errorCode;
            },
            close: function() {
                var errorCode = closeAudio(AnyChatSDKUserHandler.instance.userId);
                var params = { userId: AnyChatSDKUserHandler.instance.userId };
                logger.invokeLog("localMicrophoneClose", errorCode, params);
                return errorCode;
            }
        };

        //打开麦克风
        function openAudio(userId) {
            var errorCode = BRAC_UserSpeakControlEx(userId, 1, 0, 0, "");
            return errorCode;
        }

        //关闭麦克风
        function closeAudio(userId, streamIndex) {
            var errorCode = BRAC_UserSpeakControlEx(userId, 0, 0, 0, "");
            return errorCode;
        }


        exports.instance = AnyChatSDKAudioHandler;
        exports.openAudio = openAudio;
        exports.closeAudio = closeAudio;

        /***/ }),
    /* 14 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat视频设备处理器
	 * 函数说明:视频相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKVideoHandler");

        var AnyChatSDKUserHandler = __webpack_require__(4);

        //构造函数
        function AnyChatSDKVideoHandler(deviceName) {
            this.deviceName = deviceName;

            this.hasStreamIndex = false;
            this.name = deviceName.substring(deviceName.indexOf('-') + 1, deviceName.length);
            this.idx = deviceName.substring(0, deviceName.indexOf('-'));
            this.streamIndex = deviceName.substring(0, deviceName.indexOf('-')) -1;
            this.demoId;
            this.isInventCamera = false;
            if (this.name == "Native Screen Camera") {
                this.isInventCamera = true;
            }
            this.isOpen = false;
            this.bitRate = 90000; // 视频编码码率设置（参数为int型，单位bps，同服务器配置：VideoBitrate）
            this.quality = 3; // 视频编码质量因子控制（参数为int型，同服务器配置：VideoQuality）
            this.gop = 30; // 视频编码关键帧间隔控制（参数为int型，同服务器配置：VideoGOPSize）
            this.width = 320; // 设置本地视频采集分辨率(宽度)
            this.height = 240; // 设置本地视频采集分辨率(高度)
            this.fps = 15; // 设置本地视频编码的帧率
            this.preset = 3; // 设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
        }

        AnyChatSDKVideoHandler.prototype = {
            constructor: AnyChatSDKVideoHandler,
            config: function(opt) {
                opt.bitRate && (this.bitRate = opt.bitRate);
                opt.quality && (this.quality = opt.quality);
                opt.width && (this.width = opt.width);
                opt.height && (this.height = opt.height);
                opt.gop && (this.gop = opt.gop);
                opt.fps && (this.fps = opt.fps);
                opt.preset && (this.preset = opt.preset);

                videoConfig(this.streamIndex, opt)
            },
            open: function(opt) {
                var params = {};
                this.demoId = opt.id;
                if (typeof(opt.streamIndex) === "number") {
                    this.streamIndex = opt.streamIndex;
                    this.hasStreamIndex = true;
                    params = {
                        userId: AnyChatSDKUserHandler.instance.userId,
                        streamIndex: this.streamIndex,
                        deviceName: this.deviceName,
                        demoId: opt.id ? opt.id : "",
                        isShareDesktop: this.isInventCamera
                    };
                    var errorCode = openVideo(params);
                } else {
                    params = {
                        userId: AnyChatSDKUserHandler.instance.userId,
                        deviceName: this.deviceName,
                        demoId: opt.id ? opt.id : "",
                        isShareDesktop: this.isInventCamera
                    };
                    var errorCode = openVideo(params);
                }

                if (errorCode == 0) {
                    this.isOpen = true;
                }

                logger.invokeLog("localCameraOpen", errorCode, params);
                return errorCode;

            },
            close: function() {
                var params = {};
                if (this.hasStreamIndex) {
                    params = {
                        userId: AnyChatSDKUserHandler.instance.userId,
                        streamIndex: this.streamIndex
                    };
                    var errorCode = closeVideo(params);
                } else {
                    params = {
                        userId: AnyChatSDKUserHandler.instance.userId
                    };
                    var errorCode = closeVideo(params);
                }
                if (errorCode == 0) {
                    this.isOpen = false;
                }
                logger.invokeLog("localCameraClose", errorCode, params);
                GetID(this.demoId).innerHTML = "";
                return errorCode;
            }
        };



        //打开摄像头
        function openVideo(params) {
            var errorCode;
            if (typeof(params.streamIndex) === "number") {
                if (params.userId == AnyChatSDKUserHandler.instance.userId) {
                    //自己
                    if (!params.isShareDesktop) {
                        // BRAC_SelectVideoCapture(1, params.deviceName);
                        BRAC_SetUserStreamInfo(params.userId, params.streamIndex, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
                        errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
                        BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId, params.streamIndex);
                    } else {
                        BRAC_SetUserStreamInfo(params.userId, params.streamIndex, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
                        // desktopParamsSetting(params.userId, params.streamIndex); //先设置桌面共享流的参数
                        errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
                        if (params.demoId != "") {
                            BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId, params.streamIndex);
                        }
                    }
                } else {
                    //对方
                    errorCode = BRAC_UserCameraControlEx(params.userId, 1, params.streamIndex, 0, "");
                    BRAC_SetVideoPosEx(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_REMOTE_" + params.demoId, params.streamIndex);
                }
            } else {
                if (params.userId == AnyChatSDKUserHandler.instance.userId) {
                    //自己
                    BRAC_SetUserStreamInfo(params.userId, 0, BRAC_SO_LOCALVIDEO_DEVICENAME, params.deviceName);
                    errorCode = BRAC_UserCameraControl(params.userId, 1);
                    BRAC_SetVideoPos(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_LOCAL_" + params.demoId);
                } else {
                    //对方
                    errorCode = BRAC_UserCameraControl(params.userId, 1);
                    BRAC_SetVideoPos(params.userId, GetID(params.demoId), "ANYCHAT_VIDEO_REMOTE_" + params.demoId);
                }
            }
            return errorCode;
        }

        //关闭摄像头
        function closeVideo(params) {
            var errorCode;
            if (params.hasOwnProperty("streamIndex")) {
                errorCode = BRAC_UserCameraControlEx(params.userId, 0, params.streamIndex, 0, "");
            } else {
                errorCode = BRAC_UserCameraControl(params.userId, 0);
            }
            return errorCode;
        }

        function desktopParamsSetting(userid, deviceIdx) {
            // 设置本地视频编码的码率（如果码率为0，则表示使用质量优先模式）
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_BITRATECTRL, 1500000);

            // 设置本地视频编码的质量
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_QUALITYCTRL, 3);

            // 设置本地视频采集分辨率
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_WIDTHCTRL, 1920);
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_HEIGHTCTRL, 1080);

            // 设置本地视频编码的帧率
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_FPSCTRL, 20);

            // 设置本地视频编码的关键帧间隔
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_GOPCTRL, 80);

            // 设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_PRESETCTRL, 3);

            // 让视频参数生效
            BRAC_SetUserStreamInfo(userid, deviceIdx, BRAC_SO_LOCALVIDEO_APPLYPARAM, 1);
        }

        function videoConfig(dwStreamIndex, params) {

            // 设置本地视频编码的码率（如果码率为0，则表示使用质量优先模式）
            params.hasOwnProperty("bitRate") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_BITRATECTRL, params.bitRate);

            // 设置录像实时视频码率（参数为：int型，单位：bps）
            params.hasOwnProperty("recordBitRate") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_RECORD_VIDEOBR, params.recordBitRate);

            // 设置录像视频码率（参数为：int型，单位：bps）
            params.hasOwnProperty("recordBitRate") && BRAC_SetSDKOption(BRAC_SO_RECORD_VIDEOBR, params.recordBitRate);

            // 设置本地视频编码的质量
            params.hasOwnProperty("quality") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_QUALITYCTRL, params.quality);

            // 设置本地视频采集分辨率
            params.hasOwnProperty("width") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_WIDTHCTRL, params.width);
            params.hasOwnProperty("height") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_HEIGHTCTRL, params.height);

            // 设置本地视频编码的帧率
            params.hasOwnProperty("fps") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_FPSCTRL, params.fps);
            // 设置本地视频编码的关键帧间隔
            params.hasOwnProperty("gop") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_GOPCTRL, params.gop);
            // 设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
            params.hasOwnProperty("preset") && BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_PRESETCTRL, params.preset);

            // 本地视频采集分辩率控制策略（参数为int型，0 自动向下逐级匹配[默认]；1 使用采集设备默认分辩率），当配置的分辩率不被采集设备支持时有效
            params.hasOwnProperty("videoSizePolitic") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIDEOSIZEPOLITIC, params.videoSizePolitic);

            // 本地视频反交织参数控制（参数为int型： 0 不进行反交织处理[默认]；1 反交织处理），当输入视频源是隔行扫描源（如电视信号）时通过反交织处理可以提高画面质量
            params.hasOwnProperty("deinterlace") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_DEINTERLACE, params.deinterlace);

            // 本地视频摄像头对焦控制（参数为int型，1表示自动对焦， 0表示手动对焦）
            params.hasOwnProperty("focusCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_FOCUSCTRL, params.focusCtrl);

            // 本地视频采集优先格式控制（参数为int型，-1表示智能匹配，否则优先采用指定格式，参考：BRAC_PixelFormat）
            params.hasOwnProperty("pixfmtCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_PIXFMTCTRL, params.pixfmtCtrl);

            // 本地视频采用Overlay模式（参数为int型，1表示采用Overlay模式， 0表示普通模式[默认]）
            params.hasOwnProperty("overlay") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAY, params.overlay);

            // 本地视频编码器ID设置（参数为int型，-1表示默认，如果设置的编码器ID不存在，则内核会采用默认的编码器）
            params.hasOwnProperty("codeId") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_CODECID, params.codeId);

            // 本地视频旋转控制（参数为int型，0表示不进行旋转，1表示垂直翻转）
            params.hasOwnProperty("rotateCtrl") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_ROTATECTRL, params.rotateCtrl);

            // 本地视频采集驱动设置（参数为int型，0表示自动选择[默认]， 1 Video4Linux, 2 DirectShow, 3 Java采集[Android平台使用]）
            params.hasOwnProperty("capDriver") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_CAPDRIVER, params.capDriver);

            // 修正视频采集颜色偏色（参数为int型，0表示关闭[默认]，1 开启）
            params.hasOwnProperty("fixColordevia") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_FIXCOLORDEVIA, params.fixColordevia);

            // 迭加时间戳到本地视频（参数为：int型， 0 不迭加[默认]， 1 迭加）
            params.hasOwnProperty("overlayTimestamp") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAYTIMESTAMP, params.overlayTimestamp);

            // 本地视频迭加虚拟背景（字符串类型，JSON格式，包括虚拟背景路径、是否开启以及其它参数项）
            params.hasOwnProperty("virtualbk") && BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIRTUALBK, params.virtualbk);

            // 让视频参数生效
            BRAC_SetUserStreamInfo(-1, dwStreamIndex, BRAC_SO_LOCALVIDEO_APPLYPARAM, 1);
        }

        // 查询用户多媒体流参数
        function getUserStreamInfo(params) {
            return BRAC_GetUserStreamInfoInt(params.userId, params.streamIndex, params.infoName);
        }

        //获取DOM对象
        function GetID(id) {
            if (document.getElementById) {
                return document.getElementById(id);
            } else if (window[id]) {
                return window[id];
            }
            return null;
        }

        exports.instance = AnyChatSDKVideoHandler;
        exports.openVideo = openVideo;
        exports.closeVideo = closeVideo;
        exports.getUserStreamInfo = getUserStreamInfo;

        /***/ }),
    /* 15 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat双录处理器
	 * 函数说明:双录相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKDualRecordHandler");

        //构造函数
        function AnyChatSDKDualRecordHandler() {

        }

        AnyChatSDKDualRecordHandler.prototype = {
            constructor: AnyChatSDKDualRecordHandler
        }


        var instance = new AnyChatSDKDualRecordHandler();

        exports.instance = instance;

        /***/ }),
    /* 16 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat录像处理器
	 *
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKRecordHandler");

        var AnyChatSDKUserHandler = __webpack_require__(4);
        var getStrUserId = AnyChatSDKUserHandler.getStrUserId;
        var getIntUserId = AnyChatSDKUserHandler.getIntUserId;

        //构造函数
        function AnyChatSDKRecordHandler() {
            this.recordParams = 0;
            this.snapshotParams = 0;
            this.recordUserId = -1;
        }

        AnyChatSDKRecordHandler.prototype = {
            constructor: AnyChatSDKRecordHandler,
            start: function(opt) {
                if(opt.hasOwnProperty("userId")){
                    this.recordUserId = opt.userId;
                }
                var layoutMode = 1;
                opt.layout && (layoutMode = opt.layout);

                var string = {};
                opt.layoutStreams && (string.streamlist = opt.layoutStreams);

                if (string.streamlist) {
                    for (var i in string.streamlist) {
                        string.streamlist[i].userid = parseInt(getIntUserId(string.streamlist[i].userid));
                    }
                }
                var ANYCHAT_RECORD_FLAGS_FILEMD5 = 0x00040000;
                this.recordParams = ANYCHAT_RECORD_FLAGS_VIDEO + ANYCHAT_RECORD_FLAGS_AUDIO + ANYCHAT_RECORD_FLAGS_MIXAUDIO +
                    ANYCHAT_RECORD_FLAGS_MIXVIDEO + ANYCHAT_RECORD_FLAGS_STEREO + ANYCHAT_RECORD_FLAGS_LOCALCB + ANYCHAT_RECORD_FLAGS_USERFILENAME + ANYCHAT_RECORD_FLAGS_FILEMD5;

                switch (layoutMode + "") {
                    case "1":
                        string.recordlayout = 1;
                        // this.recordUserId = string.streamlist[0].userid;
                        // this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
                        break;
                    case "2":
                        string.recordlayout = 2;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    case "3":
                        string.recordlayout = 2;
                        break;
                    case "4":
                        string.recordlayout = 3;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    case "5":
                        string.recordlayout = 3;
                        string.layoutstyle = 1;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    case "6":
                        string.recordlayout = 4;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    case "7":
                        string.recordlayout = 9;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    case "8":
                        string.recordlayout = 16;
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                        break;
                    default:
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                }

                var mode = 1;
                opt.mode && (mode = opt.mode);

                switch (mode + "") {
                    case "1":
                        break;
                    case "2":
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_SERVER;
                        var VADCtrol = 0;
                        BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);
                        break;
                    case "3":
                        this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_SERVER + ANYCHAT_RECORD_FLAGS_STREAM;
                        var VADCtrol = 0;
                        BRAC_SetSDKOption(BRAC_SO_AUDIO_VADCTRL, VADCtrol);
                        break;
                }

                var content = 1;
                opt.content && (content = opt.content);

                switch (content + "") {
                    case "1":
                        break;
                    case "2":
                        this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_VIDEO - ANYCHAT_RECORD_FLAGS_MIXVIDEO;
                        break;
                    case "3":
                        this.recordParams = this.recordParams - ANYCHAT_RECORD_FLAGS_AUDIO - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
                        break;
                }

                if (opt.hasOwnProperty("fileType")) {
                    //录像文件格式设置
                    BRAC_SetSDKOption(BRAC_SO_RECORD_FILETYPE, parseInt(opt.fileType)-1);
                }

                if (opt.hasOwnProperty("clipMode")) {
                    //视频裁剪模式设置
                    var errorCode = BRAC_SetSDKOption(BRAC_SO_RECORD_CLIPMODE, parseInt(opt.clipMode));
                }

                if (opt.hasOwnProperty("fileName")) {
                    string.filename = opt.fileName;
                }
                if (opt.localFilePath) {
                    BRAC_SetSDKOption(BRAC_SO_RECORD_TMPDIR, opt.localFilePath);
                }

                opt.width && (BRAC_SetSDKOption(BRAC_SO_RECORD_WIDTH, opt.width));
                opt.height && (BRAC_SetSDKOption(BRAC_SO_RECORD_HEIGHT, opt.height));


                opt.picWatermark && (string.watermark = opt.picWatermark);
                opt.textWatermark && (string.textoverlay = opt.textWatermark);
                if (opt.hasOwnProperty("strJson")) {
                    string.strJson = opt.strJson;
                }
                if (opt.hasOwnProperty("category")) {
                    string.category = opt.category;
                }
                if (opt.hasOwnProperty("statusnotify")) {
                    string.statusnotify = opt.statusnotify;
                }

                var errorCode = BRAC_StreamRecordCtrlEx(this.recordUserId, 1, this.recordParams, 0, JSON.stringify(string));
                return errorCode;

            },
            stop: function() {
                //结束录制
                var errorCode = BRAC_StreamRecordCtrlEx(this.recordUserId, 0, this.recordParams, 0, "");
                if(errorCode == 0){
                    this.recordUserId = -1;
                }
                return errorCode;
            },
            insertFile: function(opt) {
                //录像时插入图片
                var errorCode = BRAC_SetSDKOption(BRAC_SO_RECORD_INSERTIMAGE, JSON.stringify(opt));
                return errorCode;
            },
            snapshot: function(opt) {
                var string = {};
                this.snapshotParams = ANYCHAT_RECORD_FLAGS_SNAPSHOT + ANYCHAT_RECORD_FLAGS_USERFILENAME;
                var mode = 1;
                opt.mode && (mode = opt.mode);

                var streamIndex = 0;
                opt.streamIndex && (streamIndex = opt.streamIndex);
                string.streamindex = streamIndex;
                string.isPhoto = 1;
                string.textoverlay = opt.szJsonBuf4Txt;
                switch (mode + "") {
                    case "1":
                        // this.snapshotParams = BRAC_RECORD_FLAGS_SNAPSHOT + BRAC_RECORD_FLAGS_LOCALCB;
                        break;
                    case "2":
                        this.snapshotParams = this.snapshotParams + ANYCHAT_RECORD_FLAGS_SERVER + ANYCHAT_RECORD_FLAGS_LOCALCB;
                        break;
                }

                if (opt.hasOwnProperty("fileName")) {
                    string.filename = opt.fileName;
                }

                if (opt.hasOwnProperty("strJson")) {
                    string.strJson = opt.strJson;
                }

                if (opt.hasOwnProperty("category")) {
                    string.category = opt.category;
                }

                if (opt.localFilePath) {
                    BRAC_SetSDKOption(BRAC_SO_SNAPSHOT_TMPDIR, opt.localFilePath);
                }

                var errorCode = BRAC_StreamRecordCtrlEx(getIntUserId(opt.userId), 1, this.snapshotParams, streamIndex, JSON.stringify(string));
                return errorCode;
            },
            cancel: function(){
                var errorCode = BRAC_StreamRecordCtrlEx(-1, 0, ANYCHAT_RECORD_FLAGS_CANCEL, 0, "");
                return errorCode;
            },
            updateRecordParam: function(opt){
                var newJsonObj = {}, paramJsonObj = {};
                if(opt.layout) {
                    switch (opt.layout+"") {
                        case "1":
                            paramJsonObj.recordlayout = 1;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_MIXAUDIO) == 1) {
                                this.recordParams - ANYCHAT_RECORD_FLAGS_MIXAUDIO;
                            }

                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_MIXVIDEO) == 1) {
                                this.recordParams - ANYCHAT_RECORD_FLAGS_MIXVIDEO;
                            }
                            break;
                        case "2":
                            paramJsonObj.recordlayout = 2;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                        case "3":
                            paramJsonObj.recordlayout = 2;
                            break;
                        case "4":
                            paramJsonObj.recordlayout = 3;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                        case "5":
                            paramJsonObj.recordlayout = 3;
                            paramJsonObj.layoutstyle = 1;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                        case "6":
                            paramJsonObj.recordlayout = 4;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                        case "7":
                            paramJsonObj.recordlayout = 9;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                        case "8":
                            paramJsonObj.recordlayout = 16;
                            if ((this.recordParams & ANYCHAT_RECORD_FLAGS_ABREAST) == 0) {
                                this.recordParams = this.recordParams + ANYCHAT_RECORD_FLAGS_ABREAST;
                            }
                            break;
                    }
                }
                if(opt.layoutStreams){
                    paramJsonObj.streamlist = opt.layoutStreams;
                }
                if(opt.textWatermark){
                    paramJsonObj.textoverlay = opt.textWatermark;
                }
                if(opt.picWatermark){
                    paramJsonObj.watermark = opt.picWatermark;
                }
                newJsonObj.userid = opt.userid ? opt.userid : -1;
                newJsonObj.strparam = paramJsonObj;

                newJsonObj.recordflags = this.recordParams;

                return BRAC_SDKControl(ANYCHAT_SDKCTRL_UPDATERECUSERSTR, JSON.stringify(newJsonObj));
            },
            recordtag:function(opt){
                var errorCode = BRAC_SDKControl(ANYCHAT_SDKCTRL_RECORDTAG,JSON.stringify(opt));
                return errorCode;
            }
        };





        var instance = new AnyChatSDKRecordHandler();

        exports.instance = instance;

        /***/ }),
    /* 17 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChat队列处理器
	 * 函数说明:AnyChat队列相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKSettingHandler");
        var AnyChatSDKConstant = __webpack_require__(2);
        var CONSTANT = AnyChatSDKConstant.instance;

        // 自定义指令构造函数
        function AnyChatSDKSettingHandler() {

        }

        AnyChatSDKSettingHandler.prototype = {
            constructor: AnyChatSDKSettingHandler,
            //设置参数
            setSDKOption: function(opt) {
                if (opt.hasOwnProperty("enableWebService")) {
                    //启动本地Web服务
                    var errorCode = enableWebService(parseInt(opt.enableWebService));
                    logger.invokeLog("enableWebService", errorCode, { enableWebService: opt.enableWebService });
                }
                if (opt.hasOwnProperty("localPath2Url")) {
                    //将本地路径转换为URL地址
                    var errorCode = localPath2Url(parseInt(opt.localPath2Url));
                    logger.invokeLog("localPath2Url", errorCode, { localPath2Url: opt.localPath2Url });
                }
                if (opt.hasOwnProperty("videoBgImage")) {
                    //设置视频背景图片
                    var errorCode = setVideoBgImage(opt.videoBgImage);
                    logger.invokeLog("videoBgImage", errorCode, { videoBgImage: opt.videoBgImage });
                }
                if (opt.hasOwnProperty("P2PPolitic")) {
                    //本地网络P2P策略控制
                    var errorCode = setP2PPolitic(parseInt(opt.P2PPolitic));
                    logger.invokeLog("P2PPolitic", errorCode, { P2PPolitic: opt.P2PPolitic });
                }
                if (opt.hasOwnProperty("remoteVideoMode")) {
                    //远程视频显示模式
                    var errorCode = setRemoteVideoMode(parseInt(opt.remoteVideoMode));
                    logger.invokeLog("remoteVideoMode", errorCode, { remoteVideoMode: opt.remoteVideoMode });
                }
                if (opt.hasOwnProperty("uploadLogInfo")) {
                    var errorCode = setUploadLogInfo(parseInt(opt.uploadLogInfo));
                    logger.invokeLog("uploadLogInfo", errorCode, { uploadLogInfo: opt.uploadLogInfo });
                }
                if (opt.hasOwnProperty("applyParam")) {
                    BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_APPLYPARAM, opt.applyParam);
                }
                if (opt.hasOwnProperty("overlayTimestamp")) {
                    var errorCode = setOverlayTimestamp(parseInt(opt.overlayTimestamp));
                    logger.invokeLog("overlayTimestamp", errorCode, { overlayTimestamp: opt.overlayTimestamp });
                }
            },
            getVersionInfo: function() {
                var version = "V" + BRAC_GetVersion(1) + " Build time: " + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME);
                return version;
            },
            getState: function(opt) {
                if (parseInt(opt.infoName) == 6 || parseInt(opt.infoName) == 7 || parseInt(opt.infoName) == 8) {
                    return BRAC_QueryUserStateString(opt.userId, opt.infoName);
                } else {
                    return BRAC_QueryUserStateInt(opt.userId, opt.infoName);
                }
            },
            getSDKOptionInt: function(infoName) {
                return BRAC_GetSDKOptionInt(infoName);
            },
            getSDKOptionString: function(infoName) {
                return BRAC_GetSDKOptionString(infoName);
            },
            // 设置虚拟背景
            setVirtualBkImg: function(opt) {
                return BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_VIRTUALBK, JSON.stringify(opt));
            },
            //旋转屏幕
            setRotation:function(opt){
                if(opt.userId){
                    var rotation;
                    if(opt.rotation==0){
                        rotation=0
                    }else if(opt.rotation==90){
                        rotation=BRAC_ROTATION_FLAGS_ROTATION90;
                    }else if(opt.rotation==180){
                        rotation=BRAC_ROTATION_FLAGS_ROTATION180;
                    }else if(opt.rotation==270){
                        rotation=BRAC_ROTATION_FLAGS_ROTATION270;
                    }
                    return BRAC_UserInfoControl(opt.userId, BRAC_USERINFO_CTRLCODE_ROTATION, rotation, 0, "");
                }
            }

        };

        // 启动本地Web服务
        function enableWebService(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_ENABLEWEBSERVICE, value);
            return errorCode;
        }

        // 将本地路径转换为URL地址
        function localPath2Url(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_LOCALPATH2URL, value);
            return errorCode;
        }

        // 设置视频背景图片
        function setVideoBgImage(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, value);
            return errorCode;
        }

        // 本地网络P2P策略控制
        function setP2PPolitic(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_NETWORK_P2PPOLITIC, value);
            return errorCode;
        }

        // 远程视频显示模式
        function setRemoteVideoMode(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_VIDEOSHOW_CLIPMODE, value);
            return errorCode;
        }

        // 设置日志上传到服务器
        function setUploadLogInfo(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_CORESDK_UPLOADLOGINFO, value);
            return errorCode;
        }

        // 设置本地视频时间戳水印
        function setOverlayTimestamp(value) {
            var errorCode = BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_OVERLAYTIMESTAMP, value);
            return errorCode;
        }



        var instance = new AnyChatSDKSettingHandler();

        exports.instance = instance;

        /***/ }),
    /* 18 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChatAI能力
	 * 函数说明:AnyChatAI能力相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKAi");
        var AnyChatSDKErrorCode = __webpack_require__(5);


        // 自定义指令构造函数
        function  AnyChatSDKAI() {
            this.asrtaskid={};
            this.ttstaskid={};
            this.facetaskid={};
            this.doOcrImagetaskid ={};
            this.capturetaskid={};
            this.isAlive=true;
            this.guid = BRAC_NewGuid();
            var json = {
                "cmd": ANYCHAT_AI_CTRL_ROBOT_INIT,
                "robotid": this.guid
            };
            var err = BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, JSON.stringify(json));
            logger.invokeLog("createRobot", err, { robotid: this.guid});
        };


        AnyChatSDKAI.prototype = {
            constructor: AnyChatSDKAI,

            //销毁机器人
            //roboId 机器人id
            destroyRobot  : function() {
                var json = {
                    "cmd": ANYCHAT_AI_CTRL_ROBOT_RELEASE,
                    "robotid": this.guid
                };
                var err = BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, JSON.stringify(json));

                logger.invokeLog("destroyRobot", err, { robotid: this.guid});
                return err;
            },
            /*
	      * 方法名：开启语音识别 AnyChatAIRobot.startASR
	      * 参数  option.event 任务开始回调 , option.resultevent 任务执行中回调  ,option.errorevent 任务报错回调, option.targetUserId 用户id（非必传）
	      * 返回值 ：asrtaskid   语音识别任务id
	     */
            startASR:function (option) {

                if(!this.isAlive){
                    return;
                }
                var taskid=BRAC_NewGuid()
                this.asrtaskid[taskid] = taskid;

                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepare"+this.asrtaskid[taskid], option.event, true);//任务开始

                (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResult"+this.asrtaskid[taskid], option.resultevent, false);//任务执行中

                (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIError"+this.asrtaskid[taskid], option.errorevent, true);//任务失败


                AI_ASR_TASKID = this.asrtaskid[taskid];
                var json = {
                    "cmd": ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_ASR,
                    "start":1,
                    "taskid": AI_ASR_TASKID,
                    "timeinterval":ANYCHAT_AI_TIMEINTERVAL_ASR,
                    "timeout":ANYCHAT_AI_TIMEOUT,
                    "robotid":this.guid,
                    "mode":ANYCHAT_ASRMODE_LIVESTREAM,
                    "asrtype":2,
                    "userid":option.targetUserId,
                };
                var strInJson = JSON.stringify(json);
                var errcode=  BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                var lpEventJsonObj=JSON.parse(errcode);
                if(lpEventJsonObj.errorcode!=0){//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIError"+this.asrtaskid[taskid],
                        result: result,
                    });
                }

                logger.invokeLog("startASR", errcode, { taskid: AI_ASR_TASKID,robotId:this.guid});
            },
            /*
	     *   方法名：关闭语音识别 AnyChatAIRobot.stopASR
	     *  参  数： option.event 回调 , ，option.asrTaskId 需要关闭语音识别的任务id
	     * 返回值：asrtaskid
	     */
            stopASR:function (option) {//option{event回调 ,}
                if(!this.isAlive){
                    return;
                }
                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinish"+option.asrTaskId, option.event, true);//关闭语音识别回调
                var json = {
                    "cmd": ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_ASR,
                    "start":0,
                    "taskid": option.asrTaskId,
                    "timeinterval":ANYCHAT_AI_TIMEINTERVAL_ASR,
                    "timeout":ANYCHAT_AI_TIMEOUT,
                    "robotid":this.guid,
                    "mode":ANYCHAT_ASRMODE_LIVESTREAM,
                    "asrtype":2,

                };
                var strInJson = JSON.stringify(json);
                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("stopASR", err, { taskid: option.asrTaskId,robotId:this.guid});
            },
            /**
             * 开启语音合成
             * 参数：option.contentStr 需要合成的文本， option.type 1->男声，2->女声 ，option.mode 1 本地播放 2 TTS转换后在线播放, option.event 任务开始回调 , option.resultevent 任务执行中回调  ,option.errorevent 任务报错回调,
             *返回值 ttsTaskId  语音合成任务id
             */
            doTTS:function (option) {
                if(!this.isAlive){
                    return;
                }
                var taskid=BRAC_NewGuid()
                this.ttstaskid[taskid] = taskid;
                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPreparetts"+this.ttstaskid[taskid], option.event, true);//任务开始

                (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulttts"+this.ttstaskid[taskid], option.resultevent, false);//任务执行中

                (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrortts"+this.ttstaskid[taskid], option.errorevent, true);//任务失败

                (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishtts"+this.ttstaskid[taskid], option.finishevent, true);//任务结束


                AI_TTS_TASKID = taskid;
                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_TTS,
                    "start":1,
                    "taskid":AI_TTS_TASKID,
                    "ttstype":option.type,
                    "mode":option.mode,
                    "robotid":this.guid,
                    "content":option.contentStr
                }
                var strInJson = JSON.stringify(json);


                var error= BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("doTTs", error, { taskid: AI_TTS_TASKID,robotId:this.guid});
                var lpEventJsonObj=JSON.parse(error);
                if(lpEventJsonObj.errorcode!=0){//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIErrortts",
                        result: result,
                    });
                }
            },
            /**
             * 人脸识别
             * 参数：option.contentStr 需要合成的文本， option.type 1->男声，2->女声 ，option.mode 1 本地播放 2 TTS转换后在线播放, option.event 任务开始回调 , option.resultevent 任务执行中回调  ,option.errorevent 任务报错回调, option.mode
             *返回值 faceTaskId  人脸识别任务id
             */
            startFaceDetect :function (option) {
                if(!this.isAlive){
                    return;
                }
                var taskid=BRAC_NewGuid()
                this.facetaskid[taskid]=taskid ;
                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepareface"+this.facetaskid [taskid], option.event, true);//任务开始

                (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulface"+this.facetaskid [taskid], option.resultevent, false);//任务执行中

                (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorface"+this.facetaskid [taskid], option.errorevent, true);//任务失败


                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_AFR,
                    "start":1,
                    "taskid":this.facetaskid [taskid],
                    "robotid":this.guid,
                    "filetype":1,
                }
                //图片人脸检测(单个image)模式
                if(option.mode==ANYCHAT_AFRMODE_IMAGEFACEDETECT){
                    json["mode"]=ANYCHAT_AFRMODE_IMAGEFACEDETECT;
                    json["image1"]=option.aiAfrOpt.image1;
                }

                //视频流人脸检测(单个timeinterval)模式
                if(option.mode==ANYCHAT_AFRMODE_STREAMFACEDETECT){
                    json["mode"]=ANYCHAT_AFRMODE_STREAMFACEDETECT;
                    json["userid"]= option.targetUserId ? option.targetUserId : 0;
                }

                //图片人脸比对模式
                if(option.mode==ANYCHAT_AFRMODE_IMAGEFACECOMPARE){
                    json["mode"]=ANYCHAT_AFRMODE_IMAGEFACECOMPARE;
                    json["image1"]=option.aiAfrOpt.image1;
                    json["image2"]=option.aiAfrOpt.image2;
                }

                //视频流人脸比对模式
                if(option.mode==ANYCHAT_AFRMODE_STREAMFACECOMPARE){
                    json["mode"]=ANYCHAT_AFRMODE_STREAMFACECOMPARE;
                    json["image1"]=option.aiAfrOpt.image1;
                    json["userid"]= option.targetUserId ? option.targetUserId : 0;
                }

                //图片人脸检测模式
                if(option.mode==ANYCHAT_AFRMODE_IMAGETWOPERSONCOMPARE){
                    json["mode"]=ANYCHAT_AFRMODE_IMAGETWOPERSONCOMPARE;
                    json["image1"]=option.aiAfrOpt.image1;
                    json["image2"]=option.aiAfrOpt.image2;
                    json["image3"]=option.aiAfrOpt.image3;
                }

                //视频流两人人脸比对模式
                if(option.mode==ANYCHAT_AFRMODE_STREAMTWOPERSONCOMPARE){
                    json["mode"]=ANYCHAT_AFRMODE_STREAMTWOPERSONCOMPARE;
                    json["image1"]=option.aiAfrOpt.image1;
                    json["image2"]=option.aiAfrOpt.image2;
                    json["userid"]= option.targetUserId ? option.targetUserId : 0;
                }

                //图片人脸姿势检测模式
                if(option.mode==ANYCHAT_AFRMODE_IMAGEFACEPOSTUREDETECT){
                    json["mode"]=ANYCHAT_AFRMODE_IMAGEFACEPOSTUREDETECT;
                    json["image1"]=option.aiAfrOpt.image1;
                }

                //视频流人脸姿势检测模式
                if(option.mode==ANYCHAT_AFRMODE_STREAMFACEPOSTUREDETECT){
                    json["mode"]=ANYCHAT_AFRMODE_STREAMFACEPOSTUREDETECT;
                    delete json["filetype"];
                }



                var strInJson = JSON.stringify(json);

                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("startFaceDetect", err, { taskid: this.facetaskid [taskid],robotId:this.guid});
                var lpEventJsonObj=JSON.parse(err);
                if(lpEventJsonObj.errorcode!=0){//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIErrorface"+this.facetaskid [taskid],
                        result: result,
                    });
                }
            },
            //关闭人脸识别
            stopFaceDetect :function (option) {
                if(!this.isAlive){
                    return;
                }
                (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishface"+option.facetaskid, option.finishevent, true);//任务结束
                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_AFR,
                    "start":0,
                    "taskid":option.facetaskid,
                    "robotid":this.guid,
                    "filetype":1,
                }
                var strInJson = JSON.stringify(json);
                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("stopFaceDetect", err, { taskid: option.afrTaskId});
            },
            //启动证件识别

            doOcrImage:function (option) {
                if(!this.isAlive){
                    return;
                }
                var taskid=BRAC_NewGuid()
                this.doOcrImagetaskid[taskid] = taskid;
                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPrepareocr"+this.doOcrImagetaskid[taskid], option.event, true);//任务开始

                (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulocr"+this.doOcrImagetaskid[taskid], option.resultevent, false);//任务执行中

                (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorocr"+this.doOcrImagetaskid[taskid], option.errorevent, true);//任务失败

                (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishocr"+this.doOcrImagetaskid[taskid], option.finishevent, true);//任务结束

                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_OCR,
                    "start":1,
                    "taskid":this.doOcrImagetaskid[taskid],
                    "ocrtype":option.type,
                    "robotid":this.guid,
                    "filetype":1,
                    "content":option.bitmap,
                }
                var strInJson = JSON.stringify(json);
                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("doOcrImage", err, { taskid:this.doOcrImagetaskid[taskid],robotId:this.guid});
                var lpEventJsonObj=JSON.parse(err);
                if(lpEventJsonObj.errorcode!=0){//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIErrorocr"+this.doOcrImagetaskid[taskid] ,
                        result: result,
                    });
                }

            },
            //场景LOGO识别
            //option.targetUserId  option.event
            startFaceCapture:function (option) {
                if(!this.isAlive){
                    return;
                }
                var taskid=BRAC_NewGuid();
                this.capturetaskid[taskid] = taskid;
                (typeof(option.event) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIPreparecapture"+this.capturetaskid[taskid], option.event, true);//任务开始

                (typeof(option.resultevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIResulcapture"+this.capturetaskid[taskid], option.resultevent, false);//任务执行中

                (typeof(option.errorevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIErrorcapture"+this.capturetaskid[taskid], option.errorevent, true);//任务失败

                (typeof(option.finishevent) === "function") && AnyChatWebSDK.anychatSDKInstance.setCallBack("onAIFinishcapture"+this.capturetaskid[taskid], option.finishevent, true);//任务结束

                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_AIC,
                    "start":1,
                    "taskid":this.capturetaskid[taskid],
                    "robotid":this.guid,
                    "userid":option.targetUserId ? option.targetUserId : 0,
                    "timeout":option.timeout ? option.timeout : ANYCHAT_AI_TIMEOUT,
                }
                if(option.mode==ANYCHAT_AICMODE_FACECAPTURE){
                    json["mode"]=ANYCHAT_AICMODE_FACECAPTURE;
                    json["xmargin"]=option.xmargin ? option.xmargin : 5;
                    json["ymargin"]=option.ymargin ? option.ymargin : 5;
                }
                if(option.mode==ANYCHAT_AICMODE_FACECOMPARE){
                    json["mode"]=ANYCHAT_AICMODE_FACECOMPARE;
                    json["content"]=option.content ;
                    json["fileype"]=1;
                    json["comparescore"]= option.comparescore ? option.comparescore : 70.0;
                }
                var strInJson = JSON.stringify(json);
                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("startFaceCapture", err, { taskid: this.capturetaskid[taskid],robotId:this.guid});
                var lpEventJsonObj=JSON.parse(err);
                if(lpEventJsonObj.errorcode!=0) {//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIErrorcapture"+this.capturetaskid[taskid],
                        result: result,
                    });
                }
            },
            stopFaceCapture:function (option) {
                if(!this.isAlive){
                    return;
                }
                var json = {
                    "cmd":ANYCHAT_AI_CTRL_ABILITY_INVOKE,
                    "aitype": ANYCHAT_AI_TYPE_AIC,
                    "start":0,
                    "taskid":option.aicTaskId,
                    "robotid":this.guid,
                }
                var strInJson = JSON.stringify(json);
                var err=BRAC_SDKControl(ANYCHAT_CORESDKEVENT_AIABILITY, strInJson);
                logger.invokeLog("stopFaceCapture", err, { taskid: option.aicTaskId});
                var lpEventJsonObj=JSON.parse(err);
                if(lpEventJsonObj.errorcode!=0){//errcode不等于0触发err回调
                    var result={
                        AnyChatResult : {
                            code: lpEventJsonObj.errorcode,
                            msg: AnyChatSDKErrorCode.checkErrorMsg(lpEventJsonObj.errorcode),
                        },
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAIFinishcapture"+option.aicTaskId,
                        result: result,
                    });
                }
            }



        };



        var instance =  AnyChatSDKAI;

        exports.instance = instance;


        /***/ }),
    /* 19 */
    /***/ (function(module, exports, __webpack_require__) {

        /*-----------------------------------------------------------
	 * AnyChatAI能力管理类
	 * 函数说明:创建、销毁、查询、AI机器人相关操作与回调事件处理
	 *
	 *
	 * ----------------------------------------------------------
	 */
        //引入log4js
        var log4js = __webpack_require__(1);
        var logger = log4js.getLogger("AnyChatSDKAIManagement");
        var AnyChatSDKAI = __webpack_require__(18);

        // 自定义指令构造函数
        function  AnyChatSDKAIManagement() {
            this.AnyChatAIRobot={};
        };

        AnyChatSDKAIManagement.prototype = {
            constructor: AnyChatSDKAIManagement,

            //创建机器人
            //anychatAi 机器人对象 AnyChatAIRobot 机器人对象集合
            createRobot  : function() {
                var anyChatAi=new AnyChatSDKAI.instance();
                this.AnyChatAIRobot[anyChatAi.guid]=anyChatAi;
                return anyChatAi;
            },

            //销毁机器人
            //roboId 机器人id
            destroyRobot  : function(robotId) {
                if(!this.AnyChatAIRobot[robotId]){
                    return ;
                }
                var err = this.AnyChatAIRobot[robotId].destroyRobot();
                if(JSON.parse(err).errorcode==0){
                    delete this.AnyChatAIRobot[robotId];
                }

            },
            //查询所有创建的机器人
            getAllRobot:function () {
                var List=[];
                for(var i in this.AnyChatAIRobot){
                    List.push(this.AnyChatAIRobot[i]);
                }
                return List;
            },
            //销毁所有机器人
            destoryAllRobot:function () {
                for(var i in this.AnyChatAIRobot){
                    if(!!this.AnyChatAIRobot[i]){
                        var err =this.AnyChatAIRobot[i].destroyRobot();
                        if(JSON.parse(err).errorcode==0){
                            delete this.AnyChatAIRobot[i];
                        }
                    }
                }
            },
            getAnyChatAIRobot:function (guid) {
                return this.AnyChatAIRobot[guid];
            },
            setAnyChatAIRobot :function (guid,anyChatRobot) {
                this.AnyChatAIRobot[guid]=anyChatRobot;
            }
        }






        var instance =new  AnyChatSDKAIManagement();

        exports.instance = instance;


        /***/ }),
    /* 20 */
    /***/ (function(module, exports) {

        // 自定义指令构造函数
        function AnyChatWhiteBoard(option) {
            this.userId = option.userId;
            this.roomId = option.roomId;
            this.appId = option.appId;//应用id，插拔式服务需要此字段
            this.container = option.container;//展示白板的容器
            //白板模式：默认是交互模式：0，另外一种是观看模式：1
            this.whiteBoardMode = option.whiteBoardMode || 0;
            //用户昵称
            this.nickName =  option.nickName || option.userId.toString();
            //文字水印
            this.warterMark = option.warterMark || null;
            //canvas 尺寸设置
            this.sizeMode= option.sizeMode|| 3;

            if(option.isHideInfoTo === void 0){
                this.isHideInfoTo =  1;//默认添加顶部和右下角附加信息
            }else{
                this.isHideInfoTo = option.isHideInfoTo
            }

            //远程用户操作标识
            this.isRemoteOperate = false;
            //默认宽高，根据容器的长宽自适应
            this.autoWidth = null;
            this.autoHeight = null;
            //实际白板宽高
            this.width = null;	//白板宽度
            this.height = null;
            this.displayCtx = null; //展示绘画结果canvas
            this.guid = null;//当前正在使用的白板数据guid
            this.bgImg = null;//背景img的路径
            this.currentBgImg = null;//当前显示的，已经加载的img
            //设定当前画笔状态并赋予初始值
            this.lineWidth = 1;
            this.lineColor = '#000000';
            this.lineStyle = 1;

            this.isMouseDown = false;
            //当前正在绘画的数据
            this.paintingData = null;
            //上一次截图保存的画板页信息（颜色、背景、线等）(字符串类型)
            this.lastClipDrawDataStr = '';
            //检查更新的定时器
            this.checkUpdateInterver = '';
            //图片加载onload个数，仅显示最终的onload图片
            this.onloadCount = 0;
            //图片预加载当前index
            this.imgPreLoadIndex = 0;

            //canvas dom 构建 相当于打开白板，与关闭白板相对应
            // this.openWhiteBoard(option.container);

            this.whiteBoardControler = {};
            //对象属性无序，为保证有序，使用数组同步添加、删除白板对象
            this.whiteBoardControlerArr = [];

            this.serverGuid = ''//插拔式服务guid
            this.detachableServerInstance = null//插拔式服务实例
            //阀门管理，使异步请求能同步（成功更改阀门，使后续步骤继续进行）
            this.flagManager = {
                'init':0,
                'syncdrawdata':0,
                // 'mediacontrol':0,
                // 'destroymeeting':0
            }
            // this.detachableServerinitFlag = false;//插拔式服务初始化成功标志
            this.actionTemporary = []//暂存区
            // this.createWBdata();
            console.log('----------------------------------画板构造函数');
            console.log(this);
            console.log('----------------------------------初始化白板插拔式服务');

            this.initDetachableServer()
            // while (!this.detachableServerinitFlag){
            //     console.log('----------------------------------初始化白板插拔式服务中');
            // }
            // console.log('----------------------------------初始化白板插拔式服务成功');
            this.command = new command(this);

        };


        AnyChatWhiteBoard.prototype = {
            constructor: AnyChatWhiteBoard,
            //打开白板（初始化展示画布）
            openWhiteBoard: function (container) {
                // console.log(container);
                // this.container = container;
                this.width = container.clientWidth || 400;
                this.height = container.clientHeight || 400;

                // container.style.position = 'relative';
                //创建canvas

                if (typeof this.width !== 'number') { throw new Error('画板宽度不是数字'); }
                if (typeof this.height !== 'number') { throw new Error('画板高度不是数字'); }

                var displayCanvas = document.createElement('canvas');
                this.displayCtx = displayCanvas.getContext('2d');
                //this.displayCtx.translate(0.5, 0.5);//平移半个像素以抗锯齿
                // this.displayCtx.lineJoin = 'round';
                // this.displayCtx.lineCap = 'round';//消除断断续续

                displayCanvas.style.position = 'relative';
                displayCanvas.style.boxSizing = 'content-box';
                displayCanvas.style.backgroundPosition = 'center';
                displayCanvas.style.backgroundRepeat = 'no-repeat';
                displayCanvas.style.backgroundSize = 'contain';
                displayCanvas.style.zIndex = 0;
                // displayCanvas.style.border = 'dotted 1px #999';
                this.displayCanvas = displayCanvas;
                // this.setCanvasSize();
                this.setSizeMode(this.sizeMode);
                //抗锯齿：先放大再缩小
                // var canvasW = this.displayCanvas.width;
                // var canvasH=this.displayCanvas.height;
                // if (window.devicePixelRatio) {
                //     this.displayCanvas.style.width = canvasW + "px";
                //     this.displayCanvas.style.height = canvasH + "px";
                //     this.displayCanvas.height = canvasH * window.devicePixelRatio;
                //     this.displayCanvas.width = canvasW * window.devicePixelRatio;
                //     this.displayCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
                // }
                this.preprocessing = this.preprocessing.bind(this);
                container.appendChild(this.displayCanvas);
                //打开鼠标事件绑定
                this.bindMouseEvent(true);
                //触发回调
                var result = {
                    container:container
                };
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteboardOpen",
                    result: result,
                });
            },
            //创建白板数据组
            createWBdata: function (wbData,userId) {
                if(userId === void 0){userId = this.userId}
                // var wbObj = new createWhiteBoradData(wbData,userId);
                var wbObj = {
                    whiteboardCreator:wbData.whiteboardCreator,
                    whiteboardName:wbData.whiteboardName,
                    whiteboardCreateTime:wbData.whiteboardCreateTime,
                    whiteboardPageIndex:wbData.whiteboardPageIndex,
                }
                if (userId !== this.userId){
                    //接收到act交互消息，创建使用对方的白板数据
                    wbObj.whiteboardId = wbData.whiteboardId;
                }else{
                    //自己创建白板则生成白板id
                    wbObj.whiteboardId = AnyChatWebSDK.anychatSDKInstance.createGuid();
                }
                this.whiteBoardControler[wbObj.whiteboardId] = wbObj;
                this.whiteBoardControlerArr.push(wbObj);
                this.guid = wbObj.whiteboardId;
            },
            //设置canvas宽高
            setCanvasSize: function (width,height) {
                //容器比宽高比例
                var containerRate = this.container.clientWidth / this.container.clientHeight;
                //默认画布宽高比
                var canvasRate = this.autoWidth/this.autoHeight;
                //图片宽高比
                var imageRate;
                if(width == 0 && height == 0){
                    //空白白板页， //传0,使用默认宽高
                    this.width = this.autoWidth;
                    this.height = this.autoHeight;
                }
                else if(width != 0  && height !=0
                    && width < this.autoWidth && height < this.autoHeight){
                    //图片存在宽高，且都小于默认画布宽高，图片按比例拉伸铺，居中显示，画布大小不变
                    this.width = this.autoWidth;
                    this.height = this.autoHeight;
                }else if(width > this.autoWidth &&  height < this.autoHeight){
                    //图片宽度大于画布宽度，高小于画布高度，画布大小不变
                    this.width = this.autoWidth;
                    this.height = this.autoHeight;
                }else if(height > this.autoHeight &&  width < this.autoWidth){
                    //图片高度大于画布，宽小于画布宽度，图片宽度拉伸，高度拉伸，画布高度撑大
                    this.width = this.autoWidth;
                    imageRate = width/height;
                    this.height = this.width / imageRate;
                }else if(width > this.autoWidth &&  height > this.autoHeight){
                    //图片高度宽度均大于画布宽高，图片宽度缩小,高度缩小，
                    // 画布高度取缩小后的图片高度与画布默认高度的最大值
                    imageRate = width/height;
                    this.width = this.autoWidth;
                    this.height = this.width / imageRate;
                    if(this.height < this.autoHeight){
                        this.height = this.autoHeight
                    }
                }

                this.displayCtx.canvas.width = this.width;
                this.displayCtx.canvas.height = this.height;
                //重新渲染
                // if (this.guid){
                //     this.render(this.whiteBoardControler[this.guid]);
                // }

            },
            //鼠标事件预处理
            preprocessing: function (e) {
                e.preventDefault();
                e = e.originalEvent ? e.originalEvent : e;
                if (!this.displayCtx) { return; }
                var rect = this.displayCtx.canvas.getBoundingClientRect();
                var mw = this.displayCtx.canvas.width;
                var mh = this.displayCtx.canvas.height;
                var x, y;
                x = e.clientX;
                y = e.clientY;
                if (!x && x !== 0) { x = 0; }
                if (!y && y !== 0) { y = 0; }
                var offset = new Point(x - rect.left, y - rect.top);
                //超范围处理
                if (offset.x > mw) {
                    offset.x = mw;
                };
                if (offset.x < 0) {
                    offset.x = 0;
                };
                if (offset.y > mh) {
                    offset.y = mh;
                };
                if (offset.y < 0) {
                    offset.y = 0;
                };
                var type = e.type;
                // console.log(type,offset)
                // var _throttle = throttle(this[type](offset),200,this,200);
                // _throttle();
                this[type](offset);
            },
            //鼠标事件绑定
            bindMouseEvent: function (control) {
                var op = control ? 'add' : 'remove';
                var canvas = [this.displayCtx.canvas];
                // console.log(canvas)
                var d = this.preprocessing;
                canvas.forEach(function (c) {
                    c[op + 'EventListener']('mousedown', d);
                    c[op + 'EventListener']('mousemove', d);
                });
                document[op + 'EventListener']('mouseup', d);
            },
            mousedown: function (offset) {
                var userId = this.userId;
                var guid = this.guid;
                if(!guid){return}
                if(this.whiteBoardMode){return}
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                var data = new drawData(this.lineWidth, this.lineColor, this.lineStyle,guid,userId);
                this.paintingData = data;
                var startPoint = this.toPercentData(offset);
                this.paintingData.lineData.startPoint = startPoint;
                //-----------------------------------------------------------------------------------
                //判断如果有useid就不需要再新生成一个
                if(this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData.hasOwnProperty(userId)){
                    console.log(this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData[userId])
                    this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData[userId].push(this.paintingData);
                }else{
                    var dataObj = [];
                    dataObj.push(this.paintingData);
                    this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData[userId] = dataObj;
                }
                console.log(this.whiteBoardControler[guid])
                this.isMouseDown = true;
                this.command.emit({
                    userId: userId,
                    guid: guid,
                    event: 'start',
                    pageId: pageId,
                    pageIndex:pageIndex,
                    value: {
                        point:startPoint,
                        lineWidth:this.lineWidth,
                        lineColor:this.lineColor,
                        lineStyle:this.lineStyle,
                        actionId:this.paintingData.actionId,
                        sTimestamp:this.paintingData.sTimestamp,

                    }
                });
            },
            mousemove: function (offset) {
                var userId = this.userId;
                var guid = this.guid;
                if (!this.isMouseDown) return;
                if (this.whiteBoardMode) return;
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                var movePoint = this.toPercentData(offset);
                this.paintingData.lineData.movePoint.push(movePoint);
                this.command.emit({
                    userId: userId,
                    guid: guid,
                    event: 'move',
                    pageIndex:pageIndex,
                    pageId:pageId,
                    value: {point:movePoint}
                });
                this.render(this.whiteBoardControler[guid]);
            },
            mouseup: function (offset) {
                var userId = this.userId;
                var guid = this.guid;
                if(!this.isMouseDown){ return; }
                if (this.whiteBoardMode) return;
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                this.isMouseDown = false;
                var endPoint = this.toPercentData(offset);
                this.paintingData.lineData.endPoint = endPoint;
                this.paintingData.eTimestamp = timeStamp();
                this.render(this.whiteBoardControler[guid]);
                this.command.emit({
                    userId: userId,
                    guid: guid,
                    pageIndex:pageIndex,
                    pageId:pageId,
                    event: 'end',
                    value: {point:endPoint, eTimestamp:this.paintingData.eTimestamp}
                });
                //线条数据同步到服务器
                var serverData = {
                    roomId:this.roomId,
                    whiteboardId:this.guid,
                    pageIndex:pageIndex,
                    pageId:pageId,
                    actionId:this.paintingData.actionId,
                    drawData:{
                        lineWidth:this.paintingData.lineWidth,
                        lineColor:this.paintingData.lineColor,
                        lineStyle:this.paintingData.lineStyle,
                        lineData:this.paintingData.lineData,
                    },
                };
                this.detachableServerRequest({'code':'adddrawdata',
                    'data':serverData
                })
                this.paintingData = null;

            },
            //渲染函数;
            render: function (wbObj) {
                // console.log(wbObj)
                var _this = this;
                var displayCtx = this.displayCtx;
                if(wbObj.whiteboardPage.length == 0){
                    return;
                }

                var users = wbObj.whiteboardPage[wbObj.whiteboardPageIndex].pageDrawData;
                var bgColor = wbObj.whiteboardPage[wbObj.whiteboardPageIndex].pageBgColor;
                var bgImg = wbObj.whiteboardPage[wbObj.whiteboardPageIndex].pageBgImage;
                var setW = wbObj.whiteboardPage[wbObj.whiteboardPageIndex].pageBgImageW;
                var setH = wbObj.whiteboardPage[wbObj.whiteboardPageIndex].pageBgImageH;
                var warterMark = this.warterMark;
                //设置白板宽高，根据当前页的图片高度来
                this.setCanvasSize(setW,setH);
                //当前页无背景图
                if(!bgImg){
                    this.bgImg = null;
                    this.currentBgImg = null;
                }
                //存在bgImg(将要渲染的img，未加载) 且（当前this.bgImg,已经为空，或当前this.bgImg不是现在的bgImg
                if( bgImg  && (!this.bgImg || this.bgImg !== bgImg)){
                    this.bgImg = bgImg;
                    if(this.currentBgImg && this.currentBgImg.src != bgImg){
                        this.currentBgImg = null
                    }
                    // var ua = navigator.userAgent.toLowerCase();
                    //ie浏览器，ie10不支持 img.crossOrigin = "Anonymous";故需要使用XMLHttpRequest
                    if(this.isIE()){
                        _this.onloadCount++;
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            //对于不同图，只显示最后一张图
                            if (_this.onloadCount != 1 ){
                                _this.onloadCount--;
                                return
                            }
                            var url = URL.createObjectURL(this.response);
                            var img = new Image();
                            img.crossOrigin = "Anonymous";

                            _this.onloadCount = 0;
                            img.onload = function () {
                                // 此时你就可以使用canvas对img为所欲为了
                                // ... code ...
                                //对于同一张图，可能上个onload刚好赋值，不需要再赋值
                                if(!(_this.bgImg &&_this.bgImg == img.src)){
                                    _this.currentBgImg = img;
                                    ///如果图当前已切换到不显示图片，则返回
                                    if(!_this.bgImg){
                                        return
                                    }
                                    _this.displayCtx.clearRect(0, 0, _this.width, _this.height);
                                    _this.fillBgColor(displayCtx,bgColor);
                                    _this.fillBgImg(img);
                                    if(_this.isHideInfoTo){
                                        //添加附加信息
                                        _this.addInfoToCanvas(displayCtx);
                                    }
                                    _this.drawLines(users)
                                }
                                // 图片用完后记得释放内存
                                URL.revokeObjectURL(url);
                            };
                            img.src = url;
                        };
                        xhr.onerror = function () {
                            if (_this.onloadCount != 1 ){
                                _this.onloadCount--;
                                return
                            }
                            _this.onloadCount = 0;
                        }
                        //有无水印
                        var xhrUrl
                        if(warterMark){
                            xhrUrl = encodeURI(bgImg+'?warterMark='+warterMark)
                        }else {
                            xhrUrl =  encodeURI(bgImg);
                        }
                        xhr.open('GET', xhrUrl, true);
                        //设置浏览器不使用缓存（ie会先从缓存拿数据，致使请求失败，清理了缓存也没用，必须加下面这句）
                        xhr.setRequestHeader("If-Modified-Since","0");
                        xhr.responseType = 'blob';
                        xhr.send();
                        //尝试
                    }
                    else{
                        var img = new Image();
                        img.crossOrigin = "Anonymous";
                        //有无水印
                        if(warterMark){
                            img.src = encodeURI(bgImg+'?warterMark='+warterMark)
                        }else {
                            img.src =  encodeURI(bgImg);
                        }
                        this.onloadCount++;
                        img.onload = function(ev){
                            // console.log(ev)
                            //对于不同图，只显示最后一张图
                            if (_this.onloadCount != 1 ){
                                _this.onloadCount--;
                                return
                            }
                            _this.onloadCount = 0;
                            //对于同一张图，可能上个onload刚好赋值，不需要再赋值
                            if(!(_this.bgImg &&_this.bgImg == img.src)){
                                _this.currentBgImg = img;
                                ///如果图当前已切换到不显示图片，则返回
                                if(!_this.bgImg){
                                    return
                                }
                                _this.displayCtx.clearRect(0, 0, _this.width, _this.height);
                                _this.fillBgColor(displayCtx,bgColor);
                                _this.fillBgImg(img);
                                if(_this.isHideInfoTo){
                                    //添加附加信息
                                    _this.addInfoToCanvas(displayCtx);
                                }
                                _this.drawLines(users)
                            }


                        };
                        img.onerror = function (ev) {
                            // console.log(ev)
                            if (_this.onloadCount != 1 ){
                                _this.onloadCount--;
                                return
                            }
                            _this.onloadCount = 0;
                        }
                    }

                }
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                //drawBg会覆盖绘制痕迹，但是还是应该先清空下？会导致move事件不断清空造成闪烁
                this.fillBgColor(displayCtx,bgColor);
                if(this.currentBgImg){
                    //已经是加载过的
                    this.fillBgImg(this.currentBgImg);
                }
                if(this.isHideInfoTo){
                    //添加附加信息
                    this.addInfoToCanvas(displayCtx);
                }
                this.drawLines(users);

            },
            isIE:function(){
                var ua = navigator.userAgent.toLowerCase();
                if(/msie/.test(ua) && !/opera/.test(ua) || (!!window.ActiveXObject || "ActiveXObject" in window)){
                    return true
                }else{
                    return false
                }
            },
            //填充背景色
            fillBgColor:function(displayCtx,bgColor){
                displayCtx.save();
                displayCtx.strokeStyle = bgColor;
                displayCtx.fillStyle = bgColor;
                // displayCtx.rect(0,0,this.width,this.height);
                // displayCtx.fill();
                displayCtx.fillRect(0,0,this.width,this.height);
                displayCtx.restore();
                // displayCtx.stroke();
            },
            //填充背景图
            fillBgImg:function(img){
                var canvasH = this.height;
                var canvasW = this.width;
                var imgAutoH;
                var imgAutoW;
                var imgH = img.height;
                var imgW = img.width;
                var xStartPosition = 0;
                var yStartPosition = 0;
                if (canvasW/canvasH >= imgW/imgH){
                    //根据画板高度自适应
                    imgAutoH = canvasH;
                    imgAutoW = imgAutoH*imgW/imgH;
                    //水平居中
                    xStartPosition = canvasW/2 -  imgAutoW/2;
                }else {
                    //根据画板宽度自适应
                    imgAutoW = canvasW;
                    imgAutoH = imgAutoW*imgH/imgW;
                    //垂直居中
                    yStartPosition = canvasH/2 -  imgAutoH/2;
                }
                this.displayCtx.drawImage(img,xStartPosition,yStartPosition,imgAutoW,imgAutoH)

            },
            //绘制笔迹
            drawLines:function(usersDrawData){
                var displayCtx = this.displayCtx;
                var _this = this;
                for(var id in usersDrawData){
                    usersDrawData[id].forEach(function(paint){
                        displayCtx.lineWidth = paint.lineWidth;
                        displayCtx.strokeStyle = paint.lineColor;
                        switch(paint.lineStyle){
                            case 1:
                                _this.free(displayCtx,paint.lineData);
                                break;
                            case 2:
                                _this.rect(displayCtx,paint.lineData);
                                break;
                            case 3:
                                _this.circle(displayCtx,paint.lineData);
                                break;
                            case 4:
                                _this.arrow(displayCtx,paint.lineData,displayCtx.strokeStyle);
                                break;
                            case 5:
                                _this.linear(displayCtx,paint.lineData);
                                break;
                        };
                    });
                };
            },

            //新增白板（同时创建白板页）
            addWhiteBoard: function (whiteBoardName,whiteBoardPages) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                //第一次新增白板或关闭白板后需要打开白板
                if(this.guid ==null){
                    this.openWhiteBoard(this.container);
                }

                if(whiteBoardName === void 0 || whiteBoardName ===''){
                    //无白板信息，则使用默认白板名
                    whiteBoardName = 'autoWhiteBoard';
                }
                var userId = this.userId;
                var wbData = {
                    whiteboardCreator:this.nickName,
                    whiteboardName:whiteBoardName,
                    whiteboardCreateTime:timeStamp(),
                    whiteboardPageIndex:0,
                };
                this.createWBdata(wbData,userId);
                var guid = this.guid;
                this.command.emit({ userId: userId, guid: guid,event: 'create', value: wbData });
                //触发回调
                var result = {
                    whiteBoardId:this.guid,
                    whiteBoardName:whiteBoardName,
                    whiteBoardIndex:this.whiteBoardControlerArr.length,//默认添加到最后
                    whiteBoardCount:this.whiteBoardControlerArr.length,
                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteboardCreate",
                    result: result,
                });
                if(!this.isRemoteOperate){
                    //创建白板同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        whiteboardCreator:wbData.whiteboardCreator,
                        whiteboardName:wbData.whiteboardName,
                        whiteboardCreateTime:wbData.whiteboardCreateTime,
                        whiteboardPageIndex:wbData.whiteboardPageIndex
                    };
                    this.detachableServerRequest({'code':'createwhiteboard',
                        'data':serverData
                    })
                }
                this.addWhiteBoardPages(whiteBoardPages,guid);
            },
            //创建白板页(同时切换到当前页)
            addWhiteBoardPages: function (whiteBoardPages,guid){
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (whiteBoardPages === void 0){
                    //无传ppt页，创建初始白板页
                    whiteBoardPages = [
                        {                                    //第一页
                            pageId: AnyChatWebSDK.anychatSDKInstance.createGuid(),              //当前页的id
                            pageIndex: 0,                  //当前页的下标
                            pageBgImage: "",                //初始白板无背景图
                            pageBgColor: "#ffffff",        //当前页的背景颜色
                            pageDrawData: {},          //当前页面上绘画的图形数据
                            pageBgImageW:  0,			//空白页默认为自适应宽度.0会setCanvasSize中设置antoWidth,
                            // 因为各端自适应宽高不同，故规定空白白板传0
                            pageBgImageH:  0,		//空白页默认为自适应高度
                        }
                    ];
                }else {
                    //传ppt页，创建ppt白板，SDK赋予pageId
                    var imgUrls = [];
                    for( var i = 0; i< whiteBoardPages.length; i++){
                        whiteBoardPages[i].pageId = AnyChatWebSDK.anychatSDKInstance.createGuid();
                        whiteBoardPages[i].pageIndex = i;
                        whiteBoardPages[i].pageDrawData = {};
                        imgUrls.push(whiteBoardPages[i].pageBgImage)
                    }
                    //图片预加载
                    this.imgPreLoad(imgUrls);
                }

                this.whiteBoardControler[guid].whiteboardPage = whiteBoardPages;
                //根据图片宽高设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                // this.setCanvasSize(whiteBoardPages[0].pageBgImageW,whiteBoardPages[0].pageBgImageH)
                var indexInArr = this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[guid]);
                this.whiteBoardControlerArr[indexInArr].whiteboardPage = whiteBoardPages;
                // this.bgImg = null;
                // this.render(this.whiteBoardControler[guid]);
                var result = {
                    whiteBoardName:this.whiteBoardControler[guid].whiteboardName,
                    whiteBoardId:guid,
                    pageCount:this.whiteBoardControlerArr[indexInArr].whiteboardPage.length,
                    pageIndex:this.whiteBoardControlerArr[indexInArr].whiteboardPageIndex +1,

                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteboardPageCreate",
                    result: result,
                });
                this.command.emit({ userId: this.userId,guid: guid,event: 'createPage', value: {
                        whiteboardPage:whiteBoardPages
                    } });
                //切换到当前页
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                if(!this.isRemoteOperate){
                    //创建白板页同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        whiteboardPage:whiteBoardPages,

                    };
                    this.detachableServerRequest({'code':'createpage',
                        'data':serverData
                    })
                }
                this.changeWhiteBoardPage(1,pageIndex);
            },
            //图片预加载
            imgPreLoad:function (urls) {
                //先剔除空图片
                var newUrls = urls.filter(function (url) {
                    return url !== '';
                });
                if(newUrls.length ==0){
                    return
                }
                var img = new Image();
                var _this = this;
                if(_this.imgPreLoadIndex < newUrls.length){
                    //图片水印
                    if(this.warterMark){
                        img.src = encodeURI(newUrls[_this.imgPreLoadIndex]+'?warterMark='+this.warterMark)
                    }else {
                        img.src =  encodeURI(newUrls[_this.imgPreLoadIndex]);
                    }
                    img.onload = function(ev){
                        // console.log('第'+(_this.imgPreLoadIndex+1)+'张图');
                        _this.imgPreLoadIndex++;
                        _this.imgPreLoad(newUrls)
                    };
                    img.onerror = function (ev) {
                        _this.imgPreLoadIndex++;
                        _this.imgPreLoad(newUrls)
                    }
                }

            },
            //关闭白板(只关闭自身的)
            closeWhiteBoard: function(){
                // if (this.whiteBoardMode && !this.isRemoteOperate) return;
                // //本次操作后，标识失效，表示下次操作是自己的
                // if(this.isRemoteOperate){this.isRemoteOperate = false}
                // var whiteBoardId = this.guid;
                // var whiteBoardName = this.whiteBoardControler[this.guid].whiteboardName;
                if( this.checkUpdateInterver){
                    clearInterval( this.checkUpdateInterver);
                    this.checkUpdateInterver = null
                }
                this.whiteBoardControler = {};
                this.whiteBoardControlerArr = [];
                this.guid = null;
                if(this.displayCtx){
                    this.displayCtx.clearRect(0, 0, this.width, this.height);
                    this.bindMouseEvent(false);
                    this.container.removeChild(this.displayCanvas);
                }
                //断开插拔式服务
                this.detachableServerInstance.closeDetachableServerConnect(this.serverGuid);
                this.detachableServerInstance = null;
                //触发回调
                var result = {
                    // errorcode:0
                    // whiteBoardId:whiteBoardId,
                    // whiteBoardName:whiteBoardName,
                    // container:this.container,
                    // whiteBoardIndex :0,
                    // whiteBoardCount: 0,
                    // pageIndex :0,
                    // pageCount:0,

                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteboardClose",
                    result: result,
                });



                //不发消息
                // this.command.emit({ userId: this.userId, guid:whiteBoardId,event: 'close', value: {} });
            },
            //切换白板
            changeWhiteBoard: function (direction,guid,userId) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (userId === void 0) userId = this.userId;
                var showWhiteBoardId;
                var indexInArr;
                var newIndex;
                if(this.whiteBoardControlerArr.length == 1){ //要触发回调？
                    showWhiteBoardId = this.whiteBoardControlerArr[0].whiteboardId;
                    newIndex = 0;
                }
                if(guid){
                    //切换到指定guid
                    showWhiteBoardId = guid;
                    indexInArr = this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[guid]);
                    newIndex = indexInArr;
                }


                else if(direction == 1){
                    indexInArr = this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[this.guid]);
                    //切换到下一白板,已经是最后一个则显示第一个白板
                    if(indexInArr == this.whiteBoardControlerArr.length - 1){
                        showWhiteBoardId = this.whiteBoardControlerArr[0].whiteboardId;
                        newIndex= 0;
                    }else {
                        showWhiteBoardId = this.whiteBoardControlerArr[indexInArr + 1].whiteboardId;
                        newIndex = indexInArr + 1;
                    }
                }
                else if(direction == -1) {
                    indexInArr = this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[this.guid]);
                    //切换到上一白板,已经是第一个则显示最后一个白板
                    if(indexInArr == 0){
                        showWhiteBoardId = this.whiteBoardControlerArr[this.whiteBoardControlerArr.length - 1].whiteboardId;
                        newIndex = this.whiteBoardControlerArr.length - 1;
                    }else {
                        showWhiteBoardId = this.whiteBoardControlerArr[indexInArr - 1].whiteboardId;
                        newIndex = indexInArr - 1;
                    }
                }

                this.guid = showWhiteBoardId;
                //根据图片宽高设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                // var setW = this.whiteBoardControler[showWhiteBoardId].whiteboardPage[0].pageBgImageW;
                // var setH = this.whiteBoardControler[showWhiteBoardId].whiteboardPage[0].pageBgImageH;
                // this.setCanvasSize(setW,setH)
                var pageIndex = this.whiteBoardControler[this.guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[this.guid].whiteboardPage[pageIndex].pageId;
                // this.bgImg = null;
                this.render(this.whiteBoardControler[this.guid]);
                //触发回调
                var result = {
                    whiteBoardId:this.guid,
                    whiteBoardName:this.whiteBoardControler[this.guid].whiteboardName,
                    whiteBoardIndex :newIndex + 1,//0表示第一板
                    whiteBoardCount: this.whiteBoardControlerArr.length,
                    pageIndex :pageIndex+1,//0表示第一页,
                    pageCount:this.whiteBoardControler[this.guid].whiteboardPage.length
                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteBoardSwitch",
                    result: result,
                });
                if (guid === void 0) guid = this.guid;
                this.command.emit({userId:userId,guid: guid,event: 'switch', value: {pageIndex:pageIndex,pageId:pageId} });

                if(!this.isRemoteOperate){
                    //本人切页同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        whiteboardPageIndex:pageIndex,
                        pageId:pageId,
                    };
                    this.detachableServerRequest({'code':'switchpage',
                        'data':serverData
                    })
                }

            },
            //切换白板页
            changeWhiteBoardPage: function (direction,pageIndex,guid,userId) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (userId === void 0) userId = this.userId;
                if (guid === void 0) guid = this.guid;
                var showPageIndex;

                var whiteboardPage = this.whiteBoardControler[this.guid].whiteboardPage;
                if(whiteboardPage.length ==1){

                }
                if(pageIndex || pageIndex ==0){
                    //切换到指定页(指定页可能为0,即第一页)
                    showPageIndex = pageIndex
                }
                else if(direction == 1){
                    pageIndex = this.whiteBoardControler[this.guid].whiteboardPageIndex;
                    //切换到下一页,已经是最后一个则显示第一页
                    if(pageIndex == whiteboardPage.length - 1){
                        showPageIndex = 0;
                    }else {
                        showPageIndex = pageIndex + 1;
                    }
                }else if(direction == -1){
                    pageIndex = this.whiteBoardControler[this.guid].whiteboardPageIndex;
                    //切换到上一页,已经是第一个则显示最后一页
                    if(pageIndex == 0){
                        showPageIndex = whiteboardPage.length - 1;
                    }else {
                        showPageIndex =pageIndex - 1;
                    }
                }
                this.whiteBoardControler[this.guid].whiteboardPageIndex = showPageIndex;
                var showPageId = this.whiteBoardControler[this.guid].whiteboardPage[showPageIndex].pageId;

                //触发回调
                var result = {
                    pageIndex :showPageIndex + 1,//0表示第一页,
                    pageCount:whiteboardPage.length
                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteBoardPageSwitch",
                    result: result,
                });
                // this.bgImg = null;
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                this.render(this.whiteBoardControler[this.guid]);
                this.command.emit({userId:userId,guid: guid,event: 'switch', value: {pageIndex:showPageIndex,pageId:showPageId} });
                if(!this.isRemoteOperate){
                    //切页同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        whiteboardPageIndex:showPageIndex,
                        pageId:showPageId,
                    };
                    this.detachableServerRequest({'code':'switchpage',
                        'data':serverData
                    })
                }

            },
            //删除白板
            deleteWhiteBoard:function(guid,userId){
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (userId === void 0) userId = this.userId;
                if (guid === void 0) guid = this.guid;
                var indexInArr = this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[guid]);
                var newIndex;
                var showWhiteBoardId;
                //如果只有一个白板，则不允许删除
                if(this.whiteBoardControlerArr.length ==1){
                    //触发回调
                    var result = {
                        errorcode:1,
                        whiteBoardId:guid,
                        whiteBoardName:this.whiteBoardControler[guid].whiteBoardName,
                        whiteBoarIndex:this.whiteBoardControlerArr.indexOf(this.whiteBoardControler[guid]),
                        whiteBoardCount: this.whiteBoardControlerArr.length,
                        pageIndex:this.whiteBoardControler[guid].whiteboardPageIndex,//0表示第一页,
                        pageCount:this.whiteBoardControler[guid].whiteboardPage.length
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onWhiteboardDelete",
                        result: result,
                    });
                    return
                }
                //刪除当前白板,显示上一白板,若已经是第一个则显示下一个白板

                if(indexInArr == 0){
                    showWhiteBoardId=  this.whiteBoardControlerArr[1].whiteboardId;
                    // newIndex = 0;
                }else {
                    showWhiteBoardId=  this.whiteBoardControlerArr[indexInArr - 1].whiteboardId;
                    // newIndex = indexInArr -1;
                }
                // var newPageIndex = this.whiteBoardControler[showWhiteBoardId].whiteboardPageIndex;
                //触发回调
                var result = {
                    errorcode:0,
                    whiteBoardId:guid,
                    whiteBoardName:this.whiteBoardControler[guid].whiteboardName,
                    // whiteBoardIndex:newIndex+1,//展示新白板的下标
                    // whiteBoardCount: this.whiteBoardControlerArr.length-1,//展示新白板数
                    // pageIndex:newPageIndex+1,//展示新版本的页下标,
                    // pageCount:this.whiteBoardControler[showWhiteBoardId].whiteboardPage.length
                }
                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                    type: "onWhiteboardDelete",
                    result: result,
                });
                delete this.whiteBoardControler[guid];
                this.whiteBoardControlerArr.splice(indexInArr,1); //在下标indexInArr处开始删除,删除一位
                this.command.emit({ userId: userId, guid: guid,event: 'delete', value: {} });
                if(!this.isRemoteOperate){
                    //删除白板同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                    };
                    this.detachableServerRequest({'code':'deletewhiteboard',
                        'data':serverData
                    })
                }
                //切换到指定白板
                this.changeWhiteBoard(1,showWhiteBoardId,userId)

            },
            //获取白板id
            getGuid: function () {
                return this.guid;
            },
            //模式选择--自由，矩形，圆形,箭头，直线
            mode: function (value) {
                if (this.whiteBoardMode) return;
                this.lineStyle = Number(value);
            },
            //画板尺寸模式选择(根据高度适配)--1:1,4:3，16:9
            setSizeMode:function(value){
                var autoHeight =  this.container.clientHeight;
                var autoWidth;
                switch (value) {
                    case 1:
                        break;
                    case 2:
                        // this.container.clientWidth= this.container.clientHeight*4/3;//?
                        autoWidth = autoHeight*4/3;
                        break;
                    case 3:
                        autoWidth = autoHeight*16/9;
                        break;
                }
                this.height =autoHeight;
                // this.displayCtx.canvas.height = autoHeight;/?会使lineJoin。linecap变为默认，不知道原因
                //保存默认宽高
                this.autoWidth = autoWidth;
                this.autoHeight = autoHeight;
                //设置实际宽高
                this.displayCanvas.height = autoHeight;
                this.width = autoWidth ;
                this.displayCanvas.width = autoWidth;
                //以上操作导致lineJoin，lineCap变动，需要重新赋值
                // this.displayCtx.lineJoin = 'round';
                // this.displayCtx.lineCap = 'round';
                this.sizeMode = value;
            },
            reSizeCanvas:function(){
                this.setSizeMode(this.sizeMode);
                this.render(this.whiteBoardControler[this.guid])
            },
            //线条宽度
            size: function (value) {
                if (this.whiteBoardMode) return;
                this.lineWidth = value;
            },
            //颜色
            setColor: function (value) {
                if (this.whiteBoardMode) return;
                this.lineColor = value;
            },
            //更改页背景
            changeBgImage: function (url,pageW,pageH,pageIndex,guid,userId) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                var _this = this;
                if (guid === void 0) guid = this.guid;
                if (userId === void 0) userId = this.userId;
                if (pageIndex === void 0) pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                if (pageW === void 0) pageW = this.whiteBoardControler[guid].pageBgImageW;
                if (pageH === void 0) pageH = this.whiteBoardControler[guid].pageBgImageH;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImage = url;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImageW = pageW;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImageH = pageH;
                //设置白板宽高
                // this.setCanvasSize(pageW,pageH);
                // this.bgImg = null;
                _this.render(_this.whiteBoardControler[guid]);
                this.command.emit({ userId: userId, guid: guid,pageIndex: pageIndex,pageId: pageId,event: 'bgImage', value: {pageBgImage:url,pageBgImageH:pageH,pageBgImageW:pageW}});
                if(!this.isRemoteOperate){
                    //设置背景图片同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        pageIndex:pageIndex,
                        pageId:pageId,
                        pageBgImage:url,
                        pageBgImageW:pageW,
                        pageBgImageH:pageH
                    };
                    this.detachableServerRequest({'code':'setbgimage',
                        'data':serverData
                    })
                }

            },
            //删除页背景
            deleteBgImage:function (pageIndex,guid,userId) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                var _this = this;
                if (guid === void 0) guid = this.guid;
                if (userId === void 0) userId = this.userId;
                if (pageIndex === void 0) pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImage = '';
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImageW = 0;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgImageH = 0;
                // this.bgImg = null;
                _this.render(_this.whiteBoardControler[guid]);
                this.command.emit({ userId: userId, guid: guid,pageIndex: pageIndex,pageId: pageId,event: 'bgImage', value: {pageBgImage:'',pageBgImageH:0,pageBgImageW:0} });
                if(!this.isRemoteOperate){
                    //设置背景图片同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        pageIndex:pageIndex,
                        pageId:pageId,
                        pageBgImage:'',
                        pageBgImageW:0,
                        pageBgImageH:0
                    };
                    this.detachableServerRequest({'code':'setbgimage',
                        'data':serverData
                    })
                }
            },
            //修改画板页背景颜色,后三个不传默认为当前页，当前画板，当前用户
            changeBgColor:function(color,pageIndex,guid,userId){
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if(guid === void 0){guid = this.guid};
                if(userId === void 0){userId = this.userId};
                if(!pageIndex && pageIndex != 0){pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex};
                if(!color || color == '' ){
                    this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgColor = null;
                }else{
                    this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageBgColor = color;
                }
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                if(this.whiteBoardControler[guid].whiteboardPageIndex === pageIndex){
                    //是当前显示的页，实时渲染
                    this.render(this.whiteBoardControler[guid]);
                }

                this.command.emit({ userId: userId, guid: guid,pageIndex:pageIndex,pageId:pageId,event: 'bgColor', value: {pageBgColor:color} });
                if(!this.isRemoteOperate){
                    //设置背景颜色同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        pageIndex:pageIndex,
                        pageId:pageId,
                        pageBgColor:color,
                    };
                    this.detachableServerRequest({'code':'setbgcolor',
                        'data':serverData
                    })
                }

            },
            //本地保存
            download: function () {
                var MIME_TYPE = "image/jpeg";
                // var image = this.displayCtx.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                // this.render(this.whiteBoardControler[this.guid]);
                var image = this.displayCtx.canvas.toDataURL(MIME_TYPE);
                // window.location.href = image;
                var _this= this;
                // 将图片保存到本地
                var saveFile = function (data, filename) {
                    if(_this.isIE()){
                        //方法一，本地使用代理测试不能用
                        // var oPop = window.open(data,"","width=1, height=1, top=5000, left=5000");
                        // for(; oPop.document.readyState != "complete"; )
                        // {
                        //     if (oPop.document.readyState == "complete")break;
                        // }
                        // oPop.document.execCommand("SaveAs");
                        // oPop.close();
                        //方法二
                        // 截取base64的数据内容（去掉前面的描述信息，类似这样的一段：data:image/png;base64,）并解码为2进制数据
                        var bstr = atob(data.split(',')[1]);
                        // 获取解码后的二进制数据的长度，用于后面创建二进制数据容器
                        var n = bstr.length;
                        // 创建一个Uint8Array类型的数组以存放二进制数据
                        var u8arr = new Uint8Array(n);
                        // 将二进制数据存入Uint8Array类型的数组中
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        // 创建blob对象
                        var blob = new Blob([u8arr]);
                        // 调用浏览器的方法，调起IE的下载流程
                        window.navigator.msSaveOrOpenBlob(blob, filename);
                    }else{
                        var link = document.createElement('a');
                        link.href = data;
                        link.download = filename;
                        var event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        link.dispatchEvent(event);
                    }

                };
                var filename = new Date().toLocaleDateString() + '.' + "jpg";
                saveFile(image, filename);
                return filename;
            },
            //设置是否隐藏画板界面标题信息
            setWhiteBoardInfoHidden:function (isHide) {
                this.isHideInfoTo = isHide;
                if(this.guid){
                    this.render(this.whiteBoardControler[this.guid])
                }
            },
            //附加画板信息
            addInfoToCanvas:function(displayCtx){
                var ctx = displayCtx;
                var whiteBoardStr = '白板名：'+this.whiteBoardControler[this.guid].whiteboardName;
                var pageIndex = this.whiteBoardControler[this.guid].whiteboardPageIndex + 1;
                var pageCound = this.whiteBoardControler[this.guid].whiteboardPage.length;
                var whiteBoardPageStr = pageIndex + "/" +pageCound;
                var canvasW = this.width;
                var canvasH = this.height;
                ctx.font="15px Arial";
                ctx.textAlign="center";
                ctx.fillText(whiteBoardStr,canvasW/2,15);
                ctx.textAlign="right";
                ctx.fillText(whiteBoardPageStr,canvasW - 5,canvasH - 5);
            },
            //检查更新 flag：1开始，0停止
            whiteBoardCheck:function(flag,userId, guid){
                //默认开始
                if (flag === void 0) flag = 1;
                if (userId === void 0) userId = this.userId;
                if (guid === void 0) guid = this.guid;
                if(this.checkUpdateInterver){
                    clearInterval(this.checkUpdateInterver);
                }

                if(flag){
                    var _this = this;
                    var pageIndex;
                    if(this.whiteBoardControler[guid] && this.whiteBoardControler[guid].whiteboardPage){
                        pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                        //开始检查时保存当前
                        this.lastClipDrawDataStr = JSON.stringify (this.whiteBoardControler[guid].whiteboardPage[pageIndex]);
                    }else{
                        //开始检查时保存当前
                        this.lastClipDrawDataStr ='';
                    }

                    //为开始则执行定时器，为停止则跳出
                    this.checkUpdateInterver =  setInterval(function () {
                        var guid = _this.guid;
                        var clipDrawDataStr;
                        var pageIndex;
                        if(_this.whiteBoardControler.hasOwnProperty(guid)){
                            pageIndex = _this.whiteBoardControler[guid].whiteboardPageIndex;
                            clipDrawDataStr  = JSON.stringify (_this.whiteBoardControler[guid].whiteboardPage[pageIndex]);
                        }else{
                            clipDrawDataStr  = '';
                        }
                        //比较两次保存的画板数据,不相同则触发回调
                        if(_this.lastClipDrawDataStr !== clipDrawDataStr){
                            _this.lastClipDrawDataStr = JSON.stringify (_this.whiteBoardControler[guid].whiteboardPage[pageIndex]);
                            //生成新截图
                            var MIME_TYPE = "image/jpeg";
                            var image = _this.displayCtx.canvas.toDataURL(MIME_TYPE);
                            //触发回调
                            var result = {
                                errorcode : 0,
                                image:image
                            };
                            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                type: "onWhiteBoardUpdate",
                                result: result,
                            });
                        }

                    },1000)
                }else{
                   return;
                }


                // return image;
            },

            //撤销上次绘制
            undo: function (userId, guid) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (userId === void 0) userId = this.userId;
                if (guid === void 0) guid = this.guid;
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                if(!this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData.hasOwnProperty(userId)
                    || this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData[userId].length == 0){
                    //当前自己无笔迹
                    return
                }
                var dataArr = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData[userId];
                var actionId = dataArr[dataArr.length -1].actionId;
                dataArr.splice(dataArr.length-1,1);
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                this.render(this.whiteBoardControler[guid]);

                // var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                this.command.emit({ guid:guid,userId: userId, pageIndex :pageIndex,pageId :pageId,actionId:actionId,event: 'undo' });
                if(!this.isRemoteOperate){
                    //撤销同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        pageIndex:pageIndex,
                        pageId:pageId,
                        actionId:actionId,
                    };
                    this.detachableServerRequest({'code':'undolastdraw',
                        'data':serverData
                    })
                }

            },
            //清空某一页
            clear: function (userId, guid) {
                if (this.whiteBoardMode && !this.isRemoteOperate) return;
                if (userId === void 0) userId = this.userId;
                if (guid === void 0) guid = this.guid;
                var pageIndex = this.whiteBoardControler[guid].whiteboardPageIndex;
                var pageId = this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageId;
                this.whiteBoardControler[guid].whiteboardPage[pageIndex].pageDrawData = {};
                // this.displayCtx.clearRect(0, 0, this.width, this.height);
                // this.bgImg = null;
                this.render(this.whiteBoardControler[guid]);
                this.command.emit({guid:guid, userId: userId, pageIndex :pageIndex,pageId :pageId, event: 'clear' });
                if(!this.isRemoteOperate){
                    //清空同步到服务器
                    var serverData = {
                        roomId:this.roomId,
                        whiteboardId:this.guid,
                        pageIndex:pageIndex,
                        pageId:pageId,
                        // userId:userId.toString(),不传是清空一整页，传则清空单个userid对应的笔迹
                    };
                    this.detachableServerRequest({'code':'clearpage',
                        'data':serverData
                    })
                }
            },
            clearBg: function () {

            },
            //获取白板信息
            getWhiteBoardInfo:function(whiteBoardId){
                if(whiteBoardId === void 0){
                    whiteBoardId = this.guid;
                }
                var pageCount = 0;
                var pageIndex  = 0;
                var whiteboardInfo = {};
                if(this.whiteBoardControler[whiteBoardId]){
                    if(this.whiteBoardControler[whiteBoardId].whiteboardPage){
                        pageCount = this.whiteBoardControler[whiteBoardId].whiteboardPage.length;
                        pageIndex = this.whiteBoardControler[whiteBoardId].whiteboardPageIndex+1;
                    }

                    whiteboardInfo ={
                        whiteBoardId:whiteBoardId,
                        whiteBoardName:this.whiteBoardControler[whiteBoardId].whiteboardName,
                        whiteBoardCreator:this.whiteBoardControler[whiteBoardId].whiteboardCreator,
                        whiteBoardCreateTime:this.whiteBoardControler[whiteBoardId].whiteboardCreateTime,
                        pageIndex:pageIndex,
                        pageCount:pageCount,
                    };
                }

                return whiteboardInfo
            },
            //接受交互数据
            act: function (obj) {
                var _this = this;
                // console.log(obj);
                var dataArr = JSON.parse(obj);
                console.log(dataArr);
                //加入本地日志
                var strLog ="白板消息接收（act）：" + JSON.stringify(dataArr);
                if(strLog.length > 4000){
                    strLog ="白板消息接收（act）:数据过大自动省略" ;
                }
                BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);

                dataArr.forEach(function(elem){
                    //创建之前不允许其他动作,关闭白板/请求同步数据/返回同步数据除外
                    if(elem.code!=10 && elem.code != 'createwhiteboard'
                        && !_this.whiteBoardControler[elem.data.whiteboardId]
                        && elem.code!=11 && elem.code!=12){
                        //加入暂存区
                        _this.actionTemporary.push(obj);
                        return false
                    };

                    //当前如果不是当前正在显示白板，切换到这个白板(创建\关闭\请求同步数据\返回同步数据除外)

                    if(elem.code!=10 && elem.code != 'createwhiteboard' && elem.data.whiteboardId !== _this.guid
                        && elem.code!=11 && elem.code!=12){
                        _this.isRemoteOperate = true;
                        _this.changeWhiteBoard(1,elem.data.whiteboardId,'');
                        _this.isRemoteOperate = false;
                    };
                    switch(elem.code){
                        case 'createwhiteboard':
                            //第一次新增白板或关闭白板后需要打开白板
                            if(_this.guid ==null){
                                _this.openWhiteBoard(_this.container);
                            }
                            _this.guid = elem.data.whiteboardId;
                            _this.createWBdata(elem.data,'');
                            //打开鼠标事件绑定
                            _this.bindMouseEvent(true);
                            //触发回调
                            var result = {
                                whiteBoardId: elem.data.whiteboardId,
                                whiteBoardName: elem.data.whiteboardName,
                                whiteBoardIndex:_this.whiteBoardControlerArr.length,//默认添加到最后
                                whiteBoardCount:_this.whiteBoardControlerArr.length,
                            }
                            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                type: "onWhiteboardCreate",
                                result: result,
                            });
                            break ;
                        case 'deletewhiteboard':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            //''表示对方id,暂时用空字符串代替
                            _this.deleteWhiteBoard(data.whiteboardId,'');
                            _this.isRemoteOperate = false;
                            break;
                        case 'createpage':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };

                            _this.whiteBoardControler[data.whiteboardId].whiteboardPage = data.whiteboardPage;
                            //图片预加载
                            var imgUrls = [];
                            var whiteBoardPages = data.whiteboardPage;
                            for( var i = 0; i< whiteBoardPages.length; i++){
                                imgUrls.push(whiteBoardPages[i].pageBgImage)
                            }
                            _this.imgPreLoad(imgUrls);
                            // _this.whiteBoardControler[data.whiteboardId].whiteboardPage.forEach(function(whiteboardPage){
                            //     whiteboardPage.pageDrawData = {};
                            // })
                            //设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                            // _this.setCanvasSize(data.whiteboardPage[0].pageBgImageW,data.whiteboardPage[0].pageBgImageH)
                            // _this.bgImg = null;
                            _this.render(_this.whiteBoardControler[data.whiteboardId]);
                            //触发回调
                            var result = {
                                whiteBoardName:_this.whiteBoardControler[data.whiteboardId].whiteboardName,
                                whiteBoardId:data.whiteboardId,
                                pageCount:data.whiteboardPage.length,
                                pageIndex:_this.whiteBoardControler[data.whiteboardId].whiteboardPageIndex +1,
                            }
                            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                type: "onWhiteboardPageCreate",
                                result: result,
                            });
                            break;
                        case 'switchpage':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };

                            //切换白板则触发切换白板回调，否则触发切换白板页回调
                            if(_this.guid !== data.whiteboardId){
                                //本次操作是远程用户执行的操作
                                _this.isRemoteOperate = true;
                                _this.changeWhiteBoard(1,data.whiteboardId,'');
                                _this.isRemoteOperate = false;
                            }
                            else if (_this.whiteBoardControler[_this.guid].whiteboardPageIndex !== data.whiteboardPageIndex){
                                //本次操作是远程用户执行的操作
                                _this.isRemoteOperate = true;
                                _this.changeWhiteBoardPage(1,data.whiteboardPageIndex,data.whiteboardId,'');
                                _this.isRemoteOperate = false;
                            }
                            break;
                        case 'setbgcolor':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            _this.changeBgColor(data.pageBgColor,data.pageIndex,data.whiteboardId,'');
                            _this.isRemoteOperate = false;
                            break;
                        case 'setbgimage':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            _this.changeBgImage(data.pageBgImage,data.pageBgImageW,data.pageBgImageH,data.pageIndex,data.whiteboardId,'')
                            _this.isRemoteOperate = false;
                            break;
                        case 'adddrawdata':
                            var data = elem.data;
                            if( data.pointStatus == 1 ){
                                var pointObj ={
                                    whiteboardId:data.whiteboardId,
                                    userId:data.userId,
                                    actionId:data.actionId,
                                    sTimestamp:data.sTimestamp,
                                    lineWidth:data.lineWidth,
                                    lineColor:data.lineColor,
                                    lineStyle:data.lineStyle,
                                    lineData:{
                                        startPoint:{
                                            xPosition: data.xPosition,
                                            yPosition: data.yPosition,
                                        },
                                        movePoint:[],
                                        endPoint:{}
                                    },
                                };
                                if(_this.whiteBoardControler[data.whiteboardId].whiteboardPage[data.pageIndex].pageDrawData.hasOwnProperty(data.userId)){
                                    _this.whiteBoardControler[data.whiteboardId].whiteboardPage[data.pageIndex].pageDrawData[data.userId].push(pointObj);
                                }else{
                                    var dataObj = [];
                                    dataObj.push(pointObj);
                                    _this.whiteBoardControler[data.whiteboardId].whiteboardPage[data.pageIndex].pageDrawData[data.userId] = dataObj;
                                }
                            }else if(data.pointStatus == 2){
                                var movePoint = {
                                    xPosition: data.xPosition,
                                    yPosition: data.yPosition,

                                };
                                var whiteboardDataArr = _this.whiteBoardControler[data.whiteboardId].whiteboardPage[data.pageIndex].pageDrawData[data.userId];
                                var index = whiteboardDataArr.length - 1;
                                whiteboardDataArr[index].lineData.movePoint.push(movePoint);
                            }else if(data.pointStatus == 3){
                                var endPoint = {
                                    xPosition: data.xPosition,
                                    yPosition: data.yPosition,
                                };
                                var whiteboardDataArr = _this.whiteBoardControler[data.whiteboardId].whiteboardPage[data.pageIndex].pageDrawData[data.userId];
                                var index = whiteboardDataArr.length - 1;
                                whiteboardDataArr[index].eTimestamp = data.eTimestamp;
                                whiteboardDataArr[index].lineData.endPoint = endPoint;
                            };
                            _this.render(_this.whiteBoardControler[elem.data.whiteboardId]);
                            break;
                        case 'undolastdraw':
                            var data = elem.data;
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            _this.undo(data.userId, data.whiteboardId);
                            _this.isRemoteOperate = false;
                            break;
                        case 'clearpage':
                            var data = elem.data
                            if(!_this.whiteBoardControler.hasOwnProperty(data.whiteboardId)){
                                return
                            };
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            _this.clear('', data.whiteboardId);
                            _this.isRemoteOperate = false;
                            break;
                        case 10:
                            //本次操作是远程用户执行的操作
                            // _this.isRemoteOperate = true;
                            // _this.closeWhiteBoard();
                            break;
                        case 11:
                            var data = elem.data;
                            if(data.toUserId !=_this.userId){
                                //不是向我请求的，退出
                                return
                            }
                            //向我请求全量数据
                            _this.sendAllWhiteBoardData(Number(data.fromUserId));
                            break;
                        case 12:
                            //接收到主持人返回的全部白板数据，更新本地白板数据
                            var data = elem.data;
                            if(data.toUserId !=_this.userId){
                                //不是返回给我的，退出
                                return
                            }
                            //已创建的白板数量
                            var wbCount = data.whiteboardData.length
                            if(!wbCount){
                                //还没有创建，退出
                                return
                            }

                            _this.whiteBoardControlerArr=data.whiteboardData ;
                            //遍历赋值
                            var whiteboard
                            var whiteboardId
                            for( var i = 0;i<= wbCount -1;i++){
                                whiteboard = data.whiteboardData[i]
                                whiteboardId = whiteboard.whiteboardId;
                                _this.whiteBoardControler[whiteboardId] = whiteboard;
                                //遍历执行所有白板数据绘制
                                //创建+绘制
                                //第一次新增白板或关闭白板后需要打开白板
                                if(_this.guid ==null){
                                    _this.openWhiteBoard(_this.container);
                                }
                                _this.guid = whiteboardId;
                                //打开鼠标事件绑定
                                _this.bindMouseEvent(true);
                                //触发回调
                                var result = {
                                    whiteBoardId: whiteboardId,
                                    whiteBoardName: whiteboard.whiteboardName,
                                    whiteBoardIndex:_this.whiteBoardControlerArr.length,//默认添加到最后
                                    whiteBoardCount:_this.whiteBoardControlerArr.length,
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onWhiteboardCreate",
                                    result: result,
                                });
                                //创建白板页

                                //设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                                // _this.setCanvasSize(whiteboard.whiteboardPage[0].pageBgImageW,whiteboard.whiteboardPage[0].pageBgImageH)
                                // _this.bgImg = null;
                                _this.render(_this.whiteBoardControler[whiteboardId]);
                                //触发回调
                                var result = {
                                    pageCount:whiteboard.whiteboardPage.length,
                                    pageIndex:whiteboard.whiteboardPageIndex +1,
                                }
                                AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                                    type: "onWhiteboardPageCreate",
                                    result: result,
                                });
                            }
                            // this.whiteBoardControler[wbObj.whiteboardId] = wbObj;
                            //切换到当前白板
                            //默认使用最后一个白板id为当前id
                            _this.guid = data.currentWhiteBoardId;
                            //本次操作是远程用户执行的操作
                            _this.isRemoteOperate = true;
                            _this.changeWhiteBoard(1,data.currentWhiteBoardId,'');
                            _this.render(_this.whiteBoardControler[_this.guid]);
                            _this.isRemoteOperate = false;
                            break;
                    };
                });
            },
            toPercentData: function (offset) {
                var point = {
                    xPosition: (offset.x / this.width).toFixed(4),
                    yPosition: (offset.y / this.height).toFixed(4)
                };
                return point;
            },
            //转化对应canvas坐标
            trans:function(point,type){
                if(type == 'x'){
                    return Math.ceil(parseFloat(point) * this.width)
                }else{
                    return Math.ceil(parseFloat(point) * this.height)
                }

            },
            /**
             * 绘制曲线
             * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
             * @param {Point} start 起始点
             * @param {Point} control 控制点
             * @param {Point} end 终止点
             * @private
             */
            free: function (ctx,lineData) {
                // Point.set(oldMid, mid.x, mid.y);
                // Point.set(end, offset.x, offset.y);
                // free(workCtx, oldMid, end, mid);
                // var mid = new Point((end.x + offset.x) / 2, (end.y + offset.y) / 2);
                var startX = this.trans(lineData.startPoint.xPosition,'x');
                var startY = this.trans(lineData.startPoint.yPosition,'y');
                //初始终点同起始点
                var endX = this.trans(lineData.startPoint.xPosition,'x');
                var endY = this.trans(lineData.startPoint.yPosition,'y');
                var controlX = 0;
                var controlY = 0;
                var arr;
                if(lineData.movePoint){
                    arr = lineData.movePoint.slice(0);
                }else{
                    arr = []
                }
                ctx.save();
                ctx.lineCap="round";//不加不显示点和消除断断续续
                // ctx.lineWidth =
                //单击时移动端不发送移动点
                if (arr.length == 0){
                    //单击成点
                    ctx.beginPath();
                    ctx.moveTo(startX,startY);
                    ctx.lineTo(endX,endY);
                    ctx.stroke();
                    ctx.restore();
                    return
                }
                arr.unshift(lineData.startPoint);
                arr.push(lineData.endPoint);
                //ctx.globalCompositeOperation = 'source-atop';
                // ctx.lineJoin="round";
                //绘制出上一个点到当前点的贝塞尔曲线
                // for(var i = 0;i < arr.length-2; i++){
                // 	startX = this.trans(arr[i].xPosition,'x');
                // 	startY = this.trans(arr[i].yPosition,'y');
                // 	endX = this.trans(arr[i+1].xPosition,'x');
                // 	endY = this.trans(arr[i+1].yPosition,'y');
                // 	controlX = ((startX + endX) / 2);
                // 	controlY = ((startY + endY) / 2);
                // 	ctx.beginPath();
                // 	ctx.moveTo(startX, startY);
                // 	ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                // 	ctx.stroke();
                // }
                startX = this.trans(arr[0].xPosition,'x');//A
                startY = this.trans(arr[0].yPosition,'y');//A
                var lastPointX;
                var lastPointY;
                for(var i = 1;i < arr.length-2; i++){
                    controlX = this.trans(arr[i].xPosition,'x');//B C
                    controlY = this.trans(arr[i].yPosition,'y');//B
                    lastPointX =this.trans(arr[i+1].xPosition,'x');//C D
                    lastPointY =  this.trans(arr[i+1].yPosition,'y');//C
                    endX = (controlX + lastPointX) / 2;//B1 C1
                    endY = (controlY + lastPointY) / 2;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY); //A B1
                    startX = endX;//
                    startY = endY;
                    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                    ctx.stroke();
                }

                ctx.restore();
            },
            /**
             * 绘制矩形
             * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
             * @param {Point} start 起始点
             * @param {number} w 宽度，单位px
             * @param {number} h 高度，单位px
             * @private
             */
            rect:function (ctx, lineData) {
                var arr;
                if(lineData.movePoint){
                    arr = lineData.movePoint.slice(0);
                }else{
                    arr = []
                }
                var startX = this.trans(lineData.startPoint.xPosition,'x');
                var startY = this.trans(lineData.startPoint.yPosition,'y');
                //初始终点同起始点
                var endX = this.trans(lineData.startPoint.xPosition,'x');
                var endY = this.trans(lineData.startPoint.yPosition,'y');
                if (arr.length ==0){
                    //单击不成点
                    return
                }
                arr.unshift(lineData.startPoint);
                //结束点不为空才添加
                if(JSON.stringify(lineData.endPoint) !== "{}"){arr.push(lineData.endPoint)};
                for(var i = 0;i < arr.length-1; i++){
                    endX = this.trans(arr[i+1].xPosition,'x');
                    endY = this.trans(arr[i+1].yPosition,'y');
                }
                //pc单击就会有移动点,这里会导致移动回起始点同样也会消失
                if(startX == endX && startY == endY){
                    return
                }
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            },
            /**
             * 绘制椭圆
             * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
             * @param {Point} start 起始点
             * @param {Point} end 终点
             * @private
             */
            circle:function (ctx,lineData) {
                var arr;
                if(lineData.movePoint){
                    arr = lineData.movePoint.slice(0);
                }else{
                    arr = []
                }

                var startX = this.trans(lineData.startPoint.xPosition,'x');
                var startY = this.trans(lineData.startPoint.yPosition,'y');
                //初始终点同起始点
                var endX = this.trans(lineData.startPoint.xPosition,'x');
                var endY = this.trans(lineData.startPoint.yPosition,'y');
                if (arr.length ==0){
                    //单击不成点
                    return
                }
                arr.unshift(lineData.startPoint);
                //结束点不为空才添加
                if(JSON.stringify(lineData.endPoint) !== "{}"){arr.push(lineData.endPoint)};
                for(var i = 0;i < arr.length-1; i++){
                    endX = this.trans(arr[i+1].xPosition,'x');
                    endY = this.trans(arr[i+1].yPosition,'y');
                }
                //pc单击就会有移动点，故需要此判断
                if(startX == endX && startY == endY){
                    return
                }
                ctx.beginPath();
                //(起点x,起点y,半径x,半径y,旋转的角度，起始角，结果角，顺时针还是逆时针)
                //ie不支持ellipse，改用画圆缩放来实现椭圆
                // ctx.ellipse(0.5 * (endX + startX), 0.5 * (endY + startY), 0.5 * (Math.abs(endX - startX)), 0.5 * (Math.abs(endY - startY)), 0, 0, 2 * Math.PI);
                // ctx.stroke();
                //(圆心x,圆心y,半径，起始角，结果角，顺时针还是逆时针)
                //x方向半径，y方向半径
                var xR = 0.5 * (Math.abs(endX - startX));
                var yR =  0.5 * (Math.abs(endY - startY));
                //半径
                var r;
                //椭圆中心
                var  centerPoint ={x:0.5 * (endX + startX) , y:0.5 * (endY + startY)};
                //缩放比例
                var scaleX = 1;
                var scaleY = 1 ;
                if(xR > yR){
                    r = xR;
                    scaleY = yR/xR;
                }else{
                    r = yR;
                    scaleX  = xR/yR;
                }
                ctx.save();  //先保存下绘图状态
                ctx.translate(centerPoint.x*(1-scaleX), centerPoint.y*(1-scaleY));
                ctx.scale(scaleX, scaleY);
                ctx.beginPath();
                ctx.arc(centerPoint.x, centerPoint.y, r , 0 , 2 * Math.PI);
                ctx.restore();  //恢复绘图状态
                ctx.stroke();
            },
            /**
             * 绘制箭头
             * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
             * @param {Point} start 起始点
             * @param {Point} end 终点
             * @param {Arrow}theta：三角斜边一直线夹角
             * @param {Arrow}headlen：三角斜边长度(需要根据线宽重新计算，实际长度为原有长度+2倍（线宽一半/tan30）)
             * @param {Arrow}arrowColor：三角形填充色
             * @private
             */
            arrow:function(ctx, lineData,arrowColor,theta,headlen) {
                var arr;
                if(lineData.movePoint){
                    arr = lineData.movePoint.slice(0);
                }else{
                    arr = []
                }
                var startX = this.trans(lineData.startPoint.xPosition,'x');
                var startY = this.trans(lineData.startPoint.yPosition,'y');
                var endX = this.trans(lineData.startPoint.xPosition,'x');
                var endY = this.trans(lineData.startPoint.yPosition,'y') ;
                if (arr.length ==0){
                    //单击不成点
                    return
                }
                arr.unshift(lineData.startPoint);
                //结束点不为空才添加
                if(JSON.stringify(lineData.endPoint) !== "{}"){arr.push(lineData.endPoint)};

                for(var i = 0;i < arr.length-1; i++){
                    endX = this.trans(arr[i+1].xPosition,'x');
                    endY = this.trans(arr[i+1].yPosition,'y');
                }
                //pc单击就会有移动动点
                if(startX == endX && startY == endY){
                    return
                }
                var headlen = headlen || 10;
                var theta = theta || 30;
                //斜线跟随线宽改变
                headlen = headlen + 2* ctx.lineWidth/2 / Math.tan(theta*Math.PI/180);
                var angle = Math.atan2(startY - endY, startX - endX) * 180 / Math.PI,
                    angle1 = (angle + theta) * Math.PI / 180,
                    angle2 = (angle - theta) * Math.PI / 180,
                    topX = headlen * Math.cos(angle1),
                    topY = headlen * Math.sin(angle1),
                    arrowTX = endX + topX ,
                    arrowTY = endY + topY,
                    botX = headlen * Math.cos(angle2),
                    botY = headlen * Math.sin(angle2),
                    arrowBX = endX + botX ,
                    arrowBY = endY + botY;

                //三角形中垂线长度
                var arrowVariLineLen = headlen * Math.cos(theta*Math.PI /180);
                //三角形扩张长度
                var moveHeadlen = ctx.lineWidth/2/Math.sin(theta*Math.PI/180);
                var moveX = arrowVariLineLen * Math.cos(angle* Math.PI / 180);
                var moveY = arrowVariLineLen * Math.sin(angle* Math.PI / 180);

                ctx.beginPath();
                //画线
                var disLen = Math.abs(startX -  endX)
                if (Math.abs(moveX) < disLen){
                    //在三角形范围内不画线
                    ctx.moveTo(startX, startY);
                    //终点往回缩刚好接触三角形
                    ctx.lineTo(endX + moveX, endY + moveY);
                    ctx.stroke();
                }

                //画箭头
                ctx.save();
                ctx.moveTo(arrowTX , arrowTY );
                ctx.lineTo(endX, endY );
                ctx.lineTo(arrowBX ,arrowBY);
                ctx.lineWidth = 1;
                ctx.fillStyle = arrowColor;
                ctx.closePath();
                ctx.fill();
                ctx.restore();  //恢复绘图状态
                // ctx.stroke()

            },
            /**
             * 绘制直线
             * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
             * @param {Point} start 起始点
             * @param {Point} end 终点
             * @private
             */
            linear:function (ctx,lineData) {
                if(lineData.movePoint){
                    arr = lineData.movePoint.slice(0);
                }else{
                    arr = []
                }
                var startX = this.trans(lineData.startPoint.xPosition,'x');
                var startY = this.trans(lineData.startPoint.yPosition,'y');
                var endX = this.trans(lineData.startPoint.xPosition,'x');
                var endY = this.trans(lineData.startPoint.yPosition,'y') ;
                if (arr.length ==0){
                    //单击不成点
                    return
                }
                arr.unshift(lineData.startPoint);
                //结束点不为空才添加
                if(JSON.stringify(lineData.endPoint) !== "{}"){arr.push(lineData.endPoint)};
                for(var i = 0;i < arr.length-1; i++){
                    endX = this.trans(arr[i+1].xPosition,'x');
                    endY = this.trans(arr[i+1].yPosition,'y');
                }
                if(startX == endX && startY == endY){
                    return
                }
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX , endY);
                ctx.closePath();
                ctx.stroke();
            },
            //设置白板模式
            setWhiteBoardMode:function(AnyChatWhiteBoardInteractionMode){
                this.whiteBoardMode = AnyChatWhiteBoardInteractionMode;
            },
            //销毁

            //请求同步白板数据fromUserId代表向谁请求
            syncAllWhiteBoardData:function(fromUserId){
                var userId = this.userId;
                // data:{allWhiteBoardData:actionObj.allWhiteBoardData}
                this.command.emit({fromUserId: userId,toUserId:fromUserId,userId:userId,event: 'syncData'});
            },
            //发送同步白板数据
            sendAllWhiteBoardData:function (toUserId) {
                var userId = this.userId;
                this.command.emit({toUserId:toUserId,userId:userId,currentWhiteBoardId:this.guid,event: 'returnData',value:this.whiteBoardControlerArr});
            },
            //插拔式服务消息发送
            detachableServerRequest :function(json){
                var serverData = {
                    'appid':this.appId,
                    'userid':this.userId,
                    'detachableId':this.serverGuid,
                    'timeout':json.timeout || 3000,
                    'sync':json.sync || 0,
                    'databuf':{
                        cmd:'whiteboardcmd',
                        code:json.code,
                        data:json.data,

                    },
                }
                var errorcode = this.detachableServerInstance.sendData(serverData);
                console.log(errorcode)

            },
            //向插拔式服务请求全量数据
            fetchHistoryWhiteBoardData:function (roomId,appId) {
                if(roomId === void 0){
                    roomId = this.roomId;
                }
                if(appId === void 0){
                    appId = this.appId;
                }
                //请求插拔式服务，获取全量数据
                this.detachableServerRequest({'code':'syncdrawdata',
                    'data':{
                        roomId:roomId
                    }
                })


            },
            //初始化插拔式服务
            initDetachableServer: function () {
                // serverGuid = BRAC_GetSDKOptionString(BRAC_SO_CORESDK_NEWGUID)
                this.serverGuid = BRAC_GetSDKOptionString(BRAC_SO_CORESDK_NEWGUID)
                //初始化插拔式服务
                var serverObject = {
                    detachableId:this.serverGuid,
                    // serverFlag:2151677952,
                    onAnyChatDetachableServiceConnect:onAnyChatDetachableServiceConnect,
                    onAnyChatDetachableServiceReConnect:onAnyChatDetachableServiceReConnect,
                    onAnyChatDetachableServiceReceiveData:onAnyChatDetachableServiceReceiveData,
                    onAnyChatDetachableServiceDisConnect:onAnyChatDetachableServiceDisConnect,
                }
                this.detachableServerInstance =  AnyChatWebSDK.anychatSDKInstance.InitDetachableService(serverObject);
                //初始化
                var errorcode = this.detachableServerInstance.connectToDetachableServer(this.serverGuid);
                if(errorcode !==0){
                    console.log("电子白板插拔式服务初始化失败，错误码："+ errorcode)
                }
            },
            //插拔式消息处理
            detachableServerGetData:function (json) {
                console.log("whiteBoard插拔式消息处理 detachableServerGetData")
                if(json.type == 'connect'){
                    if(json.hasOwnProperty('errorcode') && json.errorcode != 0){
                        console.log("电子白板插拔式服务初始化失败，错误码："+ json.errorcode)
                        console.log('----------------------------------初始化白板插拔式服务失败')
                    }else{
                        console.log('----------------------------------初始化白板插拔式服务成功');
                        console.log('----------------------------------同步白板历史数据');
                        //请求白板全量数据
                        this.fetchHistoryWhiteBoardData()
                    }

                }
                else if(json.code == 'syncdrawdata'){
                    console.log('----------------------------------接受白板历史数据');
                    //同步到本地数据
                    // "roomId": "123123",						// 房间号
                    //     "appId": "sdfsdf123123",					// 应用id
                    //     "whiteboardIndex": "wbid5858774557845565"		// 当前操作白板id
                    // "whiteboard": [
                    var data = json.content;
                    //接收到主持人返回的全部白板数据，更新本地白板数据
                    //已创建的白板数量
                    var wbCount = data.whiteboard.length;
                    if(!wbCount){
                        //还没有创建，退出
                        console.log('----------------------------------同步白板历史数据成功');
                        console.log(json.content);
                        //触发获取到历史白板数据回调,返回空数组
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type: "onAnyChatWhiteBoardHistoryDataReceive",
                            result: { whiteBoardIdArr:[],},
                        });
                        return
                    }

                    this.whiteBoardControlerArr=data.whiteboard ;
                    //遍历赋值
                    var whiteboard;
                    var whiteboardId;
                    var whiteBoardIdArr = [];
                    for(var i = 0;i<= wbCount -1;i++){
                        whiteboard = this.whiteBoardControlerArr[i];
                        whiteboardId = whiteboard.whiteboardId;
                        whiteBoardIdArr.push(whiteboardId);
                        this.whiteBoardControler[whiteboardId] = whiteboard;
                        //遍历执行所有白板数据绘制
                        //创建+绘制
                        //第一次新增白板或关闭白板后需要打开白板
                        if(this.guid ==null){
                            this.openWhiteBoard(this.container);
                        }
                        this.guid = whiteboardId;
                        //打开鼠标事件绑定
                        // this.bindMouseEvent(true);

                        //创建白板页
                        //图片预加载
                        var imgUrls = [];
                        var whiteBoardPages = whiteboard.whiteboardPage;
                        for( var j = 0; j< whiteBoardPages.length; j++){
                            imgUrls.push(whiteBoardPages[j].pageBgImage)
                        }
                        this.imgPreLoad(imgUrls);
                        //设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                        // this.setCanvasSize(whiteboard.whiteboardPage[0].pageBgImageW,whiteboard.whiteboardPage[0].pageBgImageH)
                        // _this.bgImg = null;
                        // this.render(this.whiteBoardControler[whiteboardId]);

                    }
                    // this.whiteBoardControler[wbObj.whiteboardId] = wbObj;
                    //切换到当前白板
                    //默认使用最后一个白板id为当前id
                    this.guid = data.whiteboardIndex;

                    //本次操作是远程用户执行的操作
                    // this.isRemoteOperate = true;
                    // this.changeWhiteBoard(1,data.whiteboardIndex,'');
                    whiteboardId = data.whiteboardIndex;
                    whiteboard = this.whiteBoardControler[whiteboardId];

                    //设置白板宽高,先用第一张的宽高，后面如果每页宽高不一样再另外设计
                    // this.setCanvasSize(whiteboard.whiteboardPage[0].pageBgImageW,whiteboard.whiteboardPage[0].pageBgImageH);
                    this.render(this.whiteBoardControler[whiteboardId]);
                    //检测暂存区，如果有同步期间他人操作，逐个执行一遍
                    for (var i = 0;i<this.actionTemporary.length;i++){
                        this.act(this.actionTemporary[i])
                    }
                    var currentWbIndex = this.whiteBoardControlerArr.indexOf(whiteboard);
                    console.log('----------------------------------同步白板历史数据成功');
                    console.log(json.content);
                    //触发获取到历史白板数据回调
                    var result = {
                        whiteBoardIdArr:whiteBoardIdArr,
                        currentWhiteBoardId:whiteboardId,
                        whiteBoardIndex : currentWbIndex + 1,//0表示第一板
                        whiteBoardCount: this.whiteBoardControlerArr.length,
                    }
                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAnyChatWhiteBoardHistoryDataReceive",
                        result: result,
                    });
                }
                else if(json.code == 'createwhiteboard'){
                    console.log("createwhiteboard")
                }
                else if(json.code == 'createpage'){
                    console.log("createpage")
                }
                else if(json.code == 'deletewhiteboard'){
                    console.log("deletewhiteboard")
                }
                else if(json.code == 'switchpage'){
                    console.log("switchpage")
                }
                else if(json.code == 'setbgcolor'){
                    console.log("setbgcolor")
                }
                else if(json.code == 'setbgimage'){
                    console.log("setbgimage")
                }
                else if(json.code == 'adddrawdata'){
                    console.log("adddrawdata")
                }
                else if(json.code == 'undolastdraw'){
                    console.log("undolastdraw")
                }
                else if(json.code == 'clearpage'){
                    console.log("clearpage")
                }
                this.flagManager[json.type] = 1;
            },

        };
        //时间戳
        var timeStamp = function timeStamp(){
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();
            var hour = time.getHours();
            var min = time.getMinutes();
            var s = time.getSeconds();
            var S = time.getMilliseconds();


            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            if (min < 10) {
                min = '0' + min;
            }

            if (s < 10) {
                s = '0' + s;
            }

            if (S < 10) {
                S = '0' + S;
            }

            return Number('' + year + month + day + hour + min + s + S);
        };
        //创建白板数据组
        var createWhiteBoradData = function preprocessing(params,userId) {

            if(userId !== this.userId){
                //接收到act交互消息，创建使用对方的白板id
                this.whiteboardId = params.whiteboardId;
                this.whiteboardCreator = params.whiteboardCreator;
                this.whiteboardName = params.whiteboardName;
                this.whiteboardCreateTime = params.whiteboardCreateTime;
                this.whiteboardPageIndex = params.whiteboardPageIndex;
                // this.whiteboardPage = params.whiteboardPage;
            }else{
                //自己创建白板则生成白板id
                this.whiteboardId = AnyChatWebSDK.anychatSDKInstance.createGuid();
                this.whiteboardCreator = params.whiteboardCreator;
                this.whiteboardName = params.whiteboardName;
                this.whiteboardCreateTime = params.whiteboardCreateTime;
                // this.whiteboardBgColor = '#ffffff';
                // this.whiteboardBgImage = '';
                this.whiteboardPageIndex = params.whiteboardPageIndex;
                // this.whiteboardPage = params;
                // console.log(this)
            };

        };

        //数据类
        var drawData = function drawData(lineWidth, lineColor, lineStyle,guid,userId) {
            this.whiteboardId = guid;
            this.userId = userId;
            this.actionId = AnyChatWebSDK.anychatSDKInstance.createGuid();
            this.sTimestamp = timeStamp();
            this.eTimestamp = null;
            this.lineWidth = lineWidth; //粗细
            this.lineColor = lineColor; //颜色
            this.lineStyle = lineStyle; //类型
            this.lineData = {
                startPoint: {},
                movePoint: [],
                endPoint: {}
            }; //数据点对象
        };

        //坐标点转化
        var Point = function Point(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        };
        Point.prototype.copy = function copy() {
            return new Point(this.x, this.y);
        };
        Point.set = function set(point, x, y) {
            point.x = x;
            point.y = y;
        };
        //白板消息通知
        // function onDrawing(obj){
        //     console.log(obj);
        //     var json = {};
        //     json.userid = -1;//-1表示发送给所有人：广播
        //     json.cmd="whiteboardcmd";
        //     json.data = {"msg":obj,"fromUserid":mSelfUserId};
        //     //同步消息只需要发给主持人，和返回同步数据消息只需要返回给指定请求者 ,
        //     // 但是 这里可能会有多个消息合并在一个obj的情况，故先全部广播？
        //     var dataArr = JSON.parse(obj);
        //     console.log("发送广播消息："+JSON.stringify(json));
        //     BRAC_SDKControl(ANYCHAT_SDKCTRL_BUSINESS,JSON.stringify(json));
        // }


        //白板数据发送管理
        function command(draw) {
            //emit事件
            this.ACTION = {
                'create': 1,//创建画板，本地应该保存data里面的数据
                'delete': 2,//删除画板，根据data里面的whiteboardId删除对应的画板数据
                'createPage':3, //为一个画板创建页，一页或者多页
                'switch':4,//切换画板（页）
                'bgColor': 5,//设置画板某页背景色，更新对应whiteboardId的画板的pageIndex背景颜色
                'bgImage': 6,//设置画板某页背景图，更新对应whiteboardId的画板的pageIndex背景图片
                'start': 7,//起始点
                'undo':8,//撤销上步操作
                'clear':9,//清空画板信息
                'move':10,//移动点
                'end':11,//终点
                //后三个可能废弃
                'close':12,//关闭白板
                'syncData':13,//请求同步白板数据
                'returnData':14,//返回全部白板数据
            };
            // var eventType = {};
            // eventType[1] = 'mousedown';
            // eventType[2] = 'mousemove';
            // eventType[3] = 'mouseup';
            // eventType[4] = 'undo';
            // eventType[6] = 'clear';
            // eventType[14] = 'file';
            // this.eventType = eventType;
            this._draw = draw;
            this.dataQue = [];
            // this.loop();
        };
        command.prototype = {
            constructor: command,
            emit: function (action) {
                //若不是当前用户id,则不发送（说明是act函数调用了改功能不该重复发送）
                if (action.userId !== this._draw.userId) { return };
                var data = this.getdata(action);
                // console.log('---------------', data)
                this.dataQue.push(data)
                this.send(this.dataQue);
                this.dataQue.length = 0;
                // var a = this.pack(data);
                // console.log(a);
            },
            //循环监听
            loop: function () {
                var _this = this;
                var timer = setInterval(function () {
                    var dq = _this.dataQue;
                    if (dq.length < 1) { return };
                    _this.send(dq);
                    dq.length = 0
                }, 100);
            },
            //数据获取
            getdata: function (actionObj) {
                // console.log(actionObj);
                if (!actionObj) { return };
                var type = this.ACTION[actionObj.event];
                //起始点
                if(type == this.ACTION.start){
                    console.log('--------------------start');
                    return {
                        code:'adddrawdata',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            userId:actionObj.userId.toString(),
                            actionId:actionObj.value.actionId.toString(),
                            sTimestamp:actionObj.value.sTimestamp.toString(),
                            lineWidth:parseFloat(actionObj.value.lineWidth),
                            lineColor:actionObj.value.lineColor.toString(),
                            lineStyle:Number(actionObj.value.lineStyle),
                            pointStatus:1,
                            xPosition:parseFloat(actionObj.value.point.xPosition),
                            yPosition:parseFloat(actionObj.value.point.yPosition),
                            pageId: actionObj.pageId.toString(),
                            pageIndex: Number(actionObj.pageIndex),
                        }
                    };
                    //移动点
                }
                else if(type == this.ACTION.move){
                    console.log('--------------------move');
                    return {
                        code:'adddrawdata',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            userId:actionObj.userId.toString(),
                            pointStatus:2,
                            xPosition:parseFloat(actionObj.value.point.xPosition),
                            yPosition:parseFloat(actionObj.value.point.yPosition),
                            pageId: actionObj.pageId.toString(),
                            pageIndex: Number(actionObj.pageIndex),

                        }
                    };
                    //终点
                }
                else if(type == this.ACTION.end){
                    console.log('--------------------end');
                    var eTime = actionObj.value.eTimestamp;
                    console.log(typeof eTime)
                    return {
                        code:'adddrawdata',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            userId:actionObj.userId.toString(),
                            pointStatus:3,
                            eTimestamp:actionObj.value.eTimestamp.toString(),
                            xPosition:parseFloat(actionObj.value.point.xPosition),
                            yPosition:parseFloat(actionObj.value.point.yPosition),
                            pageId: actionObj.pageId.toString(),
                            pageIndex: Number(actionObj.pageIndex),
                        }
                    }
                    //创建白板
                }
                else if(type == this.ACTION.create){
                    console.log('----------------------create');
                    return {
                        code:'createwhiteboard',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            whiteboardCreator:actionObj.value.whiteboardCreator.toString(),
                            whiteboardName:actionObj.value.whiteboardName.toString(),
                            whiteboardCreateTime:actionObj.value.whiteboardCreateTime.toString(),
                            whiteboardPageIndex:Number(actionObj.value.whiteboardPageIndex),
                            // whiteboardBgColor:actionObj.value.whiteboardPage[whiteboardPageIndex-1].whiteboardBgColor,
                            // whiteboardBgImage:actionObj.value.whiteboardPage[whiteboardPageIndex-1].whiteboardBgImage,
                            // whiteboardPage:actionObj.value.whiteboardPage,
                        }
                    };
                }
                else if(type == this.ACTION.delete){
                    //删除白板
                    console.log('----------------------delete');
                    return {
                        code:'deletewhiteboard',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            // whiteboardBgColor:actionObj.value.whiteboardPage[whiteboardPageIndex-1].whiteboardBgColor,
                            // whiteboardBgImage:actionObj.value.whiteboardPage[whiteboardPageIndex-1].whiteboardBgImage,
                            // whiteboardPage:actionObj.value.whiteboardPage,
                        }
                    };
                }
                else if(type == this.ACTION.createPage){
                    //创建白板页
                    console.log('----------------------createPage');
                    return {
                        code:'createpage',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            whiteboardPage:actionObj.value.whiteboardPage,
                        }
                    };
                }
                else if(type == this.ACTION.switch){
                    //切换画板（页）
                    console.log('----------------------switch');
                    return {
                        code:'switchpage',
                        data:{
                            whiteboardId: actionObj.guid.toString(),
                            whiteboardPageIndex: Number(actionObj.value.pageIndex),
                            pageId: actionObj.value.pageId.toString(),

                        }
                    };
                }
                else if(type == this.ACTION.bgColor){
                    //修改背景色
                    console.log('-----------------------------bgcolor');
                    return{
                        code:'setbgcolor',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            pageId:actionObj.pageId.toString(),
                            pageIndex:Number(actionObj.pageIndex),
                            pageBgColor:actionObj.value.pageBgColor.toString(),
                        },
                    }
                }
                else if(type == this.ACTION.bgImage){
                    //修改背景图
                    console.log('-----------------------------image');
                    return{
                        code:'setbgimage',
                        data:{
                            whiteboardId:actionObj.guid.toString(),
                            pageIndex: Number(actionObj.pageIndex),
                            pageId:actionObj.pageId.toString(),
                            pageBgImage:actionObj.value.pageBgImage.toString(),
                            pageBgImageW:actionObj.value.pageBgImageW,
                            pageBgImageH:actionObj.value.pageBgImageH,
                        },
                    }
                }
                else if(type == this.ACTION.undo){
                    //撤销上一步
                    console.log('-----------------------------undo');
                    return{
                        code:'undolastdraw',
                        data:{
                            whiteboardId: actionObj.guid.toString(),
                            pageId: actionObj.pageId.toString(),
                            pageIndex:Number(actionObj.pageIndex),
                            userId:  actionObj.userId.toString(),
                            actionId:actionObj.actionId.toString(),
                        },
                    }
                }
                else if(type == this.ACTION.clear){
                    //清空
                    console.log('-----------------------------clear');
                    return{
                        code:'clearpage',
                        data:{
                            whiteboardId: actionObj.guid.toString(),
                            pageId:  actionObj.pageId.toString(),
                            pageIndex: Number(actionObj.pageIndex),
                            userId: actionObj.userId.toString(),

                        },
                    }
                }
                else if(type == this.ACTION.close){
                    //关闭
                    console.log('-----------------------------close');
                    return{
                        code:10,
                        data:{},
                    }
                }
                else if(type == this.ACTION.syncData){
                    //请求同步数据
                    console.log('-----------------------------syncData');
                    return{
                        code:11,
                        data:{
                            fromUserId: actionObj.fromUserId.toString(),
                            toUserId:actionObj.toUserId.toString()
                        }
                    }
                }
                else if(type == this.ACTION.returnData){
                    //返回同步数据
                    console.log('-----------------------------returnData');
                    return{
                        code:12,
                        data:{
                            toUserId:actionObj.toUserId.toString(),
                            currentWhiteBoardId:actionObj.currentWhiteBoardId.toString(),
                            whiteboardData:actionObj.value
                        }
                    }
                }
            },
            //发送数据触发他人接收消息的回调onDrawing
            send: function (commands) {
                // console.log(JSON.stringify(commands))
                // AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                //     type: "wbCallback",
                //     result: JSON.stringify(commands),
                // });

                var json = {};
                json.userid = -1;//-1表示发送给所有人：广播
                json.cmd="whiteboardcmd";
                json.data = {"msg":JSON.stringify(commands),"fromUserid":this._draw.userId.toString()};
                //同步消息只需要发给主持人，和返回同步数据消息只需要返回给指定请求者 ,
                // 但是 这里可能会有多个消息合并在一个obj的情况，故先全部广播？
                console.log("发送广播消息："+JSON.stringify(json));
                BRAC_SDKControl(ANYCHAT_SDKCTRL_BUSINESS,JSON.stringify(json));

                //加入本地日志
                var strLog ="白板消息发送（send）：" + JSON.stringify(json);
                if(strLog.length > 4000){
                    strLog ="白板消息发送（send）:数据过大自动省略" ;
                }
                BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
            }
        };

        // 白板消息接收
        function OnAnyChatWhiteBoardBusiness(lpEventJsonStr) {
            var currentInstace = AnyChatWebSDK.anychatSDKInstance.AnyChatWhiteBoard;
            console.log("OnAnyChatWhiteBoardBusiness接收广播消息："+lpEventJsonStr);
            //加入本地日志
            var strLog ="OnAnyChatWhiteBoardBusiness(" + lpEventJsonStr + ")" ;
            BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
            if(typeof JSON.parse(lpEventJsonStr) == 'object'){
                var res = JSON.parse(lpEventJsonStr);
                var data = res.data.data;
                if(res.userid == '-1' && res.cmd === "whiteboardcmd"){
                    currentInstace.act(res.data.msg);
                }
            }
        }



        var instance = AnyChatWhiteBoard;
        exports.OnAnyChatWhiteBoardBusiness = OnAnyChatWhiteBoardBusiness;
        exports.instance = instance;


        /***/

        /***/ }),
    /******/ ]);