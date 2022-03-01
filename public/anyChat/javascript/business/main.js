// AnyChat for Web SDK

/********************************************
 *				业务逻辑控制				*
 *******************************************/

// var mDefaultServerAddr = "cloud.anychat.cn";		// 默认服务器地址
// var mDefaultServerPort = 8906;					// 默认服务器端口号
// var mDefaultAppGuid = 'aa619ad2-ebbc-492e-b327-34e04d115c61';	// 默认应用ID

// var mSelfUserId = -1; 							// 本地用户ID
// var mTargetUserId = -1;							// 目标用户ID（请求了对方的音视频）
// var mRefreshVolumeTimer = -1; 					// 实时音量大小定时器
// var mRefreshPluginTimer = -1;					// 检查插件是否安装完成定时器

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
    //获取浏览器信息，并匹配Edge浏览器
    var ua = window.navigator.userAgent.toLowerCase();
    var info = {
        edge: /edge/.test(ua)
    };
    if(info.edge) {
        AddEdgePage();
    } else {
        // setTimeout(function () {
        //     if (navigator.plugins && navigator.plugins.length) {
        //         window.navigator.plugins.refresh(false);
        //     }
        //     //检查是否安装了插件
        //     var NEED_ANYCHAT_APILEVEL = "0"; 						// 定义业务层需要的AnyChat API Level
        //     var errorcode = BRAC_InitSDK(NEED_ANYCHAT_APILEVEL); 	// 初始化插件
        //     AddLog("BRAC_InitSDK(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode, LOG_TYPE_API);
        //     if (errorcode == GV_ERR_SUCCESS) {
        //         if(mRefreshPluginTimer != -1)
        //             clearInterval(mRefreshPluginTimer); 			// 清除插件安装检测定时器
        //         ShowLoginDiv(true);
        //         AddLog("AnyChat Plugin Version:" + BRAC_GetVersion(0), LOG_TYPE_NORMAL);
        //         AddLog("AnyChat SDK Version:" + BRAC_GetVersion(1), LOG_TYPE_NORMAL);
        //         AddLog("Build Time:" + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME), LOG_TYPE_NORMAL);
        //
        //         GetID("prompt_div").style.display = "none"; 		// 隐藏插件安装提示界面
        //
        //         // 初始化界面元素
        //         InitInterfaceUI();
        //     } else { 						// 没有安装插件，或是插件版本太旧，显示插件下载界面
        //         GetID("prompt_div").style.display = "block";
        //         SetDivTop("prompt_div", 300);
        //         if (errorcode == GV_ERR_PLUGINNOINSTALL)
        //             GetID("prompt_div_line1").innerHTML = "首次进入需要安装插件，请点击下载按钮进行安装！";
        //         else if (errorcode == GV_ERR_PLUGINOLDVERSION)
        //             GetID("prompt_div_line1").innerHTML = "检测到当前插件的版本过低，请下载安装最新版本！";
        //
        //         if(mRefreshPluginTimer == -1) {
        //             mRefreshPluginTimer = setInterval(function(){ LogicInit(); }, 1000);
        //         }
        //     }
        // }, 500);
        ShowLoginDiv(true);
        // 初始化界面元素
        InitInterfaceUI();
    }
}

//加载Edge浏览器下的判断页面样式
function AddEdgePage() {
    var iframeField = document.createElement('iframe');
    iframeField.src = './html/needie.html';
    iframeField.scrolling = "no";
    iframeField.frameborder = "0";
    iframeField.width = "100%";
    iframeField.height = "800px";
    document.body.style.backgroundColor = "#fff";
    document.body.appendChild(iframeField);
}

//设置AnyChat参数，需要在收到登录成功回调之后调用
function ConfigAnyChatParameter(){

}

