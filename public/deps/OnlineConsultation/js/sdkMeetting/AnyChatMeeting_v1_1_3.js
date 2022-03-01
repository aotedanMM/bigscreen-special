// (function () {
//     var option ={name:"aa"};
//     window.AnyChatMeetingManager  = new AnyChatMeetingManager.instance(option);
//     // logger.invokeLog("createWhiteBoard", errorCode, params);
//     return window.AnyChatMeetingManager
// })()
var AnyChatMeetingManager = (function () {
    var _instance = null;
    return function () {
        // console.log('----------------------------------欢迎使用AnyChat会议sdk组件');
        // console.log('----------------------------------会议sdk组件构造函数');
        //新版sdk对象
        // this.webSDKInstance ='';
        if(_instance==null){
            _instance=this;
        }
        return _instance;
    }
})()

// function AnyChatMeetingManager(option) {
//     // 如果已存在对应的实例
//     if(typeof AnyChatMeetingManager.instance === 'object'){
//         return AnyChatMeetingManager.instance
//     }
//     //否则正常创建实例
//     this.name = option.name
//     console.log('----------------------------------欢迎使用AnyChat会议组件');
//     console.log('----------------------------------会议组件构造函数');
// };
AnyChatMeetingManager.prototype = {
    constructor: AnyChatMeetingManager,
    //会议操作相关方法
    // 创建单例
    getInstance:function(){
        console.log('----------------------------------欢迎使用AnyChat会议sdk组件');
        console.log('----------------------------------会议sdk组件构造函数');
        this.webSDKInstance = null;
        this.AnyChatMeetingConfig = null;
        //录制配置
        this.recordInfo= null;
        //成员设备状态列表
        this.userCompletion = [];
        this.meetingId = '';
        this.userInfo='';
        this.userId='';
        this.meetingType = 0;//会议类型，0为语音，1为视频会议
        //成员id列表(包含自己)
        // var userIdList=[];
        // this.hostId = '';//主持人userid
        this.camera =null;
        this.showId = '';//本地视频显示的div的id
        this.microphone=null;
        this.checkTimer = null;//检测定时器 退出房间时清空

        this.serverGuid = ''//插拔式服务guid
        this.detachableServerInstance = null//插拔式服务实例
        this.appId =  '';

        //由于断开和初始化失败都是同样的回调，为区分断开还是初始化失败加detachableServerinitFlag
        //同样自动重连成功和主动调用初始化回调也是一样，同样使用detachableServerinitFlag区分
        // this.detachableServerinitFlag=false;//连接状态，true：已连接，false：未连接,
        //阀门管理，使异步请求能同步（成功更改阀门，使后续步骤继续进行）
        this.flagManager = {
            'connect':0,
            'getMeetinginfo':0,
            // 'mediacontrol':0,
            // 'destroymeeting':0
        }

        //服务器保存状态
        this.serverData = null;

        //录制方式（recordStyle:0：音视频录制，1屏幕录制）
        this.recordStyle = 0;
        return this
    },
    // 获取当前实例
    getCurrentInstance:function(){
        return this
    },
    // 进入会议
    enterMeeting:function(AnyChatMeetingConfig){
        console.log('----------------------------------初始化');
        //初始化
        this.webSDKInstance = AnyChatMeetingConfig.webSDKInstance;
        this.AnyChatMeetingConfig = AnyChatMeetingConfig;
        this.userInfo = AnyChatMeetingConfig.userInfo;
        this.userId = AnyChatMeetingConfig.userInfo.userId;
        this.meetingType = AnyChatMeetingConfig.meetingInfo.meetingType;
        this.recordInfo = AnyChatMeetingConfig.recordInfo;
        // this.detachableServerInstance = AnyChatMeetingConfig.detachableServerInstance;
        this.appId = AnyChatMeetingConfig.appId;
        this.meetingId = AnyChatMeetingConfig.meetingInfo.roomId;
            //回调注册：
        this.registerCallback(AnyChatMeetingConfig.events);
        //设置虚拟摄像头打开 不能在这里设置，只能sdk初始化时设置cameraOpt,这点后面需要加以说明告诉用户
        // this.webSDKInstance.setSDKOption({
        //     cameraOpt:{
        //         openNativeScreenCamera: 0 //0为不开启，1为开启；虚拟摄像头用于桌面共享时捕获桌面画面
        //       }
        // })

        //创建插拔式服务实例

        // serverGuid = BRAC_GetSDKOptionString(BRAC_SO_CORESDK_NEWGUID)
        this.serverGuid = BRAC_GetSDKOptionString(BRAC_SO_CORESDK_NEWGUID)
        //初始化插拔式服务
        var serverObject = {
            detachableId:this.serverGuid,
            onAnyChatDetachableServiceConnect:onAnyChatDetachableServiceConnect,
            onAnyChatDetachableServiceReConnect:onAnyChatDetachableServiceReConnect,
            onAnyChatDetachableServiceReceiveData:onAnyChatDetachableServiceReceiveData,
            onAnyChatDetachableServiceDisConnect:onAnyChatDetachableServiceDisConnect,
        }
        this.detachableServerInstance = this.webSDKInstance.InitDetachableService(serverObject);
        //连接
        var errorcode = this.detachableServerInstance.connectToDetachableServer(this.serverGuid);
        if(errorcode !==0){
            console.log("视频会议插拔式服务初始化失败，错误码："+ errorcode)
            //触发进入会议回调
            this.triggerCallback('初始化插拔式服务失败',errorcode,[],'onAnyChatMeetingEntered')
            return
        }

        var _this = this
        //请求会议数据成功才进入房间
        var getMeetinginfoInterval = setInterval(function () {
            if(_this.flagManager['getMeetinginfo'] == 1){
                _this.flagManager['getMeetinginfo'] = 0
                clearInterval(getMeetinginfoInterval)
            }else{
                return
            }


            //初始化成功，进入房间
            console.log('----------------------------------进入会议');
            var roomId = parseInt(_this.meetingId);
            //暂时没有房间id，先用房间名进入
            // var roomName= AnyChatMeetingConfig.meetingInfo.meetingId;
            _this.webSDKInstance.enterRoom({
                roomId: roomId,
                done: onAnyChatEnterRoomForMeeting,//实际上还是进入房间回调
            });
            //在sdk初始化后调用instance.callbackFunctionRegister添加事件注册
            _this.webSDKInstance.callbackFunctionRegister({
                onRoomUserInAndOut: onAnyChatUserAtRoomForMeeting,   //用户进出房间通知事件
            })
        },200)

        //进入指定房间
        //房间id

    },
    //清除会议数据，当网络断开或者从会议异常退出的时候需要调用该方法清除资源
    cleanMeetingResource:function () {
        //清除会议人数检测定时器
        if(this.checkTimer){
            clearInterval(this.checkTimer)
            this.checkTimer = null;
        }


        // this.webSDKInstance = null;
        this.AnyChatMeetingConfig = null;
        //录制配置
        this.recordInfo= null;
        //成员设备状态列表
        this.userCompletion = [];
        this.meetingId = '';
        this.userInfo='';
        // this.userId='';
        this.meetingType = 0;//会议类型，0为语音，1为视频会议
        //成员id列表(包含自己)
        // var userIdList=[];
        // this.hostId = '';//主持人
        this.camera =null;
        this.showId = '';//本地视频显示的div的id
        this.microphone=null;
        //断开插拔式服务
        if( this.detachableServerInstance){
            this.detachableServerInstance.closeDetachableServerConnect(this.serverGuid);
        }
        this.detachableServerInstance = null;
    },
    // 进入会议回调，在进入房间回调中手动触发
    // onAnyChatMeetingEntered:function(){
    //     console.log('----------------------------------进入会议')
    // },
    // 离开会议
    leaveMeeting:function(){
        //离开房间广播个人信息(只有在房间内才能发消息) 现在离开不需要发广播，

        //取消会议人数检测定时器
        if(this.checkTimer){
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        var errorCode = this.webSDKInstance.leaveRoom();//可能会触发onAnyChatLeaveRoom？？该怎么办

        //触发离开会议回调
        var data = { meetingId:this.meetingId}
        this.triggerCallback('成功',errorCode,data,'onAnyChatMeetingLeave')
        //清空资源
        this.cleanMeetingResource()
        return errorCode;
    },

    // 结束会议(主持人) 调用此方法则发送通知给其他参会者告知离开，并自己立即离开会议
    destroyMeeting:function(){
        if(!this.isCanHost(this.userId)){
            console.log("不具权限")
            return
        }
        //该消息同步给服务器同步，
        //请求插拔式服务，结束会议
        this.detachableServerRequest({'code':'destroymeeting',
            'data':{
                roomId:this.meetingId,
            }})
        var sendData = {
            'meetingId': this.meetingId,
            'userId':this.userId,
            'nickName':this.userInfo.nickName
        }
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "destroymeeting",
                "data": sendData
            }
        })
        //自身退出
        //取消会议人数检测定时器
        if(this.checkTimer){
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        var errorCode = this.webSDKInstance.leaveRoom();
        if(errorCode ==0){
            //触发会议结束回调
            this.triggerCallback('成功',errorCode,sendData,'onAnyChatMeetingDestroy')
            //清空资源
            this.cleanMeetingResource()
        }else {
            console.log("结束会议失败，错误码："+errorCode)
        }

        return errorCode
    },

    // 转让权限（主持人）
    transferMeetingHostToUser:function(targetId){
        if(!this.isHost(this.userId)){
            console.log("不是主持人，没有该权限")
            return
        }
        // this.hostId = targetId
        var data = {
            "fromUserId":this.userId,
            "toUserId":targetId.toString(),
            "meetingId":this.meetingId
        }
        //广播消息
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "cmdHostTransfer",
                "data": data
            }
        })
        //找到对应userInfo更新主持人为参会者
        for(var index in this.userCompletion){
            if (this.userCompletion[index].userId === this.userId){
                this.userCompletion[index].hostState = 0;
                this.userInfo.hostState = 0;
            }
        }
        //触发主持人转让结果回调(主持人自己收到)
        this.triggerCallback('成功',0,data,'onAnyChatMeetingHostTransferResult')
    },
    //分配管理员权限（主持人）
    enableUserPermission:function(targetId,enable){
        if(!this.isHost(this.userId)){
            console.log("不是主持人，没有该权限")
            return
        }
        // this.hostId = targetId
        //将该消息发送给服务器同步，服务器同步完成之后，
        var state ;
        if(enable){
            state = 1;
        }else{
            state = 0;
        }

        // 将该消息发送给该参会者。
        var data = {
            "userId":targetId.toString(),
            "state":state,
            "meetingId":this.meetingId
        }
        //广播消息
        this.sendMsg({
            'userId':targetId.toString(),
            'data': {
                "code": "permissioncontrol",
                "data": data
            }
        })
    },
    //参会人相关方法
    // 获取所有参会人以及设备状态
    fetchAllMeetingUserCompletion:function(){
        return this.userCompletion;
    },
    //将参会者移出会议
    userLeaveMeetingControl:function(userId){
        var data = {
            "fromUserId":this.userId,
            'fromUserName':this.userInfo.nickName,
            "toUserId":userId.toString(),
            "meetingId":this.meetingId
        }
        //广播消息
        this.sendMsg({
            'userId':userId.toString(),
            'data': {
                "code": "kickoutuser",
                "data": data
            }
        })
    },
    getUserByUserId:function (targetId) {
        var userList = this.fetchAllMeetingUserCompletion();
        var users = userList.filter(function (user) {
            return user.userId ===targetId;
        })
        return users[0]
    },
    // 打开/关闭某一个用户的视频（主持人/管理员）
    enableVideoWithUserId:function(targetId,enable){
        if(!this.isCanHost(this.userId)){
            console.log("不具权限")
            return
        }
        var state
        if (enable){
            state = 1
        }else{
            state = 0
        }
        //广播通知，对应用户打开/禁用自身摄像头
        var data = {
            "actionType":1,//0为麦克风变化，1为摄像头变化
            "state":state,//0为关闭，2禁用
            "meetingId":this.meetingId,
            'fromUserId':this.userId,
            'fromUserName':this.userInfo.nickName,
            'toUserId':targetId.toString()
        }
        this.sendMsg({
            'userId':targetId.toString(),
            'data': {
                "code": "mediacontrol",
                "data": data
            }
        })
    },

    // 打开/关闭某一个用户的音频 （主持人/管理员）
    enableAudioWithUserId:function(targetId,enable){
        if(!this.isCanHost(this.userId)){
            console.log("不具权限")
            return
        }
        var state
        if (enable){
            state = 1
        }else{
            state = 0//禁用
        }
        //广播通知，对应用户打开/禁用自身麦克风
        var data = {
            "actionType":0,//0为麦克风变化，1为摄像头变化
            "state":state,//0为关闭，1为打开，2,禁用（主持人关闭的话，用户自己不能打开）
            "meetingId":this.meetingId,
            'fromUserId':this.userId,
            'fromUserName':this.userInfo.nickName,
            'toUserId':targetId.toString()
        }
        this.sendMsg({
            'userId':targetId.toString(),
            'data': {
                "code": "mediacontrol",
                "data": data
            }
        })
    },
    // 打开/关闭所有用户的视频 （主持人/管理员）
    enableVideoInAllMeeting:function(enable){
        if(!this.isCanHost(this.userId)){
            console.log("不具权限")
            return
        }
        var state
        if (enable){
            state = 1
        }else{
            state = 0
        }
        //广播通知，对应用户打开/禁止自身摄像头
        var data = {
            "actionType":1,//0为麦克风变化，1为摄像头变化
            "state":state,//0为关闭，1为打开
            "meetingId":this.meetingId,
            'fromUserId':this.userId,
            'fromUserName':this.userInfo.nickName,
            'toUserId':'-1'
        }
        //请求插拔式服务，设置全体禁止视频
        this.detachableServerRequest({'code':'mediacontrol',
            'data':{
                roomId:this.meetingId,
                equipmentType:1,
                status:state,
            }})
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "mediacontrol",
                "data": data
            }
        })
    },
    // 打开/关闭所有用户的音频 （主持人/管理员）
    enableAudioInAllMeeting:function(enable){
        if(!this.isCanHost(this.userId)){
            console.log("不具权限")
            return
        }
        var state;//0：关闭，1：打开
        if (enable){
            state = 1
        }else{
            state = 0
        }
        //全体禁麦需要将消息进行服务端同步，
        //请求插拔式服务，设置全体禁言
        this.detachableServerRequest({'code':'mediacontrol',
            'data':{
                roomId:this.meetingId,
                equipmentType:0,
                status:state,
                userId:this.userId,
                userName:this.userInfo.nickName,
            }})

        //广播通知，全体打开/关闭自身麦克风
        var data = {
            "actionType":0,//0为麦克风变化，1为摄像头变化
            "state":state,//0为关闭，1为打开
            'fromUserId':this.userId,
            'fromUserName':this.userInfo.nickName,
            'toUserId':'-1',
            "meetingId":this.meetingId
        }
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "mediacontrol",
                "data": data
            }
        })
    },

    //会议消息相关方法
    // 会议内群发消息
    sendMeetingMessage:function(msg){
        //广播聊天消息
        var data = {
            'userId':this.userId,//发言人
            'nickName':this.userInfo.nickName,
            'content':msg,
            //消息类型,1文字消息，2图片消息，3视频消息，4音频消息，5其他附件
            'type':"1",
            'sendTime':this.generateTimeRequestNumber(),//发送时间毫秒
            "meetingId":this.meetingId
        }
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "sendmsg",
                "data": data
            }
        })
    },
    //音视频管理相关方法
    // 打开摄像头
    openCameraInRenderView:function(showId,isSyncState){
        if(!showId){showId=this.showId}
        var cameras = this.webSDKInstance.getCameras();
        if(cameras.length == 0){
            return '无可用摄像头'
        }
        if(!this.camera){
            //当前摄像头
            this.camera = cameras[0];
            this.camera.config({
                bitRate: 500000,    // 视频编码码率设置（参数为int型，单位bps）
                gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                width: 1280,         // 设置本地视频采集分辨率(宽度)
                height: 720,        // 设置本地视频采集分辨率(高度)
                fps: 25,          // 设置本地视频编码的帧率
                recordBitRate: 400000,   // 设置录像视频码率  （参数为int型，单位bps）
                preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                quality:3  // 设置本地视频编码的质量
            });
            var errorCode = cameras[0].open({
                id: showId,//摄像头显示的div的id
                streamIndex: 0
            });
            if (errorCode == 0) {
                console.log("打开摄像头成功");
                var data = {
                    "actionType":1,//0为麦克风变化，1为摄像头变化
                    "state":1,//0为关闭，1为打开
                    "userId":this.userId,
                    "meetingId":this.meetingId
                }
                this.sendMsg({
                    'userId':'-1',
                    'data': {
                        "code": "mediastatechange",
                        "data": data
                    }
                })
            }else{
                return errorCode
            }
        }else{
            if (this.camera.isOpen) {
                console.log("当前设备已经打开");
                return;
            }
            this.camera.config({
                bitRate: 500000,    // 视频编码码率设置（参数为int型，单位bps）
                gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                width: 1280,         // 设置本地视频采集分辨率(宽度)
                height: 720,        // 设置本地视频采集分辨率(高度)
                fps: 25,          // 设置本地视频编码的帧率
                recordBitRate: 400000,   // 设置录像视频码率  （参数为int型，单位bps）
                preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                quality:3  // 设置本地视频编码的质量
            });
            var errorCode = this.camera.open({
                id: showId,//摄像头显示的div的id
                streamIndex: 0
            });
            if (errorCode == 0) {
                console.log("打开摄像头成功");
                var data = {
                    "actionType":1,//0为麦克风变化，1为摄像头变化
                    "state":1,//0为关闭，1为打开
                    "userId":this.userId,
                    "meetingId":this.meetingId
                }
                if(isSyncState){
                    this.sendMsg({
                        'userId':'-1',
                        'data': {
                            "code": "mediastatechange",
                            "data": data
                        }
                    })
                }

            }else{
                return errorCode
            }
        }
        //找到对应userInfo更新摄像头状态
        for(var index in this.userCompletion){
            if (this.userCompletion[index].userId ===this.userId){
                this.userCompletion[index].cameraState = 1;
                this.userInfo.cameraState = 1;
            }

        }
        return 0;

    },
    // 关闭摄像头
    closeCamera:function(isSyncState){
        var errorCode = this.camera.close();
        if (errorCode == 0) {
            console.log("关闭摄像头成功");
            var data = {
                "actionType":1,//0为麦克风变化，1为摄像头变化
                "state":0,//0为关闭，1为打开
                "userId":this.userId,
                "meetingId":this.meetingId
            }
            if(isSyncState){
                this.sendMsg({
                    'userId':'-1',
                    'data': {
                        "code": "mediastatechange",
                        "data": data
                    }
                })
            }
            // this.sendMsg({
            //     'userId':'-1',
            //     'data': {
            //         "code": "mediastatechange",
            //         "data": data
            //     }
            // })
            //找到对应userInfo更新摄像头状态
            for(var index in this.userCompletion){
                if (this.userCompletion[index].userId === this.userId){
                    this.userCompletion[index].cameraState = 0;
                    this.userInfo.cameraState = 0;
                }
            }
        }
        //用户关闭自身摄像头/麦克风后需要通知他人，
        // 他人再次检测该用户的摄像头麦克风，以更新显示的该用户的设备状态

    },
    // 打开麦克风
    openMicrophone:function(){

        var microphones  = this.webSDKInstance.getMicrophones();
        if(microphones.length == 0){
            return '无可用麦克风'
        }
        if(!this.microphone){
            //当前麦克风
            this.microphone = microphones[0];
            var errorCode = microphones[0].open();
            if (errorCode == 0) {
                console.log("打开麦克风成功");
                var data = {
                    "actionType":0,//0为麦克风变化，1为摄像头变化
                    "state":1,//0为关闭，1为打开
                    "userId":this.userId,
                    "meetingId":this.meetingId
                }
                this.sendMsg({
                    'userId':'-1',
                    'data': {
                        "code": "mediastatechange",
                        "data": data
                    }
                })
            }else{
                return errorCode
            }
        }else{
            //当前摄像头
            var errorCode = this.microphone.open();
            if (errorCode == 0) {
                console.log("打开麦克风成功");
                var data = {
                    "actionType":0,//0为麦克风变化，1为摄像头变化
                    "state":1,//0为关闭，1为打开
                    "userId":this.userId,
                    "meetingId":this.meetingId
                }
                this.sendMsg({
                    'userId':'-1',
                    'data': {
                        "code": "mediastatechange",
                        "data": data
                    }
                })
            }
        }
        //找到对应userInfo更新麦克风状态
        for(var index in this.userCompletion){
            if (this.userCompletion[index].userId ==this.userId){
                this.userCompletion[index].microphoneState = 1
                this.userInfo.microphoneState = 1
            }else{
                return errorCode
            }
        }
        return 0;

    },
    // 关闭麦克风
    closeMicrophone:function(){
        var errorCode = this.microphone.close();
        if (errorCode == 0) {
            console.log("关闭麦克风成功");
            var data = {
                "actionType":0,//0为麦克风变化，1为摄像头变化
                "state":0,//0为关闭，1为打开
                "userId":this.userId,
                "meetingId":this.meetingId
            }
            this.sendMsg({
                'userId':'-1',
                'data': {
                    "code": "mediastatechange",
                    "data": data
                }
            })
            //找到对应userInfo更新麦克风状态
            for(var index in this.userCompletion){
                if (this.userCompletion[index].userId ==this.userId){
                    this.userCompletion[index].microphoneState = 0
                    this.userInfo.microphoneState = 0
                }
            }
        }
    },
    // 切换摄像头
    switchCamera:function(deviceName){
        //可在视频过程中切换摄像头设备
        var errorCode =this.webSDKInstance.selectVideoCapture({
            deviceName: deviceName
        });
        if (errorCode == 0) {
            console.log("切换摄像头成功");
            //找到该摄像头对象，设为当前摄像头对象
            var cameras = this.getCameras()
            for (var i = 0 ;i<cameras.length;i++){
                if(cameras[i].deviceName === deviceName){
                    this.camera = cameras[i]
                }
            }

        }
    },
    // 切换麦克风 (需要先关闭之前的，没有像切换视频（selectVideoCapture）一样的方法)
    switchMicrophone:function(deviceName){
        var isOpen = this.userInfo.microphoneState
        //如果是打开状态，先关闭之前麦克风
        if(this.microphone && isOpen == 1){
            this.microphone.close()
        }
        //找到该麦克风对象，设为当前麦克风对象，并发送打开麦克风消息
        var microphones = this.getMicrophones()
        for (var i = 0 ;i<microphones.length;i++){
            if(microphones[i].deviceName === deviceName){
                this.microphone = microphones[i]
            }
        }
        if(isOpen == 1)
        {
            this.microphone.open()
        }
    },
    //关闭扬声器
    closeAudioPlayBack:function () {
        BRAC_SetSDKOption(240, 1)

    },
    //打开扬声器
    openAudioPlayBack:function () {
        BRAC_SetSDKOption(240, 0)

    },
    // // 切换扬声器 没有这个方法
    // switchSpeaker:function(){
    //
    // },
    // 录制类型切换（recordStyle:0：音视频录制，1屏幕录制）
    switchRecordStyle:function(recordStyle){

        this.recordStyle = parseInt(recordStyle)
    },
    // 开始录制
    startRecord:function(){
        var recordOpt = null;
        var height = this.recordInfo.height || 480
        var width = this.recordInfo.width || 640
        if(this.recordStyle == 1){
            //屏幕录制
            var errorCode = this.recordScreen();
            return errorCode
        }
        else{
            //视频录制
            //会议人数
            var personCount = this.fetchAllMeetingUserCompletion().length;
            if(this.meetingType){
                if(this.isCanHost(this.userId) && personCount!=1){
                    //视频会议，如果是主持人(且不是一个人)则录全部人视频和全部人音频

                    recordOpt = {
                        layout:100,//传一个不存在的布局值
                        userId:-1,//录制的用户ID,-1为自己
                        content:1,
                        mode: 1, //1: 本地录制(默认) 2:服务器端录制 3:服务器合成流录制
                        clipMode:2,//缩小模式，缩小到合适的比例，不进行裁剪
                        done:onRecordForMeeting,//录制成功回调
                        width:width,//录制画面高度 （默认640）
                        height:height,//录制画面宽度 （默认480）
                    };

                }else {
                    //如果是参会者/或只有主持人自己，则只录自己视频和全部人音频
                    recordOpt = {
                        layout:1,
                        userId:-1,
                        layoutStreams :[{
                            userid: -1, //自己ID
                            streamindex: 0, //用户的视频流编号，用户可能存在多个摄像头,如果切换摄像头可能有问题
                            recordindex: 1 }//录制画面编号,  由数字从小到大向右排序，
                            //若是录制画面是大小屏的，0是大屏，1是小屏
                        ],
                        content:1,
                        mode: 1, //1: 本地录制(默认) 2:服务器端录制 3:服务器合成流录制
                        clipMode:2,//缩小模式，缩小到合适的比例，不进行裁剪
                        done:onRecordForMeeting,//录制成功回调
                        width:width,//录制画面高度 （默认640）
                        height:height,//录制画面宽度 （默认480）
                    };
                }
            }else {
                //音频会议只录音频
                recordOpt = {
                    layout:100,
                    userId:-1,
                    // layoutStreams :{
                    //     userid: -1, //自己ID
                    //     streamindex: 0, //用户的视频流编号，用户可能存在多个摄像头
                    //     recordindex: 1 //录制画面编号,  由数字从小到大向右排序，
                    //     //若是录制画面是大小屏的，0是大屏，1是小屏
                    // },
                    content:2,
                    mode: 1, //1: 本地录制(默认) 2:服务器端录制 3:服务器合成流录制
                    done:onRecordForMeeting,//录制成功回调
                };
            }
        }


        console.log("开始会议录制");
        this.webSDKInstance.startRecord(recordOpt);
        return 0

    },
    // 停止录制
    completeRecord:function(){
        this.webSDKInstance.stopRecord();
        console.log("停止会议录制");
        if(this.recordStyle == 1){
            //关闭虚拟摄像头
            //本地摄像头列表
            var cameras =  this.webSDKInstance.getCameras();
            for (var index in cameras) {
                //  && cameras[index].isOpen不要这个判断，因为测到有时是false,但是实际是打开的
                if (cameras[index].isInventCamera && cameras[index].isOpen) {
                    //有些电脑的cameras[index].isOpen一直是false,这会导致一直不关闭虚拟摄像头
                    cameras[index].close();
                }
            }
        }
    },

    //屏幕录制
    recordScreen:function(){
        //本地摄像头列表
        var cameras =  this.webSDKInstance.getCameras();
        if(cameras.length ==0 ){
            return '无可用摄像头'
        }
        var inventCamera;
        var inventCameras = cameras.filter(function (camera) {
            return camera.isInventCamera
        })
        if(inventCameras.length == 0){
            return '无虚拟摄像头'
        }else{
            inventCamera = inventCameras[0]
        }
        inventCamera.config({
            bitRate: 600000, // 视频编码码率设置（参数为int型，单位bps）
            gop: 20, // 视频编码关键帧间隔控制（参数为int型）
            width: 1920, // 设置本地视频采集分辨率(宽度)
            height: 1080, // 设置本地视频采集分辨率(高度)
            fps: 5, // 设置本地视频编码的帧率
            recordBitRate: 700000, //设置录像视频码率
            preset: 3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
            quality: 3 // 设置本地视频编码的质量
        });
        var streamIndex = inventCamera.streamIndex;
        var errorCode = inventCamera.open({
            streamIndex: streamIndex
        });
        if(errorCode == 0){
            console.log("开启虚拟摄像头成功");
            //录制桌面流
            var recordOpt = {
                layout:1,
                userId:-1,
                layoutStreams :[{
                    userid: -1, //自己ID
                    streamindex: streamIndex, //用户的视频流编号，用户可能存在多个摄像头,如果切换摄像头可能有问题
                    recordindex: 1 }
                ],
                content:1,
                mode: 1, //1: 本地录制(默认) 2:服务器端录制 3:服务器合成流录制
                clipMode:2,//缩小模式，缩小到合适的比例，不进行裁剪
                done:onRecordForMeeting,//录制成功回调
                width:this.recordInfo.width || 640,//录制画面高度 （默认640）
                height:this.recordInfo.height || 480,//录制画面宽度 （默认480）
            };
            console.log("开始屏幕录制");
            this.webSDKInstance.startRecord(recordOpt);
            return errorCode
        }else{
            console.log("开启虚拟摄像头失败");
            return errorCode
        }

    },
    //虚拟摄像头开启/关闭
    enableInventCamera:function (enable) {
        if(enable){

        }else{

        }
    },
    // 开始接收远程用户视频流
    getVideoStream:function(showViewId,remoteUserId ){
        var streamIndex = 0;

        var errorCode = this.webSDKInstance.getRemoteVideoStream({
            remoteUserId: Number(remoteUserId),//远程用户id
            //对方摄像头编号，该属性置空，则默认打开对方0号视频流
            streamIndex: streamIndex,
            renderId: showViewId//显示视频位置的div层的ID
        });
        if (errorCode == 0) {
            console.log("接收" + remoteUserId + "视频成功");
        } else {
            console.log("接收" + remoteUserId + "视频失败，错误码：" + errorCode);
        }


    },
    // 停止接收远程用户视频流
    cancelVideoStream:function(remoteUserId){
        var streamIndex = 0;
        this.webSDKInstance.cancelRemoteVideoStream({
            remoteUserId:Number(remoteUserId),
            streamIndex:streamIndex
        });
        console.log("停止接收" + remoteUserId + "视频成功");
    },
    // 开始接收远程用户音频
    getAudioStream:function(remoteUserId){
        this.webSDKInstance.getRemoteAudioStream({
            remoteUserId:Number(remoteUserId)
        });
        console.log("接收" + remoteUserId + "音频成功");
    },
    // 停止接收远程用户音频
    cancelAudioStream:function(remoteUserId){
        this.webSDKInstance.cancelRemoteAudioStream({
            remoteUserId:Number(remoteUserId)
        });
        console.log("停止接收" + remoteUserId + "音频成功");
    },
    //打开、关闭桌面共享
    enableScreenShare:function (enable) {
        if(!this.isHost(this.userId)){
            console.log("不具权限")
            return
        }
        //本地摄像头列表
        var cameras =  this.webSDKInstance.getCameras()
        //打开
        if(enable){
            for (var cameraIndex in cameras) {
                //找到虚拟摄像头
                if (cameras[cameraIndex].isInventCamera) {
                    cameras[cameraIndex].config({
                        bitRate: 600000, // 视频编码码率设置（参数为int型，单位bps）
                        gop: 20, // 视频编码关键帧间隔控制（参数为int型）
                        width: 1920, // 设置本地视频采集分辨率(宽度)
                        height: 1080, // 设置本地视频采集分辨率(高度)
                        fps: 5, // 设置本地视频编码的帧率
                        recordBitRate: 700000, //设置录像视频码率
                        preset: 3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                        quality: 3 // 设置本地视频编码的质量
                    });
                    var  streamIndex = cameras[cameraIndex].streamIndex;
                    var errorCode = cameras[cameraIndex].open({
                        streamIndex: streamIndex
                    });
                    if(errorCode == 0){
                        //同步会议状态为正在桌面共享
                        this.detachableServerRequest({'code':'screenshare',
                            'data':{
                                roomId:this.meetingId,
                                userId:this.userId,
                                userName:this.userInfo.nickName,
                                streamId:streamIndex.toString(),
                                status:1,
                            }})
                        console.log("打开桌面共享成功");
                        //广播其他参会人我已打开桌面共享，请其接收
                        var data = {
                            "userId":this.userId,
                            "nickName":this.userInfo.nickName,
                            "streamId":streamIndex.toString(),
                            "isOpen":1,
                            "meetingId":this.meetingId
                        }
                        this.sendMsg({
                            'userId':'-1',
                            'data': {
                                "code": "screenshare",
                                "data": data
                            }
                        })


                    }else{
                        console.log("打开桌面共享失败");
                    }
                }else{
                    console.log("打开桌面共享失败，请开启虚拟摄像头");
                }
            }
        }else{
            //关闭
            for (var index in cameras) {
                //  && cameras[index].isOpen不要这个判断，因为测到有时是false,但是实际是打开的
                if (cameras[index].isInventCamera) {
                    var streamIndex = cameras[index].streamIndex;
                    //同步会议状态为取消桌面共享
                    this.detachableServerRequest({'code':'screenshare',
                        'data':{
                            roomId:this.meetingId,
                            userId:this.userId,
                            userName:this.userInfo.nickName,
                            streamId:streamIndex.toString(),
                            status:0,
                        }})
                    //cameras[index].close();//如果isopen为false会报错,先注释掉，也就是不关闭虚拟摄像头
                    //广播其他参会人我已关闭桌面共享，请其关闭
                    var data = {
                        "userId":this.userId,
                        "nickName":this.userInfo.nickName,
                        "streamId":streamIndex.toString(),
                        "isOpen":0,
                        "meetingId":this.meetingId
                    }
                    this.sendMsg({
                        'userId':'-1',
                        'data': {
                            "code": "screenshare",
                            "data": data
                        }
                    })
                }
            }
        }

    },
    //开启白板共享（只发消息，在白板组件创建一个白板时调用）(暂时不用)
    meetingWhiteBoardShare:function () {
        console.log("开启白板共享");
        //广播其他参会人我已打开白板共享
        // {"msg":{ "code": "cmdMeetingWBCreate","data":{"userId":"123456,"nickName":"xxxx"}}}
        var data = {
            "userId":this.userId,
            "nickName":this.userInfo.nickName,
        }
        this.sendMsg({
            'userId':'-1',
            'data': {
                "code": "cmdMeetingWBCreate",
                "data": data
            }
        })
    },
    //接收远程用户桌面共享
    getScreenStreamWithUserId:function(showViewId,remoteUserId,streamIndex){
        var errorCode = this.webSDKInstance.getRemoteVideoStream({
            remoteUserId: remoteUserId,//远程用户id
            //对方摄像头编号，该属性置空，则默认打开对方0号视频流
            streamIndex: streamIndex,
            renderId: showViewId//显示视频位置的div层的ID
        });
        if (errorCode == 0) {
            console.log("接收" + remoteUserId + "共享桌面流成功");
        } else {
            console.log("接收" + remoteUserId + "共享桌面流失败，错误码：" + errorCode);
        }
    },
    //白名单witeListApp(共享文档)
    shareDocument:function(isopen){

        //打开本地屏幕摄像头(0号流)
        var TURN_ON = 1;
        var TURN_OFF = 0;
        var a = 1;
        BRAC_UserCameraControlEx(-1,TURN_OFF,a,0,"");

        var szWhiteList ={};
        if(!isopen){
            BRAC_SetSDKOption(BRAC_SO_LOCALVIDEO_SCREENHWND, 0);
            setTimeout(function(){
                BRAC_SetSDKOption(BRAC_SO_CORESDK_APPMONITORLIST, "{}");
            },1000)

            //广播其他参会人我已关闭桌面共享，请其关闭
            var streamIndex =1
            var data = {
                "userId":this.userId,
                "nickName":this.userInfo.nickName,
                "streamId":streamIndex.toString(),
                "isOpen":false,
                "meetingId":this.meetingId
            }
            this.sendMsg({
                'userId':'-1',
                'data': {
                    "code": "screenshare",
                    "data": data
                }
            })
        }
        if(isopen){
            BRAC_SetUserStreamInfo(-1, 1, BRAC_SO_LOCALVIDEO_WIDTHCTRL, 9600)
            BRAC_SetUserStreamInfo(-1, 1, BRAC_SO_LOCALVIDEO_HEIGHTCTRL, 7200)
            // 设置本地视频编码的码率（如果码率为0，则表示使用质量优先模式）
            BRAC_SetUserStreamInfo(-1, 1,BRAC_SO_LOCALVIDEO_BITRATECTRL, 500 * 1000)
            BRAC_SetUserStreamInfo(-1, 1, BRAC_SO_LOCALVIDEO_APPLYPARAM, 1)
            setTimeout(function(){
                szWhiteList = {
                    "white_list":["notepad++.exe", "excel.exe", "winword.exe", "qq.exe","notepad.exe","wps.exe"]
                };
                BRAC_SetSDKOption(BRAC_SO_CORESDK_APPMONITORLIST, JSON.stringify(szWhiteList));
            },1000)

            //广播其他参会人我已打开白名单，请其接收
            var streamIndex =1
            var data = {
                "userId":this.userId,
                "nickName":this.userInfo.nickName,
                "streamId":streamIndex.toString(),
                "isOpen":true,
                "meetingId":this.meetingId
            }
            this.sendMsg({
                'userId':'-1',
                'data': {
                    "code": "screenshare",
                    "data": data
                }
            })


        }

        BRAC_UserCameraControlEx(-1,TURN_ON,a,0,"");
    },
    //停止接收远程用户桌面共享
    cancelScreenStreamWithUserId:function(remoteUserId,streamIndex){
        this.webSDKInstance.cancelRemoteVideoStream({
            remoteUserId:remoteUserId,
            streamIndex:streamIndex
        });
        console.log("停止接收" + remoteUserId + "共享桌面流成功");
    },
    //发送消息
    sendMsg:function (data) {
        //消息发送
        var json = {};
        json.userid = Number(data.userId);//-1表示发送给所有人：广播,int
        json.cmd="meetingcmd";
        json.data =data.data;
        console.log("发送广播消息："+JSON.stringify(json));
        BRAC_SDKControl(ANYCHAT_SDKCTRL_BUSINESS,JSON.stringify(json));
        //加入本地日志
        var strLog ="BRAC_SDKControl(" + ANYCHAT_SDKCTRL_BUSINESS +","+ JSON.stringify(json)+")";
        BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
        // this.addAnyChatLog(strLog);
    },
    //添加本地日志
    // addAnyChatLog:function(message) {
    //     BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,message);
    // },

    //注册回调所有回调事件
    registerCallback:function (events) {
        // onAnyChatMeetingEntered:onAnyChatMeetingEntered,
        // onAnyChatMeetingLeave:onAnyChatMeetingLeave,
        // onAnyChatMeetingDestroy:onAnyChatMeetingDestroy,
        // onAnyChatMeetingUserEnter:onAnyChatMeetingUserEnter,
        // onAnyChatMeetingUserLeave:onAnyChatMeetingUserLeave,
        // onAnyChatMeetingHostTransferResult:onAnyChatMeetingHostTransferResult,
        // onAnyChatMeetingUserCameraStatusChanged:onAnyChatMeetingUserCameraStatusChanged,
        // onAnyChatMeetingUserMicrophoneStatusChanged:onAnyChatMeetingUserMicrophoneStatusChanged,
        // onAnyChatMeetingHostControlCamera:onAnyChatMeetingHostControlCamera,
        // onAnyChatMeetingHostControlMicrophone:onAnyChatMeetingHostControlMicrophone,
        // onAnyChatMeetingHostTransfer:onAnyChatMeetingHostTransfer,
        // onAnyChatMeetingMessageReceived:onAnyChatMeetingMessageReceived
        for (var eventName in events){
            (typeof (events[eventName]) === "function") &&
            this.webSDKInstance.setCallBack(eventName,events[eventName], false);
        }
    },
    //触发回调
    triggerCallback:function(errorMsg,errorCode,data,callbackName){
        var result = {
            result:{
                errorMsg:errorMsg,
                errorCode:errorCode
            },
            data:data
        };
        this.webSDKInstance.eventTarget.fireEvent({
            type: callbackName,
            result: result,
        });
    },

    //获取主持人的userId
    getHostId:function () {
        var userListAtMeeting = this.fetchAllMeetingUserCompletion();

        for( var i = 0 ;i< userListAtMeeting.length;i++){
            if(userListAtMeeting[i].hostState == 1){
                return userListAtMeeting[i].userId
            }
        }
        //还没有主持人信息
        return ''
    },
    //获取全部权限者

    //判断是否是主持人
    isHost:function (targetId) {
        var userListAtMeeting = this.fetchAllMeetingUserCompletion();

        for( var i = 0 ;i< userListAtMeeting.length;i++){
            if(userListAtMeeting[i].userId == targetId.toString()){
                if(userListAtMeeting[i].hostState == 1)
                    return true
            }
        }
        return false
    },
    //判断是否有主持权限
    isCanHost:function(targetId){
        var userListAtMeeting = this.fetchAllMeetingUserCompletion();

        for( var i = 0 ;i< userListAtMeeting.length;i++){
            if(userListAtMeeting[i].userId == targetId.toString()){
                if(userListAtMeeting[i].hostState == 1|| userListAtMeeting[i].hostState ==2)
                    return true
            }
        }
        return false
    },

    //获取userid对应的userName
    getNameById:function (targetId) {
        var userList = this.fetchAllMeetingUserCompletion();
        var users = userList.filter(function (user) {
            return user.userId ===targetId;
        })
        if(users.length ==0){
            return ''
        }
        return users[0].nickName
    },
    //获取配置对象特定信息
    getSpecifiedInfor:function (SpecifiedName) {
        var AnyChatMeetingConfig = this.AnyChatMeetingConfig;
        if(AnyChatMeetingConfig.hasOwnProperty(SpecifiedName)){
            return AnyChatMeetingConfig[SpecifiedName]
        }else{
            for (var obj in AnyChatMeetingConfig) {
                if(AnyChatMeetingConfig[obj].hasOwnProperty(SpecifiedName)){
                    return AnyChatMeetingConfig[obj][SpecifiedName]
                }
            }

        }

    },
    //获取本地摄像头列表
    getCameras:function () {
        var cameras =  this.webSDKInstance.getCameras();
        return cameras
    },
    getMicrophones:function () {
        var microphones =  this.webSDKInstance.getMicrophones();
        return microphones
    },
    //时间转换工具//获取yyyyMMddHHmmSS格式的时间
    generateTimeRequestNumber:function () {
        var date = new Date();
        return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
    },
    //会议人数检测器（防止网络波动收不到他们信息）
    checkJoinUsers:function () {
        //5秒检测一次房间实际人数与会议参会人信息列表人数是否一致，
        //不一致则给缺失信息的userid再我已进入会议广播，你赶紧发同步信息消息给我
        var _this = this
        this.checkTimer = setInterval(function () {
            //成员id列表(包含自己)
            var userIdListAtRoom = _this.webSDKInstance.getRoomUsers();
            //会议成员列表
            var userListAtMeeting = _this.fetchAllMeetingUserCompletion();
            var loseUsers = [];
            if(userIdListAtRoom.length != userListAtMeeting.length ){

                //找出缺失的userId
                loseUsers = userIdListAtRoom.filter(function (userId) {
                    //该userid在userListAtMeeting中找不到则为缺失的id
                    var userIdAtMeeting = userListAtMeeting.filter(function (user) {
                        return user.userId == userId;
                    })
                    return userIdAtMeeting.length == 0

                })
                //给缺失的逐个询问
                for( var i = 0 ;i< loseUsers.length;i++){
                    //询问用户信息
                    var userInfo = _this.userInfo;
                    var sendUserInfo = {
                        "fromUserId": userInfo.userId,
                        "toUserId": loseUsers[i].toString(),
                        "meetingId": _this.meetingId
                    }
                    _this.sendMsg({
                        'userId':loseUsers[i],
                        'data': {
                            "code": "askuserinfosync",
                            "data": sendUserInfo
                        }
                    })
                }
            }
            else{
                // clearInterval(_this.checkTimer)
            }


        },5000)
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
                cmd:'meetingcmd',
                code:json.code,
                data:json.data,

            },
        }
        var errorcode = this.detachableServerInstance.sendData(serverData);
        console.log(errorcode)
    },
    //插拔式消息处理
    detachableServerGetData:function (json) {
        console.log("meeting插拔式消息处理 detachableServerGetData");

        if(json.type == 'connect'){
            if(json.hasOwnProperty('errorcode') && json.errorcode != 0){
                //连接插拔式服务失败（实际是断开了插拔式服务,serverConnectStatus为false代表是初始化时断开，故初始化失败）
                console.log("视频会议插拔式服务初始化失败，错误码："+ json.errorcode);
                //触发进入会议回调
                this.triggerCallback('初始化插拔式服务失败',json.errorcode,[],'onAnyChatMeetingEntered')
            }
            else{
                //连接插拔式服务成功
                // this.detachableServerinitFlag = true;
                //请求插拔式服务，获取当前会议状态
                this.detachableServerRequest({'code':'getMeetinginfo',
                    'data':{
                        roomId:this.meetingId
                    }
                })
                //阀门
                this.flagManager[json.type] = 1;
            }
        }
        else if(json.code == 'getMeetinginfo'){
            //请求会议状态成功，
            //阀门
            this.flagManager[json.code] = 1;
            this.serverData = json.content;
            if(this.serverData.microphoneStatus ==0 && !this.userInfo.hostState){
                //不是主持人或管理员则改变为禁止
                this.userInfo.microphoneState = 0
            }
            if(this.serverData.cameraStatus ==0 && !this.userInfo.hostState){
                this.userInfo.cameraState  = 0
            }

        }else if(json.code == 'mediacontrol'){
            // this.flagManager[json.code] = 1;
        }
        // console.log(this.flagManager)


    }
    //回调事件，写在meetingEvent.js中，供客户使用的回调接口
    //进入会议回调
    // onAnyChatMeetingEntered:function(){
    //
    // },
    //离开会议回调（接口文档没有）
    // onAnyChatMeetingLeave:function(){
    //
    // },
    // 会议结束回调
    // onAnyChatMeetingDestroy:function(){
    //
    // },
    // 主持人转让结果回调
    // onAnyChatMeetingHostTransferResult:function(){
    //
    // },
    // 用户进入会议回调
    // onAnyChatMeetingUserEnter:function(){
    //
    // },
    // 用户离开会议回调
    // onAnyChatMeetingUserLeave:function(){
    //
    // },
    // 参会者摄像头状态改变回调
    // onAnyChatMeetingUserCameraStatusChanged:function(){
    //
    // },
    // 参会者麦克风状态改变回调
    // onAnyChatMeetingUserMicrophoneStatusChanged:function(){
    //
    // },
    // 主持人操作参会者摄像头回调
    // onAnyChatMeetingHostControlCamera:function(){
    //
    // },
    // 主持人操作参会者麦克风回调（禁言）
    // onAnyChatMeetingHostControlMicrophone:function(){
    //
    // },
    // 主持人转让消息回调
    // onAnyChatMeetingHostTransfer:function(){
    //
    // },
    // 接收到消息回调
    // onAnyChatMeetingMessageReceived:function(){
    //
    // },
}

