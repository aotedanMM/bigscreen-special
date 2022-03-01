// AnyChat for Web MeetingSDK

/********************************************
 *				事件回调部分				*
 *******************************************/
// 初始化配置--连接断开事件 sdk的回调事件
function onDisConnect(result) {
    isUseMeetingFlag = false;
    if (result.code == 0) {
        console.log("退出成功！");
    } else {
        initSystem();

        ShowHallDiv(true);
        // ShowLoginDiv(true);
        console.log("出错，错误码：" + result.code);
        if(result.code == 1010000){
            //插件没有安装，跳出下载页面
            $.messager.alert("提示","服务器连接失败，插件尚未安装，请点击确定前往安装。",function () {
                document.getElementById('prompt_div').style.display = 'block';
            });

        }
        if(result.code == 117){
            //应用过期
            $.messager.alert("提示","您的应用已过期，请联系AnyChat进行续费。",function () {

            });

        }
        else{
            $.messager.alert("提示","网络连接异常("+ result.code +')');
        }

        // initRoomWhiteBoard();
    }
}

// 初始化配置--登录事件
function onLogin(data) {
    console.log('登录成功回调:onLogin');
    console.log("登录成功！用户Id为：" + data.userId);

    //这两句句后续应该提供方法包装
    defaultUserId = data.userId.toString();

    if(isUseMeetingFlag){
        componentOption.userInfo.userId = data.userId.toString();
        componentOption.webSDKInstance = instance;
        //显示等待界面
        DisplayLoadingDiv(true,'正在进入会议...');
        //调用视频会议组件
        anyChatMeetingComponentInstance.startMeetingWithMeetingInfo(componentOption);
    }

}
//---组件
//启动会议结果回调
function onAnyChatMeetingStartResult(result) {
    console.log('启动会议结果回调:onAnyChatMeetingEntered');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {

    }
}
//会议结束回调
function onAnyChatMeetingComponentDestroy(result) {
    console.log('会议结束回调:onAnyChatMeetingEntered');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {

    }
}
//----sdk
//自己进入会议结果回调
function onAnyChatMeetingEntered(result) {
    console.log('自己进入会议结果回调:onAnyChatMeetingEntered');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        console.log("进入会议成功，会议id" +data.meetingId);
        //关闭等待界面
        DisplayLoadingDiv(false);
        //打开扬声器
        meetingInstance.openAudioPlayBack();
        // myNickName = data.nickName;
        mSelfUserId = data.userId;
        var hostName = meetingInstance.getSpecifiedInfor('meetingHost');
        var meetingId = meetingInstance.getSpecifiedInfor('meetingId');
        var meetingName = meetingInstance.getSpecifiedInfor('meetingTitle');
        initTopUI(meetingName,hostName,meetingId);
        showComponentUI(true);
        var cameraState = data.cameraState;//1 2禁止（不能再打开） 0关闭
        var microphoneState =data.microphoneState;
        //初始化视频区域(一人)
        initVideoScreen(mSelfUserId,cameraState,microphoneState,data.nickName);
        //更新参会者列表
        meetingUserListControl(mSelfUserId,data.nickName,cameraState,microphoneState,data.hostState,1)
        var  $carmarIcon = $('#icon_carmar');
        var  $microphoneIcon = $('#icon_audio');
        //操作按钮：页脚麦克风和摄像头图标初始化

        if(cameraState == 1){
            // getID('icon_carmar') && (getID('icon_carmar').className = '');
            $carmarIcon.removeClass();
        }else if(cameraState == 2){
            // getID('icon_carmar').id = 'icon_carmar2';
            $carmarIcon.removeClass().addClass('icon_carmar2');
            //禁止状态
            noVideoFlag = true;
        }else{
            //关闭
            // getID('icon_carmar') && (getID('icon_carmar').className = 'active');
            $carmarIcon.removeClass().addClass('active');
        }

        if(microphoneState == 1){
            // getID('icon_audio') && (getID('icon_audio').className = 'active')
            $microphoneIcon.removeClass().addClass('active')
        }else if(microphoneState == 2){
            // getID('icon_carmar').id = 'icon_audio2';
            $microphoneIcon.removeClass().addClass('icon_audio2');
            //禁止状态
            noAudioFlag = true;
            $('#allNoVoice').removeClass().addClass('allNoVoice1');
            $('#allNoVoice').val('解除静音')
        }else{
            //关闭
            // getID('icon_audio') && (getID('icon_audio').className = '')
            $microphoneIcon.removeClass();
        }
        //白板消息面板改变
        if(data.hostState == 1){
            changeWhiteBoardMessageBoard(data.userId,1);
        }

        //应该加检测可用的判断
        var VideoCaptures = BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE);
        var AudioCapture=BRAC_EnumDevices(BRAC_DEVICE_AUDIOCAPTURE);
        if(!AudioCapture.length){
            hideMessager();
            $.messager.alert("提示","设备缺失，请检查麦克风是否正常安装");
            //关闭
            // getID('icon_audio') && (getID('icon_audio').className = '')
            $microphoneIcon.removeClass();
        }
        if(!VideoCaptures.length){
            hideMessager();
            $.messager.alert("提示","设备缺失，请检查摄像头是否正常安装");
            //关闭
            // getID('icon_carmar') && (getID('icon_carmar').className = 'active');
            $carmarIcon.removeClass().addClass('active');
        }

        // meetingInstance.fetchAllMeetingUserCompletion();
        //白板插件初始化
        var canvasDiv = $('#room_canvas')[0];
        var canvasOpt = {
            container:canvasDiv,
            roomId:data.meetingId.toString(),
            appId:mDefaultAppID.toString(),
            nickName:data.nickName,
            sizeMode:3,//画板尺寸模式16:9
            whiteBoardMode:1,//观看模式，主持人才是0，setWhiteBoardMode
            isHideInfoTo:0,//顶部和右下角附加信息不显示
            warterMark:data.nickName,
            // onDrawing:onDrawing,//这个回调应该写到sdk去
            onWhiteboardOpen:onWhiteboardOpen,
            onWhiteboardClose:onWhiteboardClose,
            onWhiteboardCreate:onWhiteboardCreate,
            onWhiteboardPageCreate:onWhiteboardPageCreate,
            onWhiteboardDelete:onWhiteboardDelete,
            onWhiteBoardSwitch:onWhiteBoardSwitch,
            onWhiteBoardPageSwitch:onWhiteBoardPageSwitch,
            onWhiteBoardUpdate:onWhiteBoardUpdate,
            onAnyChatWhiteBoardHistoryDataReceive:onAnyChatWhiteBoardHistoryDataReceive
        }
        // mycanvas = instance.initWhiteBoard(canvasOpt);
        //白板添加插拔式服务
        // meetingInstance.detachableServerInstance = serverInstance
        //调用白板插拔式服务获取当前会议历史白板数据 先显示正在同步
        // DisplayLoadingDiv(true,'正在同步历史数据...');//先不显示，后台直接处理
        // //请求白板全量数据
        // mycanvas.syncAllWhiteBoardDataFromServer()


        if(data.mode == 2){
            //如果当前正在共享屏幕
            $('#remoteShareScreenBox').css('display' , 'block');
            $.messager.popup(data.screenShareUserName+'正在共享屏幕',3000);
            isOtherShareScreening = true;
            shareScreenStreamId = Number(data.screenStreamId);
            meetingInstance.getScreenStreamWithUserId("remoteShareScreenBox",Number(data.screenShareUserId),Number(data.screenStreamId))
        }
        if (autoCreate) {
            propData.roomId = data.meetingId.toString()
            largeScreenSendMsg()
        }
    } else {
        console.log("进入会议失败，错误码：" + result.result.errorCode);
        //关闭等待界面
        DisplayLoadingDiv(false);
        if(result.result.errorCode == 20){
            //20错误：不是最新插件
            $.messager.alert("提示","进入会议失败，当前插件版本不支持使用该功能，请安装最新版本插件。点击确定前往安装。",function () {
                document.getElementById('prompt_div').style.display = 'block';
            });
        }else{
            //其他错误
            $.messager.popup('进入会议失败，错误码：'+result.result.errorCode);
        }


    }
    autoCreate = false
}
//同步历史成员回调
function onAnyChatMeetingHistoryUserInfoSync(result){
    console.log('同步历史成员回调:onAnyChatMeetingHistoryUserInfoSync');
    console.log(result)
    var data = result.data
    if (result.result.errorCode == 0) {
        //添加视频块
        addVideoArea(data.userId,data.nickName)
        //更新参会者列表
        meetingUserListControl(data.userId,data.nickName,data.cameraState,data.microphoneState,data.hostState,1)
        //消息提示
        var content = data.nickName+'进入会议'
        var timeStr = meetingInstance.generateTimeRequestNumber();
        showMessage(content,'','系统消息',timeStr,'sys')
        // //判断之前是否有主持人，有则需要向主持人请求白板数据防止已经有创建过白板
        // if(!isHost(mSelfUserId) && isHost(data.userId)){
        //     mycanvas.syncAllWhiteBoardData(Number(data.userId))
        // }
        //白板消息面板改变
        if(data.hostState == 1){
            changeWhiteBoardMessageBoard(data.userId,1);
        }

    }

}
//其他用户进入会议回调
function onAnyChatMeetingUserEnter(result) {
    console.log('其他用户进入会议回调:onAnyChatMeetingUserEnter');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        //添加视频块
        addVideoArea(data.userId,data.nickName)
        //更新参会者列表
        meetingUserListControl(data.userId,data.nickName,data.cameraState,data.microphoneState,data.hostState,1)
        //消息提示
        var content = data.nickName+'进入会议'
        var timeStr = meetingInstance.generateTimeRequestNumber();
        showMessage(content,'','系统消息',timeStr,'sys');
        //白板消息面板改变
        if(data.hostState == 1){
            changeWhiteBoardMessageBoard(data.userId,1);
        }
    }
}
//离开会议结果回调
function onAnyChatMeetingLeave(result) {
    console.log('离开会议结果回调:onAnyChatMeetingLeave');
    console.log(result)
    if (result.result.errorCode == 0) {
        console.log("离开会议成功，会议id" +result.data.meetingId);
        //关闭白板(关闭白板时会清空白板数据和断开插拔式服务)
        if(mycanvas){
            mycanvas.closeWhiteBoard()
        }
        // 隐藏组件
        showComponentUI(false)
        //显示大厅层
        ShowHallDiv(true);
        //刷新表格
        // $('#hall_table').bootstrapTable('refresh');
        // meetingInstance.fetchAllMeetingUserCompletion();
        isUseMeetingFlag = false;
    } else {
        console.log("离开会议失败，错误码：" + result.result.errorCode);
    }
}
//结束会议结果回调
function onAnyChatMeetingDestroy(result) {
    console.log('结束会议结果回调:onAnyChatMeetingDestroy');
    console.log(result)

    if(result.result.errorCode ==0){
        if(result.data.userId == mSelfUserId){
            //自己发起的结束
            //更新会议状态为已结束 确认结束后
            // requestMeetingUpdate(result.data.meetingId,myPhone,{status:0})
            var data = {
                id:result.data.meetingId,
                currentHostId:myPhone,
                status:0
            }
            requestMeetingUpdate(result.data.meetingId,myPhone,{ status:0},function () {
                    // $.messager.popup('结束会议成功')
                    // $.messager.alert('结束会议成功');
                    // 隐藏组件
                    showComponentUI(false);
                    // hideMessager();
                    window.parent["iframeId"]() // 关闭弹窗
                    // $.messager.alert("提示",'结束会议成功');
                    
                    //显示大厅层
                    // ShowHallDiv(true);
                }
                // ,function (reason) {
                //     $.messager.popup("结束会议请求失败,"+reason,3000)
                // }
            )
        }else {
            //他人收到的回调
            showComponentUI(false);
            hideMessager();
            $.messager.alert("提示",result.data.nickName+'已结束会议');
            //显示大厅层
            ShowHallDiv(true);
        }
        //关闭白板(关闭白板时会清空白板数据和断开插拔式服务)
        if(mycanvas){
            mycanvas.closeWhiteBoard()
        }
        isUseMeetingFlag = false;
    }else {
        console.log("结束会议失败，错误码：" + result.result.errorMsg);
    }




}