// 初始化界面元素
function InitInterfaceUI() {
    //设置按钮
    GetID("setting").onclick = function () {
        if (GetID("setting_div").style.display == "block")
            GetID("setting_div").style.display = "none";
        else
            GetID("setting_div").style.display = "block";
    }
    //登录按钮
    GetID("loginbtn").onclick = function () {
        var signTimestamp = 0;
        var signStr = "";


        if (GetID("username").value != "") {
            DisplayLoadingDiv(true);
            setLoginInfo();

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
                // //房间用户数变化通知事件
                // onRoomUserChanged: onAnyChatRoomOnlineUser,
                // //接收房间内的文本消息通知事件
                // onRoomUserMsgReceived: onAnyChatUserMsgAtRoom
            };
            // 初始化设置，包括插件初始化、连接、登录
            var initParams = {
                serverIp: $('#ServerAddr').val(), //服务器地址 （必填项）
                serverPort: $('#ServerPort').val(), //端口号（必填项）
                nickName: $('#username').val(), //用户昵称（必填项）
                // strUserId: strUserId, //用户字符串ID
                password: '',
                appId: $('#AppGuid').val(), //应用ID（智能排队时必填）
                sign: "", //签名字符串（签名登录时必填）
                timeStamp: "", //时间戳（签名登录时必填）
                onDisConnect: onDisConnect,
                onLogin: onLogin,
                // roomOpt: roomOpt, //定义房间相关配置
                videoCallOpt: videoCallOpt,
                roomOpt: roomOpt, //定义房间相关配置
                // // bufferOpt:bufferOpt, //透明通道
                // //fileOpt: fileOpt, //定义文件上传/下载相关配置
                // //videoCallOpt: videoCallOpt, //定义视频呼叫相关配置
                // // logOpt: logOpt, //定义日志存储相关配置( 不设该配置项，则插件日志默认保存在插件安装目录下)
                // // receiveBuffer: onReceiveBuffer,
                cameraOpt: {
                    openNativeScreenCamera: 0 //0为不开启，1为开启；虚拟摄像头用于桌面共享时捕获桌面画面
                } //定义是否开启虚拟摄像头（该虚拟摄像头用于桌面共享）
            };
            SDKInstance = AnyChatWebSDK.sdkInit(initParams);

            // 隐藏设置界面
            GetID("setting_div").style.display = "none";

        }
        else {
            GetID("a_error_user").style.color = "red";
            AddLog("The user name can not be empty!", LOG_TYPE_ERROR);
            GetID("username").focus();
        }
    }
    //退出系统
    GetID("ExitSystemBtn").onclick = function () {
        var errorcode = BRAC_Logout();
        AddLog("BRAC_Logout()=" + errorcode, LOG_TYPE_API);
        ShowHallDiv(false);
        ShowLoginDiv(true);
    }
    //退出房间
    GetID("leaveroom").onclick = function () {
        var errorcode = BRAC_LeaveRoom(-1);
        AddLog("BRAC_LeaveRoom(" + -1 + ")=" + errorcode, LOG_TYPE_API);
        if(mRefreshVolumeTimer != -1)
            clearInterval(mRefreshVolumeTimer); // 清除实时音量显示计时器
        ShowRoomDiv(false); 					// 隐藏房间界面
        ShowHallDiv(true); 						// 显示大厅界面
        mTargetUserId = -1;
        var errorCode = this.SDKInstance.logout();
        console.log(errorCode, 'errorCode')
        if (errorCode == 0) {
            window.parent["iframeId"]();
        }
    }
    //进入自定义房间
    // GetID("EnterRoomBtn").onclick = function () {
    //     if (GetID("customroomid").value != "") {
    //         var re = /^[1-9]+[0-9]*]*$/;   //判断是否纯数字
    //         if (re.test(GetID("customroomid").value)) {//纯数字
    //             EnterRoomRequest(parseInt(GetID("customroomid").value));
    //         } else {
    //             AddLog("Room ID must be number!", LOG_TYPE_ERROR);
    //             GetID("customroomid").value = "";
    //             GetID("customroomid").focus();
    //         }
    //     }
    // }
    //发送信息按钮
    // GetID("SendMsg").onclick = function () {
    //     SendMessage();
    // }
    // //回车键发送信息
    // GetID("MessageInput").onkeydown = function (e) {
    //     e = e ? e : window.event; //键盘事件
    //     if (e.keyCode == 13 && GetID("MessageInput").value != "") {//回车键被点击且发送信息框不为空
    //         SendMessage();
    //     }
    // }
    //下载插件按钮鼠标划入划出时间
    GetID("prompt_div_btn_load").onmouseover = function () {
        GetID("prompt_div_btn_load").style.backgroundColor = "#ffc200";
    }
    GetID("prompt_div_btn_load").onmouseout = function () {
        GetID("prompt_div_btn_load").style.backgroundColor = "#ff8100";
    }
    //下载插件界面关闭按钮
    GetID("prompt_div_headline2").onclick = function () {
        document.URL = location.href;
    }
    // 鼠标移到日志层上面
    GetID("LOG_DIV_BODY").onmousemove = function () {
        GetID("LOG_DIV_BODY").style.zIndex = 100;
        GetID("LOG_DIV_CONTENT").style.backgroundColor = "#FAFADD";
        GetID("LOG_DIV_CONTENT").style.border = "1px solid black";
    }
    // 鼠标从日志层上面移开
    GetID("LOG_DIV_BODY").onmouseout = function () {
        GetID("LOG_DIV_BODY").style.zIndex = -1;
        GetID("LOG_DIV_CONTENT").style.backgroundColor = "#C4CEDD";
        GetID("LOG_DIV_CONTENT").style.border = "";
    }
    // //高级设置界面关闭按钮
    // GetID("advanceset_div_close").onclick = function () {
    //     GetID("advanceset_div").style.display = "none";
    // }
    // //高级设置
    // GetID("advancedsetting").onclick = function () {
    //     if (GetID("advanceset_div").style.display == "block")
    //         GetID("advanceset_div").style.display = "none";
    //     else {
    //         GetID("advanceset_div").style.display = "block"; // 显示高级设置界面
    //         // 初始化高级设置界面
    //         InitAdvanced();
    //     }
    // }

    //BRAC_SetSDKOption(BRAC_SO_CORESDK_USEHWCODEC, 1);


    //发起视频通话按钮
    $("#video_btn").click(function() {
        var nickName = SDKInstance.getUserName({
            userId: mSelfUserId
        });
        anyChatVideoCallComponentInstance.setAnyChatCallUserConfig({userId:mSelfUserId,nickName:nickName});
        var targetUserId = parseInt($('#targetUserId').val())
        var targetUserName = $('#targetUserName').val();
        anyChatVideoCallComponentInstance.requestCall("video",{userId:targetUserId,targetUserName:targetUserName} );
    })
    //发起语音通话按钮
    $("#audio_btn").click(function() {
        var nickName = SDKInstance.getUserName({
            userId: mSelfUserId
        });
        anyChatVideoCallComponentInstance.setAnyChatCallUserConfig({userId:mSelfUserId,nickName:nickName});
        var targetUserId = parseInt($('#targetUserId').val());
        var targetUserName = $('#targetUserName').val();
        anyChatVideoCallComponentInstance.requestCall("voice",{userId:targetUserId,targetUserName:targetUserName} );
    })
    getLoginInfo();
}