//配置类
var AnyChatMeetingConfig =function (AnyChatMeetingUserInfo,AnyChatMeetingInfo,AnyChatRecordOpt,container) {
    this.AnyChatMeetingUserInfo = AnyChatMeetingUserInfo;
    this.AnyChatMeetingInfo = AnyChatMeetingInfo;
    this.AnyChatRecordOpt = AnyChatRecordOpt;
    this.AnyChatRecordOpt = AnyChatRecordOpt;
    this.container = container;
}
//参会人信息类 起参照作用
var AnyChatMeetingUserInfo =function (userId,userName,isHost,isOpenCamera,isOpenMicrophone) {
    this.userId = userId;
    this.nickName = userName;
    this.hostState = isHost;
    this.cameraState = isOpenCamera;
    this.microphoneState = isOpenMicrophone;
}
//视频会议信息类 起参照作用
var AnyChatMeetingInfo =function (meetingId,meetingTitle,startTime,endTime) {
    this.meetingId = meetingId;
    this.meetingTitle = meetingTitle;
    this.startTime = startTime;
    this.endTime = endTime;
}
//视频录制参数类AnyChatRecordOpt

//回调事件

//进入房间结果通知（为防止影响已有的onAnyChatEnterRoom事件，名字另起为onAnyChatEnterRoomForMeeting）
function onAnyChatEnterRoomForMeeting(result, data) {
    var currentInstance = (new AnyChatMeetingManager()).getCurrentInstance()
    if (result.code == 0) {
        console.log("进入房间成功，房间id" + data.roomId);

        //成员id列表(包含自己)
        var userIdList = currentInstance.webSDKInstance.getRoomUsers();
        var meetingType = currentInstance.meetingType;
        //是视频会议，且超过16个则自动退出，并放回对应消息
        if(meetingType && userIdList.length >16){
            //自动退出房间
            currentInstance.webSDKInstance.leaveRoom();
            //触发进入会议回调
            currentInstance.triggerCallback("进入会议失败，参会人数已超限 ",'1',[],'onAnyChatMeetingEntered')
            return
        }
        //进入房间广播个人信息
        var userInfo = currentInstance.userInfo;
        var sendData = {
            "userId":userInfo.userId,
            "nickName": userInfo.nickName,
            "hostState": userInfo.hostState,
            "cameraState": userInfo.cameraState,
            "microphoneState": userInfo.microphoneState,
            "meetingId":currentInstance.meetingId
        }
        currentInstance.sendMsg({
            'userId':'-1',
            'data': {
                "code": "entermeeting",
                "data": sendData
            }
        })
        //更新用户设备状态列表
        currentInstance.userCompletion.push(userInfo)
        //触发进入会议回调
        currentInstance.triggerCallback(result.msg,result.code,sendData,'onAnyChatMeetingEntered');
        //房间人数检测机制
        currentInstance.checkJoinUsers()

        //如果是禁止状态，需要触发被控制回调
        if(currentInstance.serverData.microphoneStatus ==0){
            //触发麦克风被控制回调
            var triggerDate = {
                'state':0,
                'fromUserId':currentInstance.serverData.microphoneOperatorId,
                'fromUserName':currentInstance.serverData.microphoneOperatorName,
                'isControlAll':1,//是否是全体操作
                'meetingId':currentInstance.meetingId
            }
            currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlMicrophone')
        }
        if(currentInstance.serverData.cameraStatus ==0){
            //触发摄像头被控制回调
            var triggerDate = {
                'state':0,
                'fromUserId':currentInstance.serverData.cameraOperatorId,
                'fromUserName':currentInstance.serverData.cameraOperatorName,
                'isControlAll':1,//是否是全体操作
                'meetingId':currentInstance.meetingId
            }
            currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlCamera')
        }

        //如果是共享屏幕状态，触发共享屏幕回调
        if(currentInstance.serverData.mode == 2){
            var data = {
                "userId":currentInstance.serverData.screenShareUserId,
                "nickName":currentInstance.serverData.screenShareUserName,
                "streamId":currentInstance.serverData.screenStreamId,
                "isOpen":1,
                "meetingId":currentInstance.meetingId
            }
            currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingScreenShare')
        }


    }
    else {
        console.log("进入房间失败，错误码：" + result.code);
        //触发进入会议回调
        currentInstance.triggerCallback(result.msg,result.code,[],'onAnyChatMeetingEntered')
    }
}