//其他用户离开会议回调
function onAnyChatMeetingUserLeave(result) {
    console.log('其他用户离开会议回调:onAnyChatMeetingUserLeave')
    console.log(result)
    var data = result.data;
    if (result.result.errorCode == 0) {
        //移除视频块
        removeVideoArea(data.userId)
        //移除参会人列表项
        //移除对应参会者者列表项
        meetingUserListControl(data.userId,'','','','',0)
        //消息提示
        var content = data.nickName+'已离开会议'
        var timeStr = meetingInstance.generateTimeRequestNumber();
        showMessage(content,'','系统消息',timeStr,'sys')
        //离开者是主持人
        if(data.hostState == 1){
            //白板消息面板改变
            changeWhiteBoardMessageBoard(data.userId,0);
            //如果主持人未关闭屏幕共享，则自动停止接收
            if(isOtherShareScreening){
                // $('#remoteShareScreenBox').css('display' , 'none');
                $('#remoteShareScreenBox2').css("visibility","hidden");
                //如果当前不在白板界面（即在主界面）
                var status = $("#whiteBoardSite").css('visibility');
                if(status !== 'visible'){
                    $("#videoSite").css("visibility","visible");
                }
                // $.messager.popup(data.nickName+'关闭屏幕共享');
                meetingInstance.cancelScreenStreamWithUserId(Number(data.userId),shareScreenStreamId)
            }
        }
    }
}
//被移出会议回调(被移出的人自己收到)
function onAnyChatMeetingUserLeaveControl(result) {
    console.log('被移出会议回调:onAnyChatMeetingUserLeaveControl');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        var fromName = data.fromUserName;
        showComponentUI(false);
        hideMessager();
        $.messager.alert("提示",'你已被'+fromName+'踢出会议');
        //显示大厅层
        ShowHallDiv(true);
        //关闭白板(关闭白板时会清空白板数据和断开插拔式服务)
        if(mycanvas){
            mycanvas.closeWhiteBoard()
        }

        //你确定要将xxxx踢出会议吗？

    }
}
//管理员权限控制回调（被操作者的回调）
function onAnyChatMeetingHostPermissionControl(result) {
    console.log('管理员权限控制回调:onAnyChatMeetingHostPermissionControl');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        if(data.state == 1){
            // showTip('主持人已将你设置为管理员');
            // $.messager.popup('主持人已将你设置为管理员',3000)
            setUserPermissionChangeUi(mSelfUserId,true)
        }else{
            // showTip('主持人已撤销你的管理员权限');
            // $.messager.popup('主持人已撤销你的管理员权限',3000)
            setUserPermissionChangeUi(mSelfUserId,false)
        }
    }
}
//参会者身份改变回调（其他参会者的回调）
function onAnyChatMeetingUserPermissionChanged(result) {
    console.log('参会者身份改变回调:onAnyChatMeetingUserPermissionChanged');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        if(data.hostState == 2){
            // showTip(data.nickName+'已成为管理员');
            // $.messager.popup(data.nickName+'已成为管理员',3000)
            setUserPermissionChangeUi(data.userId,true)
        }else {
            // showTip(data.nickName+'管理员权限已被主持人撤销');
            // $.messager.popup(data.nickName+'管理员权限已被主持人撤销',3000)
            setUserPermissionChangeUi(data.userId,false)
        }

    }
}
// 参会者摄像头状态改变回调
function onAnyChatMeetingUserCameraStatusChanged(result) {
    console.log('参会者摄像头状态改变回调:onAnyChatMeetingUserCameraStatusChanged')
    console.log(result)
    var data = result.data;
    if (result.result.errorCode == 0) {
        //摄像头图标改变
        changeCameraIcon(data.userId,data.state)
        //接收他的视频（他一进来就一直请求音视频了，不需要再请求）
        // if(data.isOpen){
        //     meetingInstance.getVideoStream(data.userId+'videoSite',userId);
        // }

    }
}
// 参会者麦克风状态改变回调
function onAnyChatMeetingUserMicrophoneStatusChanged(result) {
    console.log('参会者麦克风状态改变回调:onAnyChatMeetingUserMicrophoneStatusChanged')
    console.log(result)
    var data = result.data;
    if (result.result.errorCode == 0) {
        //麦克风图标改变
        changeMicrophoneIcon(data.userId,data.state)
        if(data.state ==0 || data.state ==2){
            //防止关闭麦克风时我的发言图标刚好显示
            $('#'+data.userId+'videoArea .icon_speak').css("visibility","hidden");
        }
        //接受他的音频
        // if(data.isOpen){
        //     meetingInstance.getAudioStream(data.userId);
        // }

    }

}
// 参会者摄像头被控制回调
function onAnyChatMeetingHostControlCamera(result) {
    console.log('参会者摄像头被控制回调:onAnyChatMeetingHostControlCamera')
    console.log(result)
    //本地时间 yyyyMMddHHmmSS格式的时间
    var timeStr = meetingInstance.generateTimeRequestNumber();
    var content ='';
    var data = result.data;
    if (result.result.errorCode == 0) {

        var fromUserName = data.fromUserName;
        if(data.state ==1){
            //取消禁止状态
            noVideoFlag = false;
            //打开摄像头请求
            if(isCanHost(mSelfUserId)){
                console.log('同等权限，忽略该请求')
                return
            }
            // showTip(fromUserName+'请求你打开摄像头,是否打开摄像头？','confirm',function () {
            //     operateCamera();
            // },'','打开','保持关闭')
            // if($('.dialog.modal.fade.in  .modal-footer .btn+.btn').text() !== '保持关闭'){
            //
            // }
            hideMessager();
            $.messager.confirm('提示',fromUserName+'请求你打开摄像头,是否打开摄像头？',function () {
                operateCamera();
            },'',{ok:'打开',cancel:'保持关闭'})


        }else {

            //关闭摄像头
            //icon_carmar1代表开启
            //打开摄像头请求
            if(isCanHost(mSelfUserId)){
                //禁止状态
                noVideoFlag = true;
                console.log('同等权限，忽略该请求')
                return
            }
            operateCamera();
            // showTip('你的摄像头已经被'+fromUserName+'禁止')
            // $.messager.popup('你的摄像头已经被'+fromUserName+'禁止',3000)
            //消息提示
            content = '你的摄像头已经被'+fromUserName+'禁止';
            showMessage(content,'','系统消息',timeStr,'sys');
            //禁止状态
            noVideoFlag = true;
        }
    }
}
// 参会者麦克风被控制回调（禁言）
function onAnyChatMeetingHostControlMicrophone(result) {
    console.log('参会者麦克风被控制回调:onAnyChatMeetingHostControlMicrophone')
    console.log(result)
    var data = result.data;

    if (result.result.errorCode == 0) {
        var fromUserName = data.fromUserName;
        //有active的是打开,1
        var currentStatus = ($('#icon_audio').attr('class') === 'active');
        //本地时间 yyyyMMddHHmmSS格式的时间
        var timeStr = meetingInstance.generateTimeRequestNumber();
        var content ='';
        if(data.state ==1){
            //取消禁止状态（解除禁止再打开）
            noAudioFlag = false;
            if(data.isControlAll){
                $('#allNoVoice').attr('class','allNoVoice0');
                $('#allNoVoice').val('全体静音');
            }
            if(isCanHost(mSelfUserId)){
                console.log('同等权限，忽略该请求')
                return
            }
            //打开麦克风
            //关闭状态下请求打开
            if(!currentStatus){
                // showTip(fromUserName+'请求你打开麦克风,是否打开麦克风？','confirm',function () {
                //     operateMicrophone()
                // },'','打开','保持静音')
                // if($('.dialog.modal.fade.in  .modal-footer .btn+.btn').text() !== '保持静音'){
                //
                // }
                hideMessager();
                $.messager.confirm('提示',fromUserName+'请求你打开麦克风,是否打开麦克风？',function () {
                    operateMicrophone()
                },'',{ok:'打开',cancel:'保持静音'})




            }


        }else {
            //关闭麦克风

            if(data.isControlAll){
                $('#allNoVoice').attr('class','allNoVoice1');
                $('#allNoVoice').val('解除静音');
            }
            if(isCanHost(mSelfUserId)){
                //禁止状态(关闭完再禁止)
                noAudioFlag = true;
                console.log('同等权限，忽略该请求')
                return
            }
            if(currentStatus){
                operateMicrophone()
                // showTip('你的麦克风已经被'+fromUserName+'禁止')
                // $.messager.popup('你的麦克风已经被'+fromUserName+'禁止',3000)
                //消息提示
                content = '你的麦克风已经被'+fromUserName+'禁止';
                showMessage(content,'','系统消息',timeStr,'sys')
            }
            //禁止状态(关闭完再禁止)
            noAudioFlag = true;
        }
    }
}