function PasswordFocus(obj,color){
    // 判断文本框中的内容是否是默认内容
    if(obj.value=="密码可为空")
        obj.value="";
    obj.type="password";
    // 设置文本框获取焦点时候背景颜色变换
    obj.style.backgroundColor=color;
}
// 当鼠标离开时候改变文本框背景颜色
function myblur(obj,color){
    obj.style.background=color;
}

//计算高度并设置界面位置
function SetDivTop(id, TheHeight) {
    var BodyHeight = document.documentElement.clientHeight; //获得浏览器可见区域高度
    if (TheHeight < BodyHeight) {//div高度小于可见区域高度
        GetID("margintop").style.height = (BodyHeight - TheHeight) / 4 + "px";
        GetID(id).style.marginTop = "0px";
    }
}

//系统信息框滚动条显隐
function DisplayScroll(id) {
    var offset = GetID(id); //需要检测的div
    if (offset.offsetHeight < offset.scrollHeight) {//div可见高度小于div滚动条高度
        GetID(id).style.overflowY = "scroll";//显示滚动条
        GetID(id).scrollTop = GetID(id).scrollHeight;//滚动条自动滚动到底部
    }
    else
        GetID(id).style.overflowY = "hidden";//隐藏滚动条
}
//发送信息
function SendMessage() {
    if (GetID("MessageInput").value != "") {//发送信息框不为空
        var Msg = GetID("MessageInput").value;
        BRAC_SendTextMessage(0, 0, Msg); //调用发送信息函数
        DisplayTextMessage(mSelfUserId, Msg);
        GetID("MessageInput").value = "";
        GetID("MessageInput").focus();
    }
}