//其他用户进出 房间事件
function onAnyChatUserAtRoomForMeeting(data){
    console.log("onAnyChatUserAtRoomForMeeting: ");
    console.log(data);
    var targetID = data.userId.toString();
    var currentInstance = (new AnyChatMeetingManager()).getCurrentInstance()
    if (data.action == 1) {
        console.log(targetID+"进入房间 ");
        //进入action: 1
        // roomId: 75
        // userId: -1301
        // RequestVideoByUserId(data.userId);
        //收到对方进入的消息后同步自己的信息给他
        var userInfo = currentInstance.userInfo;
        var sendData = {
            "userId": userInfo.userId,
            "nickName": userInfo.nickName,
            "hostState": userInfo.hostState,
            "cameraState": userInfo.cameraState,
            "microphoneState":userInfo.microphoneState,
            "meetingId": currentInstance.meetingId
        }
        currentInstance.sendMsg({
            'userId':targetID,
            'data': {
                "code": "answeruserinfosync",
                "data": sendData
            }
        })
    } else {
        console.log(targetID+"离开房间 ");
        var targetUserInfo = meetingInstance.getUserByUserId(targetID);
        if(!targetUserInfo){
            //此时该用户只是进入房间退出房间，尚未进入会议，故不触发其离开会议回调
            return
        }
        var triggerData = {
            "userId": targetUserInfo.userId,
            "nickName": targetUserInfo.nickName,
            "hostState": targetUserInfo.hostState,
            "cameraState": targetUserInfo.cameraState,
            "microphoneState":targetUserInfo.microphoneState,
            "meetingId": currentInstance.meetingId
        }
        //更新用户设备状态列表 移除对应userId的userInfo
        var newUserCompletion = meetingInstance.userCompletion.filter(
            function(currentItem){
                return  currentItem.userId != targetID
            })
        // console.log(newUserCompletion);
        currentInstance.userCompletion = newUserCompletion;
        //触发用户离开房间回调
        currentInstance.triggerCallback('成功',0,triggerData,'onAnyChatMeetingUserLeave')
    }
}