// 接收到聊天消息回调
function onAnyChatMeetingMessageReceived(result) {
    console.log('接收到聊天消息回调:onAnyChatMeetingMessageReceived');
    console.log(result);
    var data = result.data;
    if (result.result.errorCode == 0) {
        //文本消息
        if(data.type){
            //显示消息
            showMessage(data.content,data.fromUserId,data.nickName,data.sendTime)

            if($("#messageSite").css("display") == 'none' &&
                $("#whiteBoardSite").css("visibility") != "visible"){
                // 如果此时消息界面隐藏,且不是白板界面，则主动调出消息界面
                showMessageUI();
            }

        }
    }
}
//桌面共享回调(收到其他人的共享屏幕视频流)
function onAnyChatMeetingScreenShare(result){
    console.log('接收到桌面共享回调:onAnyChatMeetingScreenShare')
    console.log(result)
    var data = result.data;
    if (result.result.errorCode == 0) {
        if(data.isOpen){
            // $('#remoteShareScreenBox').show();
            //如果当前在主界面
            var status = $("#videoSite").css('visibility');
            if(status == 'visible'){

                $('#remoteShareScreenBox2').width( $("#videoSite").width()).css("visibility","visible");
                setTimeout(function () {
                    $("#videoSite").css("visibility","hidden");
                },3000)
            }
            // $.messager.popup(data.nickName+'正在共享屏幕',3000);
            isOtherShareScreening = true;
            shareScreenStreamId = Number(data.streamId);
            // meetingInstance.getScreenStreamWithUserId("remoteShareScreenBox",Number(data.userId),Number(data.streamId))
            meetingInstance.getScreenStreamWithUserId("remoteShareScreenBox2",Number(data.userId),Number(data.streamId))

        }else{
            // $('#remoteShareScreenBox').hide();
            //如果当前在主界面
            //如果当前不在白板界面（即在主界面）
            var status = $("#whiteBoardSite").css('visibility');
            if(status !== 'visible'){
                $('#remoteShareScreenBox2').css("visibility","hidden");
                $("#videoSite").css("visibility","visible");
            }

            // $.messager.popup(data.nickName+'关闭屏幕共享');
            isOtherShareScreening = false;
            meetingInstance.cancelScreenStreamWithUserId(Number(data.userId),Number(data.streamId))
        }

    }
}
//录像回调（）
function onRecordForMeeting(result,data){
    console.log('会议录制结果回调:onRecordForMeeting')
    console.log(result,data)
    if (result.code == 0) {
        var content = {
            des:"录制结束,文件保存路径(点击以下路径自动复制)：",
            url:data.filePath
        };
        //本地时间 yyyyMMddHHmmSS格式的时间
        var timeStr = meetingInstance.generateTimeRequestNumber();
        showMessage(content,'','系统消息',timeStr,'sys','file')
        // 如果此时消息界面隐藏,且不是白板界面，则主动调出消息界面
        if($("#messageSite").css("display") == 'none' &&
            $("#whiteBoardSite").css("visibility") != "visible"){
            showMessageUI();
        }
        // $.messager.alert("提示","录制成功，"+result);
        // showTip('录制成功,文件保存路径：'+data.filePath)
        $.messager.popup('录制成功,文件保存路径：'+data.filePath,3000)
    }else{
        // showTip('录制失败,失败原因：'+result.msg)
        $.messager.popup('录制失败,失败原因：'+result.msg,3000)
    }


};