// 显示文字消息
function DisplayTextMessage(fromuserid, message) {
    var namestr = BRAC_GetUserName(fromuserid) + "&nbsp" + GetTheTime();
    if(fromuserid==mSelfUserId)
        namestr = namestr.fontcolor("#008000");
    else
        namestr = namestr.fontcolor("#000080");
    message = message.fontcolor("#333333");

    var msgdiv = document.createElement("div");
    msgdiv.setAttribute("class", "TheMsgStyle");
    msgdiv.innerHTML = namestr + "：&nbsp&nbsp" + message;
    GetID("ReceiveMsgDiv").appendChild(msgdiv);
    DisplayScroll("ReceiveMsgDiv");
}

// 在文字消息区域显示通知信息
function ShowNotifyMessage(message, type) {
    if (type == NOTIFY_TYPE_SYSTEM) {
        message = message.fontcolor("#FF0000");
    } else {
        message = message.fontcolor("#333333");
    }
    var msgdiv = document.createElement("div");
    msgdiv.setAttribute("class", "TheMsgStyle");
    msgdiv.innerHTML = message + "&nbsp(" + GetTheTime().fontcolor("#999999") + ")";
    GetID("ReceiveMsgDiv").appendChild(msgdiv);
    DisplayScroll("ReceiveMsgDiv");
}

// 显示登录界面
function ShowLoginDiv(bShow) {
    if(bShow) {
        GetID("login_div").style.display = "block"; 	//显示登录界面
        GetID("username").focus();
        SetDivTop("login_div", 195); 					//登录界面垂直居中
        GetID("LOG_DIV_BODY").style.display = "block"; 	//显示系统信息框
        var serverIP = getCookie("ServerAddr");
        var serverPort = getCookie("ServerPort");
        GetID("ServerAddr").value = (typeof serverIP != "undefined" && serverIP != null) ? serverIP : mDefaultServerAddr;
        GetID("ServerPort").value = (typeof serverPort != "undefined" && serverPort != null) ? serverPort : mDefaultServerPort;
    } else {

    }
}

// 显示大厅界面
function ShowHallDiv(bShow) {
    if (bShow) {
        // GetID("room_div_userlist").innerHTML = ""; //清空房间界面好友列表
        GetID("login_div").style.display = "none"; 		//隐藏登录界面
        GetID("hall_div").style.display = "block"; 		//显示大厅界面
        // GetID("customroomid").value = "";
        SetDivTop("hall_div", 400); 					//大厅界面垂直居中
        GetID("targetUserId").focus();
        GetID("a_error_user").style.color = "#FAFADD";

        GetID("hall_div_td_name").innerHTML = BRAC_GetUserName(mSelfUserId);
        GetID("hall_div_td_id").innerHTML = mSelfUserId;
        GetID("hall_div_td_level").innerHTML = BRAC_GetUserLevel(mSelfUserId);
        GetID("hall_div_td_ip").innerHTML = BRAC_QueryUserStateString(mSelfUserId, BRAC_USERSTATE_LOCALIP);
    } else {
        GetID("hall_div").style.display = "none";
    }
}

// 显示房间界面
function ShowRoomDiv(bShow) {
    if (bShow) {
        GetID("hall_div").style.display = "none"; //隐藏大厅界面
        GetID("room_div").style.display = "block"; 	//显示房间界面
        SetDivTop("room_div", 610); 				//房间界面垂直居中
        GetID("MessageInput").focus();
    } else {
        // GetID("advanceset_div").style.display = "none"; //隐藏高级设置界面
        // GetID("ReceiveMsgDiv").innerHTML = ""; 		//清空房间界面信息接收框
        GetID("room_div").style.display = "none"; 	//隐藏房间界面
    }
}

