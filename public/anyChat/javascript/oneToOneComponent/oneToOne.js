;(function(win, doc, undefined) {
    /*----------------------------------------------------------
     * AnyChatMeetingComponentWithHall
     * 函数说明:AnyChatMeetingComponentWithHall 工厂,用于创建AnyChatMeetingComponentWithHall实例
     *
     * ---------------------------------------------------------
     */
    function AnyChatVideoCallComponent() {
        this.anyChatVideoCallComponentInstance = null;
    }
    AnyChatVideoCallComponent.prototype.getInstance = function(option) {
        this.anyChatVideoCallComponentInstance = new AnyChatVideoCallComponentInstance();
        return this.anyChatVideoCallComponentInstance;
    }
    var AnyChatVideoCallComponent = new AnyChatVideoCallComponent();

    win.AnyChatVideoCallComponent = AnyChatVideoCallComponent;
    /*--------------------------------------------------------
     * AnyChatMeetingComponentWithHallInstance
     * AnyChatMeetingComponentWithHall实例，全局唯一,实例可创建会议大厅及会议主界面
     *
     * -------------------------------------------------------
     */
    function AnyChatVideoCallComponentInstance() {
        this.mTargetUserId = -1;
        this.roomId = "";
        this.roomUserList = []; // 房间内用户列表
        this.microphones = []; //本地麦克风对象列表
        this.speaks = []; //本地扬声器对象列表
        this.cameras = []; //本地摄像头对象列表
        this.blnCheckUnload = false; //刷新页面退出默认值
        this.instance = AnyChatWebSDK.anychatSDKInstance;
        // this.nickName = "";
        this.mTargetName = "";
        this.calltype = "";
        this.timer;
        this.audiorMic = true;
        this.audiorspeak = true;
        this.videocarm = true;
        this.videomic = true;
        this.isReject = false;
        this.isError = false;
        this.isDestroy = false;
        this.activeLeft = true
        this.componentUIInit();
    }
    AnyChatVideoCallComponentInstance.prototype = {
        constructor: AnyChatVideoCallComponent,
        //配置当前用户信息
        setAnyChatCallUserConfig:function(userInfo){
            this.mSelfUserId = userInfo.userId;
            this.nickName = userInfo.nickName;
        },
        // 发起通话呼叫
        requestCall: function(type,userInfo) {
            this.calltype = type;
            this.mTargetUserId = userInfo.userId;
            this.mTargetName = userInfo.targetUserName;
                // this.calltype = type;
            var errorCode = this.requestVideoCall(userInfo.userId,type);

        },
        //结束音视频呼叫:当网络断开或者从视频通话中异常退出时调用该方法结束音视频呼叫操作
        destroyVideoCall:function(){
            if(this.isDestroy){
                return;
            }
            this.isDestroy = true;
            $("#audioWindow").hide();
            $("#videoWindow").hide();
            var errorCode = this.instance.leaveRoom();
            console.log("退出房间" + errorCode);
            if (this.timer) {
                this.timer.stop()
            }
            // var logoutCode1 = anyChatVideoCallComponentInstance.logout();
            // var logoutCode = this.SDKInstance.logout();
            // console.log(logoutCode1, 'logoutCode1')
            // setTimeout(function() {
                    window.parent["iframeId"]();
            // }, 2000)
            console.log("呼叫结束");
            if(this.isReject){
                this.isReject = false;
                return;
            }
            $(".middle").text("通话已结束");
            $("#requestVideo").hide();

            $("#requestAudio").hide();
            $("#getVideoRequest").hide();
            $("#getAudioRequest").hide();
            $(".alert").show();
            console.log(888888);
            $(".alertBtn").unbind().click(function() {
                $(".alert").hide()
                $('#AnyChatVideoCallComponent').parent().hide()
            })
        },
        //发起语音/视频呼叫（内部方法）
        requestVideoCall: function(userId, calltype) {

            // console.log("自己的昵称" + nickName)
            if (calltype == "video") {
                // let Userobj = {
                //     "code": "video",
                //     "data": {
                //         "userId": userId, //发起呼叫人的userid
                //         "nickName": nickName //发起呼叫人的昵称
                //     }
                // }
                // let Userstr = JSON.stringify(Userobj);
                var sendObj = {
                    "type": "video",
                    "videoCallUserInfo": {
                        "userId":this.mSelfUserId,  //发起呼叫人用户id
                        "nickName": this.nickName //发起呼叫人的昵称
                    }
                }
                var errorCode = this.instance.requestVideoCall({
                    userId: userId, //被呼叫方用户ID
                    szUserStr: JSON.stringify(sendObj), //用户自定义参数
                    done: onRequestVideoCallDone
                });

            } else {
                // let Userobj = {
                //     "code": "voice",
                //     "data": {
                //         "userId": userId, //发起呼叫人的userid
                //         "nickName": nickName //发起呼叫人的昵称
                //     }
                // }
                // let Userstr = JSON.stringify(Userobj);
                var sendObj = {
                    "type": "voice",
                    "videoCallUserInfo": {
                        "userId":this.mSelfUserId,  //发起呼叫人用户id
                        "nickName": this.nickName //发起呼叫人的昵称
                    }
                }

                var errorCode = this.instance.requestVideoCall({
                    userId: userId, //被呼叫方用户ID
                    szUserStr: JSON.stringify(sendObj), //用户自定义参数
                    done: onRequestVideoCallDone
                });
            }
            return errorCode;
        },
        //呼叫异常处理
        resolveErrorCode:function(errorCode){
            if (errorCode == 0) {
                if (this.calltype == "video") {
                    // $("#AnyChatVideoCallComponent").css("background-color", "#353535")
                    $("#requestVideo").show();
                    $("#requestVideo .requestText").text("正在等用户【" + this.mTargetName + "】接受邀请")
                    var _this = this;
                    $("#cancelVideoCallBtn").unbind().click(function() {
                        console.log("取消视频请求")
                        // mTargetUserId = list[0];
                        _this.cancelVideoCall(_this.mTargetUserId);
                        // var logoutCode1 = anyChatVideoCallComponentInstance.logout();
                        // var logoutCode = this.SDKInstance.logout();
                        // console.log(logoutCode1, 'logoutCode1')
                        // setTimeout(function() {
                                window.parent["iframeId"]();
                        // }, 2000)
                        $("#requestVideo").hide()
                        $('#AnyChatVideoCallComponent').parent().hide()
                    })
                } else {
                    $("#requestAudio").show();
                    $("#requestAudio .requestText").text("正在等用户【" + this.mTargetName + "】接受邀请");
                    var _this = this;
                    $("#cancelAudioCallBtn").unbind().click(function() {
                        console.log("取消语音请求")
                        // mTargetUserId = list[0];
                        _this.cancelVideoCall(_this.mTargetUserId)
                        $("#requestAudio").hide()
                        $('#AnyChatVideoCallComponent').parent().hide()
                        // $('#AnyChatVideoCallComponentWrap').hide()
                    })
                }

            }
            else{
                this.isError = true;
                if (errorCode == 100101) {
                    $(".middle").text(this.mTargetName + "已取消通话邀请。")
                    $("#requestVideo").hide();
                    $("#requestAudio").hide();
                    $("#getVideoRequest").hide();
                    $("#getAudioRequest").hide()
                }

                else if (errorCode == 100102) {
                    console.log("对不起，您拨打的用户不在线，请稍后再拨")
                    // alert("对不起，您拨打的用户正在通话中，请稍后再拨")
                    // 对不起，您拨打的用户正在通话中，请稍后再拨
                    $(".middle").text("对不起，您拨打的用户不在线，请稍后再拨。");
                }
                else if (errorCode == 100103) {
                    console.log("对不起，您拨打的用户正在通话中，请稍后再拨")
                    // alert("对不起，您拨打的用户正在通话中，请稍后再拨")
                    // 对不起，您拨打的用户正在通话中，请稍后再拨
                    $(".middle").text(this.mTargetName + "正在通话中，请稍后再试。");
                }

                else if (errorCode == 100104) {
                    $(".middle").text(this.mTargetName + "拒绝了您的通话邀请。")
                    $("#requestVideo").hide();
                    $("#requestAudio").hide();
                    $("#getVideoRequest").hide();
                    $("#getAudioRequest").hide();
                    this.isReject = true;
                }
                else if (errorCode == 100105) {
                    $(".middle").text("会话请求超时，请重试。")
                    $("#requestVideo").hide();
                    $("#requestAudio").hide();
                    $("#getVideoRequest").hide();
                    $("#getAudioRequest").hide();
                }
                else if (errorCode == 100106) {
                    $(".middle").text("网络错误，请重试。")
                    $("#requestVideo").hide();
                    $("#requestAudio").hide();
                    $("#getVideoRequest").hide();
                    $("#getAudioRequest").hide()

                }
                else if (errorCode == 100107) {
                    $(".middle").text("呼叫错误，请稍后再试。")
                    $("#requestVideo").hide();
                    $("#requestAudio").hide();
                    $("#getVideoRequest").hide();
                    $("#getAudioRequest").hide();

                }
                $(".alert").show()
                $(".alertBtn").unbind().click(function() {
                    $(".alert").hide()
                    $('#AnyChatVideoCallComponent').parent().hide()
                    // var logoutCode1 = anyChatVideoCallComponentInstance.logout();
                    // var logoutCode = this.SDKInstance.logout();
                    // console.log(logoutCode1, 'logoutCode1')
                    // setTimeout(function() {
                            window.parent["iframeId"]();
                    // }, 2000)
                    // $("#AnyChatVideoCallComponent").css("background-color", "white")
                })

            }

        },
        //进入指定房间
        enterRoomRequest:function (roomId, calltype) {
            if(calltype === void 0){
                calltype = this.calltype;
            }
            console.log(roomId, calltype)
            //进入视频房间
            if (calltype == "video") {
                this.instance.enterRoom({
                    roomId: roomId,
                    done: onAnyChatEnterRoomForVideo
                });

            } else {
                this.instance.enterRoom({
                    roomId: roomId,
                    done: onAnyChatEnterRoomForAudio
                });
            }

            // DisplayLoadingDiv(true);
        },
        //获取房间人数
        getRoomUserNum:function () {
            var list = this.instance.getRoomUsers();
            console.log("房间人数")
            console.log(list);
            return list;
        },
        //取消视频呼叫
        cancelVideoCall:function (userId) {
            this.instance.cancelVideoCall({
                userId: userId,
                // szUserStr: xxx //用户自定义参数
            });
        },
        //接受视频请求
        acceptVideoCall:function (userId) {
            this.instance.acceptVideoCall({
                userId: userId,
                // szUserStr: "video" //用户自定义参数
            });
        },
        //拒绝视频请求
        rejectVideoCall:function (userId) {
            this.instance.rejectVideoCall({
                userId: userId,
                // szUserStr: xxx //用户自定义参数
            });
            $("#getVideoRequest").hide()
            $("#getAudioRequest").hide()
            $('#AnyChatVideoCallComponent').parent().hide()
            // $("#AnyChatVideoCallComponent").css("background-color", "#FFFFFF")
        },
        //打开摄像头
        openCamera:function (index) {
            if (this.cameras[index].isOpen) {
                alert("当前设备已经打开");
                return;
            }
            this.cameras[index].config({
                bitRate: 300000,    // 视频编码码率设置（参数为int型，单位bps）
                gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                width: 640,         // 设置本地视频采集分辨率(宽度)
                height: 480,        // 设置本地视频采集分辨率(高度)
                fps: 15,          // 设置本地视频编码的帧率
                recordBitRate: 700000,   // 设置录像视频码率  （参数为int型，单位bps）
                preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                quality:3  // 设置本地视频编码的质量
            });
            var errorCode = this.cameras[index].open({
                id: "video_left", // 此id是视频div容器的id
                streamIndex: this.cameras[index].streamIndex
            });
            if (errorCode == 0) {
                console.log("打开" + index + "号摄像头成功");
            }
        },
        //关闭摄像头
        closeCamera:function (index) {
            var errorCode = this.cameras[index].close();
            if (errorCode == 0) {
                console.log("关闭" + index + "号摄像头成功");
            }
        },
        //打开麦克风
        openMicrophone:function (index) {
            var errorCode = this.microphones[index].open();
            if (errorCode == 0) {
                console.log("打开" + index + "号音频成功");
            }
        },
        //关闭麦克风
        closeMicrophone:function (index) {
            console.log("关闭麦克风")
            var errorCode = this.microphones[index].close();
            if (errorCode == 0) {
                console.log("关闭" + index + "号音频成功");
            } else {
                console.log("关闭麦克风失败，错误码：" + errorCode);
            }
        },
        //获取本地摄像头
        getLocalCameras:function () {
            return this.instance.getCameras();
        },
        //获取本地麦克风
        getLocalMicrophones:function () {
            return this.instance.getMicrophones(); //返回麦克风对象列表
        },
        //获取本地扬声器
        getLocalSpeaks:function () {
            return this.instance.getSpeaks(); //返回扬声器对象列表
        },
        //接收视频
        getRemoteVideo:function () {
            var streamIndex = 0;
            var errorCode = this.instance.getRemoteVideoStream({
                remoteUserId: this.mTargetUserId,
                streamIndex: streamIndex,
                renderId: "video_right"
            });
            if (errorCode == 0) {
                console.log("接收" + this.mTargetUserId + "视频成功");
            } else {
                console.log("接收" + this.mTargetUserId + "视频失败，错误码：" + errorCode);
            }
        },
        // 接收音频
        getRemoteAudio:function () {
            var errorCode = this.instance.getRemoteAudioStream({
                remoteUserId: this.mTargetUserId
            });
            if (errorCode == 0) {
                console.log("接收"+this.mTargetUserId+"音频流成功");
                // $("#" + targetId + "_MicrophoneTag").attr('src', "./images/microphone_true.png");
            }
        },
        //终止视频
        cancelRemoteVideo:function (targetId) {
            var streamIndex = 0;
            var code = this.instance.cancelRemoteVideoStream({
                remoteUserId: targetId,
                streamIndex: streamIndex
            });
            console.log("终止视频" + code);
        },
        //终止音频
        cancelRemoteAudio:function (targetId) {
            var code = this.instance.cancelRemoteAudioStream({
                remoteUserId: targetId
            });
            console.log("终止音频" + code);
        },
        //挂断音视频
        hangupVideo:function (userId) {
            this.instance.hangupVideoCall({
                userId: userId,
                // szUserStr: xxx //用户自定义参数
            });
            // var logoutCode1 = anyChatVideoCallComponentInstance.logout();
            // var logoutCode = this.SDKInstance.logout();
            // console.log(logoutCode1, 'logoutCode1')
            // setTimeout(function() {
                    window.parent["iframeId"]();
            // }, 2000)
        },
        //打开扬声器
        openAudioPlayBack:function () {
            BRAC_SetSDKOption(240, 0)

        },
        //关闭扬声器
        closeAudioPlayBack:function () {
            BRAC_SetSDKOption(240, 1)
        },
        //获取对方昵称
        getFriendNickName:function (userId) {
            var mTargetName = this.instance.getUserName({
                userId: userId
            });
            console.log("mTargetName" + mTargetName)
            return mTargetName
        },
        //组件界面初始化
        componentUIInit:function (){
            //视频通话操作按钮
            $("#videoCameraOperate").unbind().click(function() {
                // cameras = getLocalCameras();
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                if (_this.videocarm == true) {
                    _this.videocarm = false
                    _this.closeCamera(0)
                    $("#videoCameraOperate").attr('src', "images/oneToOne/cameraClose.png")
                } else {
                    _this.videocarm = true
                    _this.openCamera(0);
                    $("#videoCameraOperate").attr('src', "images/oneToOne/cameraOpen.png")
                }
            })
            $("#videoMicroOperate").unbind().click(function() {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                if (_this.videomic) {
                    _this.videomic = false
                    _this.closeMicrophone(0)
                    $("#videoMicroOperate").attr('src', "images/oneToOne/audioClose.png")
                } else {
                    _this.videomic = true
                    _this.openMicrophone(0)
                    $("#videoMicroOperate").attr('src', "images/oneToOne/audioOpen.png")
                }

            })
            $("#hangupVideo").unbind().click(function() {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                _this.hangupVideo(_this.mTargetUserId);
                $("#videoWindow").hide()
                // _this.timer.stop()
            })
            this.hangupVideoCall = function () {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                if (_this.mTargetUserId) {
                    _this.hangupVideo(_this.mTargetUserId);
                    $("#videoWindow").hide()
                } else {
                    // var logoutCode1 = anyChatVideoCallComponentInstance.instance.logout();
                    // var logoutCode = this.SDKInstance.logout();
                    // console.log(logoutCode1, 'logoutCode')
                    // setTimeout(function() {
                            window.parent["iframeId"]();
                    // }, 2000)
                }
            }

            //语音通话操作按钮
            $("#audioMicroOperate").unbind().click(function() {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                if (_this.audiorMic) {
                    _this.audiorMic = false
                    _this.closeMicrophone(0)
                    $("#audioMicroOperate").attr('src', "images/oneToOne/audioClose.png")
                } else {
                    _this.audiorMic = true
                    _this.openMicrophone(0)
                    $("#audioMicroOperate").attr('src', "images/oneToOne/audioOpen.png")
                }

            })
            $("#audioSpeakOperate").unbind().click(function() {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                if (_this.audiorspeak) {
                    _this.audiorspeak = false
                    _this.closeAudioPlayBack()
                    $("#audioSpeakOperate").attr('src', "images/oneToOne/voiceClose.png")
                } else {
                    _this.audiorspeak = true
                    _this.openAudioPlayBack()
                    $("#audioSpeakOperate").attr('src', "images/oneToOne/voiceOpen.png")
                }
            })
            $("#hangupAudio").unbind().click(function() {
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                _this.hangupVideo(_this.mTargetUserId);

            })
            $("select#videoRateTab").change(function(e){
                var _this = window.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance;
                console.log(e.currentTarget.value, 'eee');
                if (e.currentTarget.value == 0) {
                    _this.cameras[0].config({
                        bitRate: 500000,    // 视频编码码率设置（参数为int型，单位bps）
                        gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                        width: 1280,         // 设置本地视频采集分辨率(宽度)
                        height: 720,        // 设置本地视频采集分辨率(高度)
                        fps: 25,          // 设置本地视频编码的帧率
                        recordBitRate: 400000,   // 设置录像视频码率  （参数为int型，单位bps）
                        preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                        quality:3  // 设置本地视频编码的质量
                    });
                } else if (e.currentTarget.value == 1) {
                    _this.cameras[0].config({
                        bitRate: 300000,    // 视频编码码率设置（参数为int型，单位bps）
                        gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                        width: 640,         // 设置本地视频采集分辨率(宽度)
                        height: 480,        // 设置本地视频采集分辨率(高度)
                        fps: 25,          // 设置本地视频编码的帧率
                        recordBitRate: 400000,   // 设置录像视频码率  （参数为int型，单位bps）
                        preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                        quality:3  // 设置本地视频编码的质量
                    });
                } else if (e.currentTarget.value == 2) {
                    _this.cameras[0].config({
                        bitRate: 200000,    // 视频编码码率设置（参数为int型，单位bps）
                        gop: 30,            // 视频编码关键帧间隔控制（参数为int型）
                        width: 352,         // 设置本地视频采集分辨率(宽度)
                        height: 288,        // 设置本地视频采集分辨率(高度)
                        fps: 25,          // 设置本地视频编码的帧率
                        recordBitRate: 400000,   // 设置录像视频码率  （参数为int型，单位bps）
                        preset:3, //设置视频编码预设参数（值越大，编码质量越高，占用CPU资源也会越高）
                        quality:3  // 设置本地视频编码的质量
                    });
                }
            })
            // $(".busyAlert").hide();
            // $(".rejectAlert").hide();
            $(".alert").hide();
            // $("#room_div").hide();
            $("#getVideoRequest").hide();
            $("#audioWindow").hide();
            $("#requestVideo").hide();
            $("#videoWindow").hide();
            $("#getAudioRequest").hide();
            $("#requestAudio").hide();
            $("#AnyChatVideoCallComponent").show();
        }
    }

}(window, document))
function showNum(num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}
// 自定义计时器构造函数
function timerTool() {
    this.showId = '';
    this.count = 0;//计时单位，s
    this.timeInterval = null;
    // this.addFunction = addFunction;//定时器开始时附带执行的函数
    this.begin = function (showId,addFunction) {
        //addFunction为附加执行事件
        //开始计时
        var count = this.count
        // var showId = this.showId
        // getID(showId).innerText='00:00:00'
        var _this= this
        this.timeInterval = setInterval(function() {
            count++;
            if(addFunction){
                //执行附带事件
                addFunction()
            }
            if(showId){
                _this.showId = showId;
                //传showId即要构建计时器
                // 需要改变页面上时分秒的值
                var time = showNum(parseInt(count / 60 / 60))+':'+showNum(parseInt(count / 60) % 60)+':'+showNum(count % 60)
                $('#'+showId).html(time);
            }

        }, 1000)
    }
    this.stop = function () {
        clearInterval(this.timeInterval)
        if(this.showId){
            //停止时置为00:00:00
            $('#'+this.showId).html('00:00:00')
        }
    }
}