//下面的回调事件应该写进视频会议sdk中
// //进入房间结果通知（为防止影响已有的onAnyChatEnterRoom事件，名字另起为onAnyChatEnterRoomForMeeting）
// function onAnyChatEnterRoomForMeeting(result, data) {
//     var data = { meetingId:data.roomId}
//     if (result.code == 0) {
//         console.log("进入房间成功，房间id" + data.roomId);
//         //成员id列表(包含自己)
//         var userIdList = this.webSDKInstance.getRoomUsers();
//         //超过九个则自动退出，并放回对应消息
//         if(userIdList.length >=9){
//             //触发进入会议回调
//             meetingInstance.triggerCallback("超过9人限制",'1',data,'onAnyChatMeetingEntered')
//             return
//         }
//         //进入房间广播个人信息
//         var userInfo = meetingInstance.AnyChatMeetingConfig.userInfo;
//         this.sendMsg({
//             'userId':-1,
//             'data': {
//                 "cmd": "cmdEnterMeetingBoardcast",
//                 "data": userInfo
//             }
//         })
//         //更新用户设备状态列表
//         meetingInstance.userCompletion.push(userInfo)
//         //触发进入会议回调
//         meetingInstance.triggerCallback(result.msg,result.code,data,'onAnyChatMeetingEntered')
//     }
//     else {
//         console.log("进入房间失败，错误码：" + result.code);
//         //触发进入会议回调
//         meetingInstance.triggerCallback(result.msg,result.code,data,'onAnyChatMeetingEntered')
//     }
// }