// 请求进入指定的房间
function EnterRoomRequest(roomid) {
    var errorcode = BRAC_EnterRoom(roomid, "", 0); //进入房间
    AddLog("BRAC_EnterRoom(" + roomid + ")=" + errorcode, LOG_TYPE_API);
    if(errorcode == 0)
        DisplayLoadingDiv(true);
}

function GetID(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (window[id]) {
        return window[id];
    }
    return null;
}
// 打开指定用户的音视频
function RequestOtherUserVideo(userid) {
    var userlist = GetID("room_div_userlist");
    // 获得用户列表中所有<a>标签
    var userdivobj = userlist.getElementsByTagName("div");
    for (var i = 0; i < userdivobj.length; i++) {
        userdivobj[i].style.backgroundColor = "White";
    }
    // 获取用户列表中所有<img>标签
    var userimgobj = userlist.getElementsByTagName("img");
    for (var j = 0; j < userimgobj.length; j++) {
        if (userimgobj[j].getAttribute("class") == "MicrophoneTag") { // 该图片为 话筒 图片
            userimgobj[j].src = "./images/advanceset/microphone_false.png";
            userimgobj[j].onclick = ""; // 删除话筒按钮点击事件
            userimgobj[j].style.cursor = "";
        }
    }
    // 判断是否需要关闭之前已请求的用户音视频数据
    if (mTargetUserId != -1) {
        reVideoDivSize();
        BRAC_UserCameraControl(mTargetUserId, 0);
        BRAC_UserSpeakControl(mTargetUserId, 0);
    }
    GetID(userid + "_MicrophoneTag").src = "./images/advanceset/microphone_true.png"; // 点亮话筒图片
    GetID(userid + "_UserDiv").style.backgroundColor = "#E6E6E6"; //设置被点击<a>元素的字体颜色

    mTargetUserId = userid; 					//设置被点用户ID为全局变量
    BRAC_UserCameraControl(userid, 1); 		// 请求对方视频
    BRAC_UserSpeakControl(userid, 1); 		// 请求对方语音
    // 设置远程视频显示位置
    BRAC_SetVideoPos(userid, GetID("AnyChatRemoteVideoDiv"), "ANYCHAT_VIDEO_REMOTE");
    MicrophoneOnclick(userid); // 为当前视频会话用户话筒按钮添加点击事件
}

// 对列表中的用户进行添加、删除操作
function RoomUserListControl(userid, bInsert) {
    var userlist = GetID("room_div_userlist");
    if (bInsert) {
        var itemdiv = document.createElement("div");
        itemdiv.setAttribute("class", "UserListStyle");
        itemdiv.id = userid + "_UserDiv";

        // 判断用户摄像头状态
        if (BRAC_GetCameraState(userid) == 0)
            AddImage(itemdiv, userid + "_CameraTag", "CameraTag", "", userid); // 添加摄像头图片<img>标签
        if (BRAC_GetCameraState(userid) == 1)
            AddImage(itemdiv, userid + "_CameraTag", "CameraTag", "./images/advanceset/camera_false.png", userid); // 添加摄像头图片<img>标签
        if (BRAC_GetCameraState(userid) == 2)
            AddImage(itemdiv, userid + "_CameraTag", "CameraTag", "./images/advanceset/camera_true.png", userid); // 添加摄像头图片<img>标签
        // 判断当前ID是否为自己
        if (userid == mSelfUserId) {
            AddImage(itemdiv, mSelfUserId + "_MicrophoneTag", "mSelfMicrophoneTag", "./images/advanceset/microphone_true.png", userid); // 添加话筒图片<img>标签
            itemdiv.innerHTML += "&nbsp" + BRAC_GetUserName(mSelfUserId) + "(自己)";
        } else {
            AddImage(itemdiv, userid + "_MicrophoneTag", "MicrophoneTag", "./images/advanceset/microphone_false.png", userid); // 添加话筒图片<img>标签
            // 添加用户姓名<a>标签
            var a = document.createElement("a");
            a.id = userid + "_UserTag";
            a.title = BRAC_GetUserName(userid);
            a.innerHTML = BRAC_GetUserName(userid);
            a.href = "javascript:RequestOtherUserVideo(" + userid + ")";
            itemdiv.appendChild(a);
        }
        GetID("room_div_userlist").appendChild(itemdiv);
        MicrophoneOnclick(mSelfUserId);
    } else {
        var my = GetID(userid + "_UserDiv");
        userlist.removeChild(my);
    }
    DisplayScroll("room_div_userlist");
}
//div按钮鼠标划入划出效果
function Mouseover(id) {
    GetID(id).style.backgroundColor = "#FFFFCC";
}
//div按钮鼠标划入划出效果
function Mouseout(id) {
    GetID(id).style.backgroundColor = "#E6E6E6";
}
//获取当前时间  (00:00:00)
function GetTheTime() {
    var TheTime = new Date();
    return TheTime.toLocaleTimeString();
}