//会议消息回调
function OnAnyChatMeetingBusiness(lpEventJsonStr) {
    var currentInstance = (new AnyChatMeetingManager()).getCurrentInstance()
    console.log("OnAnyChatMeetingBusiness接收广播消息："+lpEventJsonStr);
    //加入本地日志
    var strLog ="OnAnyChatMeetingBusiness(" + lpEventJsonStr + ")" ;
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    if(typeof JSON.parse(lpEventJsonStr) == 'object'){
        var res = JSON.parse(lpEventJsonStr);
        var data = res.data.data;
        //后面的逻辑最终会用一个处理消息的函数包装，并放入组件sdk中
        if(res.userid == -1 && res.cmd === "meetingcmd"){
            //会议结束通知处理
            if(res.data.code ==="destroymeeting"){
                // var errorCode = currentInstance.leaveMeeting();
                // if(errorCode ==0){
                //     //触发会议结束回调
                //     currentInstance.triggerCallback('成功',errorCode,data,'onAnyChatMeetingDestroy')
                // }else {
                //     console.log("结束会议失败，错误码："+errorCode)
                // }

                //取消会议人数检测定时器
                if(currentInstance.checkTimer){
                    clearInterval(currentInstance.checkTimer);
                    currentInstance.checkTimer = null;
                }
                var errorCode = currentInstance.webSDKInstance.leaveRoom();
                if(errorCode ==0){
                    //触发会议结束回调
                    currentInstance.triggerCallback('成功',errorCode,data,'onAnyChatMeetingDestroy');
                    //清空资源
                    currentInstance.cleanMeetingResource()
                }else {
                    console.log("结束会议失败，错误码："+errorCode)
                }
            }
            //进入房间（他人）广播消息处理
            if(res.data.code ==="entermeeting"){
                //去重，防止对方发了多次
                var userList = currentInstance.userCompletion;
                for(var i = 0; i < userList.length; i++){
                    if(userList[i].userId == data.userId){
                        return
                    }
                }
                //如果是主持人，则保持到本地(默认其说的是真的)
                //0:参会者, 1:主持人,2:有权限的参与者
                // if(data.hostState == 1){
                //     currentInstance.hostId = data.userId
                // }
                var userInfoData = {
                    userId:data.userId,
                    nickName:data.nickName,
                    hostState:data.hostState,
                    cameraState:data.cameraState,
                    microphoneState:data.microphoneState,
                }
                //更新用户设备状态列表
                currentInstance.userCompletion.push(userInfoData)
                // //收到对方进入的消息后同步自己的信息给他 ，这一步在onAnyChatUserAtRoomForMeeting里做

                //触发其他人进入会议回调
                currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingUserEnter')
            }
            //主持人转移消息广播
            if(res.data.code ==="cmdHostTransfer"){
                // 更新当前主持人id hostId是int，传的touserId是字符串
                // currentInstance.hostId = data.toUserId;
                //更新用户设备状态列表,并触发对应回调
                for(var index in currentInstance.userCompletion){
                    //找到对应userInfo
                    if (currentInstance.userCompletion[index].userId ===data.toUserId){
                        currentInstance.userCompletion[index].hostState =1
                    }
                }
                //触发主持人转让消息回调（其他参会者收到）
                currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingHostTransfer')
            }
            //音视频变化广播消息处理
            if(res.data.code ==="mediastatechange"){
                //更新用户设备状态列表,并触发对应回调
                for(var index in currentInstance.userCompletion){
                    //找到对应userInfo
                    if (currentInstance.userCompletion[index].userId ===data.userId){
                        if(data.actionType ==1){
                            //摄像头
                            currentInstance.userCompletion[index].cameraState = data.state;
                            //触发参会者摄像头状态改变回调
                            var resultDate = {
                                'userId':data.userId,
                                'state':data.state,
                                'meetingId':data.meetingId
                            }
                            currentInstance.triggerCallback('成功',0,resultDate,'onAnyChatMeetingUserCameraStatusChanged')
                        }else {
                            //麦克风
                            currentInstance.userCompletion[index].microphoneState = data.state;

                            //触发参会者麦克风状态改变回调
                            var resultDate = {
                                'userId':data.userId,
                                'state':data.state,
                                'meetingId':data.meetingId
                            }
                            currentInstance.triggerCallback('成功',0,resultDate,'onAnyChatMeetingUserMicrophoneStatusChanged')
                        }
                        break
                    }
                }
            }
            //操作全体的音/视频消息处理
            if(res.data.code ==='mediacontrol'){
                //主持人和有权限的参与者不能相互禁麦，只能控制普通参会者的音视频
                var triggerDate = {
                    'state':data.state,
                    'fromUserId':data.fromUserId,
                    'fromUserName':data.fromUserName,
                    'isControlAll':1,//是否是全体操作
                    'meetingId':data.meetingId
                }
                if(data.actionType ==1){
                    //摄像头操作,由于需要传view，故触发回调就好，让业务层自己去关闭打开
                    currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlCamera')
                }else {
                    //麦克风操作，让业务层自己去关闭打开
                    currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlMicrophone')
                }

            }

            //会议文字消息处理
            if(res.data.code ==='sendmsg'){
                var triggerDate = {
                    'fromUserId':data.userId,//发言人
                    'nickName':data.nickName,
                    'content':data.content,
                    //消息类型,1文字消息，2图片消息，3视频消息，4音频消息，5其他附件
                    'type':data.type,
                    'sendTime':data.sendTime,//发送时间毫秒
                    "meetingId":data.meetingId
                }
                //触发接收到消息回调onAnyChatMeetingMessageReceived
                currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingMessageReceived')
            }
            //桌面共享消息处理
            if(res.data.code ==='screenshare'){
                //触发桌面共享回调

                currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingScreenShare')
            }
            //共享白板消息处理
            // {"msg":{ "cmd": "cmdMeetingWBCreate","data":{"userId":"123456,"nickName":"xxxx"}}}
            if(res.data.code ==='cmdMeetingWBCreate'){
                //触发白板共享回调
                currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingWhiteBoardShare')
            }
            //参会者身份改变通知
            if(res.data.code ==='permissionstatechange'){
                var currentStatus = data.hostState;
                //找到该参会者的userinfo,更新其hostState
                for(var index in currentInstance.userCompletion){
                    //找到对应userInfo
                    if (currentInstance.userCompletion[index].userId === data.userId){
                        currentInstance.userCompletion[index].hostState = currentStatus;
                    }
                }
                //触发参会者身份改变回调（其他参会者的回调）
                currentInstance.triggerCallback('成功',0,data,'onAnyChatMeetingUserPermissionChanged')
            }
        }
        //单独发给某人
        if(res.userid == currentInstance.userId && res.cmd === "meetingcmd"){
            //接收他人个人信息
            if(res.data.code ==='answeruserinfosync'){
                //去重，防止对方发了多次
                var userList = currentInstance.userCompletion;
                for(var i = 0; i < userList.length; i++){
                    if(userList[i].userId == data.userId){
                        return
                    }
                }
                //更新用户设备状态列表
                var userInfoData = {
                    "userId": data.userId,
                    "nickName": data.nickName,
                    "hostState": data.hostState,
                    "cameraState": data.cameraState,
                    "microphoneState": data.microphoneState,
                }
                meetingInstance.userCompletion.push(userInfoData)
                // if(data.hostState == 1){
                //     currentInstance.hostId = data.userId
                // }
                //触发同步历史成员回调
                meetingInstance.triggerCallback('成功',0,data,'onAnyChatMeetingHistoryUserInfoSync')
            }
            //接收到询问用户信息，返回个人信息
            if(res.data.code ==='askuserinfosync'){
                var targetID = data.fromUserId;
                var userInfo = currentInstance.userInfo;
                var sendUserInfo = {
                    'userId': userInfo.userId,
                    'nickName':userInfo.nickName,
                    'hostState':userInfo.hostState,
                    'cameraState':userInfo.cameraState,
                    'microphoneState':userInfo.microphoneState,
                    'meetingId':currentInstance.meetingId
                    // toUserId:data.userId.toString()
                }

                currentInstance.sendMsg({
                    'userId':targetID,
                    'data': {
                        "code": "answeruserinfosync",
                        "data": sendUserInfo
                    }
                })
            }
            //操作某人音/视频消息处理
            if(res.data.code ==='mediacontrol'){
                var triggerDate = {
                    'state':data.state,
                    'fromUserId':data.fromUserId,
                    'fromUserName':data.fromUserName,
                    'isControlAll':0,//是否是全体操作
                    'meetingId':data.meetingId
                }
                if(data.actionType ==1){
                    //摄像头操作,由于需要传view，故触发回调就好，让业务层自己去关闭打开
                    currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlCamera')
                }else {
                    //麦克风操作，让业务层自己去关闭打开
                    currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostControlMicrophone')
                }
            }
            //权限控制操作通知
            if(res.data.code ==='permissioncontrol'){
                var currentStatus;
                var triggerDate = {};
                if(data.state ==1){
                    //被设置为管理员
                    currentStatus = 2;
                    triggerDate.state = 1;
                }else {
                    //权限收回，被设置为参会者
                    currentStatus = 0;
                    triggerDate.state = 0;
                }
                triggerDate.meetingId = data.meetingId;
                //更新个人信息
                for(var index in currentInstance.userCompletion){
                    //找到对应userInfo
                    if (currentInstance.userCompletion[index].userId === data.userId){
                        currentInstance.userCompletion[index].hostState = currentStatus;
                        currentInstance.userInfo.hostState = currentStatus;
                    }
                }
                //广播自身权限变化
                var sendData = {
                    "hostState":currentStatus ,
                    "userId": data.userId,
                    "nickName":currentInstance.getNameById(data.userId),
                    "meetingId": data.meetingId
                }
                //广播消息
                currentInstance.sendMsg({
                    'userId':'-1',
                    'data': {
                        "code": "permissionstatechange",
                        "data": sendData
                    }
                })
                //触发管理员权限控制回调（被操作者的回调）
                currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingHostPermissionControl')
            }
            //被移出会议通知
            if(res.data.code ==='kickoutuser'){
                var triggerDate = {
                    fromUserId:data.fromUserId,
                    fromUserName:data.fromUserName,
                    meetingId:data.meetingId,
                };
                //取消会议人数检测定时器
                if(currentInstance.checkTimer){
                    clearInterval(currentInstance.checkTimer);
                    currentInstance.checkTimer = null;
                }
                //离开房间
                var errorCode = currentInstance.webSDKInstance.leaveRoom();
                if(errorCode ==0){
                    //触发被移除会议回调（被操作者的回调）
                    currentInstance.triggerCallback('成功',0,triggerDate,'onAnyChatMeetingUserLeaveControl')
                    //清空资源
                    currentInstance.cleanMeetingResource()
                }else {
                    console.log("移出会议失败，错误码："+errorCode)
                }
            }
        }
    }
}
function pad2(n) { return n < 10 ? '0' + n : n }


