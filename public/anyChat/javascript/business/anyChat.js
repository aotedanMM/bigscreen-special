var mDefaultServerAddr = "";		// 默认服务器地址
var mDefaultServerPort = '';					// 默认服务器端口号
var mDefaultAppGuid = '';	// 默认应用ID

var mSelfUserId = -1; 							// 本地用户ID
var mTargetUserId = -1;							// 目标用户ID（请求了对方的音视频）
var mRefreshVolumeTimer = -1; 					// 实时音量大小定时器
var mRefreshPluginTimer = -1;					// 检查插件是否安装完成定时器
// 日志记录类型，在日志信息栏内显示不同的颜色
var LOG_TYPE_NORMAL = 0;
var LOG_TYPE_API = 1;
var LOG_TYPE_EVENT = 2;
var LOG_TYPE_ERROR = 3;

// 通知类型，在文字消息栏内显示不同的颜色
var NOTIFY_TYPE_NORMAL = 0;
var NOTIFY_TYPE_SYSTEM = 1;
var SDKInstance = null;
var anyChatVideoCallComponentInstance = null;

function LogicInit() {
    // console.log(bairuiPath.mDefaultServerAddr);
    // DisplayLoadingDiv(true);
    //视频呼叫回调
    var videoCallOpt = {
        //接收视频呼叫请求通知
        onReceiveVideoCallRequest: onReceiveVideoCallRequest,
        //接收视频呼叫开始通知
        onReceiveVideoCallStart: onReceiveVideoCallStart,
        //接收视频呼叫结束通知
        onReceiveVideoCallFinish: onReceiveVideoCallFinish,
        //接收视频呼叫异常通知
        onReceiveVideoCallError: onReceiveVideoCallError
    };
    var roomOpt = {
        //用户进出房间通知事件
        onRoomUserInAndOut: onRoomUserInAndOut,
    };
    // 初始化设置，包括插件初始化、连接、登录
    var initParams = {
        serverIp: mDefaultServerAddr, //服务器地址 （必填项）
        serverPort: mDefaultServerPort, //端口号（必填项）
        nickName: '指挥中心', //用户昵称（必填项）
        // strUserId: strUserId, //用户字符串ID
        password: '',
        appId: mDefaultAppGuid, //应用ID（智能排队时必填）
        sign: "", //签名字符串（签名登录时必填）
        timeStamp: "", //时间戳（签名登录时必填）
        onDisConnect: onDisConnect,
        onLogin: onLogin,
        // roomOpt: roomOpt, //定义房间相关配置
        videoCallOpt: videoCallOpt,
        roomOpt: roomOpt, //定义房间相关配置
        cameraOpt: {
            openNativeScreenCamera: 0 //0为不开启，1为开启；虚拟摄像头用于桌面共享时捕获桌面画面
        } //定义是否开启虚拟摄像头（该虚拟摄像头用于桌面共享）
    };
    SDKInstance = AnyChatWebSDK.sdkInit(initParams);

    // 初始化配置--登录事件
    function onLogin(data) {
        console.log('登录成功回调:onLogin');
        console.log("登录成功！用户Id为：" + data.userId);
        console.log('服务地址：' + mDefaultServerAddr);
        anyChatVideoCallComponentInstance = AnyChatVideoCallComponent.getInstance();
        // 配置当前用户信息
        var nickName = SDKInstance.getUserName({
            userId: data.userId
        });
        anyChatVideoCallComponentInstance.setAnyChatCallUserConfig({userId:data.userId,nickName:nickName});

        // // 发起通话
        // 获取转递过来的id
        var userId = null;
        var targetEle = parent.$("#iframeId");//寻找目标
            var regexpParam = /\??([\w\d%]+)=([\w\d%]*)&?/g; //分离参数的正则表达式
            var  paramMap=null;//置空
            if(!!targetEle) {
                var url = targetEle.attr("src"); //取得iframe的url
                var userId = targetEle.attr("src"); //取得iframe的url
                var ret;
                paramMap = {};//初始化结果集
                while((ret = regexpParam.exec(url)) != null) {
                    paramMap[ret[1]] = ret[2];
                }
            }
            userId = paramMap.id;
            this.mTargetName = paramMap.id;
            var videoUserInfo = SDKInstance.getUserInfos(userId);
            console.log(videoUserInfo, 'videoUserInfo')
            var videoUserId = JSON.parse(videoUserInfo).userid;
            var videoUserName = JSON.parse(videoUserInfo).username;
            anyChatVideoCallComponentInstance.requestCall("video",{userId:videoUserId,targetUserName:videoUserName} );
            // anyChatVideoCallComponentInstance.requestCall("video",{userId:'-2288',targetUserName:videoUserId} );
        // var targetUserName = $('#targetUserName').val();
        // anyChatVideoCallComponentInstance.requestCall("voice",{userId:targetUserId,targetUserName:targetUserName} );
    }
    // parent.vm.sayhello();
}
$(function(){
    $.ajax({  
        type : "get",
         url : "../json/publishObjectPath.json",   
        dataType:"json",
            success : function(data) {
                    console.log(data)
                    mDefaultServerAddr = data.bairuiPath.mDefaultServerAddr
                    mDefaultServerPort = data.bairuiPath.mDefaultServerPort
                    mDefaultAppGuid = data.bairuiPath.mDefaultAppGuid
                    LogicInit()
         },
            error : function() {  
            alert('请求失败')
        }
    })
})
// 显示等待进度条，提示用户操作正在进行中
function DisplayLoadingDiv(bShow) {
    if (bShow) {
        GetID("LOADING_DIV").style.display = "block";
        GetID("LOADING_GREY_DIV").style.display = "block";
        var TheHeight = document.documentElement.clientHeight;
        var TheWidth = document.body.offsetWidth;
        GetID("LOADING_DIV").style.marginTop = (TheHeight - 50) / 2 + "px";
        GetID("LOADING_DIV").style.marginLeft = (TheWidth - 130) / 2 + "px";
    }
    else {
        GetID("LOADING_DIV").style.display = "none";
        GetID("LOADING_GREY_DIV").style.display = "none";
    }
}