// 添加日志并显示，根据不同的类型显示不同的颜色
function AddLog(message, type) {
    if (type == LOG_TYPE_API) {			// API调用日志，绿色
        message = message.fontcolor("Green");
    } else if(type == LOG_TYPE_EVENT) {	// 回调事件日志，黄色
        message = message.fontcolor("#CC6600");
    } else if(type == LOG_TYPE_ERROR) {	// 出错日志，红色
        message = message.fontcolor("#FF0000");
    } else {							// 普通日志，灰色
        message = message.fontcolor("#333333");
    }
    GetID("LOG_DIV_CONTENT").innerHTML += message + "&nbsp" + GetTheTime().fontcolor("#333333") + "<br />";
    DisplayScroll("LOG_DIV_CONTENT");
}

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

//好友 摄像头  话筒  图标
function AddImage(parent_id, img_id, img_class, fir_img, userid) {
    var imgs = document.createElement("img");
    imgs.id = img_id;
    imgs.className = img_class;
    imgs.src = fir_img;
    imgs.style.width = "15px";
    imgs.style.height = "15px";
    parent_id.appendChild(imgs);
}
// 为被点击用户话筒按钮添加点击事件
function MicrophoneOnclick(userid) {
    GetID(userid + "_MicrophoneTag").style.cursor = "pointer"; // 鼠标形状
    GetID(userid + "_MicrophoneTag").onclick = function () { // 话筒点击事件
        var ImgPath = GetID(userid + "_MicrophoneTag").src.split('/');
        if (ImgPath[ImgPath.length - 1] == "microphone_true.png") {
            GetID(userid + "_MicrophoneTag").src = "./images/advanceset/microphone_false.png";
            BRAC_UserSpeakControl(userid, 0); // 关闭语音
        }
        else {
            GetID(userid + "_MicrophoneTag").src = "./images/advanceset/microphone_true.png";
            BRAC_UserSpeakControl(userid, 1); // 开启语音
        }
    }
}
//恢复显示视频div大小
function reVideoDivSize() {
    var divWidth=GetID("AnyChatRemoteVideoDiv").offsetWidth;
    var divHeight=GetID("AnyChatRemoteVideoDiv").offsetHeight;
    if(divWidth<divHeight){
        GetID("AnyChatRemoteVideoDiv").style.width=(4.0/3*divHeight)+"px";
        GetID("AnyChatRemoteVideoDiv").style.height=divHeight+"px";
    }
}

//设置登录信息，包括用户名、服务器IP、服务器端口、应用ID
function setLoginInfo() {
    var loginType = 0;
    setCookie('username',GetID("username").value,30);
    setCookie('ServerAddr',GetID("ServerAddr").value,30);
    setCookie('ServerPort',GetID("ServerPort").value,30);
    setCookie('AppGuid',GetID("AppGuid").value,30);
}

//获取登录信息
function getLoginInfo() {
    GetID("username").value = getCookie("username");
    var serverIP = getCookie("ServerAddr");
    GetID("ServerAddr").value = (serverIP != "") ? serverIP : mDefaultServerAddr;
    var serverPort = getCookie("ServerPort");
    GetID("ServerPort").value = (serverPort != "") ? serverPort : mDefaultServerPort;
    var appGuid = getCookie("AppGuid");
    GetID("AppGuid").value = (appGuid != "") ? appGuid : mDefaultAppGuid;
}

//获取cookie项的cookie值
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    }
    return "";
}

//设置cookie
function setCookie(c_name, value, expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + value + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
