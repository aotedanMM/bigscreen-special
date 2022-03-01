// AnyChat for Web SDK

/********************************************
 *				业务逻辑控制				*
 *******************************************/

var defaultUserId = '';//登录AnyChat的userId
var SDKInstance = null;   //websdk实例
var defaultServerAddr = "111.62.17.223";//AnyChat服务器地址
var defaultServerPort = '18906';//AnyChat服务器端口号
// var defaultAppID ='F3D0AFBD-2D4B-6243-9352-34232DFBB294';//应用Id
var defaultAppID ='F3D0AFBD-2D4B-6243-9352-34232DFBB294';//应用Id
var defaultRequestIp = 'http://111.62.17.223:10040';//业务请求后台地址
// var defaultRequestIp = '/apis';
var defaultUserName = '';//用户名
var phone = '';
var anyChatMeetingHallComponentInstance;//视频会议组件(带会议列表)实例



// $(function() {
//     启动视频会议组件
//     $("#loginbtn").on("click", function() {
//         startAnyChatMeetingComponent();
//     });
//     手机输入框绑定回车
//     $("#phone,#AppGuid").on('keydown',function(e){
//         // console.log(e.which)
//         //回车键
//         if(e.which ==13){
//             startAnyChatMeetingComponent();
//         }
//     } )
//     getLoginInfo();
    // startAnyChatMeetingComponent();
// });
$(function(){
    $.ajax({  
        type : "get",
         url : "../../json/publishObjectPath.json",
        dataType:"json",
            success : function(data) {
                    defaultServerAddr = data.bairuiPath.mDefaultServerAddr
                    defaultServerPort = data.bairuiPath.mDefaultServerPort
                    defaultAppID = data.bairuiPath.mDefaultAppGuid
                    defaultRequestIp = data.bairuiPath.mDefaultRequestIp
                    startAnyChatMeetingComponent();
                    dispatchData();
         },
            error : function() {  
            alert('请求失败')
        }
    })
})

//启动会议组件
function startAnyChatMeetingComponent() {
    // var reg = /1[345782]\d{9}$/g;
    // var phone = $("#phone").val();
    // if (phone == '') {
    //     $.messager.popup('请输入手机号！',3000);
    //     $("#phone").focus();
    //     return;
    // }else if(!reg.test(phone)) {
    //     $.messager.popup('请输入合法手机号！',3000);
    //     $("#phone").val('').focus();
    //     return;
    // }
    // if(!$("#AppGuid").val()){
    //     $.messager.popup('请输入应用Id！',3000);
    //     $("#AppGuid").focus();
    //     return;
    // }
    // defaultAppID = $("#AppGuid").val();
    // if(!$("#userName").val()){
    //     $.messager.popup('请输入用户名！',3000);
    //     $("#userName").focus();
    //     return;
    // }
    // defaultUserName = $("#userName").val();
    //保存cookice
    // setLoginInfo();
    // const role = JSON.parse(sessionStorage.getItem('role'));
   //创建视频会议实例
    anyChatMeetingHallComponentInstance = AnyChatMeetingHallComponent.getInstance();
    var hallConfig = {
        serverAddr: defaultServerAddr,
        serverPort: defaultServerPort,
        appId: defaultAppID,
        bussinessServerAddr:defaultRequestIp,
        webSdkInstance:SDKInstance,
        account: '18000000000',
        userName: '指挥中心',
        userId:defaultUserId,
    }
    //启用会议组件(带会议大厅)
    console.log(hallConfig)
    anyChatMeetingHallComponentInstance.enterMeetingHall(hallConfig)
}

// 显示登录界面
function ShowLoginDiv(bShow) {
    if (bShow) {
        // $("#login_div").show()
        $("#login_div").css('visibility','visible'); //显示登录界面
        $("#login_right").hide();
        $("#phone").focus();
        $("#checkCode").val('');
        if($('.hall_content .bootstrap-table').length){
            $("#hall_table").bootstrapTable('destroy');
        }

    } else {
        $("#login_div").css('visibility','hidden');
    }
}


//设置登录信息，包括用户名、环境名，服务器IP、服务器端口、应用ID
function setLoginInfo() {

    setCookie('phone',  $("#phone").val(), 30);
    // setCookie('ServerName', $("#ServerName").val(), 30);
    // $('#setServerName_dropdown').change()
    // setCookie('ServerAddr', $("#ServerAddr").val(), 30);
    // setCookie('ServerPort', $("#ServerPort").val(), 30);
    setCookie('appGuid', defaultAppID, 30);
    setCookie('userName', defaultUserName, 30);
    // setCookie('BusinessGuid', $("#BusinessGuid").val(), 30);
    // setCookie('requestIp', $("#AppGuid").val(), 30);
}

//设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + decodeURI(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
//清除cookie
function clearCookie() {
    setCookie('AppGuid', "", -1);
}
//获取登录信息
function getLoginInfo() {
    if(getCookie("phone")){
        $("#phone").val(getCookie("phone"));
    }
    if(getCookie("appGuid")){
        $("#AppGuid").val(getCookie("appGuid"));
    }
    if(getCookie("userName")){
        $("#userName").val(getCookie("userName"));
    }

}

//获取cookie项的cookie值
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}