//白板回调事件
//白板消息通知
function onDrawing(obj){
    console.log(obj);
    var json = {};
    json.userid = -1;//-1表示发送给所有人：广播
    json.cmd="whiteboardcmd";
    json.data = {"msg":obj,"fromUserid":mSelfUserId};
    //同步消息只需要发给主持人，和返回同步数据消息只需要返回给指定请求者 ,
    // 但是 这里可能会有多个消息合并在一个obj的情况，故先全部广播？
    var dataArr = JSON.parse(obj);
    console.log("发送广播消息："+JSON.stringify(json));
    BRAC_SDKControl(ANYCHAT_SDKCTRL_BUSINESS,JSON.stringify(json));
}
//白板打开回调
function onWhiteboardOpen(result) {
    console.log(result)
}
//白板关闭
function onWhiteboardClose(result) {
    console.log('白板关闭：'+result);
    // result.container.style.block = 'none'
    // $('#whiteBoardName').text(result.whiteBoardName);
    // $('#whiteBoardNum').text(result.whiteBoardCount);
    // $('#whiteBoardIndex').text(result.whiteBoardIndex);
    // $('#pageNum').text(result.pageCount);
    // $('#pageIndex').text(result.pageIndex)
    arr = [];
    // var whiteBoardName = "";
    whiteBoardId = "";
    pageIndex = 0;
    mycanvas = null; //绘图实例
    // 缩略图初始化
    initThumb();
}
//白板创建
function onWhiteboardCreate(result) {
    console.log(result)
    // $('#whiteBoardNum').text(result.whiteBoardCount);
    // $('#whiteBoardIndex').text(result.whiteBoardIndex);
    // $('#whiteBoardName').text(result.whiteBoardName);
    arr.push(mycanvas.getGuid());
    // whiteBoardName = result.whiteBoardName;
    whiteBoardId = result.whiteBoardId;
    //创建白板时调用视频会议组件的共享白板功能
    // (在onWhiteboardCreate回调中调用会导致其他人创建，我自己也会触发通知)
    //不在回调中触发，未必创建成功就通知对方，结果对方进去一看还没创建
    //暂时先用主持人来判断，后面改为赋权模式时再考虑怎么改
    //创建者
    var whiteBoardCreator =  mycanvas.getWhiteBoardInfo(whiteBoardId).whiteBoardCreator;
    if(!isMyCreateWB){
        // meetingInstance.meetingWhiteBoardShare()
        //当前未打开才需要打开
        var status = $("#whiteBoardSite").css('visibility');
        if(status === 'hidden'&& meetingInstance){
            //弹窗提醒“xxx正在共享白板，是否前往观看？”，点击确定则显示白板，取消则不做处理。
            // showTip(whiteBoardCreator+'正在共享白板，是否前往观看','confirm',function () {
            //     //点确定则打开白板界面,点取消则不做处理
            //     showWhiteBoardUI();
            // })
            hideMessager();
            $.messager.confirm('提示',whiteBoardCreator+'正在共享白板，是否前往观看?',function () {
                //点确定则打开白板界面,点取消则不做处理
                showWhiteBoardUI();
            })
        }
    }else{
        //本次是自己创建的，不提示共享白板
        isMyCreateWB = false;
    }

}
//白板页创建
function onWhiteboardPageCreate(result) {
    console.log(result)
    var whiteBoardName = result.whiteBoardName;
    var whiteBoardId = result.whiteBoardId;
    $('#pageNum').text(result.pageCount);
    $('#pageIndex').text(result.pageIndex);
    //添加缩略图
    addThumb(whiteBoardId,whiteBoardName,result.pageIndex,result.pageCount);
    var whiteBoardIndex = arr.indexOf(result.whiteBoardId)
    thumbSwitch(result.whiteBoardId,whiteBoardIndex);
}
//白板删除
function onWhiteboardDelete(result) {
    console.log(result)
    whiteBoardId = result.whiteBoardId
    // $('#whiteBoardNum').text(result.whiteBoardCount);
    // $('#whiteBoardIndex').text(result.whiteBoardIndex)
    // $('#pageNum').text(result.pageCount);
    // $('#pageIndex').text(result.pageIndex)
    // var wbName = result.whiteBoardName;
    //由于白板名可能重复，故不能用白板名检索
    // var thumbIndex = $(".Wb_thumb .wbName:contains("+wbName+")").parent().index();
    //为0表示正常删除，为1表示仅剩一个不允许删除
    if(result.errorcode ==0){
        // var thumbIndex = arr.indexOf(result.whiteBoardId);
        // console.log("result.whiteBoardId:"+result.whiteBoardId);

        arr.splice(arr.indexOf(result.whiteBoardId),1);
        deleteThumb(result.whiteBoardId);
    }

}
//白板切换
function onWhiteBoardSwitch(result){
    console.log(result);
    whiteBoardId = result.whiteBoardId
    // $('#whiteBoardName').text(result.whiteBoardName);
    // $('#whiteBoardNum').text(result.whiteBoardCount);
    // $('#whiteBoardIndex').text(result.whiteBoardIndex);
    $('#pageNum').text(result.pageCount);
    $('#pageIndex').text(result.pageIndex);
    thumbSwitch(result.whiteBoardId,result.whiteBoardIndex-1);
    $('#room_canvas').animate({
        scrollTop:0,
    },30)
}
//白板页切换
function onWhiteBoardPageSwitch(result) {
    console.log(result);
    $('#pageNum').text(result.pageCount);
    $('#pageIndex').text(result.pageIndex)
    $('#wb_thumb_list>#'+whiteBoardId+' .wbPage').text(result.pageIndex+'/'+result.pageCount)
    pageIndex = result.pageIndex -1;
    //滚动到顶部
    $('#room_canvas').animate({
        scrollTop:0,
    },30)
}
//白板更新（检查更新）
function onWhiteBoardUpdate(result) {
    console.log('onWhiteBoardUpdate');
    console.log(result);
    var $currentThumb = $('#wb_thumb_list').find('#'+whiteBoardId+' .item_content');
    $currentThumb.css('background-image','url('+ result.image+')')
    // instance.insertFileDuringRecord({
    //     // streamIndex:0,
    //     // fileName:result.image
    //
    //     streamIndex:1,
    //     fileName:'http://120.76.248.33/AnyChatCloud/html/AnyChatFaceX/99991111.jpg',
    // });
}
//获取到历史白板数据回调
function onAnyChatWhiteBoardHistoryDataReceive(result) {
    console.log('onAnyChatWhiteBoardHistoryDataReceive');
    console.log(result);
    if(result.whiteBoardIdArr.length){
        var whiteBoardName;
        var whiteBoardInfo;
        for(var i=0;i<result.whiteBoardIdArr.length;i++){
            whiteBoardId = result.whiteBoardIdArr[i];
            arr.push(whiteBoardId);
            whiteBoardInfo = mycanvas.getWhiteBoardInfo(whiteBoardId)
            whiteBoardName =whiteBoardInfo.whiteBoardName;
            //添加缩略图
            addThumb(whiteBoardId,whiteBoardName,whiteBoardInfo.pageIndex,whiteBoardInfo.pageCount);
        }
        whiteBoardId =  result.currentWhiteBoardId;
        whiteBoardInfo = mycanvas.getWhiteBoardInfo(whiteBoardId);
        whiteBoardName = mycanvas.getWhiteBoardInfo(whiteBoardId).whiteBoardName;

        // $('#whiteBoardName').text(whiteBoardName);
        // $('#whiteBoardNum').text(result.whiteBoardCount);
        // $('#whiteBoardIndex').text(result.whiteBoardIndex);
        $('#pageNum').text(whiteBoardInfo.pageCount);
        $('#pageIndex').text(whiteBoardInfo.pageIndex);
        thumbSwitch(whiteBoardId,result.whiteBoardIndex-1);
        //3秒后再显示，因为要先显示‘如不发言。。'提示语
        // setTimeout(function () {
        //当前未打开才需要打开
        var status = $("#whiteBoardSite").css('visibility');
        if(status === 'hidden'&& meetingInstance){
            //弹窗提醒“加载到历史数据，是否前往观看？”，点击确定则显示白板，取消则不做处理。

            // showTip('加载到历史数据，是否前往观看','confirm',function () {
            //     //点确定则打开白板界面,点取消则不做处理
            //     showWhiteBoardUI();
            // })
            $.messager.confirm('提示','当前会议有电子白板分享，是否前往？',function () {
                //点确定则打开白板界面,点取消则不做处理
                showWhiteBoardUI();
            })
        }
        // },3000)
        //开启检查更新
    }

    mycanvas.whiteBoardCheck(true)
}
//插拔式服务回调
//插拔式服务消息回调
// function OnAnyChatMeetingServerobject(lpEventJsonStr) {
//     console.log("OnAnyChatMeetingServerobject接收服务消息："+lpEventJsonStr);
//     if(typeof JSON.parse(lpEventJsonStr) == 'object'){
//         if(lpEventJsonStr.errorcode == 0){
//             //接收数据成功
//             if(lpEventJsonStr.eventtype == 1){
//                 //初始化成功
//
//             }else if(lpEventJsonStr.eventtype == 2){
//                 //不在线，中断、释放服务器对象
//                 //插拔服务器状态：
//                 // Status  ：3-在线
//                 // Status  ：1-离线
//                 //插拔服务器不在线
//                 // {"eventtype":2,"serverobject":"B1F876BC-9B11-F948-B137-B87570F58D31","status":3}
//                 alert('插拔服务器不在线')
//
//             }else if(lpEventJsonStr.eventtype == 4){
//                 //接收业务消息
//                 console.log('接收业务消息')
//
//             }
//             // {
//             //     "errorcode":0,
//             //     "eventtype":1,
//             //     "serverobject":"B1F876BC-9B11-F948-B137-B87570F58D31",
//             //     "strparam":{
//             //     "cmd":1,
//             //         "serverobject":"B1F876BC-9B11-F948-B137-B87570F58D31",
//             //         "svrflags":2150629376
//             // }
//             // }
//         }else if(lpEventJsonStr.errorcode == 120){
//             console.log('发送失败，插拔服务器已停止工作')
//         }else if(lpEventJsonStr.errorcode == 117){
//             console.log('重连失败')
//         }else if(lpEventJsonStr.errorcode == 2){
//             console.log('初始化失败，连接不上插拔服务器')
//         }
//         else if(lpEventJsonStr.errorcode == 100){
//             console.log('超过会话保持时间，连接中断')
//         }
//     }
// }

//插拔式服务回调
//连接回调
function onAnyChatDetachableServiceConnect(result){
    // console.log('触发onAnyChatDetachableServiceConnect')
    //加入本地日志
    var strLog ="onAnyChatDetachableServiceConnect(" + result+")";
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    var data = JSON.parse(result)
    console.log(data)
    if(data.serverobject == meetingInstance.serverGuid){
        data.type = 'connect'//这句能不能服务端处理？
        meetingInstance.detachableServerGetData(data)
    } else if(data.serverobject == mycanvas.serverGuid){
        data.type = 'connect'
        mycanvas.detachableServerGetData(data)
    }
}
//重连回调
function onAnyChatDetachableServiceReConnect(result){
    // console.log('触发onAnyChatDetachableServiceConnect')
    //加入本地日志
    var strLog ="onAnyChatDetachableServiceReConnect(" + result+")";
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    var data = JSON.parse(result)
    console.log(data)
}
//接收业务信息成功回调
function onAnyChatDetachableServiceReceiveData(result){
    // console.log('触发onAnyChatDetachableServiceReceiveData 分发业务消息')
    //加入本地日志
    var strLog ="onAnyChatDetachableServiceReceiveData("+result+")";
    if(strLog.length > 4000){
        strLog ="onAnyChatDetachableServiceReceiveData（...）(数据过大自动省略)" ;
    }
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    var data = JSON.parse(result)
    console.log(data)
    if(data.serverobject == meetingInstance.serverGuid){
        //如果是视频会议的消息
        meetingInstance.detachableServerGetData(data)
    }else if(data.serverobject == mycanvas.serverGuid){
        //如果是白板的消息
        mycanvas.detachableServerGetData(data)
    }


}
//连接断开回调
function onAnyChatDetachableServiceDisConnect(result){
    // console.log('触发onAnyChatDetachableServiceDisConnect')
    //加入本地日志
    var strLog ="onAnyChatDetachableServiceDisConnect(" + result+")";
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    var data = JSON.parse(result)
    console.log(data)
}

function onTransBufferDone(res, data) {
    console.log('透明通道的发送状态', res);
    console.log('透明通道的发送数据', data);
}

function largeScreenSendMsg() {
    // 主持人 - 会议标题 - 会议ID - 会议类型 - 房间ID
    const msg = `invitation_${propData.form.hostName}_${propData.form.title}_${propData.form.meetingId}_${propData.form.type}_${propData.roomId}`
    let userIdList = [];
    let promiseList = [];
    propData.personList.forEach((item) => {
        let obj = instance.getUserInfos(item)
        userIdList.push(JSON.parse(obj).userid);
    })
    console.log('用户id数组：', userIdList)
    instance.transBufferEx({
        msg,
        targetUsers: userIdList,
        time: 5,
        done: onTransBufferDone
    });
    // propData.personList.forEach((item) => {
    //     let fun = instance.getUserInfos(item)
    //     promiseList.push(fun);
    // })
    // pormise.all(promiseList).then((res) => {
    //     res.forEach((v) =>{
    //         userIdList.push(JSON.parse(v).userid)
    //     })
    //     console.log('用户id数组：', userIdList)
    //     instance.transBufferEx({
    //         msg,
    //         targetUsers: userIdList,
    //         time: 5,
    //         done: onTransBufferDone
    //     });
    // })
}
