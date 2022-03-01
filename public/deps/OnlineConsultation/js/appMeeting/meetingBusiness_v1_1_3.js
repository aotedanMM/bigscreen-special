//实例化组件
// var meetingInstance = new AnyChatMeetingManager();
// meetingInstance.enterMeeting();
//验证是否单实例
// var meetingInstance2 = new AnyChatMeetingManager();
// console.log(meetingInstance === meetingInstance2)//true
//验证getInstance方法是否正确
// var meetingInstance3 = meetingInstance2.getInstance();
// console.log(meetingInstance3 === meetingInstance2);//true
var meetingInstance = ''; //视频会议sdk实例
var microphones = []; //本地麦克风对象列表
var speaks = []; //本地扬声器对象列表
var cameras = []; //本地摄像头对象列表
var mSelfUserId = ''
var meetingType = 0;//会议类型0为语音会议，1为视频会议
// var meetingName = '';
// var hostName = '';
var noAudioFlag = false;//禁言状态
var noVideoFlag  = false;//禁止打开视频状态
var timerMeeting = null //语音会议的的计时器
var timerRecord = null //录制的计时器
var timerSpeak = null//检测发言人的计时器
var timerBites = null //网速检测定时器
//插拔式服务guid
// var serverGuid ;
var showFlag = false; //密码显示与隐藏状态控制
//防暴力点击
var isClick = true;
var isMyCreateWB = false;//自身创建白板标识
var isRecording = false;//正在录制标识
var isShareScreening = false;//正在共享屏幕标识(自己是主持人)
var isOtherShareScreening = false;//正在共享屏幕标识(他人是主持人)
var shareScreenStreamId = 0;//共享屏幕流号，接收到共享时保存
var isUseMeetingFlag = false;//使用视频会议标志，防止在共同回调中（如onLogin）干扰其他业务

var mSelfUserId = -1;
var mDefaultServerAddr = "120.76.74.249";
var mDefaultServerPort = 8906;
var mDefaultAppID ='ADFE2DFF-0B55-BB49-85FE-C47612DD7AAC';
var requestIp = '120.76.248.33:10040';

// var inviteUrl = 'http://192.168.13.123:81/share/';
var inviteUrl = 'http://meeting.spmdm.com/share/index.html';
var instance;   //websdk实例
var mycanvas; //绘图实例
var anyChatMeetingComponentInstance; //视频会议组件(仅会议主界面)实例
//是否打开摄像头标志
var componentOption; //视频会议组件配置项
//手机号 作为创建会议时的主持人id
var myPhone = '';
var myUserName = '';
//会议唯一标识，id（roomId）,注意不是meetingid,meetingid是客户自定义的，id（roomId）代表的实际是房间号
var roomId = 0;
//业务层保存白板id
var arr = [];
// var index = 0;
// var targetID =-1;
// var whiteBoardName = "";
var whiteBoardId = "";
var pageIndex = 0;
//aes密钥
var AESKey = CryptoJS.enc.Utf8.parse("qwertyuiopasdfgh");
var propData = {}   //大屏传递的参数
var autoCreate = false
window.onbeforeunload  = function () {
    if(mycanvas){
        mycanvas.closeWhiteBoard()
    }
    //清除会议资源（退出会议和结束会议时会自己清空，连接断开属于异常情况需要手动清空）
    if(meetingInstance){
        meetingInstance.cleanMeetingResource()
    }
    if(instance){
        instance.leaveRoom()
        instance.logout()
    }

}
/*----------------------------------------------------------
	 * AnyChatMeetingComponentWithHall
	 * 函数说明:AnyChatMeetingComponentWithHall 工厂,用于创建AnyChatMeetingComponentWithHall实例
	 *
	 * ---------------------------------------------------------
	 */
function AnyChatMeetingHallComponent() {
    this.anyChatMeetingComponentWithHallInstance = null;
}
AnyChatMeetingHallComponent.prototype.getInstance = function(option) {
    this.anyChatMeetingHallComponentInstance = new AnyChatMeetingHallComponentInstance();
    return this.anyChatMeetingHallComponentInstance;
}
var AnyChatMeetingHallComponent = new AnyChatMeetingHallComponent();

window.AnyChatMeetingHallComponent = AnyChatMeetingHallComponent;
/*--------------------------------------------------------
	 * AnyChatMeetingComponentWithHallInstance
	 * AnyChatMeetingComponentWithHall实例，全局唯一,实例可创建会议大厅及会议主界面
	 *
	 * -------------------------------------------------------
	 */
function AnyChatMeetingHallComponentInstance() {

}
AnyChatMeetingHallComponentInstance.prototype = {
    constructor: AnyChatMeetingHallComponent,
    //进入会议大厅
    enterMeetingHall :function(hallConfig){
        mDefaultServerAddr = hallConfig.serverAddr;
        mDefaultServerPort = hallConfig.serverPort;
        mDefaultAppID = hallConfig.appId;
        requestIp = hallConfig.bussinessServerAddr;
        instance = hallConfig.webSdkInstance;
        myPhone = hallConfig.account;
        myUserName = hallConfig.userName;
        mSelfUserId = hallConfig.userId;
        //打开标志
        isUseMeetingFlag = true;
        bingHallEvents();
        $('#AnyChatMeetingComponent').show();
        ShowHallDiv(true);
        //视频会议添加插拔式服务
        // AnyChatMeetingConfig.detachableServerInstance = serverInstance

        // window.meetingInstance = meetingInstance;
        //在meetingEven.js中的进入房间回调把组件界面加载出来
    },

}
/*--------------------------------------------------------
	 * AnyChatMeetingComponentInstance
	 * AnyChatMeetingComponent实例，全局唯一
	 *
	 * -------------------------------------------------------
	 */
function AnyChatMeetingComponentInstance() {
    this.container ='html';
}
// 视频会议组件类
/*----------------------------------------------------------
	 * AnyChatMeetingComponent
	 * 函数说明:AnyChatMeetingComponent 工厂,用于创建AnyChatMeetingComponent实例
	 *
	 * ---------------------------------------------------------
	 */
function AnyChatMeetingComponent() {
    this.anyChatMeetingComponentInstance = null;
}

AnyChatMeetingComponent.prototype.getInstance = function(option) {
    this.anyChatMeetingComponentInstance = new AnyChatMeetingComponentInstance();
    return this.anyChatMeetingComponentInstance;
}
var AnyChatMeetingComponent = new AnyChatMeetingComponent();

window.AnyChatMeetingComponent = AnyChatMeetingComponent;

// var AnyChatMeetingComponent = (function () {
//     //使用闭包创建单例模式
//     var _instance = null;

//     // this.meetingInstance = '';
//     return function () {
//         console.log('----------------------------------欢迎使用AnyChat视频会议ui组件');
//         //存放ui的容器id
//          this.container ='html';//会报错
//         if(_instance ==null){
//             _instance=this;
//         }
//         return _instance;
//     }
// })();
AnyChatMeetingComponentInstance.prototype = {
    constructor: AnyChatMeetingComponent,
    //会议操作相关方法
    // 启动会议ui
    startMeetingWithMeetingInfo :function(AnyChatMeetingConfig){
        meetingInstance = (new AnyChatMeetingManager()).getInstance();
        this.container = AnyChatMeetingConfig.container;
        meetingType = AnyChatMeetingConfig.meetingInfo.meetingType;
        meetingInstance.enterMeeting(AnyChatMeetingConfig);
        //视频会议添加插拔式服务
        // AnyChatMeetingConfig.detachableServerInstance = serverInstance

        // window.meetingInstance = meetingInstance;
        //在meetingEven.js中的进入房间回调把组件界面加载出来
    },

}
function initTopUI(title,hoseName,meetingId) {
    $("#AnyChatMeeting_title").text(title);
    $("#AnyChatMeeting_hostName").text(hoseName);
    $("#AnyChatMeeting_meetingId").text(meetingId);
}
function showComponentUI(bool) {
    if(bool){
        //将界面渲染在传进来的contain中，若没有传，默认渲染在html中（）
        if(AnyChatMeetingComponent.container !=='html'){
            //ui字符串
            // var AnyChatMeeting_box = ''
            // getID(AnyChatMeetingComponent.container).appendChild(AnyChatMeeting_box)
            //    这部分逻辑等将ui转为字符串再做
        }
        // $("#AnyChatMeeting_box").css('display','block');
        //由会议类型渲染不同风格主界面
        if(!meetingType){
            //显示语音会议界面
            initAudioMeetingUI()
        }else {
            //显示视频会议界面
            initVideoMeetingUI()
        }
        // showUpAndDownBytes()
        timerBites = setInterval(function () {
            showUpAndDownBytes()
        },1000)
        //初始化全局变量
        globalVarInit();
        //初始化各区域
        siteInit()
        $("#AnyChatMeeting_box").css('display','block');

        // showTip('如不发言请关闭麦克风','popup','',3000)
        // $.messager.popup('如不发言请关闭麦克风',3000)

        //计算白板高度
        // var canvasDiv = document.getElementById('room_canvas');
        // SetWBHeightForMeeting(canvasDiv)
        //绑定各类事件
        bindEvents()
        //初始化clipBoard工具
        initClip();
        //邀请入会按钮增加自动复制功能
        initInviteClip();
    }else {
        //清空各个定时器
        if(timerMeeting && timerMeeting.timeInterval){
            //清空语音会议定时器
            timerMeeting.stop();
            timerMeeting = null;
        }
        if(timerRecord && timerRecord.timeInterval){
            //清空录制定时器
            timerRecord.stop();
            timerRecord = null;
        }
        if(timerSpeak && timerSpeak.timeInterval){
            //清空检测发言定时器
            timerSpeak.stop();
            timerSpeak = null;
        }
        if(timerBites){
            //清空上下行定时器
            clearInterval(timerBites);
            timerBites = null;
        }
        //置空会议实例
        meetingInstance = '';
        $("#AnyChatMeeting_box").css('display','none');
        //初始化各区域
        // siteInit()
        //初始化模态框(如果当前模态框显示，则隐藏)
        // if($('#messageModal').hasClass('in')){
        //     $('#messageModal').modal('hide')
        // }
        // if($('.dialog.modal.fade').hasClass('in')){
        //     $('.dialog.modal.fade').modal('hide')
        // }
        //初始化全局变量
        // noAudioFlag = false;//禁言状态
        // noVideoFlag  = false;//禁止打开视频状态
    }

}
//绑定各种事件
function bindEvents() {
    //页脚按钮
    $('#icon_users,#icon_talk,#icon_shareWhiteBoard,#icon_setting').unbind('click').on('click',switchCurrentUI);
    //邀请入会
    $('#icon_invite').unbind('click').on('click',inviteUser);
    //聊天界面
    //发送消息按钮
    $(".sendMessage").unbind('click').on('click',sendMessage);
    //输入框绑定回车
    $(".messageText").unbind('keydown').on('keydown',function(e){
        console.log(e.which)
        //回车键
        if(e.which ==13){
            // sendMessage()
            var $currentMessageBoard = $(this).parent().parent('.messageSite');
            $currentMessageBoard.find('.sendMessage').click();
        }
    } )

    //设置界面
    $("#updatePasswordBtn").unbind('click').on('click',updatePassword);
    //修改密码输入框回车键绑定
    //输入框绑定回车
    $("#newPassword").unbind('keydown').on('keydown',function(e){
        console.log(e.which)
        //回车键
        if(e.which ==13){
            updatePassword()
        }
    } )
    //密、明文切换
    $('#icon_eye').unbind('click').on('click', changeEye)
    //下拉菜单按钮点击事件
    $('#addWB_dropdown,#drawMode_dropdown,#lineMode_dropdown,#colorMode_dropdown,' +
        '#bgcolor_dropdown,#wbSize_dropdown,#videoscreensetting_dropdown,' +
        '#videoCapture_dropdown,#audioCapture_dropdown,#audioPlayBack_dropdown,' +
        '#recordSetting_dropdown').unbind('click').on('click',function (){
        // console.log($(this).attr("id"));
        var dropMenuId = $(this).attr("id");
        changeDropMenu(dropMenuId)
    });
    //下拉菜单按钮失去焦点事件
    $('#addWB_dropdown,#drawMode_dropdown,#lineMode_dropdown,#colorMode_dropdown,' +
        '#bgcolor_dropdown,#wbSize_dropdown,#videoscreensetting_dropdown,' +
        '#videoCapture_dropdown,#audioCapture_dropdown,#audioPlayBack_dropdown,' +
        '#recordSetting_dropdown').unbind('blur').on('blur',function (){
        var dropMenuId = $(this).attr("id");
        // 更改按钮图标
        changeDropIcon(dropMenuId);
    });
    //下拉菜单子项点击事件（模拟select）
    $('#addWB_dropdown_ul li,#lineMode_dropdown_ul li,#drawMode_dropdown_ul li,#colorMode_dropdown_ul li,' +
        '#bgcolor_dropdown_ul li,#wbSize_dropdown_ul li,#videoscreensetting_dropdown_ul li,' +
        '#videoCapture_dropdown_ul li,#audioCapture_dropdown_ul li,#audioPlayBack_dropdown_ul li,' +
        '#recordSetting_dropdown_ul li').unbind('click').on('click',function(){
        //更改当前菜单项
        var targetId = $(this).attr('id');
        var parentId = $(this).parent().attr('id');
        //当前已经创建白板才能操作
        if(arr.length==0 && parentId !== 'addWB_dropdown_ul'
            && parentId !== 'videoCapture_dropdown_ul'
            && parentId !== 'audioCapture_dropdown_ul'
            && parentId !== 'audioPlayBack_dropdown_ul'
            && parentId !== 'recordSetting_dropdown_ul'){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }

        changeOption(targetId);
    });

    //白板界面顶部显隐
    // $(".AnyChatMeeting_whiteBoard_top").hover(function() {
    //     $(this).animate({top:'0'});
    // }, function() {
    //     $(this).animate({top:'-7%'});
    // });

    //白板消息面板显隐
    $("#messageBoard").unbind('click').on('click', function() {
        var $whiteBoardMessageBoard = $('#whiteBoardMessageBoard');
        if( $whiteBoardMessageBoard.css('right') == '0px'){
            //收起
            // $("#messageSite").clone(true).appendTo($whiteBoardMessageBoard);
            // $(this).find('.clone_message').html()
            $whiteBoardMessageBoard.animate({right:'-24%'},'normal',function () {
                // $whiteBoardMessageBoard.find('#messageBoard').css('background-image','url(./img/icon_showMessage0.png)')
                $whiteBoardMessageBoard.find('#messageBoard').remove('active');
            });
        }else{
            //展开
            //红点消失
            messageEedDotOperate(0);
            $whiteBoardMessageBoard.animate({right:'0'},'normal',function () {
                $whiteBoardMessageBoard.find('#messageBoard').addClass('active');
            });
        }

     });
    //移入移出（因为会有需要一直显示的情况，故只需要依靠点击来隐藏）
    // $("#whiteBoardMessageBoard").unbind('mouseenter mouseleave').hover(function(){
    //     var $whiteBoardMessageBoard = $('#whiteBoardMessageBoard');
    //     messageEedDotOperate(0);
    //     $whiteBoardMessageBoard.animate({right:'0'},'normal',function () {
    //         $whiteBoardMessageBoard.find('#messageBoard').css('background-image','url(./img/icon_showMessage1.png)')
    //     });
    // },function () {
    //     var $whiteBoardMessageBoard = $('#whiteBoardMessageBoard');
    //     $whiteBoardMessageBoard.animate({right: '-24%'}, 'normal', function () {
    //         $whiteBoardMessageBoard.find('#messageBoard').css('background-image', 'url(./img/icon_showMessage0.png)')
    //     });
    // })

    //撤销上一步绘画
    $("#undo").unbind('click').on('click', function() {
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.undo();
    });

    //清除全部
    $("#clear").unbind('click').on('click', function() {
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.clear();
    });

    //模式选择
    $('#drawMode_dropdown').unbind('change').on('change',function(){
        // console.log($(this).attr('data-val'));
        var val =$(this).attr('data-val');
        mycanvas.mode(val);
    });
    //粗细选择
    $('#lineMode_dropdown').unbind('change').on('change',function(){
        var val =$(this).attr('data-val');
        mycanvas.size(val);
    });

    //颜色选择
    $('#colorMode_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        mycanvas.setColor(val);
    });
    //背景颜色选择
    $('#bgcolor_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        //更改第1页背景颜色
        mycanvas.changeBgColor(val);
    });
    //更换背景 删除背景=>改为图片分享
    $('#bgChange').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        if ($("#bgChange span").first().hasClass("icon_bgChange")){
            // var url = './img/whiteBoarBk.png';
            // var url = "http://192.168.2.12:81/test.png";
            //在上传成功后更改背景,同时更改图标
            imgUpLoad(function () {
                //更改按钮
                // $('#bgChange span').first().removeClass('icon_bgChange').addClass('icon_bgDelete');
                // $('#bgChange span').eq(1).text("删除背景")
            })


        }else{
            mycanvas.deleteBgImage();
            $('#bgChange span').first().removeClass('icon_bgDelete').addClass('icon_bgChange');
            $('#bgChange span').eq(1).text("更改背景")

        }

    });

    //更改画板大小
    $('#wbSize_dropdown').unbind('click').unbind('change').on('change',function(){

        var val = $(this).attr('data-val');
        var canvasH  = $("#room_canvas").height();
        var canvasW ;
        switch (val) {
            case "first":
                //1:1
                canvasW = canvasH;
                break;
            case "second":
                canvasW = canvasH /3*4;
                // canvasH = 400;
                break;
            case "third":
                canvasW = canvasH /9*16;
                // canvasH = 400;
                break;
        }
        // changeWhiteBoardSize(canvasW,canvasH)
        $('#room_canvas').height(canvasH);
        $('#room_canvas').width(canvasW);
        mycanvas.setCanvasSize(canvasW,canvasH);
    });
    //本地下载canvas
    $('#canvasDownload').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.download();
    });
    //检查canvas更新
    $('#canvasCheck').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.whiteBoardCheck();
    });
    //停止检查canvas更新
    $('#canvasCheckStop').unbind('click').on('click',function(){
        mycanvas.whiteBoardCheck(0);
    });
    //新增白板
    $('#addWB_dropdown').unbind('change').on('change',function(){
        //打开白板（白板初始化时会自动打开白板，但关闭后需要手动打开）
        // openWhiteBoard();
        var val = $(this).attr('data-val');
        if(val === "addWB"){
            var wbName = '';
            hideMessager();
            $.messager.prompt('创建白板','请输入白板名：',function(val){
                preventClickQuick(function () {
                    wbName = val
                    // console.log(wbName);
                    if(!wbName){
                        return
                    }

                    //创建空白白板
                    createBlankWhiteBoard(wbName)
                })
            },'','',function(val){
                //校验规则
                if(!val){
                    // $.messager.popup('白板名不能为空')
                    return false
                }
                return true
            });
            
        }else if(val === "addPPTWB"){
            //弹窗选择文件,在转换成功时执行创建ppt白板
            fileToImage();
        }
    });

    //切换canvas/页
    //上一板
    $('#changeWBPre').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.changeWhiteBoard(-1);
    });
    //下一板
    $('#changeWBNext').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.changeWhiteBoard(1);
    });
    //上一页
    $('#changeWBPagePre').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.changeWhiteBoardPage(-1);
    });
    //下一页
    $('#changeWBPageNext').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        mycanvas.changeWhiteBoardPage(1);
    });
    //删除白板
    $('#deleteWB').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length == 0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        if(arr.length == 1){
            $.messager.popup('操作无效，只有一个白板不允许删除！',3000)
            return
        }
        mycanvas.deleteWhiteBoard();
    });
    //关闭白板
    // $('#closeWB').on('click',function(){
    //     // mycanvas.closeWhiteBoard();
    //     leaveRoomRequest();
    // });
    //打开白板
    // $('#openWB').on('click',function(){
    //     canvasDiv = document.getElementById('room_canvas');
    //     mycanvas.openWhiteBoard(canvasDiv);
    // });
    function openWhiteBoard(){
        if ($("#room_canvas").children().length !=0){
            return
        }
        //如果没有画板，则添加打开画板
        var canvasDiv = document.getElementById('room_canvas');
        mycanvas.openWhiteBoard(canvasDiv);
    }
    //本地上传
    $('#localUpload').unbind('change').on('change',function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            src = e.target.result;
            // console.log(src);
            mycanvas.image(src);
        };
    });

    //显示白板信息
    $('#showWBInfo').unbind('click').on('click',function(){
        //当前已经创建白板才能操作
        if(arr.length==0){
            $.messager.popup('请先创建白板再执行此操作！',3000)
            return
        }
        var infor = mycanvas.getWhiteBoardInfo();
        var showInform = '白板名：'+infor.whiteBoardName+'；白板ID：'+ infor.whiteBoardId+''+
            '；创建者：'+infor.whiteBoardCreator+
            '；创建时间：'+timestampToTime(infor.whiteBoardCreateTime.toString())
        // showTip(showInform)
        hideMessager();
        $.messager.alert('白板信息',showInform)
    });

    //div默认无法得到获取焦点，只有获取焦点的元素才能绑定键盘事件
    $("#wb_thumb_list").attr("tabindex",0)
    //为缩略图绑定键盘事件
    $("#wb_thumb_list").unbind('keyup').on('keyup',function(event){
        console.log(event.target)
        //方向键控制
        if(event.which ==37){
            //按左键
            mycanvas.changeWhiteBoard(-1);
        }else if(event.which ==39){
            //按右键
            mycanvas.changeWhiteBoard(1);
        }
    });

    //设备切换
    $('#videoCapture_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        BRAC_SelectVideoCapture(BRAC_DEVICE_VIDEOCAPTURE, val);
    });
    $('#audioCapture_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        BRAC_SelectVideoCapture(BRAC_DEVICE_AUDIOCAPTURE, val);
    });
    $('#audioPlayBack_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        BRAC_SelectVideoCapture(BRAC_DEVICE_AUDIOPLAYBACK, val);
    });
    //录制设置
    $('#recordSetting_dropdown').unbind('change').on('change',function(){
        var val = $(this).attr('data-val');
        meetingInstance.switchRecordStyle(val)
    });
}
//防暴力点击函数
function preventClickQuick(fun) {
    if(isClick) {
        isClick = false;
        //事件
        fun();
        //定时器
        setTimeout(function() {
            isClick = true;
        }, 1000);//一秒内不能重复点击
    }
}
//区域块初始化
function siteInit() {
    //视频区域初始化
    $('#videoSite').css('width','100%');
    $("#videoSite").css('visibility','visible');
    if(isHost(mSelfUserId)){
        //页脚显示共享屏幕按钮
        $('#icon_shareScreen').parent().show()
    }else{
        $('#icon_shareScreen').parent().hide()
    }
    //消息列表初始化
    $('#messageSite').css('dispaly','none');
    $('.messageList').empty();
    //参会者列表初始化
    $('#userListSite').css('dispaly','none');
    $('#userList').empty();
         //静音按钮初始化
    $('#allNoVoice').removeClass().addClass('allNoVoice0');
    $('#allNoVoice').val('全体静音');
    //设置界面初始化
    $('#settingSite').css('dispaly','none');
         //设备选择初始化
    InitDeviceSetting();
        //密码模块是否显示
    if(isCanHost(mSelfUserId)){
        $('#passwordSetting').css("visibility",'visible');
    }else{
        $('#passwordSetting').css("visibility",'hidden');
    }
        //密码是否加密显示
    // var showFlag = false; // 状态控制 初始为隐藏
    $('#icon_eye').removeClass('eyeOpen').addClass('eyeClose');
    $('#newPassword').attr("type","password");
    $('#newPassword').val('');
    //白板区域初始化
    $('#whiteBoardSite').css('visibility','hidden');
    changeWhiteBoardShowUIMode();
    initRoomWhiteBoard();
    //白板消息面板初始化
    if(meetingType){
        $('#whiteBoardMessageBoard #whiteBoard_hostVideo').show();
        $('#hostVideoImgMask').show();
        $('#whiteBoardMessageBoard #whiteBoard_message').css('height','68.5%');
    }else{
        //语音会议白板现象面板主持人视频区域用图片代替
        //语音会议白板消息面板不显示顶上块
        $('#whiteBoardMessageBoard #whiteBoard_hostVideo').hide();
        $('#whiteBoardMessageBoard #whiteBoard_message').css('height','100%');
    }
    $('#whiteBoardMessageBoard').css({'right':'-24%'});
    // $('.messageList').empty();
    //页脚初始化
    if(isCanHost(mSelfUserId)){
        $('#AnyChatMeeting_end').css("visibility","visible");
    }else{
        $('#AnyChatMeeting_end').css("visibility","hidden");
    }
}
//全局变量初始化
function  globalVarInit() {
    //防止第二次进入会议收第一次进入会议的状态影响
    noAudioFlag = false;//禁言状态
    noVideoFlag  = false;//禁止打开视频状态
    showFlag = false; //密码显示与隐藏状态控制
    isClick = true;
    isMyCreateWB = false;//自身创建白板标识
    isRecording = false;//正在录制标识
    isShareScreening = false;//正在共享屏幕标识(自己是主持人)
    isOtherShareScreening = false;//正在共享屏幕标识(他人是主持人)
    shareScreenStreamId = 0;//共享屏幕流号，接收到共享时保存
}
//显示视频会议界面
function initVideoMeetingUI(){
    //视频区域初始化
    var $videoSiteBox = $("#videoSite");
    $videoSiteBox.attr('class',"AnyChatMeeting_videoSite AnyChatMeeting_flexVerCenter AnyChatMeeting_wrap AnyChatMeeting_horCenter");
    $videoSiteBox.empty();
    //页脚初始化
    $('#AnyChatMeetingFooter').html('<div class="AnyChatMeeting_box_bottom_left AnyChatMeeting_flexVerCenter">\n' +
        '                    <span id="recordBtn" class="AnyChatMeeting_box_bottom_btn AnyChatMeeting_flexVerCenter" onclick="recordOperate(this)">\n' +
        '                        <i class="AnyChatMeeting_icon_record" id="icon_record"></i>\n' +
        '                        <span>开始录制</span>\n' +
        '                    </span>\n' +
        '                    <span id="recordTimeBox">正在录制 <span id="recordTime">00:00:00</span></span>\n' +
        '                </div>\n' +
        '                <div class="AnyChatMeeting_box_bottom_middle AnyChatMeeting_flexAround AnyChatMeeting_flexVerCenter ">\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_users" name="img"/>\n' +
        '                        <div>参会人</div>\n' +
        '                    </div>\n' +
        // '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        // '                        <input type="button" id="icon_invite" name="img"/>\n' +
        // '                        <div>邀请入会</div>\n' +
        // '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_talk" name="img" />\n' +
        '                        <div>对话聊天</div>\n' +
        '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_shareScreen" name="img" onclick="shareScreen()"/>\n' +
        '                        <div>共享屏幕</div>\n' +
        '                    </div>\n' +
        // '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        // '                        <input type="button" id="icon_shareWhiteBoard" name="img" "/>\n' +
        // '                        <div>共享白板</div>\n' +
        // '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn microphoneBox AnyChatMeeting_verCenterAround">\n' +
        // '                        <ul id="microphoneList">' +
        // '                           <iframe  frameborder="0" scrolling="no" style="background-color: transparent;' +
        // '                           position:absolute;z-index: -1; width:100%; height: 100%;left: 0;top: 0;"></iframe>' +
        // '                       </ul>\n' +
        '                        <input type="button" id="icon_audio" name="img" onclick="operateMicrophone()"/>\n' +
        '                        <div>麦克风</div>\n' +
        '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn cameraBox AnyChatMeeting_verCenterAround">\n' +
        // '                        <ul id="cameraList">' +
        // '                           <iframe  frameborder="0" scrolling="no" style="background-color: transparent;' +
        // '                       position: absolute;z-index: -1;width:100%; height: 100%;left: 0;top: 0;"></iframe>' +
        // '                       </ul>\n' +
        '                        <input type="button" id="icon_carmar" name="img" onclick="operateCamera()"/>\n' +
        '                        <div>摄像头</div>\n' +
        '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_voice" name="img" onclick="isOpenVoice()"/>\n' +
        '                        <div>静音</div>\n' +
        '                    </div>\n' +
        '                  <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                      <input type="button" id="icon_setting" name="img"/>\n' +
        '                      <div>设置</div>\n' +
        '                  </div>\n' +
        '                </div>\n' +
        '                <div class="AnyChatMeeting_box_bottom_right AnyChatMeeting_end">\n' +
        '                     <button type="button" id="AnyChatMeeting_end" onclick="endMeeting()" \n' +
        '                   class="AnyChatMeeting_box_bottom_btn " >结束会议</button>\n' +
        '                </div>')
        // <span id="AnyChatMeeting_exit" onclick="leaveMeetingRequest()" class="AnyChatMeeting_box_bottom_btn AnyChatMeeting_flexVerCenter">\n' +
        // '                        <i class="AnyChatMeeting_icon_exit"></i>\n' +
        // '                        退出\n' +
        // '                    </span>\n' +
    // //本地摄像头列表初始化
    // var cameraUl = getID("cameraList")
    // var cameras = meetingInstance.getCameras();
    // if(cameras.length ==0){
    //     showTip('无摄像头，请确认已安装摄像头再启动启动视频会议')
    //     // 隐藏组件
    //     showComponentUI(false)
    // }
    // for(var i=0;i<cameras.length;i++){
    //     var cameraLi = document.createElement("li");
    //     cameraLi.innerText = cameras[i].deviceName;
    //     $(cameraLi).on('click',switchCamera)
    //     cameraUl.appendChild(cameraLi)
    // }
    // //本地麦克风列表初始化
    // var microphoneUl = getID("microphoneList")
    // var microphones = meetingInstance.getMicrophones();
    // for(var i=0;i<microphones.length;i++){
    //     var microphoneLi = document.createElement("li");
    //     microphoneLi.innerText = microphones[i].deviceName;
    //     $(microphoneLi).on('click',switchMicrophone)
    //     microphoneUl.appendChild(microphoneLi)
    // }
    //视频会议白板现象面板主持人视频区域显示视频，在白板打开时显示视频
}
var szJsonBuf4Txt = { fontcolor: '0xffffff', alpha: 100, posx: 5, posy: 5, fontsize: 23, text: '应急中心', };
function onSnapshotDone(res, data) {
    console.log('拍照的发送状态', res);
    console.log('拍照发送数据', data);
}
function takeSnapShot(ele) {
    console.log(ele.id, 'ele')
    var timeStr = meetingInstance.generateTimeRequestNumber();
    instance.takeSnapShot({   
        userId: ele.id,   
        streamIdx: 0,   
        fileName: timeStr, 
        // localFilePath: xxxx, 
        szJsonBuf4Txt: szJsonBuf4Txt,
        done: onSnapshotDone,//截图结果通知
        category: 'picture', //拍照文件上传至服务器上的分类子目录
    });
}

//显示语音会议界面
function initAudioMeetingUI(){
    //视频区域初始化
    var $videoSiteDiv= $("#videoSite");
    $videoSiteDiv.attr('class',"AnyChatMeeting_audio AnyChatMeeting_verCenterAround");
    $videoSiteDiv.html('<div class="audio_top AnyChatMeeting_flexVerCenter AnyChatMeeting_wrap AnyChatMeeting_horCenter" id="audioSite_top">\n' +
        '                    </div>\n' +
        '                    <div class="audio_middle">\n' +
        '                        <span id="audio_time">00:00:00</span>\n' +
        '                    </div>\n' +
        '                    <div class="audio_bottom AnyChatMeeting_flexAround">\n' +
        '                        <input type="button" id="icon_audio" name="img" onclick="operateMicrophone()"/>\n' +
        // '                        <input type="button" id="AnyChatMeeting_exit" name="img" onclick="leaveMeetingRequest()"/>\n' +
        '                        <input type="button" id="icon_voice" name="img" onclick="isOpenVoice()"/>\n' +
        '                    </div>')
    //页脚初始化
    $('#AnyChatMeetingFooter').html('<div class="AnyChatMeeting_box_bottom_left AnyChatMeeting_flexVerCenter">\n' +
        '                    <span  id="recordBtn" class="AnyChatMeeting_box_bottom_btn AnyChatMeeting_flexVerCenter" onclick="recordOperate(this)">\n' +
        '                        <i class="AnyChatMeeting_icon_record" id="icon_record"></i>\n' +
        '                        <span>开始录制</span>\n' +
        '                    </span>\n' +
        '                    <span id="recordTimeBox">正在录制 <span id="recordTime">00:00:00</span></span>\n' +
        '                </div>\n' +
        '                <div class="AnyChatMeeting_box_bottom_middle AnyChatMeeting_flexAround AnyChatMeeting_flexVerCenter ">\n' +
        '\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_users" name="img" />\n' +
        '                        <div>参会人</div>\n' +
        '                    </div>\n' +
        // '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        // '                        <input type="button" id="icon_invite" name="img"/>\n' +
        // '                        <div>邀请入会</div>\n' +
        // '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_talk" name="img" />\n' +
        '                        <div>对话聊天</div>\n' +
        '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_shareScreen" name="img" onclick="shareScreen()"/>\n' +
        '                        <div>共享屏幕</div>\n' +
        '                    </div>\n' +
        // '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        // '                        <input type="button" id="icon_shareWhiteBoard" name="img" />\n' +
        // '                        <div>共享白板</div>\n' +
        // '                    </div>\n' +
        '                    <div class="AnyChatMeeting_box_bottom_mid_btn AnyChatMeeting_verCenterAround">\n' +
        '                        <input type="button" id="icon_setting" name="img" "/>\n' +
        '                        <div>设置</div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="AnyChatMeeting_box_bottom_right AnyChatMeeting_end">\n' +
        '                    <button type="button" id="AnyChatMeeting_end" onclick="endMeeting()" \n' +
        '                   class="AnyChatMeeting_box_bottom_btn">结束会议</button>\n' +
        '                    <span id="AnyChatMeeting_exit" onclick="leaveMeetingRequest()" class="AnyChatMeeting_box_bottom_btn AnyChatMeeting_flexVerCenter">\n' +
        '                        <i class="AnyChatMeeting_icon_exit"></i>\n' +
        '                        退出\n' +
        '                    </span>\n' +
        '                </div>')
}
//封装一个处理单位数字的函数
function showNum(num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}
// 离开当前会议
function leaveMeetingRequest() {
    // showTip('会议正在进行，你确定离开会议吗','confirm',function () {
    //     var errorCode = meetingInstance.leaveMeeting();
    //     if (errorCode == 0) {
    //         // closeCamera(0);
    //         // closeMicrophone(0);
    //         // showComponentUI(false); // 隐藏组件

    //     }
    // })'
    if(isRecording){
        hideMessager();
        $.messager.alert('提示','当前会议正在录制中，请先停止录制再退出会议',function () {

        })
    }
    // else if(isShareScreening){
    //     // hideMessager();
    //     // $.messager.alert('提示','当前会议正在共享屏幕，请先停止共享再离开会议',function () {
    //     // })
    //    $('#icon_shareScreen').click();
    // }
    else{
        hideMessager();
        // $.messager.confirm('提示','会议正在进行，你确定离开会议吗？',function () {
            if(isShareScreening){
                //如果正在共享屏幕，先关闭共享
                $('#icon_shareScreen').click();
            }
            var errorCode = meetingInstance.leaveMeeting();
            if (errorCode == 0) {
                // closeCamera(0);
                // closeMicrophone(0);
                // showComponentUI(false); // 隐藏组件

            }
        // })
    }


}
//结束当前会议
function endMeeting() {
    if(!isCanHost(mSelfUserId)){
        // showTip('非管理员或主持人没有操作权限')
        $.messager.popup('非管理员或主持人没有操作权限',3000)
        return
    }
    // showTip('你确定结束会议吗？','confirm',function () {
    //     var errorCode = meetingInstance.destroyMeeting()
    //     if (errorCode == 0) {
    if(isRecording){
        hideMessager();
        $.messager.alert('提示','当前会议正在录制中，请先停止录制再结束会议',function () {

        })
    }
    // else if(isShareScreening){
    //     // hideMessager();
    //     // $.messager.alert('提示','当前会议正在共享屏幕，请先停止共享再结束会议',function () {
    //     //
    //     // })
    //
    // }
    else{
        hideMessager();
        // $.messager.confirm('提示','结束会议之后将无法重新进入会议，是否确定结束？',function () {
            if(isShareScreening){
                //如果正在共享屏幕，先关闭共享
                $('#icon_shareScreen').click();
            }
            var errorCode = meetingInstance.destroyMeeting()
            if (errorCode == 0) {

            }
        // })
    }


}
//显示/隐藏聊天界面
function showMessageUI() {
    $('#icon_talk').click();
}

//界面选择
function switchCurrentUI() {
    var currentId = $(this).attr('id');
    var currentUIId  = '';
    switch (currentId){
        case 'icon_users':
            currentUIId = 'userListSite';
            break;
        case 'icon_talk':
            currentUIId = 'messageSite';
            break;
        case 'icon_shareWhiteBoard':
            currentUIId = 'whiteBoardSite';
            //如果当前正在共享屏幕，不允许共享白板
            if(isShareScreening){
                $.messager.alert('提示','当前会议正在共享屏幕，请先停止共享');
                return
            }
            break;
        case 'icon_setting':
            currentUIId = 'settingSite';
            break;
    }
    var status = $(this).hasClass('active');
    if(!status){
        $(this).addClass('active').parent()
            .siblings().children('#icon_users,#icon_talk,#icon_shareWhiteBoard,#icon_setting').removeClass('active');
        $('#'+currentUIId).siblings('#userListSite,#messageSite,#settingSite').hide();
        if(currentId !=='icon_shareWhiteBoard'){
            $("#videoSite").width("75%");
            $('#remoteShareScreenBox2').width("75%");
            if(!isOtherShareScreening){
                $("#videoSite").css("visibility","visible");
            }else {
                $('#remoteShareScreenBox2').css("visibility","visible");
            }
            $('#whiteBoardSite').css("visibility","hidden");
            $('#'+currentUIId).show();
            if(meetingType){
                //视频区域也要自适应
                //宽度加了过渡，所以2秒后宽度才是正确的
                setTimeout(function () {
                    videoAdapter("videoSite")
                },2000)
            }
        }
        else{
            //    共享白板界面特殊处理
            $("#videoSite").width("100%").css("visibility","hidden");
            $('#remoteShareScreenBox2').width("100%").css("visibility","hidden");
            $('#'+currentUIId).css("visibility","visible");
            //检查是不是主持人
            if(isHost(mSelfUserId)){
                // showTip('你是主持人，可以操作白板','popup','',2000)
                $.messager.popup('你是主持人，可以操作白板',3000);
                mycanvas.setWhiteBoardMode(0)//设置交互模式
                //白板消息面板显示视频
            }
            else if(isCanHost(mSelfUserId)){
                // showTip('你是管理员，可以操作白板','popup','',2000)
                $.messager.popup('你是管理员，可以操作白板',3000);
                // $('#AnyChatMeeting_whiteBoard_Mask').hide();
                mycanvas.setWhiteBoardMode(0)//设置交互模式
                //拉取主持人的视频

            }
            else{
                mycanvas.setWhiteBoardMode(1);//设置观看模式模式
                // $('#AnyChatMeeting_whiteBoard_Mask').show();
                // showTip('你不是主持人或管理员，请观看演示','popup','',2000)
                $.messager.popup('你不是主持人或管理员，请观看演示',3000)
                //拉取主持人的视频

            }
            if(meetingType){
                //视频区域也要自适应
                //宽度加了过渡，所以2秒后宽度才是正确的
                setTimeout(function () {
                    videoAdapter("videoSite")
                },2000)
            }
            //白板消息界面显示，并显示主持人视频
            showWhiteBoardMessageBoard(true);
        }
    }
    else {
        //隐藏，取消图标高亮
        $(this).removeClass('active');

        if(currentId !=='icon_shareWhiteBoard'){
            $('#'+currentUIId).hide();
            $("#videoSite").width("100%");
            $('#remoteShareScreenBox2').width("100%");
            if(meetingType){
                //视频区域也要自适应
                //宽度加了过渡，所以2秒后宽度才是正确的
                setTimeout(function () {
                    videoAdapter("videoSite")
                },2000)
            }
        }
        else {
            //共享白板界面特殊处理
            // $("#videoSite").css("visibility","visible");
            if(!isOtherShareScreening){
                $("#videoSite").css("visibility","visible");
            }else {
                $('#remoteShareScreenBox2').css("visibility","visible");
            }
            $('#'+currentUIId).css("visibility","hidden");

            //白板消息面板隐藏，主界面视频显示主持人视频
            showWhiteBoardMessageBoard(false);

        }


    }
}
//白板消息面板显隐
function showWhiteBoardMessageBoard(isShow) {
    if(isShow){
        //白板消息界面显示，并显示主持人视频
        $('#whiteBoardMessageBoard').show();
        var hostUserID = meetingInstance.getHostId();
        if(meetingType && hostUserID){
            if(isHost(mSelfUserId)){
                meetingInstance.closeCamera(false);
                var errorcode = meetingInstance.openCameraInRenderView('hostVideoSite',false)
                if(errorcode != 0){
                    hideMessager();
                    $.messager.alert('提示','打开摄像头失败，错误码/原因：'+errorcode)
                }
            }else{
                meetingInstance.getVideoStream('hostVideoSite',hostUserID);
            }

        }
        var $messageListBox = $('#whiteBoard_message .messageList');
        if ($messageListBox[0].offsetHeight < $messageListBox[0].scrollHeight) { //div可见高度小于div滚动条高度
            $messageListBox.css('overflowY' ,'scroll'); //显示滚动条
            $messageListBox.animate({
                scrollTop:$messageListBox[0].scrollHeight,
            },30)
            // messageListBox.scrollTop = messageListBox.scrollHeight; //滚动条自动滚动到底部
        }
    }else{
        //白板消息面板隐藏，主界面视频显示主持人视频
        $('#whiteBoardMessageBoard').hide();
        var hostUserID = meetingInstance.getHostId();
        if(meetingType && hostUserID){
            if(isHost(mSelfUserId)){
                meetingInstance.closeCamera(false);
                var errorcode = meetingInstance.openCameraInRenderView(mSelfUserId+'videoSite',false);
                if(errorcode != 0){
                    hideMessager();
                    $.messager.alert('提示','打开摄像头失败，错误码/原因：'+errorcode)
                }
            }else{
                // meetingInstance.cancelVideoStream(meetingInstance.getHostId())
                // var hostUserID = meetingInstance.getHostId();
                meetingInstance.getVideoStream(hostUserID+'videoSite',hostUserID);
            }
        }
    }
}
//白板消息面板改变(跟随主持人进出房间改变)
function changeWhiteBoardMessageBoard(userId,state){
    if(meetingType){
        if(state){
            $('#hostVideoImgMask').hide();
            //白板消息面板添加主持人姓名
            $('#whiteBoardMessageBoard #whiteBoard_hostVideo .hostName').text(meetingInstance.getNameById(userId));
            var status = $("#whiteBoardSite").css('visibility');
            if(status === 'visible'){
                if(userId == mSelfUserId){
                    meetingInstance.closeCamera(false);
                    var errorcode = meetingInstance.openCameraInRenderView('hostVideoSite',false)
                    if(errorcode != 0){
                        hideMessager();
                        $.messager.alert('提示','打开摄像头失败，错误码/原因：'+errorcode)
                    }
                }else{
                    meetingInstance.getVideoStream('hostVideoSite',userId);
                }
            }
        }else{
            //主持人离开了会议
            $('#hostVideoImgMask').show();
            // meetingInstance.cancelVideoStream(userId);
            $('#hostVideoSite').empty();
        }
    }



};
//白板消息界面消息红点操作
function messageEedDotOperate(actionType) {
    $redDot = $('#messageDot');
    if(actionType){
        $redDot.addClass('active')
    }else{
        $redDot.removeClass('active')
    }
}
//白板显示模式更改（普通用户模式/主持人或管理员模式）
function changeWhiteBoardShowUIMode() {
    if(isHost(mSelfUserId) || isCanHost(mSelfUserId)){
        //主持人和观众白板界面
        $('#AnyChatMeeting_whiteBoard_top').show();
        $('#AnyChatMeeting_whiteBoard_left').show();
        $('#AnyChatMeeting_whiteBoard_right').css({'height':'90%','width':'84.9%'});
        $('#whiteBoardMessageBoard').css({'height':'85.5%','top':'14.5%'});
        $('.hostPerson').show();
        var $wbCamera = $('.wbMediaOperate').find('#wbMediaOperate_camera');
        var $wbMicrophone = $('.wbMediaOperate').find('#wbMediaOperate_microphone');
        var $wbSpeak = $('.wbMediaOperate').find('#wbMediaOperate_voice');
        //状态跟随主界面状态
        //摄像头按钮
        if(meetingType){
            $wbCamera.show();
            if($('#icon_carmar').hasClass('active')){
                //主界面摄像头按钮有active是关闭状态
                $wbCamera.addClass('active')
            }else{
                $wbCamera.removeClass('active')
            }
        }else{
            $wbCamera.hide()
        }
        //麦克风按钮
        if($('#icon_audio').hasClass('active')){
            //主界面麦克风按钮有active是打开状态
            $wbMicrophone.removeClass('active')
        }else{
            $wbMicrophone.addClass('active')
        }
        //扬声器按钮
        if($('#icon_voice').hasClass('active')){
            //主界面扬声器按钮有active是关闭状态
            $wbSpeak.addClass('active')
        }else{
            $wbSpeak.removeClass('active')
        }
        $('.normalPerson').hide();
        //     height: 90%;
        //     width:86%;
    }else{
        //普通成员白板界面
        $('#AnyChatMeeting_whiteBoard_top').hide();
        $('#AnyChatMeeting_whiteBoard_left').hide();
        $('#AnyChatMeeting_whiteBoard_right').css({'height':'100%','width':'100%'});
        $('#whiteBoardMessageBoard').css({'height':'95%','top':'5%'});
        $('.hostPerson').hide();
        $('.normalPerson').show();
        var $wbSpeakForNormalPerson = $('.wbMediaOperate').find('#wbMediaOperate_voice_normalPerson');
        //扬声器按钮
        if($('#icon_voice').hasClass('active')){
            //主界面扬声器按钮有active是关闭状态
            $wbSpeakForNormalPerson.addClass('active')
        }else{
            $wbSpeakForNormalPerson.removeClass('active')
        }
    }
    // //白板大小改变
    if(arr.length){
        //只有白板存在的情况才能设置白板大小
        changeWhiteBoardSize()
        // $('#room_canvas').css('background-image','unset');
    }

    // var canvasH = $('#room_canvas').height();
    // var canvasW = $('#room_canvas').width();
    // mycanvas.setCanvasSize(canvasW,canvasH);
}
//白板大小更改
function changeWhiteBoardSize() {
    // var canvasH  = $("#room_canvas").height();
    // var canvasW = canvasH /9*16;
    // $('#room_canvas').height(canvasH);
    // $('#room_canvas').width(canvasW);
    // mycanvas.setCanvasSize(canvasW,canvasH);
    // mycanvas.setSizeMode(3)
    mycanvas.reSizeCanvas();
}
// 初始化设置界面下拉菜单
function InitDeviceSetting() {
    fillSelect("videoCapture_dropdown", BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE), BRAC_EnumDevices(BRAC_DEVICE_VIDEOCAPTURE)); 		// 视频采集设备下拉框值
    fillSelect("audioCapture_dropdown", BRAC_EnumDevices(BRAC_DEVICE_AUDIOCAPTURE),BRAC_EnumDevices(BRAC_DEVICE_AUDIOCAPTURE)); 		// 音频采集设备下拉框值
    fillSelect("audioPlayBack_dropdown", BRAC_EnumDevices(BRAC_DEVICE_AUDIOPLAYBACK), BRAC_EnumDevices(BRAC_DEVICE_AUDIOPLAYBACK)); 	// 音频播放设备下拉框值
    initSelected();
    $('#recordSetting_dropdown').attr('data-val','0')
    $('#recordSetting_dropdown .button_content').text('音视频录制')
    // $('#recordSetting_dropdown ')
}
// 填充下拉框值
function fillSelect(id, txtArray,valueArray) {
    $('#'+id+'_ul').empty()
    for (var i = 0; i < txtArray.length; i++) {
        var $li = $("<li></li>");
        $li.html('<a href="#"></a>')
        $('#'+id+'_ul').append($li);
        $li.attr('id',id+i);
        $li.attr('data-val',txtArray[i]);
        $li.children().text(valueArray[i])
    }
}
// 获取当前参数值
function initSelected() {
    getIndex("videoCapture_dropdown", BRAC_GetCurrentDevice(BRAC_DEVICE_VIDEOCAPTURE),"combobox"); // 当前使用的视频采集器
    getIndex("audioCapture_dropdown", BRAC_GetCurrentDevice(BRAC_DEVICE_AUDIOCAPTURE),"combobox"); // 当前使用的音频采集器
    getIndex("audioPlayBack_dropdown",BRAC_GetCurrentDevice(BRAC_DEVICE_AUDIOPLAYBACK),"combobox"); // 当前使用的音频播放器
}
// 设置控件初始值
function getIndex(control_id,value,type) {
    if (type == "combobox") { // 下拉框
        $('#'+control_id+' .button_content').text(value);
    }
}
//显示/隐藏白板界面
function showWhiteBoardUI() {
    $('#icon_shareWhiteBoard').click();

}
//计算白板高度
function SetWBHeightForMeeting(canvasDiv) {
    // console.log($("#room_canvas").width());

    //先判断以宽为基准还是以高为基准
    //父容器大小
    var parentDiv = canvasDiv.parentNode;
    var parentHeight = parentDiv.offsetHeight;
    var parentWidth = parentDiv.offsetWidth;
    //画布大小
    var canvasW=0;
    var canvasH = 0;
    //保持视频 16:9宽高比,先以宽作为基准
    canvasW = parentWidth;
    canvasH = canvasW / 16*9;
    if(canvasH >parentHeight){
        //超出（父容器高度没这么高），则以高作为基准
        canvasH = parentHeight;
        canvasW = canvasH / 9*16;
    }
    canvasDiv.style.height = Math.floor(canvasH)+'px';
    canvasDiv.style.width = Math.floor(canvasW)+'px';
}
//共享屏幕
function shareScreen() {
    if(!isHost(mSelfUserId)){
        // showTip('非主持人没有操作权限')
        $.messager.popup('非主持人没有操作权限',3000)
        return
    }
    var status = $('#icon_shareScreen').attr('class') == 'active';

    if(status){
        //取消图标高亮
        $('#icon_shareScreen').removeClass();
        meetingInstance.enableScreenShare(false);
        isShareScreening = false;
    }else {
        //图标高亮
        $('#icon_shareScreen').removeClass().addClass('active');
        meetingInstance.enableScreenShare(true);
        isShareScreening = true;
    }

}
//白名单共享
function shareDocument() {
    var status = $('#icon_shareScreen').attr('class') == 'active';

    if(status){
        //取消图标高亮
        $('#icon_shareScreen').removeClass();
        meetingInstance.shareDocument(false);
    }else {
        //图标高亮
        $('#icon_shareScreen').removeClass();
        meetingInstance.shareDocument(true);
    }
}
//初始化区域视频/语言块
function initVideoScreen(userId,isOpenCamera,isOpenMicrophone,nickName) {
    // var userList = meetingInstance.fetchAllMeetingUserCompletion()
    //视频区域
    var $videoSiteBox = $("#videoSite");
    //单个视频块（包含视频与名字）
    // var div_video = document.createElement("div");
    var $div_video = $("<div id='"+userId+'videoArea'+"'></div>");
    // div_video.id = userId+'videoArea';
    $div_video.addClass('videoArea');
    // 创建用户视频div
    // var div_videoSite = document.createElement("div");
    var $div_videoSite = $("<div id='"+userId+'videoSite'+"'></div>");
    // div_videoSite.id = userId+'videoSite';
    $div_videoSite.addClass('videoSite myVideoSite');

    //创建用户名字div
    // var div_nameSite = document.createElement("div");
    // div_nameSite.setAttribute("class",'nameSite AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter')
    var $div_nameSite = $("<div></div>");
    $div_nameSite.addClass('nameSite AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter');
    // var nickName = meetingInstance.getNameById(userId)

    $div_nameSite.html( '<img  alt="" class="icon_host">\n' +
        '                     <span>'+nickName+'</span>\n' +
        '                     <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n');

    //单个视频块包括视频与用户名
    $div_video.append($div_videoSite);
    $div_video.append($div_nameSite);

    // var isHostFlag = isHost(mSelfUserId)
    //大小与videoSite一致，盖在上面
    if(meetingType){
        //视频会议
        $videoSiteBox.append($div_video);
        //主持人标识
        //检查是不是主持人
        if( isHost(mSelfUserId)){
            $('#'+mSelfUserId+'videoArea .icon_host').attr("src","./img/icon_isHost1.png").css("visibility","visible");

            // $('#passwordSetting').removeAttr("disabled");
        }else if(isCanHost(mSelfUserId)){
            $('#'+mSelfUserId+'videoArea .icon_host').attr("src","./img/icon_isHost2.png").css("visibility","visible");
        }
        //自适应

        // checkIsSpeak()
        videoAdapter('videoSite')
        if(isOpenCamera){
            var errorcode = meetingInstance.openCameraInRenderView(userId+'videoSite',true)
            if(errorcode != 0){
                hideMessager();
                $.messager.alert('提示','打开摄像头失败，错误码/原因：'+errorcode)
            }
            //白板界面的视频
        }
    }
    else {
        //语音会议
        var $audioSiteUserBox =$("#audioSite_top");
        $div_video.html('<div class="userItem">\n' +
            '                            <div class="icon_hostFlag"></div>\n' +
            '                            <img src="./img/user.png" alt="">\n' +
            '                            <div>'+nickName+'</div>\n' +
            '                            <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n' +
            '                        </div>')
        $audioSiteUserBox.append($div_video);
        //检查是不是主持人
        if(isHost(mSelfUserId)){
            $('#'+mSelfUserId+'videoArea .icon_hostFlag').addClass('icon_hostFlag1').css("visibility","visible");
            // $('#passwordSetting').removeAttr("disabled");
        }else if(isCanHost(mSelfUserId)){
            $('#'+mSelfUserId+'videoArea .icon_hostFlag').addClass('icon_hostFlag2').css("visibility","visible");
        }
        //语音会议定时器初始化
        timerMeeting = new timerTool()
        //开始计时
        timerMeeting.begin('audio_time')
    }
    //远程共享桌面遮罩层
    var $remoteShareScreenBox = $("<div id='remoteShareScreenBox'></div>");
    $videoSiteBox.append($remoteShareScreenBox);
    $remoteShareScreenBox.hide();
    //录制定时器初始化
    timerRecord = new timerTool()
    //检测发言人定时器初始化
    timerSpeak = new timerTool()
    //开始检测
    timerSpeak.begin('',checkIsSpeak)
    if (isOpenMicrophone){
        var errorcode = meetingInstance.openMicrophone();
        if(errorcode != 0){
            hideMessager();
            $.messager.alert('提示','打开麦克风失败，错误码/原因：'+errorcode)
        }
    }
}
//检测当前谁在发言
function checkIsSpeak() {
    var userList = meetingInstance.fetchAllMeetingUserCompletion()
    var volume;
    var targetId ;
    for(var i = 0;i<userList.length;i++){
        if(userList[i].microphoneState){
            targetId= userList[i].userId;
            volume = meetingInstance.webSDKInstance.getUserState({
                userId: targetId,
                infoName:  BRAC_USERSTATE_SPEAKVOLUME, // 用户当前说话音量（参数为double类型（0.0 ~ 100.0））
            });
            if(volume>0) {
                $('#'+targetId+'videoArea .icon_speak').css("visibility","visible");
                //白板消息面板发言图标
                if(isHost(targetId)){
                    $('#whiteBoard_hostVideo .icon_speak').css("visibility","visible");
                }
            }else{
                $('#'+targetId+'videoArea .icon_speak').css("visibility","hidden");
                //白板消息面板发言图标
                if(isHost(targetId)){
                    $('#whiteBoard_hostVideo .icon_speak').css("visibility","hidden");
                }
            }
        }
    }


}
//添加视频/语音块
function addVideoArea(userId,userName) {
    //只要有人进来就请求其音视频流
    //单个视频块（包含视频与名字）
    // var div_video = document.createElement("div");
    var $div_video = $("<div id='"+userId+'videoArea'+"'></div>");
    // div_video.id = userId+'videoArea';
    $div_video.addClass('videoArea');
    var isHostFlag = isHost(userId);
    if(meetingType){
        //视频会议
        var $videoSiteBox = $("#videoSite");
        // 创建用户视频div
        // var div_videoSite = document.createElement("div");
        var $div_videoSite = $("<div id='"+userId+'videoSite'+"'></div>");
        // div_videoSite.id = userId+'videoSite';
        $div_videoSite.addClass('videoSite');

        //创建用户名字div
        // var div_nameSite = document.createElement("div");
        // div_nameSite.setAttribute("class",'nameSite')
        var $div_nameSite = $("<div></div>");
        $div_nameSite.addClass('nameSite AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter');
        // var userName = meetingInstance.getNameById(userId)
        $div_nameSite.html( '<img alt="" class="icon_host">\n' +
            '                     <span>'+userName+'</span>\n' +
            '                     <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n');
        //单个视频块包括视频与用户名
        $div_video.append($div_videoSite);
        $div_video.append($div_nameSite);

        if(isHost(userId)){
            //检查是不是主持人
            //放第一个，添加标识
            $videoSiteBox.prepend($div_video);
            // $('#'+userId+'videoArea .icon_host').css("visibility","visible");
            $('#'+userId+'videoArea .icon_host').attr("src","./img/icon_isHost1.png").css("visibility","visible");
        }else {
            $videoSiteBox.append($div_video);
            if(isCanHost(userId)){
                //检查是不是管理员
                $('#'+userId+'videoArea .icon_host').attr("src","./img/icon_isHost2.png").css("visibility","visible");
            }
        }
        //自适应
        videoAdapter('videoSite')
        meetingInstance.getVideoStream(userId+'videoSite',userId);
    }else {
        //语音会议
        var $audioSiteUserBox =$("#audioSite_top");
        var childrenDivNum = $audioSiteUserBox.children().length;
        var userNum = meetingInstance.fetchAllMeetingUserCompletion().length;
        $div_video.html('<div class="userItem">\n' +
            '                            <div class="icon_hostFlag"></div>\n' +
            '                            <img src="./img/user.png" alt="">\n' +
            '                            <div id="">'+userName+'</div>\n' +
            '                            <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n' +
            '                        </div>')
        if(userNum>12) {
            $audioSiteUserBox.children('.videoArea:last').html('<div class="userItem">\n' +
                '                            <img src="./img/lessUser.png" alt="">\n' +
                '                            <div id="lessNum">'+(userNum-childrenDivNum+1)+'+'+'</div>\n' +
                '                        </div>').attr('id','lastUserItem')
            //检查是不是主持人
            if(isHostFlag){
                $('#audioSite_top div:nth-of-type(11)').remove();
                //放第一个，移除第11个
                $audioSiteUserBox.prepend($div_video)

            }
        }else if (userNum<12 || userNum == 12){
            //检查是不是主持人
            if(isHostFlag){
                //放第一个
                $audioSiteUserBox.prepend($div_video)
            }else{
                //往后放
                $audioSiteUserBox.append($div_video);
            }

        }
        //检查是不是主持人
        if(isHostFlag){
            $('#'+userId+'videoArea .icon_hostFlag').addClass('icon_hostFlag1');
        }else if(isCanHost(userId)){
            //检查是不是管理员
            $('#'+userId+'videoArea .icon_hostFlag').addClass('icon_hostFlag2');
        }
    }
    meetingInstance.getAudioStream(userId);
}
//移除视频/语音块
function removeVideoArea(userId){
    if(meetingType){
        var $videoSiteBox = $("#videoSite");
        var $leaveVideoArea = $('#'+userId+'videoArea');
        $leaveVideoArea.remove();
        //自适应
        videoAdapter('videoSite')
    }else {
        var $audioSiteUserBox =$("#audioSite_top");
        var $leaveAudioArea = $('#'+userId+'videoArea');
        var $lastUserItem = $('#lastUserItem');
        var $less = $('#lessNum');
        //已显示的语音块的userid
        var userList = meetingInstance.fetchAllMeetingUserCompletion();
        var userCount = userList.length;//人数
        var showDivArr = [];
        if(userCount > 12){
            //人数超过12
            //该用户有对应语音块
            if($leaveAudioArea.length != 0){
                //前11中移除了自己）
                $leaveAudioArea.remove();
                //前11个
                for(var i = 0;i<11;i++){
                    showDivArr.push(parseInt($audioSiteUserBox.children('.videoArea').eq(i).attr('id')).toString())
                }
                //找出一个未显示userid显示
                var noShowUserId;//未显示的userid
                for(var j = 0;j < userList.length;j++){
                    for(var i = 0;i<showDivArr.length;i++){
                        if( showDivArr.indexOf(userList[j].userId) == -1){
                            noShowUserId = userList[j].userId;
                            break
                        }
                    }
                    if( noShowUserId){
                        break
                    }
                }
                //移除对应语音块(如果在之前的11个块中)，并从剩余的取出一个显示
                $leaveAudioArea.remove();
                //添加语音块
                //用户名
                var noShowUserName = meetingInstance.getNameById(noShowUserId);
                var $newAudioArea =$('<div >\n' +
                    '                   <div class="userItem">\n' +
                    '                       <div class="icon_hostFlag"></div>\n' +
                    '                       <img src="./img/user.png" alt="">\n' +
                    '                       <div id="">'+noShowUserName+'</div>\n' +
                    '                       <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n' +
                    '                </div>\n' +
                    '</div>');
                $newAudioArea.attr('id',noShowUserId+'videoArea').addClass('videoArea');
                $lastUserItem.before($newAudioArea);
            }
            //未显示的人数减1
            $less.text(parseInt($less.text())-1+'+');
        }else if(userCount == 12){
            //前11个
            for(var i = 0;i<11;i++){
                showDivArr.push(parseInt($audioSiteUserBox.children('.videoArea').eq(i).attr('id')).toString())
            }
            //找出一个未显示userid显示
            var noShowUserId;//未显示的userid
            for(var j = 0;j < userList.length;j++){
                for(var i = 0;i<showDivArr.length;i++){
                    if( showDivArr.indexOf(userList[j].userId) == -1){
                        noShowUserId = userList[j].userId;
                        break
                    }
                }
                if( noShowUserId){
                    break
                }
            }
            //移除对应语音块
            $leaveAudioArea.remove();
            //移除最后一个的语音块
            $lastUserItem.remove();
            //添加语音块
            //用户名
            var noShowUserName = meetingInstance.getNameById(noShowUserId);
            var $newAudioArea =$('<div >' +
                '                   <div class="userItem">\n' +
                '                       <div class="icon_hostFlag"></div>\n' +
                '                       <img src="./img/user.png" alt="">\n' +
                '                       <div id="">'+noShowUserName+'</div>\n' +
                '                       <img src="./img/icon_isSpeak.png" alt="" class="icon_speak">\n' +
                '                </div>' +
                '</div>');
            $newAudioArea.attr('id',noShowUserId+'videoArea').addClass('videoArea');
            $audioSiteUserBox.append($newAudioArea);
        }
        else{
            //移除对应语音块
            $leaveAudioArea.remove();
        }
    }

}
//是否具备管理权限
function isCanHost(targetId){
    return meetingInstance.isCanHost(targetId.toString())
}
//是否是主持人
function isHost(targetId) {
    return meetingInstance.isHost(targetId.toString())
}
//视频大小适配器 传入父元素，自动检测合适布局
function videoAdapter(parentId) {
    var parentDiv = $("#"+parentId)[0];
    // 视频块数量（其中一个div是远程共享桌面层）
    var count = $(parentDiv).find('.videoArea').length;
    //行列
    var row = 1;
    var col = 1;
    //父容器大小
    var parentHeight = parentDiv.offsetHeight;
    var parentWidth = parentDiv.offsetWidth;
    //单个视频块最大宽高 百分比
    var maxHeight = 0;
    var maxWidth =0;
    //视频块大小（videoH是包含用户名的视频块的高度）
    var videoW=0;
    var videoH = 0;

    switch (count){
        case 1:
            //独享整个
            maxHeight = 1;
            maxWidth = 1;
            row = 1;
            col = 1;
            break;
        case 2:
            //水平并列
            maxHeight = 1;
            maxWidth = 0.49;//防止小数0.5累加超过父元素
            row = 1;
            col = 2;
            break;
        case 3:
        //两行两列
        case 4:
            //两行两列
            maxHeight = 0.49;
            maxWidth = 0.49;
            row = 2;
            col = 2;
            break;
        case 5:
        //两行三列
        case 6:
            //两行三列
            maxHeight = 0.49;
            maxWidth = 0.33;
            row = 2;
            col = 3;
            break;
        case 7:
        //7-9,三行三列
        case 8:

        case 9:
            maxHeight = 0.33;
            maxWidth = 0.33;
            row = 3;
            col = 3;
            break;
        case 10:
        //10-12三行四列
        case 11:
        case 12:
            maxHeight = 0.33;
            maxWidth = 0.249;
            row = 3;
            col = 4;
            break;
        default:
            //13-16,四行四列
            maxHeight = 0.249;
            maxWidth = 0.249;
            row = 4;
            col = 4;

    }
    var i = 0
    //是否超出,先假设超出，
    // var isOver = true;
    var isOver = false
    //保持视频4-3宽高比,先以高作为基准，-20px名字的高度才是真正视频的高度
    videoH = parentHeight * maxHeight;
    videoW = (videoH -20) / 3*4;
    isOver = videoW > parentWidth * maxWidth;
    if(isOver){
        //超出则以宽作为基准
        videoW = parentWidth * maxWidth ;
        videoH = videoW / 4*3 +20;
    }
    //如果此时parentWidth宽度足够放置更多videoW（n），
    // 导致行数降低，parentWidth/n为maxWidth，重新检测videoW，videoH
    //实际一行可放div
    var rowDivs = parseInt(parentWidth/videoW);
    //row-1足够放置当前所有div(正常屏幕最多也只能减一列)
    if( rowDivs*(row - 1) >= count){
        row = row - 1;
        //实际最优列数，向上取整
        col = Math.ceil(count/row);
        maxHeight = 1/row -0.01;
        maxWidth = 1/col -0.01;
        videoW = parentWidth * maxWidth ;
        videoH = videoW / 4*3 +20;
        isOver = videoH > parentHeight * maxHeight;
        if(isOver){
            //超出则以宽作为基准
            videoH = parentHeight * maxHeight ;
            videoW = (videoH -20) / 3*4;
        }
    }
    var childNodes = parentDiv.getElementsByClassName('videoArea')
    Array.from(childNodes).forEach(function(childNode){
        //视频块videoArea
        // childNode.style.width = videoW+"px"
        // childNode.style.height = videoH +"px";
        //视频区域videoSite,20px为名字的高度，4为border的宽度
        childNode.firstChild.style.width = videoW -4+"px";
        childNode.firstChild.style.height = videoH -20-4+"px";
    })

}
//摄像头操作(打开、关闭)
function operateCamera() {
    //有active的是关闭状态,0 这种dom元素状态作为当前状态的依据可靠吗？
    if(noVideoFlag && !isCanHost(mSelfUserId)){
        //禁止状态下不允许操作
        // showTip('摄像头操作已被禁止，请联系主持人或管理员解除限制')
        $.messager.popup('摄像头操作已被禁止，请联系主持人或管理员解除限制',3000)
        return
    }
    var currentStatus = !($('#icon_carmar').attr('class') === 'active')
    if(currentStatus){
        $('#icon_carmar').attr('class','active');
        $('#'+mSelfUserId+'_CameraTag_show').removeClass('icon_carmar1').addClass('icon_carmar0');
        $("#wbMediaOperate_camera").removeClass('active');
        //关闭摄像头
        meetingInstance.closeCamera(true)
    }else{
        $('#icon_carmar').attr('class','');
        $('#'+mSelfUserId+'_CameraTag_show').removeClass('icon_carmar0').addClass('icon_carmar1');
        $("#wbMediaOperate_camera").addClass('active');
        //打开摄像头(分白板界面打开和主界面打开)
        // meetingInstance.openCameraInRenderView(mSelfUserId+'videoSite')
        var errorcode;
        //如果当前是打开白板状态，且自己为主持人
        var status = $("#whiteBoardSite").css('visibility');
        if(status === 'visible' && isHost(mSelfUserId)){
            //打开白板消息面板的主持人视频
            errorcode = meetingInstance.openCameraInRenderView('hostVideoSite',true);
        }else{
            errorcode = meetingInstance.openCameraInRenderView(mSelfUserId+'videoSite',true);
        }

        if(errorcode != 0){
            hideMessager();
            $.messager.alert('提示','打开摄像头失败，错误码/原因：'+errorcode)
        }
    }
}
//切换摄像头
function switchCamera() {
    var cameraName = $(this).text()
    meetingInstance.switchCamera(cameraName)
}
//切换麦克风
function  switchMicrophone(){
    var microphoneName = $(this).text()
    meetingInstance.switchMicrophone(microphoneName)
}
//麦克风操作（打开/关闭）
function operateMicrophone() {
    if(noAudioFlag && !isCanHost(mSelfUserId)){
        //禁止状态下不允许操作
        // showTip('麦克风操作已被禁止，请联系主持人或管理员解除限制')
        $.messager.popup('麦克风操作已被禁止，请联系主持人或管理员解除限制',3000)
        return
    }
    //有active的是打开,1
    var currentStatus = ($('#icon_audio').attr('class') === 'active')
    if(currentStatus){
        $('#icon_audio').attr('class','');
        $('#'+mSelfUserId+'_AudioTag_show').removeClass('icon_audio1').addClass('icon_audio0');
        $("#wbMediaOperate_microphone").removeClass('active');
        //关闭麦克风
        meetingInstance.closeMicrophone();
        //防止关闭麦克风时发言图标刚好显示
        $('#'+mSelfUserId+'videoArea .icon_speak').css("visibility","hidden");
        //白板消息面板发言图标
        if(isHost(mSelfUserId)){
            $('#whiteBoard_hostVideo .icon_speak').css("visibility","hidden");
        }
    }else{
        var errorcode = meetingInstance.openMicrophone();
        if(errorcode != 0){
            hideMessager();
            $.messager.alert('提示','打开麦克风失败，错误码/原因：'+errorcode);
            return
        }
        $('#icon_audio').attr('class','active');
        $('#'+mSelfUserId+'_AudioTag_show').removeClass('icon_audio0').addClass('icon_audio1');;
        $("#wbMediaOperate_microphone").addClass('active');
        //打开麦克风
        // meetingInstance.openMicrophone()
    }
}
//自身静音
function isOpenVoice() {
    //有active的是关闭状态,0
    var currentStatus = !($('#icon_voice').attr('class') === 'active')

    // var userList = meetingInstance.fetchAllMeetingUserCompletion();
    // var openMicrophoneList = userList.filter(function (user) {
    //     return user.isOpenMicrophone == true && user.userId!=mSelfUserId;
    // })
    if(currentStatus){
        //开启自身静音（等同关闭扬声器）
        meetingInstance.closeAudioPlayBack()
        $('#icon_voice').attr('class','active') ;
        $("#wbMediaOperate_voice").removeClass('active');
        $("#wbMediaOperate_voice_normalPerson").removeClass('active');
        // //不接收所有其他参会者音频流就是自身静音
        // for(var i =0;i<openMicrophoneList.length;i++){
        //     meetingInstance.cancelAudioStream(openMicrophoneList[i].userId)
        // }
    }else {
        //关闭静音
        $('#icon_voice').attr('class','');
        $("#wbMediaOperate_voice").addClass('active');
        $("#wbMediaOperate_voice_normalPerson").addClass('active');
        meetingInstance.openAudioPlayBack()
        //不接收所有其他参会者音频流就是自身静音
        // for(var i =0;i<openMicrophoneList.length;i++){
        //     meetingInstance.getAudioStream(openMicrophoneList[i].userId)
        // }
    }



}
//全体静音操作（关闭除主持人外的所有麦克风）
function allNoVoice() {
    //是否有权限
    if(!isCanHost(mSelfUserId)){
        // showTip('非管理员或主持人没有操作权限')
        $.messager.popup('非管理员或主持人没有操作权限',3000)
        return
    }

    //有allNoVoice0的是未设置全体静音
    var currentStatus = ($('#allNoVoice').attr('class') === 'allNoVoice0');
    if(currentStatus){
        $('#allNoVoice').attr('class','allNoVoice1');
        $('#allNoVoice').val('解除静音');
        meetingInstance.enableAudioInAllMeeting(0)
    }else{
        $('#allNoVoice').attr('class','allNoVoice0');
        $('#allNoVoice').val('全体静音');
        meetingInstance.enableAudioInAllMeeting(1)
    }

}
//操作远程用户摄像头
function operateRemoteCamera(ele) {
    preventClickQuick(function () {
        // console.log(ele.id)
        var targetId = parseInt(ele.id)
        //是否有权限
        if(!isCanHost(mSelfUserId)){
            // showTip('非管理员或主持人没有操作权限')
            $.messager.popup('非管理员或主持人没有操作权限',3000)
            return
        }
        else if(isHost(targetId)){
            // showTip('你不能操作主持人的摄像头')
            $.messager.popup('你不能操作主持人的摄像头',3000)
            return
        }
        else if(isCanHost(targetId)){
            // showTip('你不能操作其他管理员的摄像头')
            $.messager.popup('你不能操作其他管理员的摄像头',3000)
            return
        }
        //icon_carmar1代表开启
        // var currentStatus = ($('#'+targetId+'_CameraTag').attr('class') == 'icon_carmar1 btn_icon');
        var currentStatus = ($('#'+targetId+'_CameraTag').hasClass('icon_carmar1'));
        if(currentStatus){
            // getID(targetId+'_CameraTag').className = 'icon_carmar0 btn_icon';
            //关闭参会者摄像头
            meetingInstance.enableVideoWithUserId(targetId ,0)
        }else{
            // getID(targetId+'_CameraTag').className = 'icon_carmar1 btn_icon';
            //打开参会者摄像头
            meetingInstance.enableVideoWithUserId(targetId ,1)
        }
    })
}
//参会者摄像头状态图标改变
function changeCameraIcon(targetId,isOpen){
    //icon_carmar1代表开启
    if(isOpen){
        $('#'+targetId+'_CameraTag_show').removeClass('icon_carmar0').addClass('icon_carmar1');
        $('#'+targetId+'_CameraTag').removeClass('icon_carmar0').addClass('icon_carmar1');
        $('#'+targetId+'_CameraTag').val('关闭摄像头')
    }else {
        $('#'+targetId+'_CameraTag_show').removeClass('icon_carmar1').addClass('icon_carmar0');
        $('#'+targetId+'_CameraTag').removeClass('icon_carmar1').addClass('icon_carmar0');
        $('#'+targetId+'_CameraTag').val('打开摄像头')
    }
}
//操作远程客户麦克风
function operateRemoteMicrophone(ele) {
    preventClickQuick(function () {
        var targetId = parseInt(ele.id);
        //是否有权限
        if(!isCanHost(mSelfUserId)){
            // showTip('非管理员或主持人没有操作权限')
            $.messager.popup('非管理员或主持人没有操作权限',3000)
            return
        }
        else if(isHost(targetId)){
            // showTip('你不能操作主持人的麦克风')
            $.messager.popup('你不能操作主持人的麦克风',3000)
            return
        }
        else if(isCanHost(targetId)){
            // showTip('你不能操作其他管理员的麦克风')
            $.messager.popup('你不能操作其他管理员的麦克风',3000)
            return
        }
        //icon_audio1代表开启
        // var currentStatus = ($('#'+targetId+'_AudioTag').attr('class') == 'icon_audio1 btn_icon');
        var currentStatus = ($('#'+targetId+'_AudioTag').hasClass('icon_audio1'));
        if(currentStatus){
            // getID(targetId+'_AudioTag').className = 'icon_audio0 btn_icon'
            //关闭参会者麦克风
            meetingInstance.enableAudioWithUserId(targetId ,0)
        }else{
            // getID(targetId+'_AudioTag').className = 'icon_audio1 btn_icon'
            //打开参会者麦克风
            meetingInstance.enableAudioWithUserId(targetId ,1)
        }
    })


}
//参会者麦克风状态图标改变
function changeMicrophoneIcon(targetId,isOpen){
    //icon_audio1代表开启
    if(isOpen){
        $('#'+targetId+'_AudioTag_show').removeClass('icon_audio0').addClass('icon_audio1');
        $('#'+targetId+'_AudioTag').removeClass('icon_audio0').addClass('icon_audio1');
        $('#'+targetId+'_AudioTag').val('关闭麦克风');
    }else {
        $('#'+targetId+'_AudioTag_show').removeClass('icon_audio1').addClass('icon_audio0');
        $('#'+targetId+'_AudioTag').removeClass('icon_audio1').addClass('icon_audio0');
        $('#'+targetId+'_AudioTag').val('打开麦克风');
    }
}
//赋予/收回管理员权限
function setUserPermission(ele) {
    var targetId = parseInt(ele.id);
    var targetUserName = meetingInstance.getNameById(targetId.toString())
    //判断是否是主持人
    if(!isHost(mSelfUserId)){
        // showTip('非主持人没有操作权限')
        $.messager.popup('非主持人没有操作权限',3000)
        return
    }
    // var currentStatus = $(ele).hasClass('icon_hostState2');
    var currentStatus = ($(ele).hasClass('icon_hostState2'));
    if(currentStatus){
        // showTip('你确定撤销'+targetUserName+'管理员权限吗？','confirm',function () {
        //     meetingInstance.enableUserPermission(targetId.toString(),false)
        // })
        hideMessager();
        // $.messager.confirm('提示','你确定撤销'+targetUserName+'管理员权限吗？',function () {
            meetingInstance.enableUserPermission(targetId.toString(),false)
        // })
    }else{
        // showTip('你确定赋予'+targetUserName+'管理员权限吗？','confirm',function () {
        //     meetingInstance.enableUserPermission(targetId.toString(),true)
        // })
        hideMessager();
        // $.messager.confirm('提示','你确定赋予'+targetUserName+'管理员权限吗？',function () {
            meetingInstance.enableUserPermission(targetId.toString(),true)
        // })
    }

}
//赋予/收回管理员后界面改变
function setUserPermissionChangeUi(targetId,enable) {
    var $hostFlagSpan = $('#'+targetId+ '_UserDiv .userNameSpan .hostFlagSpan');
    var targetUserName = meetingInstance.getNameById(targetId.toString());
    //本地时间 yyyyMMddHHmmSS格式的时间
    var timeStr = meetingInstance.generateTimeRequestNumber();
    var content ='';
    if(enable){
        //赋权
        //参会者界面管理员标识
        // $('#'+targetId+'_hostState').attr('class','icon_hostState2 operateBtn');
        $('#'+targetId+'_hostState').removeClass('icon_hostState0').addClass('icon_hostState2');
        $('#'+targetId+'_hostState').val('撤销管理员');
        $('#'+targetId+'_faceTag').attr("src","./img/icon_hostState2.png");
        //添加/显示管理员标志块
        if($hostFlagSpan.length){
            $hostFlagSpan.show();
        }else{
            var $newHostFlagSpan = $("<span></span>");
            $newHostFlagSpan.text('管理员');
            $newHostFlagSpan.attr('class',"hostFlagSpan");
            $('#'+targetId+ '_UserDiv .userNameSpan').append($newHostFlagSpan);
        }
        //视频界面管理员标识
        if(meetingType){
            $('#'+targetId+'videoArea .icon_host').attr("src","./img/icon_isHost2.png").css("visibility","visible");
        }else {
            $('#'+targetId+'videoArea .icon_hostFlag').addClass('icon_hostFlag2');

        }

        if(mSelfUserId === targetId){
            //如果当前是打开白板状态
            var status = $("#whiteBoardSite").css('visibility');
            if(status === 'visible'){
                // showTip('你已成为管理员，可以操作白板');
                $.messager.popup('你已成为管理员，可以操作白板',3000)
                // $('#AnyChatMeeting_whiteBoard_Mask').hide();

            }
            //切换白板模式为互动模式
            mycanvas.setWhiteBoardMode(0)//设置交互模式
            //结束会议按钮显示
            $('#AnyChatMeeting_end').css("visibility","visible");
            //有密码修改模块
            $('#passwordSetting').css("visibility",'visible');
            content ="主持人已将你设置为管理员";
            changeWhiteBoardShowUIMode();
        }else{
            content = targetUserName+"已成为管理员";
        }
        //消息提示
        showMessage(content,'','系统消息',timeStr,'sys')
    }else{
        //收回
        //参会者界面管理员标识
        // $('#'+targetId+'_hostState').attr('class','icon_hostState0 operateBtn');
        $('#'+targetId+'_hostState').removeClass('icon_hostState2').addClass('icon_hostState0');
        $('#'+targetId+'_hostState').val('设置管理员');
        $('#'+targetId+'_faceTag').attr("src","./img/icon_hostState0.png");

        //隐藏管理员标志块
        $hostFlagSpan.hide();
        //视频界面主持人标识
        if(meetingType){
            $('#'+targetId+'videoArea .icon_host').attr("src","./img/icon_isHost2.png").css("visibility","hidden");
        }else {
            $('#'+targetId+'videoArea .icon_hostFlag').removeClass('icon_hostFlag2');

        }
        if(mSelfUserId === targetId){
            //如果当前是打开白板状态
            var status = $("#whiteBoardSite").css('visibility');
            if(status === 'visible'){
                // showTip('你的权限已被收回，不可以操作白板')
                $.messager.popup('你的权限已被收回，不可以操作白板',3000)
                // $('#AnyChatMeeting_whiteBoard_Mask').show()

            }
            //切换白板模式为观看模式
            mycanvas.setWhiteBoardMode(1)//设置交互模式
            //结束会议按钮隐藏
            $('#AnyChatMeeting_end').css("visibility","hidden");
            //无密码修改模块
            $('#passwordSetting').css("visibility",'hidden');
            content = "主持人已撤销你的管理员权限";
            //白板显示界面模式更改
            changeWhiteBoardShowUIMode();
        }else{
            content = targetUserName+"管理员权限已被主持人撤销";
        }
        //消息提示
        showMessage(content,'','系统消息',timeStr,'sys')
    }
    //参会者列表ui更改
    setUserListOperateUIForAll();


}
// 对参会者列表中的用户进行添加、删除操作
function meetingUserListControl(userid,userName,isOpenCamera,isOpenMicrophone,hostState,bInsert) {
    var $userListBox = $('#userList');
    if (bInsert) {
        var $itemdiv = $("<div id='"+ userid + '_UserDiv' +"'></div>");

        $itemdiv.attr("class", "userItem");
        // itemdiv.setAttribute("class", "AnyChatMeeting_flexVerCenter");
        // itemdiv.setAttribute("class", "AnyChatMeeting_flexBetween");
        // itemdiv.id = userid + "_UserDiv";
        var audioTagText = '打开麦克风';
        var cameraTagText = '打开摄像头';
        var hostStateTagText = '设置管理员';
        var takeSnapShotText = '拍照'
        if(isOpenMicrophone){
            audioTagText = '关闭麦克风'
        }
        if(isOpenCamera){
            cameraTagText = '关闭摄像头'
        }
        if(hostState==2){
            hostStateTagText = '撤销管理员'
        }
        $itemdiv.html('<div class=" AnyChatMeeting_flexVerCenter AnyChatMeeting_flexBetween">\n' +
            '                            <img src="./img/icon_hostState'+ hostState+'.png"  alt="头像" class="icon_faceTag" id="'+userid+'_faceTag"">\n' +
            '                            <div class="userNameSpan">\n' +
            '                                <span>'+userName+'</span>\n' +
            '                            </div>\n' +
            '                            <input type="button" id="'+userid+'_AudioTag_show" class="icon_audio'+ isOpenMicrophone+' btn_icon" "/>\n' +
            '                            <input type="button"  id="'+userid+'_CameraTag_show" class="icon_carmar'+ isOpenCamera+' btn_icon" "/>\n'+
            '                            <input type="button" class="collapseBtn" data-toggle="collapse" data-target="#'+userid+'_collapseArea" id="'+userid+'_collapseBtn"/>\n' +
            '                        </div>\n' +
            '                        <div id="'+userid+'_collapseArea" class="collapse">\n' +
            '<ul class="collapseArea AnyChatMeeting_start AnyChatMeeting_flexBetween AnyChatMeeting_wrap " >\n' +
            '<li><input type="button" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' operateBtn" onclick="operateRemoteMicrophone(this)" value="'+audioTagText+'"/></li>\n' +
            '<li><input type="button" id="'+userid+'_CameraTag" class="icon_carmar'+ isOpenCamera+' operateBtn" onclick="operateRemoteCamera(this)" value="'+cameraTagText+'"/></li>\n' +
            '<li><input type="button" id="'+userid+'_hostState" class="icon_hostState'+ hostState+' operateBtn" onclick="setUserPermission(this)" value="'+hostStateTagText+'"/></li>\n' +
            '<li><input type="button" id="'+userid+'" class="icon_hostState'+ hostState+' operateBtn" onclick="takeSnapShot(this)" value="'+takeSnapShotText+'"/></li>\n' +
            '<li><input type="button" id="'+userid+'_kickUser" class="icon_kickUser operateBtn" onclick="kickUser(this)" value="踢出会议"/></li>\n' +
            '</ul>\n' +

            // '                           <input type="button" name="audio" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' btn_icon" onclick="operateRemoteMicrophone(this)"/>\n'+
            // '                           <input type="button" name="carmar" id="'+userid+'_CameraTag" class="icon_carmar'+ isOpenCamera+' btn_icon" onclick="operateRemoteCamera(this)"/>\n'+
            // '                           <input type="button" name="hostState" id="'+userid+'_hostState" class="icon_hostState'+ hostState+' btn_icon" onclick="setUserPermission(this)"/>\n'+
            // '                           <input type="button" name="kickUser" id="'+userid+'_kickUser" class=" btn_icon" onclick="kickUser(this)"/>\n'+
            '                        </div>')

        // if (userid == mSelfUserId) {
        //     $itemdiv.html('<div class=" AnyChatMeeting_flexVerCenter AnyChatMeeting_flexBetween">\n' +
        // '                            <img src="./img/icon_hostState'+ hostState+'.png"  alt="头像" class="icon_faceTag" id="'+userid+'_faceTag">\n' +
        // '                            <div class="userNameSpan">\n' +
        // '                                <span>'+userName+'</span>\n' +
        // '                            </div>\n' +
        // '                            <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#'+userid+'_collapseArea" style="visibility: hidden">折叠按钮</button>\n' +
        // '                        </div>')
        //             // '<span class='longUserNameSpan'>" + instance.getUserName({userId: mSelfUserId}) + "(自己)</span>';
        //
        // }else{
        //
        // }
        // switchUserListOperateUI(userid);
        // if(meetingType){
        //     // 判断当前ID是否为自己(自己不显示操作按钮)
        //     if (userid == mSelfUserId) {
        //         $itemdiv.html( '<img src="./img/icon_faceTag.png"  alt="头像" class="icon_faceTag">'+
        //             '<div class="userNameSpan">' +
        //             '<span>'+userName+'</span>' +
        //             // '<span>'+userName+'</span><span>自己</span>' +
        //             '</div>'+
        //             '<input type="button" name="audio" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' btn_icon" onclick="operateMicrophone()"/>'+
        //             '<input type="button" name="carmar" id="'+userid+'_CameraTag" class="icon_carmar'+ isOpenCamera+' btn_icon" onclick="operateCamera()"/>'+
        //             '<input type="button" name="hostState" id="'+userid+'_hostState" class=" icon_hostState'+ hostState+' btn_icon" />')
        //         // '<span class='longUserNameSpan'>" + instance.getUserName({userId: mSelfUserId}) + "(自己)</span>';
        //
        //     }
        //     else {
        //         $itemdiv.html('<img src="./img/icon_faceTag.png"  alt="头像" class="icon_faceTag">'+
        //             '<div class="userNameSpan" >' +
        //             '<span>'+userName+'</span>' +
        //             // '<span>'+userName+'</span><span>自己</span>' +
        //             '</div>'+
        //             '<input type="button" name="audio" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' btn_icon" onclick="operateRemoteMicrophone(this)"/>'+
        //             '<input type="button" name="carmar" id="'+userid+'_CameraTag" class="icon_carmar'+ isOpenCamera+' btn_icon" onclick="operateRemoteCamera(this)"/>'+
        //             '<input type="button" name="hostState" id="'+userid+'_hostState" class=" icon_hostState'+ hostState+' btn_icon" onclick="setUserPermission(this)"/>')
        //     }
        // }
        // else {
        //     // 判断当前ID是否为自己
        //     if (userid == mSelfUserId) {
        //         $itemdiv.html ('<img src="./img/icon_faceTag.png"  alt="头像" class="icon_faceTag">'+
        //             '<div class="userNameSpan" ><span>'+userName+'</span></div>'+
        //             '<input type="button" name="audio" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' btn_icon" onclick="operateMicrophone()"/>'+
        //             '<input type="button" name="hostState" id="'+userid+'_hostState" class=" icon_hostState'+ hostState+' btn_icon" />')
        //         // '<span class='longUserNameSpan'>" + instance.getUserName({userId: mSelfUserId}) + "(自己)</span>';
        //
        //     }
        //     else {
        //         $itemdiv.html('<img src="./img/icon_faceTag.png"  alt="头像" class="icon_faceTag">'+
        //             '<div class="userNameSpan" ><span>'+userName+'</span></div>'+
        //             '<input type="button" name="audio" id="'+userid+'_AudioTag" class="icon_audio'+ isOpenMicrophone+' btn_icon" onclick="operateRemoteMicrophone(this)"/>'+
        //             '<input type="button" name="hostState" id="'+userid+'_hostState" class=" icon_hostState'+ hostState+' btn_icon" onclick="setUserPermission(this)"/>')
        //     }
        // }
        // 添加‘自己’标志
        if (userid == mSelfUserId) {
            var myselfFlagSpan = document.createElement("span");
            myselfFlagSpan.innerText = '自己';
            $itemdiv.find('.userNameSpan').append(myselfFlagSpan)
        }
        //添加角色标志
        if (hostState == 1){
            var hostFlagSpan = document.createElement("span");
            hostFlagSpan.innerText = '主持人';
            hostFlagSpan.class = "hostFlagSpan";
            $itemdiv.find('.userNameSpan').append(hostFlagSpan)
            $userListBox.prepend($itemdiv)
        }else if(hostState == 2){
            var hostFlagSpan = document.createElement("span");
            hostFlagSpan.innerText = '管理员';
            hostFlagSpan.class = "hostFlagSpan";
            $itemdiv.find('.userNameSpan').append(hostFlagSpan);
            $userListBox.append($itemdiv);
        }else{
            $userListBox.append($itemdiv);
        }
        //语音会议不显示摄像头
        var $cameraShowIcon = $('#'+userid+'_CameraTag_show');
        if(meetingType){
            $cameraShowIcon.show()
        }else{
            $cameraShowIcon.hide()
        }
        //添加事件
        // MicrophoneOnclick(userid);
        //添加折叠/展开事件监听
        $('#'+userid+'_collapseArea').on('show.bs.collapse', function () {
            $('#'+userid+'_collapseBtn').addClass('active');
            $('#'+userid+'_UserDiv').css('background-color','rgba(53,53,53,1)')
        });
        $('#'+userid+'_collapseArea').on('hide.bs.collapse', function () {
            $('#'+userid+'_collapseBtn').removeClass('active')
            $('#'+userid+'_UserDiv').css('background-color','unset')
        });
        setUserListOperateUI(userid);
    }
    else {
        var $currentItem = $('#'+userid + "_UserDiv");
        $currentItem.remove();
    }
    //滚动到对应位置
    // DisplayScroll("room_div_userlist");
    changeUserListCount()
}
//设置参会者列表对应用户操作界面(主持人，管理员，参会者)
function setUserListOperateUI(targetUserId){

    // 视频会议：
    // 当前是主持人：设置管理员 、踢出房间、禁止摄像头、禁止麦克风
    // 当前是管理员：踢出房间、禁止摄像头、禁止麦克风
    // 语音会议：
    // 当前是主持人：设置管理员 、踢出房间、禁止麦克风
    // 当前是管理员：踢出房间、禁止麦克风
//
    var $collapseBtn = $('#'+targetUserId+'_collapseBtn');
    var $collapseArea = $('#'+targetUserId+'_collapseArea');
    var $cameraControlBtn = $('#'+targetUserId+'_CameraTag').parent();
    var $microphoneControlBtn = $('#'+targetUserId+'_AudioTag').parent();
    var $hostStateControlBtn = $('#'+targetUserId+'_hostState').parent();
    var $kickUserControlBtn = $('#'+targetUserId+'_kickUser').parent();
    //剔除为自己/为主持人/自己为普通参会者的情况（者三种情况没有任何操作按钮，也不显示缩略按钮）
    if(targetUserId == mSelfUserId || isHost(targetUserId) || !isCanHost(mSelfUserId)){
        $cameraControlBtn.hide();
        $microphoneControlBtn.hide();
        $hostStateControlBtn.hide();
        $kickUserControlBtn.hide();
        // $collapseBtn.css('visibility','hidden');
        // $collapseArea.collapse('hide');
        return
    }
    //会议类型区分
    if (meetingType){
        //当前角色区分
        if(isHost(mSelfUserId)){
            $cameraControlBtn.show();
            $microphoneControlBtn.show();
            $hostStateControlBtn.show();
            $kickUserControlBtn.show();
            $collapseBtn.css('visibility','visible');
            // $collapseArea.collapse('show');
            //被操作者区分(主持人不能操作其他管理员的摄像头/麦克风，不能踢出房间)
            if(isCanHost(targetUserId)){
                $cameraControlBtn.hide();
                $microphoneControlBtn.hide();
                $kickUserControlBtn.hide();
            }

        }else if(!isHost(mSelfUserId) &&isCanHost(mSelfUserId)){
            //无设置角色权限按钮
            $hostStateControlBtn.hide();
            //对普通用户
            $cameraControlBtn.show();
            $microphoneControlBtn.show();
            $kickUserControlBtn.show();
            $collapseBtn.css('visibility','visible');
            // $collapseArea.collapse('show');
            //被操作者区分(管理员不能操作其他管理员/主持人的摄像头/麦克风，不能踢出房间)
            if(isCanHost(targetUserId)){
                $cameraControlBtn.hide();
                $microphoneControlBtn.hide();
                $kickUserControlBtn.hide();
                $collapseBtn.css('visibility','hidden');
                $collapseArea.collapse('hide');
            }
        }
    }else {
        //语音会议无摄像头操作按钮
        $cameraControlBtn.hide();
        //角色区分
        if(isHost(mSelfUserId)){
            $microphoneControlBtn.show();
            $hostStateControlBtn.show();
            $kickUserControlBtn.show();
            $collapseBtn.css('visibility','visible');
            // $collapseArea.collapse('show');
            //被操作者区分(主持人不能操作其他管理员的摄像头/麦克风，不能踢出房间)
            if(isCanHost(targetUserId)){
                $microphoneControlBtn.hide();
                $kickUserControlBtn.hide();
            }
        }else if(!isHost(mSelfUserId) &&isCanHost(mSelfUserId)){
            //无设置角色权限按钮
            $hostStateControlBtn.hide();
            //对普通用户
            $microphoneControlBtn.show();
            $kickUserControlBtn.show();
            $collapseBtn.css('visibility','visible');
            // $collapseArea.collapse('show');
            //被操作者区分(管理员不能操作其他管理员/主持人的摄像头/麦克风，不能踢出房间)
            if(isCanHost(targetUserId)){
                $microphoneControlBtn.hide();
                $kickUserControlBtn.hide();
                $collapseBtn.css('visibility','hidden');
                $collapseArea.collapse('hide');
            }
        }

    }
}
//设置所有参会者操作界面ui更改
function setUserListOperateUIForAll() {
    // var $userListBox = $('#userList');
    var $userItems =  $('#userList').find('.userItem');
    $userItems.each(function(){
        var currentUserId = parseInt($(this).attr('id'));
        setUserListOperateUI(currentUserId.toString())
        //用$(this)可以访问正在循环的元素
    });
}
//踢出参会者
function kickUser(ele){
    var targetId = parseInt(ele.id);
    console.log('踢出'+targetId);
    var userName = meetingInstance.getNameById(targetId.toString());
    // $.messager.confirm('提示','你确定要将'+userName+'踢出会议吗？',function () {
        // $(ele).attr('class','icon_kickUser1 operateBtn')
        meetingInstance.userLeaveMeetingControl(targetId)
    // })

}
//参会人数改变
function changeUserListCount(){
    var count = meetingInstance.fetchAllMeetingUserCompletion().length;
    $('#userListSite_userCount').text('参会者('+count+')')
}
function testSend() {
    for(var i=0;i<100;i++){
        //本地组装数据显示
        meetingInstance.sendMeetingMessage(i);
    }

}
//发送聊天消息
function sendMessage() {
    var $currentMessageBoard = $(this).parent().parent('.messageSite');
    var $messageTextInput = $currentMessageBoard.find('.messageText');
    var messageText = $messageTextInput.val();

    //本地组装数据显示
    var timeStr = meetingInstance.generateTimeRequestNumber();
    //非空才发送
    if(messageText.trim()){
        meetingInstance.sendMeetingMessage(messageText);
        var nickName = meetingInstance.getNameById(mSelfUserId);
        showMessage(messageText,mSelfUserId,nickName,timeStr)
    }
    //清除输入框
    $messageTextInput.val('');
    //输入框获取自动获取焦点
    $messageTextInput.focus();
}
//显示消息
function showMessage(content,userId,nickName,sendTime,type,contentType) {
    var formatTime = myGetTime(sendTime);
    var $messageListBox = $('.messageList');
    var $messageItem = $("<div></div>");
    var fileUrl = content.url;
    //type为消息类型，默认不传为用户消息，传"sys"为系统消息
    if(type){
        $messageItem.attr("class", "messageItem sys");
        //默认是普通文本消息,如果是file,则表示是录制文件路径，生成a标签
        if(contentType ==='file'){
            // content = '<span class="recordFileUrl" onclick="copyText(this)">'+content+'</span>'
            content = '<span>'+content.des+'</span><br/>' +
                '<input type="button" class="recordFileUrl clipBtn"  value="'+content.url+'" data-clipboard-text="'+fileUrl+'"/>'
                // '<input type="text" readonly="readonly" class="recordFileUrl" ondblclick="copyText(this)" value="'+content.url+'"/>'
            // $(fileUrlSpan).on('click',function () {
            //     console.log('点击显示视频')
            // })
            //readonly="readonly"
        }
    }
    else {
        $messageItem.attr("class", "messageItem");
    }
    // return TheTime.toLocaleTimeString();
    // var formatTime=sendTime.parse("18:23:14")

    // messageItem.id = userId + "_MessageDiv";
    $messageItem.html('<span class="AnyChatMeeting_messageTime">'+formatTime+' </span>'+
        '<p class="AnyChatMeeting_message">'+nickName+':'+ content+'</p>')
    $messageListBox.append($messageItem);
    // initRecordClip(sendTime+'_fileUrl',fileUrl);
    //主界面消息面板滚动到底部
    if ($messageListBox[0].offsetHeight < $messageListBox[0].scrollHeight) { //div可见高度小于div滚动条高度
        $messageListBox.css('overflowY' ,'scroll'); //显示滚动条
        $messageListBox.animate({
            scrollTop:$messageListBox[0].scrollHeight,
        },30)
        // messageListBox.scrollTop = messageListBox.scrollHeight; //滚动条自动滚动到底部
    }
    //白板界面消息面板滚动到底部
    if ($messageListBox[1].offsetHeight < $messageListBox[1].scrollHeight) { //div可见高度小于div滚动条高度
        $messageListBox.css('overflowY' ,'scroll'); //显示滚动条
        $messageListBox.animate({
            scrollTop:$messageListBox[1].scrollHeight,
        },30)
        // messageListBox.scrollTop = messageListBox.scrollHeight; //滚动条自动滚动到底部
    }
    //消息红点逻辑
    if ($("#whiteBoardSite").css("visibility") == "visible" &&
        $('#whiteBoardMessageBoard').css('right') !== '0px'){
        // 如果此时是白板界面，且白板消息面板未展开，则添加红点提示
        messageEedDotOperate(1);
    }
}
//解析yyyyMMddHHmmSS
function myGetTime(timeStr) {
    var hh = timeStr.slice(8,10);
    var mm = timeStr.slice(10,12);
    var ss = timeStr.slice(12);
    return hh+':'+ mm +':'+ss
}
//录制
function recordOperate(ele) {
    //有AnyChatMeeting_icon_record的是显示录制图标，即未开始录制

    var currentStatus = $('#icon_record').attr('class') === 'AnyChatMeeting_icon_record';
    var isOpenMicrophone = ($('#icon_audio').attr('class') === 'active');
    var isOpenCarmar;
    if($('#icon_carmar')){
        isOpenCarmar = !($('#icon_carmar').attr('class') === 'active')
    }
    if(currentStatus){
        if(!meetingType && !isOpenMicrophone){
            //音频会议必须要开启麦克风才能录制
            // showTip('请打开麦克风，再开始录制')
            $.messager.popup('请打开麦克风，再开始录制',3000);
            return
        }
        if(meetingType && !isOpenCarmar){
            //视频会议必须要开启摄像头才能录制
            // showTip('请打开摄像头，再开始录制')
            $.messager.popup('请打开摄像头，再开始录制',3000);
            return
        }
        meetingInstance.startRecord();
        //显示录制时间
        showRecordTime(true)
        $('#icon_record').attr('class','AnyChatMeeting_icon_recordEnd');
        $('#recordBtn').css('background-color','#FF0000');
        ele.lastElementChild.innerText='结束录制';
        isRecording = true;
        // showTip('开始录制')
        // $.messager.popup('结束录制')
    }else{
        meetingInstance.completeRecord();
        isRecording = false;
        //隐藏录制时间
        showRecordTime(false)

        $('#icon_record').attr('class','AnyChatMeeting_icon_record');
        $('#recordBtn').css('background-color','#136CFF');
        ele.lastElementChild.innerText='开始录制';

        // $('#messageModal').modal('show');
        // $.messager.popup('开始录制')
    }
}
//自动复制
function copyText(ele) {
    ele.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    //取消选中x
    // ele.blur()

    // showTip('复制成功')
    $.messager.popup('复制成功',3000)
    //方法2 x
    // var txt = ele.innerText;
    // if (window.clipboardData) {
    //     window.clipboardData.clearData();
    //     clipboardData.setData("Text", txt);
    //     alert("复制成功！");
    //
    // } else if (navigator.userAgent.indexOf("Opera") != -1) {
    //     window.location = txt;
    // } else if (window.netscape) {
    //     try {
    //         netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    //     } catch (e) {
    //         alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
    //     }
    //     var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    //     if (!clip)
    //         return;
    //     var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    //     if (!trans)
    //         return;
    //     trans.addDataFlavor("text/unicode");
    //     var str = new Object();
    //     var len = new Object();
    //     var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    //     var copytext = txt;
    //     str.data = copytext;
    //     trans.setTransferData("text/unicode", str, copytext.length * 2);
    //     var clipid = Components.interfaces.nsIClipboard;
    //     if (!clip)
    //         return false;
    //     clip.setData(trans, null, clipid.kGlobalClipboard);
    //     alert("复制成功！");
    // }
    //方法3 x
    // var rng = document.body.createTextRange();
    // rng.moveToElementText(ele);
    // rng.scrollIntoView();
    // rng.select();
    // rng.execCommand("Copy");
    // rng.collapse(false);
    // alert("复制成功!");
}
function openRecordFile(ele){
    var v_file=$('#chose_videoInput');
    // v_file.click();
}
function recordFilePlay(){
    var file = $('#chose_videoInput')[0].files[0];
    var url = URL.createObjectURL(file);
    console.log(url);
    $("#record_video")[0].src = url;
    //显示视频
    $('#record_video').css('visibility','visible');
    $("#record_video")[0].play()
}
//显示或关闭录制时间
function showRecordTime(isOpen) {
    if(isOpen){
        $('#recordTimeBox').show();
        timerRecord.begin('recordTime')
    }else{
        $('#recordTimeBox').fadeOut("slow");
        timerRecord.stop()
    }

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

//更新图标状态
function updateIcon(targetId,targetIcon,status) {

}

//显示网速
function showUpAndDownBytes(){
    var upBytes = getUpBytes();
    var downBytes = getDownBytes();
    $('#upBytes').text(upBytes);
    $('#downBytes').text(downBytes)
}
//查询上行网速
function getUpBytes() {
    //上行网速为自己的音视频流码率
    var videoBitRate =0;
    var audioBitRate = 0;
    var targetId = Number(mSelfUserId)
    videoBitRate = meetingInstance.webSDKInstance.getUserState({
        userId: targetId,
        streamIndex: 0,
        infoName: BRAC_USERSTATE_VIDEOBITRATE
    });
    audioBitRate = meetingInstance.webSDKInstance.getUserState({
        userId: targetId,
        streamIndex: 0,
        infoName: BRAC_USERSTATE_AUDIOBITRATE
    });
    return parseInt((videoBitRate + audioBitRate)/1000) + 'k/s'
}
//查询下行网速
function getDownBytes() {
    //下行网速为其他人的音视频流码率
    var videoBitRate =0;
    var audioBitRate = 0;
    // 遍历房间内其他人员
    //成员id列表(包含自己)
    var userIdListAtMeeting = meetingInstance.fetchAllMeetingUserCompletion();
    for ( var i = 0 ;i< userIdListAtMeeting.length;i++){
        if(userIdListAtMeeting[i].userId == mSelfUserId)
            continue
        var targetId = Number(userIdListAtMeeting[i].userId)
        videoBitRate += meetingInstance.webSDKInstance.getUserState({
            userId: targetId,
            streamIndex: 0,
            infoName: BRAC_USERSTATE_VIDEOBITRATE
        });
        audioBitRate += meetingInstance.webSDKInstance.getUserState({
            userId: targetId,
            streamIndex: 0,
            infoName: BRAC_USERSTATE_AUDIOBITRATE
        });
    }

    return parseInt((videoBitRate + audioBitRate)/1000) + 'k/s'
}
//根据id查找dom
function getID(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (window[id]) {
        return window[id];
    }
}
//更改密码显隐
function changeEye(){
    if(showFlag){
        $('#icon_eye').removeClass('eyeOpen').addClass('eyeClose')
        $('#newPassword').attr("type","password")
        showFlag = false
    }else{
        $('#icon_eye').removeClass('eyeClose').addClass('eyeOpen')
        $('#newPassword').attr("type","text")
        showFlag = true
    }
}
//修改密码(主持人/管理员)
function updatePassword(){
    if(!isCanHost(mSelfUserId)){
        // showTip('非管理员或主持人没有操作权限')
        $.messager.popup('非管理员或主持人没有操作权限',3000)
        return
    }
    if(!$("#newPassword").val()){
        $.messager.popup('密码不能为空！',3000);
        $("#newPassword").focus();
        return
    }
    // showTip('你确定修改密码吗？','confirm',function () {
    //     var newPassword = $('#newPassword').val()
    //     //更新会议状态为已结束
    //     requestMeetingUpdate(roomId,myPhone,{needPassword:true,password:newPassword},
    //         function () {
    //             //成功后的消息提示
    //             var content = "密码修改成功"
    //             //本地时间 yyyyMMddHHmmSS格式的时间
    //             var timeStr = meetingInstance.generateTimeRequestNumber();
    //             showMessage(content,'','系统消息',timeStr,'sys')
    //             setTimeout(function () {
    //                 showTip('密码修改成功')
    //             },500)

    //         },
    //         function (reason) {
    //             //失败后后的消息提示
    //             var content = "密码修改失败,"+reason
    //             //本地时间 yyyyMMddHHmmSS格式的时间
    //             var timeStr = meetingInstance.generateTimeRequestNumber();
    //             showMessage(content,'','系统消息',timeStr,'sys')
    //             setTimeout(function () {
    //                 showTip(content)
    //             },500)
    //     })
    // })
    hideMessager();
    // $.messager.confirm('提示','你确定修改密码吗？',function () {
        var newPassword = $('#newPassword').val()
        //更新会议状态为已结束
        requestMeetingUpdate(roomId,myPhone,{needPassword:true,password:newPassword},
            function () {
                //成功后的消息提示
                var content = "密码修改成功"
                //本地时间 yyyyMMddHHmmSS格式的时间
                var timeStr = meetingInstance.generateTimeRequestNumber();
                showMessage(content,'','系统消息',timeStr,'sys');
                $.messager.popup('密码修改成功',3000)
                // setTimeout(function () {
                //     showTip('密码修改成功')
                // },500)

            })
    // })
    // $.messager.prompt("操作提示", "请输入密码？", function (data) {
    //     if (data) {
    //         alert(data);
    //     }
    // });
    // var password = prompt('请输入新密码')



}
//实例化clipBoard
function initClip() {
    var clipboard = new Clipboard('.clipBtn');
    //所有加.clipBtn的元素都能点击复制
    clipboard.on('success', function(e) {
        if(e.trigger.id === 'icon_invite'){
            //参会邀请不做复制提示
            return
        }
        $.messager.popup('复制成功',3000);
    });

    clipboard.on('error', function(e) {
        $.messager.popup('复制失败',3000)
    });
}
//邀请入会自动复制功能初始化
function initInviteClip(){
    var meetIngInfo = meetingInstance.getSpecifiedInfor('meetingInfo');
    var myName = meetingInstance.getNameById(mSelfUserId);
    var meetingTitle = meetIngInfo.meetingTitle;
    var meetingId = meetIngInfo.meetingId;
    var meetingBeginTime = meetIngInfo.startTime;
    meetingBeginTime = meetingBeginTime.replace('-','年').replace('-','月').replace('-','好');
    var hostName = meetingInstance.getSpecifiedInfor('meetingHost');
    var meetingUrl = '';
    // var url = 'http://192.168.13.123:81/share/';
    var url = inviteUrl;
    //ae4加密会议邀请信息
    var shareMeetingInfo =JSON.stringify({
        id:meetingId,
        title:meetingTitle,
        name:myName
    })
    var aesBase64 = encrypt(shareMeetingInfo);
    meetingUrl = url+'?share='+aesBase64;
    var copyText = myName+'邀请你加入会议\n' +
        '\n' +
        '会议主题：'+meetingTitle+'\n' +
        '会议ID：'+meetingId+'\n' +
        '开始时间：'+meetingBeginTime+'\n' +
        '主持人：'+hostName+'\n' +
        '会议链接：'+meetingUrl;
    //自动复制
    $('#icon_invite').addClass('clipBtn').attr('data-clipboard-text',copyText)
    // var clipboard = new Clipboard('#icon_invite', {
    //     text: function() {
    //         return copyText
    //     }
    // });
    //
    // clipboard.on('success', function(e) {
    //     console.log(e);
    // });
    //
    // clipboard.on('error', function(e) {
    //     console.log(e);
    // });
}
//邀请入会
function inviteUser() {
    //提示
    $.messager.alert('提示','入会邀请链接已复制到粘贴板，将会议信息分享给他人即可快速入会')
}

//消息提示
function showTip(text,type,sureTodo,delay,sureText,cancelText) {
    var sureBtnText = sureText || '确定';
    var cancelBtnText = cancelText || '取消';
    //text为中间提示信息，type,为提示框类型(默认为alert)，sureTodo为点确定按钮要做的事
    $('#messageModal #message').text(text)
    //不要确定按钮
    $('#meetingModalFooter').html(
        '<button type="button" class="btn btn-primary"  data-dismiss="modal">'+sureBtnText+'</button>')
    if(type){
        switch (type){
            case 'confirm':
                //底部为取消+确定按钮
                $('#meetingModalFooter').html(
                    '<button type="button" class="btn btn-primary"  data-dismiss="modal">'+sureBtnText+'</button>\n'+
                    '<button type="button" class="btn btn-primary btn-danger"  data-dismiss="modal">'+cancelBtnText+'</button>'
                )
                if(typeof (sureTodo) === "function"){
                    //只执行一次
                    $('#meetingModalFooter button:nth-of-type(1)').one('click',sureTodo)
                }
                break;
            case 'alert':
                //底部为确定按钮
                $('#meetingModalFooter').html(
                    '<button type="button" class="btn btn-primary"  data-dismiss="modal">'+sureBtnText+'</button>')
                if(typeof (sureTodo) === "function"){
                    //只执行一次
                    $('#meetingModalFooter button:nth-of-type(1)').one('click',sureTodo)
                }
                break;
            case 'popup':
                //默认底部为确定按钮,可点击隐藏，或过3秒自动
                $('#meetingModalFooter').html(
                    '<button type="button" class="btn btn-primary"  data-dismiss="modal">'+sureBtnText+'</button>')
                var timeOut=null;
                if(delay){
                    timeOut = setTimeout(function () {
                        $('#messageModal').modal('hide');
                    },delay)

                }else{
                    timeOut=setTimeout(function () {
                        $('#messageModal').modal('hide')
                    },2000)
                }
                $('#meetingModalFooter button:nth-of-type(1)').one('click',function () {
                    clearTimeout(timeOut);
                    timeOut=null;
                })
                $('#messageModal').one('hide.bs.modal', function () {
                    clearTimeout(timeOut);
                    timeOut=null;
                })
                break
        }
        $('#messageModal').modal('show');
    }else{
        setTimeout(function () {
            $('#messageModal').modal('show');
        },500)
    }




}

//更改默认下拉菜单大小及下拉按钮改变
function changeDropMenu(dropMenuId) {
    //更改ul宽度
    $("#"+dropMenuId+"_ul").width($("#"+dropMenuId).width());
    //更改下拉图标
    // if ($("#"+dropMenuId+" .icon_after").hasClass("icon_hide")){
    //     $("#"+dropMenuId+" .icon_after").removeClass("icon_hide").addClass("icon_show")
    // }else{
    //     $("#"+dropMenuId+" .icon_after").removeClass("icon_show").addClass("icon_hide")
    // }
    changeDropIcon(dropMenuId);
}
//更改下拉图标
function changeDropIcon(dropMenuId) {
    if ($("#"+dropMenuId+" .icon_after").hasClass("icon_hide")){
        $("#"+dropMenuId+" .icon_after").removeClass("icon_hide").addClass("icon_show")
    }else{
        $("#"+dropMenuId+" .icon_after").removeClass("icon_show").addClass("icon_hide")
    }
}
//模拟select
function changeOption(id){
    //更改当前菜单项为半透明
    //先移除其他的select
    // $('#'+id).parent("ul").find(".select").removeClass("select");
    // $('#'+id+' a').addClass("select");
    //更改下拉菜单按钮显示内容为点击的选项
    var ele = $('#'+id+' a').html();
    var $button = $('#'+id).parent('ul').prevAll('button');
    //更改button的data-val值
    var dataVal = $('#'+id).attr('data-val');
    $button.find('.button_content').html(ele);
    $button.attr('data-val',dataVal);
    //手动触发change，即会触发button的onchang事件
    $button.change();
}
//隐藏$.messager (alert,confirm,prompt显示的模态框)
function hideMessager(){
    if($('.dialog.modal.fade.in').length != 0){
        $('.dialog.modal.fade.in .close').click()
    }
}



//会议大厅需要的方法
// 显示大厅界面
function ShowHallDiv(bShow) {
    if (bShow) {
        // $("#login_div").hide(); //隐藏登录界面
        // $("#login_div").css('visibility','hidden');
        // $("#hall_div").show(); //显示大厅界面
        // $("#customroomid").val("");
        // SetDivTop("hall_div", 400); //大厅界面垂直居中
        $("#hall_div_username").text(myUserName);
        if(!$('.hall_content .bootstrap-table').length){
            showMeetingTable();
        }else{
            //刷新表格,加延时防止结束会议后返回大厅此时服务器数据尚未更新
            setTimeout(function () {
                $('#hall_table').bootstrapTable('refresh');
            },200)
        }


        //创建视频会议ui实例
        anyChatMeetingComponentInstance = AnyChatMeetingComponent.getInstance();
        //初始化配置项
        if(!componentOption){
            componentOption={
                meetingInfo:{
                    meetingId:'',
                    roomId:'',
                    meetingTitle:'',
                    meetingHost:'',
                    startTime:'',
                    endTime:'',
                    meetingType:1 //0代表语言会议,1代表视频会议
                },
                userInfo:{
                    userId:mSelfUserId,
                    nickName:'',
                    hostState:1,//0:参会者 1：主持人 2：临时授权者
                    cameraState:1,//0:关闭 1：打开 2：被禁止
                    microphoneState:1
                },
                recordInfo:{
                    //录制模式必加，其他的自己设置
                    width:1920,//录制画面高度 （默认640）
                    height:1080,//录制画面宽度 （默认480）
                },
                events:{
                    onAnyChatMeetingEntered:onAnyChatMeetingEntered,
                    onAnyChatMeetingLeave:onAnyChatMeetingLeave,
                    onAnyChatMeetingDestroy:onAnyChatMeetingDestroy,
                    onAnyChatMeetingHistoryUserInfoSync:onAnyChatMeetingHistoryUserInfoSync,
                    onAnyChatMeetingUserEnter:onAnyChatMeetingUserEnter,
                    onAnyChatMeetingUserLeave:onAnyChatMeetingUserLeave,
                    // onAnyChatMeetingHostTransferResult:onAnyChatMeetingHostTransferResult,
                    onAnyChatMeetingUserCameraStatusChanged:onAnyChatMeetingUserCameraStatusChanged,
                    onAnyChatMeetingUserMicrophoneStatusChanged:onAnyChatMeetingUserMicrophoneStatusChanged,
                    onAnyChatMeetingHostControlCamera:onAnyChatMeetingHostControlCamera,
                    onAnyChatMeetingHostControlMicrophone:onAnyChatMeetingHostControlMicrophone,
                    // onAnyChatMeetingHostTransfer:onAnyChatMeetingHostTransfer,
                    onAnyChatMeetingMessageReceived:onAnyChatMeetingMessageReceived,
                    onAnyChatMeetingScreenShare:onAnyChatMeetingScreenShare,
                    // onAnyChatMeetingWhiteBoardShare:onAnyChatMeetingWhiteBoardShare,
                    onAnyChatMeetingHostPermissionControl:onAnyChatMeetingHostPermissionControl,
                    onAnyChatMeetingUserPermissionChanged:onAnyChatMeetingUserPermissionChanged,
                    onAnyChatMeetingUserLeaveControl:onAnyChatMeetingUserLeaveControl,
                    onAnyChatMeetingStartResult:onAnyChatMeetingStartResult,
                    onAnyChatMeetingComponentDestroy:onAnyChatMeetingComponentDestroy,

                },
                container:'',
                webSDKInstance:instance,//新版sdk实例对象
                appId:mDefaultAppID
            }
        }

        // var anyChatMeetingComponentInstance2 = AnyChatMeetingComponent.getInstance()
        // console.log(anyChatMeetingComponentInstance2 ===anyChatMeetingComponentInstance)//false
        // 似乎不是单实例的，但是新版sdk实例也是这么写的，暂且保留
        saveShareMeetingInfo()
        //检测是否有邀请信息
        checkMeetingInvited()
    } else {
        $("#hall_div").hide();
    }
}
// 显示等待进度条，提示用户操作正在进行中
function DisplayLoadingDiv(bShow,msg) {
    if (bShow) {
        $("#LOADING_DIV").show();
        if(msg){
            //提示信息
            $("#LOADING_DIV>div").text(msg)
        }

        $("#LOADING_GREY_DIV").show();

        var TheHeight = document.documentElement.clientHeight;
        var TheWidth = document.body.offsetWidth;
        $("#LOADING_DIV").css("marginTop", (TheHeight - 50) / 2 + "px");
        $("#LOADING_DIV").css("marginLeft", (TheWidth - 130) / 2 + "px");
    } else {
        $("#LOADING_DIV").hide();
        $("#LOADING_GREY_DIV").hide();
    }
}
//绑定大厅层各种事件（记得加上解绑）
function bingHallEvents() {
    //点击开始会议改变模态框 弹出由data-toggle控制
    $("#startMeeting").unbind().on('click', function () {
        //改变模态框title
        // $("#meetingModal .modal-title").text("开始会议");
        //改变模态框中开始时间可否编辑状态（开始会议不可编辑，安排会议可编辑）
        $("#beginDate").attr("disabled","disabled");
        $("#startOrCreateMeetingBtn").attr("operate","start");
    });
    //点击安排改变模态框 弹出由data-toggle控制
    $("#createMeeting").unbind().on('click', function () {
        //改变模态框中开始时间可否编辑状态（开始会议不可编辑，安排会议可编辑）
        $("#meetingModal .modal-title").text("安排会议");
        //改变模态框中开始时间可否编辑状态（开始会议不可编辑，安排会议可编辑）
        $("#beginDate").attr("disabled",false);
        $("#startOrCreateMeetingBtn").attr("operate","create");

        //默认使用手机号作为主持人昵称
        $('#hostName').val( myPhone);
        //默认使用手机号+的会议作为会议名称
        $('#meetingName').val( myPhone+"的会议");
    });
    //开始会议 安排会议
    $("#startOrCreateMeetingBtn").unbind().on("click", function(e){
        //创建会议
        createMeeting()
        // if(event.type === 'click' || e.which ==13){
        //     //创建会议
        //     createMeeting()
        // }
    });
    //创建会议模态框input绑定回车
    $("#meetingName,#meetingId,#hostName,#meetingPassword,#beginDate," +
        "#endDate,#typeRadios1,#typeRadios2").unbind().on('keydown',function(e) {
        if (e.which == 13) {
            createMeeting()
        }
    })
    //加入会议
    $('#enterMeetingBtn').unbind().on("click", function(){
        if(!$("#meetingIdForEnterModal").val()){
            $.messager.popup('会议ID不能为空！',3000);
            $("#meetingIdForEnterModal").focus();
            return
        }
        if(!$("#userNameForEnterModal").val()){
            $.messager.popup('参会人名称不能为空！',3000);
            $("#userNameForEnterModal").focus();
            return
        }
        //根据meetingId检索会议，如果不存在则提示无效的会议id，存在则进行后续逻辑
        var meetingId = $('#meetingIdForEnterModal').val()
        checkMeetingExist(meetingId)
    })
    //加入会议输入框绑定回车
    $("#meetingIdForEnterModal,#userNameForEnterModal," +
        "input[name='audioRadiosForEnterModal']").unbind().on('keydown',function(e) {
        if (e.which == 13) {
            if(!$("#meetingIdForEnterModal").val()){
                $.messager.popup('会议ID不能为空！',3000);
                $("#meetingIdForEnterModal").focus();
                return
            }
            if(!$("#userNameForEnterModal").val()){
                $.messager.popup('参会人名称不能为空！',3000);
                $("#userNameForEnterModal").focus();
                return
            }
            var meetingId = $('#meetingIdForEnterModal').val()
            checkMeetingExist(meetingId)
        }
    })
    //用户配置模态框进入会议事件
    $("#userInfoModalBtn").unbind().on("click", function(){
        //参会者进入会议
        joinUserEnter()
    });
    //用户配置模态框输入框绑定回车
    $("#meetingJoinName,input[name='audioRadios'],input[name='cameraRadios']," +
        "input[name='cameraRadiosForEnterModal'],#userInfoModalBtn").on('keydown',function(e) {
        if (e.which == 13) {
            //参会者进入会议
            joinUserEnter()
        }
    })
    //校验密码(校验密码模态框专为快速加入设计)
    $("#checkPasswordBtnForModal").unbind().on("click", function(){
        if(!$("#meetingPasswordForCheck").val()){
            $.messager.popup('密码不能为空！',3000);
            $("#meetingPasswordForCheck").focus();
            return
        }
        var password = $("#meetingPasswordForCheck").val()
        //先校验密码
        checkoutPassword(roomId,password,function () {
            $('#passwordModal').modal('hide');
            var isOpenCamera
            var isOpenMicrophone
            if($("input[name='audioRadiosForEnterModal']:checked").val() ==="true"){
                isOpenMicrophone =1;
            }else {
                isOpenMicrophone =0;
            }
            if($("input[name='cameraRadiosForEnterModal']:checked").val() ==="true"){

                isOpenCamera =1;
            }else {
                isOpenCamera =0;

            }
            //语音会议，isOpenCamera默认是关闭
            if(!componentOption.meetingInfo.meetingType){
                isOpenCamera = 0
            }
            // componentOption.userInfo.userId = mSelfUserId.toString();
            componentOption.userInfo.nickName = $("#userNameForEnterModal").val();
            componentOption.userInfo.cameraState = isOpenCamera;
            componentOption.userInfo.microphoneState =isOpenMicrophone;
            login();
        },function () {
            $.messager.popup('密码不正确，请重新输入',3000);
            $("#meetingPasswordForCheck").val('');
            $("#meetingPasswordForCheck").focus();
        })

    });
    //校验密码输入框绑定回车
    $("#meetingPasswordForCheck").unbind().on('keydown',function(e) {
        if (e.which == 13) {
            if(!$("#meetingPasswordForCheck").val()){
                $.messager.popup('密码不能为空！',3000);
                $("#meetingPasswordForCheck").focus();
                return
            }
            var password = $("#meetingPasswordForCheck").val()
            //先校验密码
            checkoutPassword(roomId,password,function () {
                $('#passwordModal').modal('hide');
                var isOpenCamera
                var isOpenMicrophone
                if($("input[name='audioRadiosForEnterModal']:checked").val() ==="true"){
                    isOpenMicrophone =1;
                }else {
                    isOpenMicrophone =0;
                }
                if($("input[name='cameraRadiosForEnterModal']:checked").val() ==="true"){

                    isOpenCamera =1;
                }else {
                    isOpenCamera =0;

                }
                //语音会议，isOpenCamera默认是关闭
                if(!componentOption.meetingInfo.meetingType){
                    isOpenCamera = 0
                }
                // componentOption.userInfo.userId = mSelfUserId.toString();
                componentOption.userInfo.nickName = $("#userNameForEnterModal").val();
                componentOption.userInfo.cameraState = isOpenCamera;
                componentOption.userInfo.microphoneState =isOpenMicrophone;
                login();
            },function () {
                $.messager.popup('密码不正确，请重新输入',3000);
                $("#meetingPasswordForCheck").val('');
                $("#meetingPasswordForCheck").focus();
            })
        }
    })
    //密码显示与隐藏
    // var showFlag = false; // 状态控制 初始为隐藏
    $('#hall_div .icon_eye').unbind().on('click', function(){
        var currentStatus = $(this).hasClass('eyeOpen')
        if(currentStatus){
            $(this).removeClass('eyeOpen').addClass('eyeClose')
            $(this).prev().attr("type","password")
        }else{
            $(this).removeClass('eyeClose').addClass('eyeOpen')
            $(this).prev().attr("type","text")
        }
    })
    //会议列表单元格按钮注册事件
    window.operateEvents = {
        'click .enterMeetingBtnForTable': function (e, value, row, index) {
            //检查会议是否失效，失效则提示会议失效并刷新表格，成功 则继续后面的逻辑
            checkMeetingValid(row.meetingId)
        }
    };
    //会议列表刷新按钮
    $('#icon_refreshTable').unbind().on('click',function(){
        //刷新表格
        $('#hall_table').bootstrapTable('refresh');
    })
    //单选框图标切换
    $(".radio-group label input").unbind().on('click', function () {
        ToggleRadio( $(this));
    });
    //复选框图标切换
    $(".checkbox_list label input").unbind().on('click', function () {
        ToggleCheckbox( $(this));
    });
    //模态框打开监听
    $('#meetingModal').unbind().on('show.bs.modal', function () {

        //模态框展示时初始化时间选择器datetimepicker
        $('#beginDate,#endDate').datetimepicker({
            fontAwesome:'font-awesome',//指定bootstrap3的字体图标
            pickerPosition:"top-left",
            forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
            language: 'zh-CN',//显示中文
            format: 'yyyy-mm-dd hh:ii:ss',//显示格式
            initialDate: new Date(),//初始化当前日期
            autoclose: true,//选中自动关闭
            // todayBtn: true,//显示今日按钮
            minView:"hour",//能够提供的最精确的时间选择视图
            minuteStep:10,//步进值，即预设时间（分钟）间隔
            // keyboardNavigation:false,
            startDate: new Date()//可选择的最早时间
        })
        // 时间选择器互动（结束时间不得早于开始时间）
        $('#beginDate').on('changeDate', function(ev){
            $('#endDate').datetimepicker('setStartDate', ev.date);
            //开始时间改变时。默认结束时间对应增加30分钟
            $("#endDate").datetimepicker("setDate", add30Minute(ev.date) );
            console.log(ev.date)
        });
        //阻止打开事件冒泡到模态框
        $('#beginDate, #endDate').on("hide",function (event) {
            // console.log("隐藏beginDate")
            // event.preventDefault();
            // event.stopPropagation();
        }).on("show",function (event) {
            // console.log("打开beginDate")
            // event.preventDefault();
            event.stopPropagation();
        })
        var beingTime = new Date();
        $("#beginDate").datetimepicker("setDate", beingTime);  //设置默认显示当前的时间
        var endTime = add30Minute(new Date());
        $("#endDate").datetimepicker("setDate",endTime);
        $('#endDate').datetimepicker('setStartDate',beingTime);
        $('#meetingName').val('');
        $('#meetingId').val('');
        $('#meetingPassword').val('');
        $('#typeRadios1').click()
        setTimeout(function () {
            //默认使用用户名作为主持人昵称
            $('#hostName').val( myUserName);
            $('#meetingName').focus()
        },500)

    })
    $('#enterMeetingModal').unbind().on('show.bs.modal', function () {
        $('#meetingIdForEnterModal').val('');
        $('[name="audioRadiosForEnterModal"]').last().click();
        $('[name="cameraRadiosForEnterModal"]').first().click();
        setTimeout(function () {
            $('#userNameForEnterModal').val( myUserName);
            $('#meetingIdForEnterModal').focus()
        },500)
    })
    $('#userInfoModal').unbind().on('show.bs.modal', function () {
        $('#audioRadios2').click();
        $('#cameraRadios1').click();
        $('#meetingJoinName ').val( myUserName);
        //打开时密码默认隐藏,且清空
        $('#hall_div .icon_eye').removeClass('eyeOpen').addClass('eyeClose')
            .prev().attr("type","password").val('')
        setTimeout(function () {

            if(!$("#meetingJoinName").attr("disabled")){
                $('#meetingJoinName').focus()
            }else{
                $('#userInfoModalBtn').focus()
            }
        },500)
    })
    $('#passwordModal').unbind().on('show.bs.modal', function () {
        //打开时密码默认隐藏,且清空
        $('#hall_div .icon_eye').removeClass('eyeOpen').addClass('eyeClose')
            .prev().attr("type","password").val('')
        setTimeout(function () {
            $('#meetingPasswordForCheck').focus()
        },500)
    })

    //退出系统
    $("#exit_box").unbind().on('click', function() {
        $.messager.confirm("提示", "您确定要退出系统吗？", function () {
            console.log('按钮点击退出系统')
            logout();
        });

    })
    //下载页刷新按钮
    $('#prompt_div_headline2').unbind().on('click', function(){
        window.location.reload();//刷新当前页面.
    });

}
//接收透明通道消息通知
function onReceiveBuffer(data) {
    console.log('onReceiveBuffer:');
    console.log(data);
}
//登录anychat
function login() {
    if(!instance){
        //未登录anychat
        var nickName = myPhone;
        var strUserId = nickName;
        var password = '';
        var serverIp =mDefaultServerAddr;
        var serverPort =mDefaultServerPort;
        //在sdk初始化配置项中注册需要的房间管理相关事件
        var bufferOpt = {
            onReceiveBuffer:onReceiveBuffer
        }
        // 初始化设置，包括插件初始化、连接、登录
        var initParams = {
            serverIp: serverIp, //服务器地址 （必填项）
            serverPort: serverPort, //端口号（必填项）
            nickName: nickName, //用户昵称（必填项）
            // strUserId: strUserId, //用户字符串ID
            password: password,
            appId: mDefaultAppID, //应用ID（智能排队时必填）
            sign: "", //签名字符串（签名登录时必填）
            timeStamp: "", //时间戳（签名登录时必填）
            onDisConnect: onDisConnect,
            onLogin: onLogin,
            // roomOpt: roomOpt, //定义房间相关配置
            bufferOpt:bufferOpt, //透明通道
            // //fileOpt: fileOpt, //定义文件上传/下载相关配置
            // //videoCallOpt: videoCallOpt, //定义视频呼叫相关配置
            // // logOpt: logOpt, //定义日志存储相关配置( 不设该配置项，则插件日志默认保存在插件安装目录下)
            // // receiveBuffer: onReceiveBuffer,
            cameraOpt: {
                openNativeScreenCamera: 1 //0为不开启，1为开启；虚拟摄像头用于桌面共享时捕获桌面画面
            } //定义是否开启虚拟摄像头（该虚拟摄像头用于桌面共享）
        };
        //initParams.isCluster = parseInt($("#clusterSelect").val());
        instance = AnyChatWebSDK.sdkInit(initParams);
        // //初始化参数设置
        // var SDKOption = {
        //     videoBgImage: 'ssebk.jpg',        //设置视频背景图片
        // };
        // instance.setSDKOption(SDKOption);
        // var instance2 = AnyChatWebSDK.sdkInit(initParams);
        // console.log(instance2 == instance)

        DisplayLoadingDiv(true,'正在连接...');
        //在登录成功回调中调用进入会议

    }else{
        //已登录，直接调用视频会议组件
        //调用视频会议组件
        anyChatMeetingComponentInstance.startMeetingWithMeetingInfo(componentOption);
        //显示等待界面
        DisplayLoadingDiv(true,'正在进入会议...')
    }


}
//登出anychat
function logout() {
    // console.log('执行instance.logout()之前')
    if(instance){
        var errorCode = instance.logout();
        instance = null;
    }

    // console.log('执行instance.logout()之后，errorCode：' +errorCode)
    // clearInterval(mRefreshVolumeTimer);
    ShowHallDiv(false);
    $('#AnyChatMeetingComponent').hide();
    $('#checkCode').val('');
    // clearCookie();
    window.localStorage.removeItem('token')
    isUseMeetingFlag = false;
    // if (errorCode == 0) {
    //     clearInterval(mRefreshVolumeTimer);
    //     blnCheckUnload = false;
    //     ShowHallDiv(false);
    //     ShowLoginDiv(true);
    // }
}
//检测会议邀请
function checkMeetingInvited() {
    // 从sessionStorage获取数据
    // var shareInfo = window.localStorage.getItem('share');
    var shareInfoStr = window.localStorage.getItem('share');
    if(shareInfoStr){
        //转化为JSON字符串
        var shareInfoObj = JSON.parse(shareInfoStr);
        $.messager.confirm('提示','是否接受'+shareInfoObj.name+'的入会邀请，进入【'+ shareInfoObj.title+'】会议',
            function () {
                receiveInvited(shareInfoObj.id);
            })
        //清除会议邀请信息
        // alert(shareInfo)
        window.localStorage.removeItem('share')
    }
}
//接受会议邀请
function receiveInvited(meetingId) {
    checkMeetingValid(meetingId)
}
//获取分享会议信息
function getShareMeetingInfo() {
    var url = document.location.toString();//获取url地址
    var shareInfoObj = null;
    if(url.indexOf('?share=') !=-1){
        var urlParmStr = url.slice(url.indexOf('?')+1);//获取问号后所有的字符串

        var arr = urlParmStr.split('&');//通过&符号将字符串分割转成数组
        var meetingStr = arr[0].split("share=")[1];//获取数组中第一个参数
        // var unit_title=arr[1].split("=")[1];//第二个参数
        // unit_title=decodeURI(unit_title);//转码将解码方式unscape换为decodeURI，将中文参数获取
        console.log(meetingStr);
        //aes解密
        var shareInfoStr =  decrypt(meetingStr);

        if(shareInfoStr && (typeof  JSON.parse(shareInfoStr)) == 'object'){
            shareInfoObj =  JSON.parse(shareInfoStr);
            console.log('aes解密成功');
            console.log(shareInfoObj);
        }

    }

    return shareInfoObj
}
//保存邀请信息
function saveShareMeetingInfo(){
    var shareMeetingInfo = getShareMeetingInfo();
    if(shareMeetingInfo){
        localStorage.setItem('share',JSON.stringify(shareMeetingInfo));
        var url = document.location.toString();//获取url地址
        var urlParmStr = url.slice(0,url.indexOf('?'));//获取问号前所有的字符串
        window.location.href=urlParmStr;
    }
}

//显示会议列表表格
function showMeetingTable() {
    //创建会议列表
    $('#hall_table').bootstrapTable({
        // url:requestIp+'/meetingInfo/appList',     //请求后台的URL（*）
        method:'post',
        dataType:'Json',
        // responseHandler:responseHandler,
        ajax:requestMeetingList,
        // pageNumber: 1,//初始化加载第一页，默认第一页
        pagination:true,//是否分页
        // onlyInfoPagination:true,//分页器只显示页数
        paginationHAlign:"center",
        showJumpto: true,
        pageSize:6,//单页记录数
        paginationDetailHAlign:' hidden',//去掉分页信息,这里注意hidden前面有个空格，样式加上.hidden{display:none;}
        // paginationDetailHAlign:'right',
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        classes:"table table-hover",
        formatNoMatches: function(){
            return "暂无数据";
        },
        formatLoadingMessage: function(){
            return "请稍等，正在加载中";
        },
        columns: [
            {
                field: 'title',
                title: '会议主题',
                formatter: showTitleFormatter
            }, {
                field: 'hostName',
                title: '主持人',
                cellStyle:{
                    css:{
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap"
                    }
                },
            }, {
                field: 'type',
                title: '会议类型',
                formatter:typeFormatter//单元格内容自定义
            }, {
                field: 'planBeginTime',
                title: '开始时间',
            }, {
                field: 'planEndTime',
                title: '结束时间',
            }, {
                field: 'status',
                title: '操作',
                width: '150px',
                events:operateEvents,
                formatter:statusFormatter//添加按钮
            }],

    })

}
//创建会议
function createMeeting(){
    var hostName = $('#hostName').val()
    var meetingName = $('#meetingName').val()
    var beginTime = $('#beginDate').val()
    var endDate = $('#endDate').val()
    var meetingId = $('#meetingId').val()
    if ($("#meetingName").val() == '') {
        $.messager.popup('请输入会议名称！',3000);
        $("#meetingName").focus();
        return;
    }
    if ($("#meetingId").val() == '') {
        $.messager.popup('请输入会议ID！',3000);
        $("#meetingId").focus();
        return;
    }
    if ($("#hostName").val() == '') {
        $.messager.popup('请输入主持人昵称！',3000);
        $("#hostName").focus();
        return;
    }
    if ($("#beginTime").val() == '') {
        $.messager.popup('请选择开始时间！',3000);
        $("#beginTime").focus();
        return;
    }
    if ($("#endDate").val() == '') {
        $.messager.popup('请选择结束时间！',3000);
        $("#endDate").focus();
        return;
    }

    //调用后台接口创建会议，是为了维护会议列表，该接口由业务层维护，与组件无关
    requestMeetingCreate()

    // DisplayLoadingDiv(true);
}
//参会者进入会议
function joinUserEnter(){
    if(!$("#meetingJoinName").val()){
        $.messager.popup('参会人名字不能为空！',3000);
        $("#meetingJoinName").focus();
        return
    }
    //显示密码校验则需校验，否则直接调组件
    if($('#userInfoPasswordBox').css('display') =='block'){
        if(!$("#passwordForUserInfo").val()){
            $.messager.popup('密码不能为空！',3000);
            $("#passwordForUserInfo").focus();
            return
        }
        var password = $("#passwordForUserInfo").val()
        //先校验密码
        checkoutPassword(roomId,password,function () {
            //隐藏模态框
            $('#userInfoModal').modal('hide')
            //调用会议组件
            var isOpenCamera
            var isOpenMicrophone
            if($("input[name='audioRadios']:checked").val() ==="true"){
                isOpenMicrophone =1;
            }else {
                isOpenMicrophone =0;
            }
            if($("input[name='cameraRadios']:checked").val() ==="true"){

                isOpenCamera =1;
            }else {
                isOpenCamera =0;

            }
            //语音会议，isOpenCamera默认是关闭
            if(!componentOption.meetingInfo.meetingType){
                isOpenCamera = 0
            }
            // componentOption.userInfo.userId = mSelfUserId.toString();
            componentOption.userInfo.nickName = $("#meetingJoinName").val();
            componentOption.userInfo.cameraState = isOpenCamera;
            componentOption.userInfo.microphoneState =isOpenMicrophone;
            login();
        },function () {
            $.messager.popup('密码不正确，请重新输入',3000);
            $("#passwordForUserInfo").val('');
            $("#passwordForUserInfo").focus();
        })
    }else{
        //隐藏模态框
        $('#userInfoModal').modal('hide')
        //调用会议组件
        var cameraState
        var microphoneState
        if($("input[name='audioRadios']:checked").val() ==="true"){
            microphoneState =1;
        }else {
            microphoneState =0;
        }
        if($("input[name='cameraRadios']:checked").val() ==="true"){

            cameraState =1;
        }else {
            cameraState =0;

        }
        //语音会议，isOpenCamera默认是关闭
        if(!componentOption.meetingInfo.meetingType){
            cameraState = 0
        }
        // componentOption.userInfo.userId = mSelfUserId.toString();
        componentOption.userInfo.nickName = $("#meetingJoinName").val();
        componentOption.userInfo.cameraState = cameraState;
        componentOption.userInfo.microphoneState =microphoneState;
        login();
    }


}
//请求会议列表，使用url字段自动加载时请求，故暂时不需要
function requestMeetingList(params){
    var data = {
        // limit: params.limit,   //页面大小
        // offset: params.offset,  //页码
        pageSize:1000,//故意设置单页1000条数据，使得所有数据全加载，再分页
        appId: mDefaultAppID,
        // hostId:mpPhone
        statusList:[1]//查有效的会议
    };
    // if(tokenObj){
    //     //查询会议列表传手机号，只查个人，否则不传，查全部
    //     data.hostId = tokenObj.phone;
    // }

    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/appList',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {
            params.success({
                "rows": data.content.resultList,
                "total": data.content.count,
            }, null, {})

            // params.success({
            //     "rows": data.content.resultList,
            //     "total": data.content.count,
            //     'status':200
            // })
            // params.complete()
            // params.success(data)
            // return params
            // $('#hall_table').bootstrapTable('load',params)
        },
        error:function(xhr) {
            params.error({})
            $('#hall_table').bootstrapTable('updateFormatText', 'formatNoMatches', '网络错误，请重试');
            if (xhr.status == 401) {
                initSystem();
                window.localStorage.removeItem('token');
                //返回登录页
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            }else{
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

        }
    });
}
//请求后台创建一条视频会议记录
function requestMeetingCreate(formData) {
    var meetingType;
    if($("input[name='typeRadios']:checked").val() ==="video"){
        meetingType =1;
    }else {
        meetingType =0;
    }
    var password = $('#meetingPassword').val();
    var data = {}
    if (!formData) {
        data = {
            appId:mDefaultAppID,
            hostName:$('#hostName').val(),
            hostId:myPhone,//手机号
            title:$('#meetingName').val(),
            planBeginTime:$('#beginDate').val(),
            planEndTime:$('#endDate').val(),
            meetingId:$('#meetingId').val(),
            type:meetingType,//0-	语音会议 1-	视频会议
        };
        if(password){
            data.needPassword = true;
            data.password = password;
        }else{
            data.needPassword = false;
        }
    } else {
        data = formData
    }
    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/save',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {
            if(data.errorcode !=0){
                $.messager.popup("创建会议失败,"+data.msg,3000)
            }else{
                $.messager.popup('会议创建成功',3000)
                //隐藏模态框
                $('#meetingModal').modal('hide')
                //判断是安排会议还是开始会议，后者立即调用组件
                var operate =  $("#startOrCreateMeetingBtn").attr("operate");
                if(operate === "start"){
                    // //刷新表格
                    $('#hall_table').bootstrapTable('refresh');
                    var meetingId = data.content.meetingId;//自定义会议id
                    roomId = data.content.id//房间号
                    //调用组件
                    componentOption.meetingInfo.meetingId = meetingId.toString();
                    componentOption.meetingInfo.roomId = roomId.toString();
                    componentOption.meetingInfo.meetingTitle = $("#meetingName").val();
                    componentOption.meetingInfo.meetingHost = data.content.hostName;
                    componentOption.meetingInfo.startTime = $("#beginDate").val();
                    componentOption.meetingInfo.endTime = $("#endDate").val();
                    componentOption.meetingInfo.meetingType = meetingType;
                    // componentOption.userInfo.userId = mSelfUserId.toString();
                    componentOption.userInfo.nickName = $("#hostName").val();
                    componentOption.userInfo.hostState = 1;
                    componentOption.userInfo.cameraState = 1;
                    componentOption.userInfo.microphoneState = 1;
                    login();
                }else if(operate === "create"){
                    //刷新表格
                    $('#hall_table').bootstrapTable('refresh');
                } else if (autoCreate) {
                    //刷新表格
                    $('#hall_table').bootstrapTable('refresh')
                    checkMeetingExist(propData.form.meetingId)
                }
            }


        },
        error:function(xhr) {
            if (xhr.status == 401) {
                initSystem();
                window.localStorage.removeItem('token');
                //返回登录页
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            } else{
                // 当前报错
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

        }
    });
}
//请求后台修改会议信息
function requestMeetingUpdate(meetingId,currentHostId,changeDate,successTodo,failTodo) {
    // requestMeetingUpdate(id,myPhone,{needPassword:true,password:password})
    var data = {
        id:meetingId,
        currentHostId:currentHostId,
        appId:mDefaultAppID,
    }
    if(changeDate.status!=null){
        data.status =changeDate.status
    }
    if(changeDate.hostName!=null){
        data.hostName =changeDate.hostName
    }
    if(changeDate.hostId!=null){
        data.hostId =changeDate.hostId
    }
    if(changeDate.needPassword !=null){
        data.needPassword =changeDate.needPassword;
        data.password =changeDate.password
    }

    console.log("更新项："+JSON.stringify(data))
    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/update',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {
            if(data.errorcode !=0){
                // $.messager.popup("更新会议失败,"+data.msg)
                if(typeof (failTodo) === "function"){
                    //如果有传入失败之后要做的动作
                    failTodo(data.msg)
                }
            }else{
                console.log("更新会议请求成功==");
                // $.messager.popup('更新成功')
                //刷新表格 应该退出组件再刷新？
                // $('#hall_table').bootstrapTable('refresh');
                if(typeof (successTodo) === "function"){
                    //如果有传入成功之后要做的动作
                    successTodo()
                }
            }
        },
        error:function(xhr) {
            if (xhr.status == 401) {
                //返回登录页
                initSystem();
                window.localStorage.removeItem('token');
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            }else{
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

            // if(typeof (failTodo) === "function"){
            //     //如果有传入失败之后要做的动作
            //     failTodo('请求发送失败')
            // }
        }
    });

}

//校验会议有效（列表进入）
function checkMeetingValid(meetingId){
    var data = {
        appId:mDefaultAppID,
        meetingId:meetingId,//Id, meetingId两者至少传1个
        // id:row.id
    }
    //获取会议详情
    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/appGet',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {
            console.log("获取会议详情请求成功==");
            if(data.errorcode ==1 ){
                //已失效
                $.messager.popup("获取会议详情失败，"+data.msg,3000)
                //刷新表格
                $('#hall_table').bootstrapTable('refresh');
            }else{
                var meetingObj = data.content;
                roomId = meetingObj.id;
                var needPassword =  meetingObj.needPassword;
                // var isHost = (row.hostId === myPhone);
                var hostState = 0;
                if(meetingObj.hostId === myPhone){
                    hostState = 1
                }
                var meetingType = meetingObj.type;
                //语音会议没有摄像头选项
                if(!meetingType){
                    $('#radiosBoxForCamera').hide()
                }else {
                    $('#radiosBoxForCamera').show()
                }

                componentOption.meetingInfo.meetingId = meetingObj.meetingId;
                componentOption.meetingInfo.roomId = roomId.toString();
                componentOption.meetingInfo.meetingTitle = meetingObj.title;
                componentOption.meetingInfo.meetingHost = meetingObj.hostName;
                componentOption.meetingInfo.startTime = meetingObj.planBeginTime;
                componentOption.meetingInfo.endTime = meetingObj.planEndTime;
                componentOption.meetingInfo.meetingType = meetingObj.type;
                componentOption.userInfo.hostState = hostState;
                if(hostState){
                    $('#meetingJoinName').val( meetingObj.hostName);
                    //名字不可编辑
                    $("#meetingJoinName").attr("disabled","disabled");
                }else {
                    // $('#meetingJoinName').val( myPhone);
                    $("#meetingJoinName").attr("disabled",false);
                }
                //需要密码且不是主持人，展示输入密码输入框
                if(needPassword && !hostState){
                    //显示密码校验输入框
                    $('#userInfoPasswordBox').show()
                }else{
                    //隐藏密码校验输入框
                    $('#userInfoPasswordBox').hide()
                }
                $('#userInfoModal').modal('show')
            }



        },
        error:function(xhr) {
            if (xhr.status == 401) {
                initSystem();
                window.localStorage.removeItem('token');
                //返回登录页
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            }else{
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

        }
    });
}
//校验密码
function checkoutPassword(id,password,successTodo,failTodo){
    var data = {
        id:id,
        password:password
    }
    //校验密码请求
    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/checkPassword',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {

            if(data.errorcode !=0 ){
                $.messager.popup("校验密码失败，"+data.msg,3000)
            }else{
                console.log("校验密码请求成功==");
                if(data.content){
                    //校验成功密码正确
                    successTodo()
                }else{
                    failTodo()
                }
            }

        },
        error:function(xhr) {
            if (xhr.status == 401) {
                initSystem();
                window.localStorage.removeItem('token');
                //返回登录页
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            }else{
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

        }
    });
}

//检查会议存在（快速加入）
function checkMeetingExist(meetingId){
    console.log(meetingId);
    var data = {
        appId:mDefaultAppID,
        meetingId:meetingId//Id, meetingId两者至少传1个
        // id:id
    }
    //获取会议详情
    $.ajax({
        type:"post",
        url:requestIp+'/meetingInfo/appGet',
        dataType: 'Json',
        data: JSON.stringify(data),
        contentType : 'application/json',
        success:function(data) {
            console.log("获取会议详情请求成功==");
            if(data.errorcode ==1 ){
                //已失效
                $.messager.popup('获取会议详情失败,'+data.msg,3000)

            }else{
                //会议存在
                //隐藏模态框
                $('#enterMeetingModal').modal('hide')
                var content = data.content
                var needPassword =  content.needPassword

                var hostState = 0;
                if(content.hostId === myPhone){
                    hostState = 1
                }
                var meetingType = content.type;
                //语音会议没有摄像头选项
                // if(!meetingType){
                //     $('#radiosBoxForCameraForEnterModal').hide()
                // }else {
                //     $('#radiosBoxForCameraForEnterModal').show()
                // }
                roomId = content.id
                componentOption.meetingInfo.meetingId = content.meetingId.toString();
                componentOption.meetingInfo.roomId = roomId.toString();
                componentOption.meetingInfo.meetingTitle = content.title;
                componentOption.meetingInfo.meetingHost = content.hostName;
                componentOption.meetingInfo.startTime = content.planBeginTime;
                componentOption.meetingInfo.endTime = content.planEndTime;
                componentOption.meetingInfo.meetingType = content.type;
                componentOption.userInfo.hostState = hostState;
                //需要密码且不是主持人，展示输入密码模态框
                if(needPassword && !hostState){
                    //显示密码校验模态框
                    $('#passwordModal').modal('show')
                }else{
                    //直接调用组件进入会议
                    var cameraState
                    var microphoneState
                    if($("input[name='audioRadiosForEnterModal']:checked").val() ==="true"){
                        microphoneState =1;
                    }else {
                        microphoneState =0;
                    }
                    if($("input[name='cameraRadiosForEnterModal']:checked").val() ==="true"){

                        cameraState =1;
                    }else {
                        cameraState =0;

                    }
                    //语音会议，isOpenCamera默认是关闭
                    if(!componentOption.meetingInfo.meetingType){
                        cameraState = 0
                    }
                    // componentOption.userInfo.userId = mSelfUserId.toString();
                    componentOption.userInfo.nickName = $("#userNameForEnterModal").val();
                    componentOption.userInfo.cameraState = cameraState;
                    componentOption.userInfo.microphoneState =microphoneState;
                    login();
                }
            }



        },
        error:function(xhr) {
            if (xhr.status == 401) {
                initSystem();
                window.localStorage.removeItem('token');
                //返回登录页
                ShowHallDiv(false);
                ShowLoginDiv(true);
                $.messager.alert('提示',"登录信息已失效，请重新登录");
            }else{
                // console.log("获取会议详情请求失败==");
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
            }

        }
    });
}
// 表格文本悬浮显示内容
function showTitleFormatter(value, row, index) {
    var values = row.title;
    values = values.replace(/\s+/g, '&nbsp;');
    return "<span title="+values+">"+row.title+"</span>";
}
//状态项内容自定义
function statusFormatter(value, row, index) {
    var result;
    //0-	无效
    // 1-	有效（只会返回有效的）

    var status = row.status
    //会议id，绑定到按钮上
    // var rowId = row.id
    switch (status){
        case 0:
            result = '<span class="tabel-failure">已失效</span>';
            break;
        case 1:
            result = '<span class="table-enter enterMeetingBtnForTable">进入会议</span>';
            break;
    }
    return result
}
//会议类型项内容自定义
function typeFormatter(value, row, index) {
    var result;
    //0-	语音会议
    // 1-	视频会议
    var type = row.type
    switch (type){
        case 0:
            result = '语音会议';
            break;
        case 1:
            result = '视频会议';
            break;
    }
    return result
}
//自定义radio图标切换
function ToggleRadio(current){
    //在当前的radio-inline里先清除所有“选取”图标，全部换成“取消”样式（“初始化”）
    current.parent().parent().find(".radioTrue")
        .removeClass("radioTrue")
        .addClass("radioFalse");

    //更改当前用户选择的那个假的radio图标
    current.parent().find(":first-child")
        .removeClass("radioFalse")
        .addClass("radioTrue");
    //设置真的radio图标为选中
    // $("input[name='audioRadios']:checked").removeAttr("checked");
    // current.attr('checked');
}
//自定义复选框图标切换
function ToggleCheckbox(current){
    //更改当前用户选择的那个
    var $icon = current.parent().find(":first-child");
    if($icon.hasClass("checkboxFalse")){
        $icon.removeClass("checkboxFalse").addClass("checkboxTrue");
    }else {
        $icon.removeClass("checkboxTrue").addClass("checkboxFalse");
    }
}


function initSystem(){
    // leaveRoomRequest(-1);
    //关闭白板(关闭白板时会清空白板数据和断开插拔式服务)
    if(mycanvas){
        mycanvas.closeWhiteBoard()
    }
    //清除会议资源（退出会议和结束会议时会自己清空，连接断开属于异常情况需要手动清空）
    if(meetingInstance){
        meetingInstance.cleanMeetingResource()
    }
    //断开需要退出anychat,防止网络连上后自动登录
    if(instance && instance.anychat){
        //防止没正确安装报错（没正确安装没有anychat）
        instance.logout();
        instance = null;
        $('#checkCode').val('');
    }

    // reVideoDivSize();
    showComponentUI(false); // 隐藏组件
    hideMessager();
    DisplayLoadingDiv(false);
}

//时间增加30分钟
function add30Minute(date) {
    // var defaultStartTime =  new Date();
    var startTime =date;
    var endTime =  new Date(startTime);
    endTime.setMinutes ( startTime.getMinutes() + 30 );
    return endTime;
}
//解析yyyymmddhhmmssSSS时间戳
function timestampToTime(timestamp) {
    var Y = timestamp.substring(0,4)+'/'
    var M = timestamp.substring(4,6)+'/';
    var D = timestamp.substring(6,8)+' ';
    var h = timestamp.substring(8,10)+':';
    var m = timestamp.substring(10,12)+':';
    var s = timestamp.substring(12,14)+'';
    var S = timestamp.substring(14);
    return Y+M+D+h+m+s;
}
//base64编解码
function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
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
    this.decode = function (input) {
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
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
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
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
// AES加密
function encrypt(str) {
    var cipher = CryptoJS.AES.encrypt(str, AESKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        iv: '',
    });
    // 将加密后的数据转换成 Base64
    var base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
    // 处理 Android 某些低版的BUG
    var resultCipher = base64Cipher.replace(/\+/g,'-').replace(/\//g,'_');
    // 返回加密后的经过处理的 Base64
    return resultCipher;
}

// AES解密
function decrypt(str) {
    // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
    var restoreBase64 = str.replace(/\-/g,'+').replace(/_/g,'/');
    // var deBase64Str = CryptoJS.enc.Base64.stringify(str);
    // 解密 返回的是一个解密后的对象
    var decryptedData = CryptoJS.AES.decrypt(restoreBase64, AESKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        iv: '',
    });

    // 解密后，将解密对象转换成 UTF8 的字符串
    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}
//白板相关

//文件转换为img
function fileToImage(){
    var inputObj;
    //如果已经存在，先删除
    if($('#ppt_file').length){
        // 防止第二次选择相同文件无法触发onchange
        document.body.removeChild($('#ppt_file')[0])
    }
    inputObj=document.createElement('input')
    inputObj.setAttribute('id','ppt_file');
    inputObj.setAttribute('type','file');
    inputObj.setAttribute('name','pptfile');
    // 自定义文件类型pptx,ppt,pdf,docx,doc,xlsx,xls,png.jpeg,jpg
    inputObj.setAttribute('accept','application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint, '+
        'application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, '+
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/png, image/jpeg');
    inputObj.setAttribute("style",'visibility:hidden');

    document.body.appendChild(inputObj);
    // document.getElementById("room_div_mid_canvas").appendChild(inputObj);
    //添加onchage事件
    $('#ppt_file').on('change',function(){
        //显示等待层
        DisplayLoadingDiv(true,'正在转换，请耐心等待...');
        var ppt_file = $('#ppt_file')[0].files[0];
        var formData = new FormData();
        formData.append("file",ppt_file);
        $.ajax({
            type:"post",
            url:requestIp+"/file/convert",
            //var requestIp = 'http://120.76.248.33:10020/'
            dataType: 'Json',
            data:formData,
            crossDomain:true==!(document.all),//ie打开本地html 加上这句！同时关闭ie安全模式
            processData : false, // 使数据不做处理
            contentType : false, // 不要设置Content-Type请求头
            success:function(data) {
                // alert("数据请求成功==");
                // console.log(data.result);
                //关闭等待层
                DisplayLoadingDiv(false);
                //上交所
                // createPPtWhiteBoard(data.data);
                //测试环境
                if(data.errorcode ==0){
                    //创建ppt白板
                    createPPtWhiteBoard(data.content);
                }else {
                    hideMessager();
                    $.messager.alert('提示','文档转换失败，'+data.msg);
                    // $.messager.popup('文件转换失败，'+data.msg,3000)
                }

                // arr.push(mycanvas.getGuid());
            },
            error:function() {
                // alert("数据请求失败==");
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
                //关闭等待层
                DisplayLoadingDiv(false);
                // 防止第二次选择相同文件无法触发onchange
                // $('#ppt_file').val("");//ie11以上没问题，ie10file具备readonly,只能使用清除input
                document.body.removeChild(inputObj)

            }
        });
    })

    // inputObj = document.getElementById('ppt_file');
    inputObj.click();
};
//图片上传
function imgUpLoad(successTodo){
    var inputForImg;
    //如果已经存在，先删除
    if($('#img_file').length){
        // 防止第二次选择相同文件无法触发onchange
        document.body.removeChild($('#img_file')[0])
    }
    inputForImg=document.createElement('input');
    inputForImg.setAttribute('id','img_file');
    inputForImg.setAttribute('type','file');
    inputForImg.setAttribute('name','imgFile');
    // 自定义图片类型png.jpeg,jpg
    inputForImg.setAttribute('accept','image/png, image/jpeg');
    inputForImg.setAttribute("style",'visibility:hidden');
    document.body.appendChild(inputForImg);
    $('#img_file').on('change',function(){
        //显示等待层
        DisplayLoadingDiv(true,'正在上传，请耐心等待...');
        var img_file = $('#img_file')[0].files[0];
        var formData = new FormData();
        formData.append("file",img_file);
        $.ajax({
            type:"post",
            url:requestIp+"/file/convert",
            dataType: 'Json',
            data:formData,
            crossDomain:true==!(document.all),//ie打开本地html 加上这句！同时关闭ie安全模式
            processData : false, // 使数据不做处理
            contentType : false, // 不要设置Content-Type请求头
            success:function(data) {
                //关闭等待层
                DisplayLoadingDiv(false);
                //执行successTodo
                successTodo();
                if(data.errorcode ==0){
                    var pageW = data.content[0].width;
                    var pageH = data.content[0].height;
                    //更改背景图
                    var url = data.content[0].webUrl;
                    mycanvas.changeBgImage(url,pageW,pageH);
                }else {
                    // $.messager.popup('文件转换失败，'+data.msg,3000)
                    hideMessager();
                    $.messager.alert('提示','图片上传失败，'+data.msg);
                }
            },
            error:function() {
                // alert("数据请求失败==");
                hideMessager();
                $.messager.alert('提示',"网络错误，请检查网络后重试");
                //关闭等待层
                DisplayLoadingDiv(false);

            }
        });
    })

    // inputObj = document.getElementById('ppt_file');
    inputForImg.click();
}
//创建ppt白板
function createPPtWhiteBoard(imgUrls){
    var whiteboardPages=[];
    //for of循环不兼容ie
    // for(var imgUrl of imgUrls){
    //     var pageObj = {"pageBgImage":""};
    //     pageObj.pageBgImage = imgUrl;
    //     pageObj.pageBgColor = "#ffffff";
    //     whiteboardPages.push(pageObj);
    // }
    if(!imgUrls){
        $.messager.popup('图片不能为空',3000)
        return
    }
    var canvasHeight = imgUrls[0].height;
    var canvasWidth = imgUrls[0].width;
    for (var index = 0; index < imgUrls.length; index++) {
        var pageObj = {"pageBgImage":""};
        // 测试环境
        pageObj.pageBgImage = imgUrls[index].webUrl;
        //上交所
        // pageObj.pageBgImage = imgUrls[index]
        //需要传pageBgColor，否则andriod接收消息出错，后续可能要改进
        pageObj.pageBgColor = "#ffffff";
        pageObj.pageBgImageW = canvasWidth;			//当前页的宽度
        pageObj. pageBgImageH = canvasHeight;			//当前页的高度
        whiteboardPages.push(pageObj);
        // 故意设置出错的路径测试
        // if (index==1) {
        //     imgUrls[2] = "test.png"
        // }
    }
    //设置输入框默认白板名为ppt文件名
    var file = $("#ppt_file").val();
    // 防止第二次选择相同文件无法触发onchange
    // $('#ppt_file').val('');
    document.body.removeChild($("#ppt_file")[0])
    var fileName = file.substring(file.lastIndexOf("\\")+1,file.lastIndexOf("."));

    // var wbName = prompt('请输入白板名',fileName);

    // if(wbName !== null){
    //     // if($('#room_canvas').parent.width() > canvasWidth){
    //     //     $('#room_canvas').width(canvasWidth)
    //     // }

    //     mycanvas.addWhiteBoard(wbName,whiteboardPages);
    //     //先创建白板才能设置白板宽高
    //     // mycanvas.setCanvasSize(canvasWidth,canvasHeight)
    //     // //创建白板时调用视频会议组件的共享白板功能
    //     // meetingInstance.meetingWhiteBoardShare()
    //     //在回调中push
    //     // arr.push(mycanvas.getGuid());
    // }
    hideMessager();
    $.messager.prompt('创建文档白板','请输入白板名：',function(val){
        preventClickQuick(function () {
            var wbName = val;
            // console.log(wbName);
            //创建文档白板
            if(!wbName){
                return
            }
            mycanvas.addWhiteBoard(wbName,whiteboardPages);
            isMyCreateWB = true;

        })

    },'',fileName,function(val){
        //校验规则
        if(!val){
            // $.messager.popup('白板名不能为空')
            return false
        }
        return true
    });
};
//创建空白白板
function createBlankWhiteBoard(wbName){
    // var containerH = $('#room_canvas').height();
    // var containerW =$('#room_canvas').width();

    mycanvas.addWhiteBoard(wbName);
    isMyCreateWB = true;
    // mycanvas.setCanvasSize(containerW,containerH);
    //创建白板时调用视频会议组件的共享白板功能
    // meetingInstance.meetingWhiteBoardShare()
};
//添加白板缩略图
function addThumb(whiteBoardId,whiteBoardName,pageIndex,pageCount){
    var $listDiv =  $("#wb_thumb_list");
    var boxHeiht = $("#wb_thumb_box").height();
    var itemHeight = $listDiv.children().outerHeight(true);
    var marginBottom = parseInt($listDiv.children().css('margin-bottom'))
    var showItem = parseInt((boxHeiht+marginBottom)/itemHeight); //可容纳显示的的个数
    $("#wb_thumb_list .wb_thumb_item .thumb_choise").removeClass("thumb_choise");
    var wbCount = arr.length;
    var inserDiv = "<li class='wb_thumb_item' Id='"+whiteBoardId +"'>"+
        "<div class='item_content thumb_choise' >"+
        "<span class='wbName'>"+whiteBoardName+"</span>"+
        "<span class='wbPage'>"+pageIndex+"/"+pageCount+"</span>"+
        "</div>"+
        "</li>"

    if(wbCount == 1){
        $listDiv.empty().append(inserDiv)
    }
    else if(wbCount > 1 && wbCount<= showItem){
        $listDiv.append(inserDiv);
    }else if(wbCount > showItem){
        $listDiv.append(inserDiv);
        $("#wb_thumb_box").removeClass('AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter')
    }
    // 添加淡入效果
    // $("#"+whiteBoardId).hide().fadeIn(500);

    //绑定白板切换事件
    $("#"+whiteBoardId).unbind('click').on({
        click:function(event){
            // 所点缩略图对应下标
            // var index = $(this).parents(".wb_thumb_item").index();
            // console.log(index)
            mycanvas.changeWhiteBoard(1,whiteBoardId);
            //点击，点击后默认获得焦点，可用键盘控制切换
        },
    });
    //先获取焦点
    $("#wb_thumb_list").focus();


};
//删除白板缩略图
function deleteThumb(thumbId){
    // thumbIndex表示删除的第thumbIndex+1个白板，如2表示第三个
    var $listDiv = $("#wb_thumb_list");
    var boxHeiht = $("#wb_thumb_box").height();
    var itemHeight = $listDiv.children().outerHeight(true);
    var marginBottom = parseInt($listDiv.children().css('margin-bottom'))
    var showItem = parseInt((boxHeiht+marginBottom)/itemHeight); //可容纳显示的的个数
    // eq从0开始，如2表示第三个
    // $(".wb_thumb_item").eq(thumbIndex).remove();
    var wbCount = arr.length;//已经删除
    var divWidth = $("#wb_thumb_list>li").innerWidth();
    if(wbCount <= showItem){
        //添加垂直水平居中
        $("#wb_thumb_box").addClass("AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter");
        // showItem个以内不需要滚动，因为放得下
        // $listDiv.animate({ scrollLeft:0},500);
    }else if(wbCount >= showItem){
        // $("#"+thumbId).nextAll().each(function(i){
        //     var $this = $(this);
        //     $this.animate({left:"-="+divWidth},500);
        // })
    }
    //先隐藏
    $("#"+thumbId).fadeOut(500);
    //移除当前缩略图
    setTimeout(function(){
        // animate需要500ms，故为了看到过渡效果，移除最后一项需要延时500ms执行
        $("#"+thumbId).remove();
    },500)

    $("#wb_thumb_list").focus();
}
//缩略图初始化
function initThumb(){
    var div = "<li class='wb_thumb_item'>"+
        "<div class='item_content'>"+
        "<span class='wbName'>无</span>"+
        "<span class='wbPage'>0/0</span>"+
        "</div>"+
        "</li>"
    $("#wb_thumb_list").empty().append(div);
    $("#wb_thumb_list").css('top','0');
    $("#wb_thumb_box").addClass("AnyChatMeeting_flexVerCenter AnyChatMeeting_horCenter");
}
//房间白板相关初始化
function initRoomWhiteBoard(){
    //初始化白板数组
    arr =[];
    //移除已有画布
    $("#room_canvas").empty();
    //初始化页码
    $('#pageNum').text(0);
    $('#pageIndex').text(0);
    //初始化各带状态的操作按钮
    var eleArr = [
        'addWB',
        'free',
        'lineMode_small',
        'colorMode_black',
        'bgcolor_white',
        'wbSize_third']
    initWbButtons(eleArr)
    //初始化更改背景图片按钮
    // $('#bgChange span').first().removeClass('icon_bgDelete').addClass('icon_bgChange');
    // $('#bgChange span').eq(1).text("更改背景")
    //初始化白板缩略图
    initThumb();

}
//白板select操作按钮初始化
function initWbButtons(eleArr) {
    var id  ='';
    for (var i = 0;i<eleArr.length;i++){
        id = eleArr[i]
        var ele = $('#'+id+' a').html();
        $('#'+id).parent('ul').prev('button').find('.button_content').html(ele);
        //更改button的data-val值
        var dataVal = $('#'+id).attr('data-val');
        $('#'+id).parent('ul').prev('button').attr('data-val',dataVal);
    }

}
//切换缩略图
function thumbSwitch(thumbId,whiteBoardIndex){
    // whiteBoardIndex从0开始
    // var index = $("#wb_thumb_list .wb_thumb_item .thumb_choise").parent().index();
    var $listDiv = $("#wb_thumb_list");
    var boxHeiht = $("#wb_thumb_box").height();
    var itemHeight = $listDiv.children().outerHeight(true);
    var marginBottom = parseInt($listDiv.children().css('margin-bottom'))
    var showItem = parseInt((boxHeiht+marginBottom)/itemHeight); //可容纳显示的的个数
    var warpHeight = $listDiv.height(); //由item撑开高度
    var moveItem;//滚动个数
    var moveTop;//偏移top
    var wbCount = arr.length;
    //更改选中样式
    changeChoiseStyle(thumbId);
    //获取焦点
    $listDiv.focus();
    //高度超过则滚动，没超过不滚动

    if(warpHeight > boxHeiht){
        moveItem = (whiteBoardIndex +1) - showItem;
        if(moveItem <= 0){
            //滚动到最前
            moveTop = 0;

        }else{
            //滚动whiteBoardIndex+1 -showItem个
            moveTop = moveItem * itemHeight;
        }
        $listDiv.stop(true).animate({ top:-moveTop},500);
    }
}
//切换缩略图选中样式 index为将切换到的缩略图下标
function changeChoiseStyle(thumbId){
    //将切换到的缩略图
    var $goThumb =  $("#"+thumbId);
    //移除选中样式
    $("#wb_thumb_list .wb_thumb_item .thumb_choise").removeClass("thumb_choise");
    //添加选中样式
    $goThumb.children().addClass("thumb_choise");
}

// 自动生成一条视频会议记录
function dispatchData() {
    const query = window.location.search.substring(1);
    const keyValues = query.split("&");
    for (let i=0;i<keyValues.length;i++) {
        let pair = keyValues[i].split("=");
        propData[pair[0]] = JSON.parse(decodeURIComponent(pair[1]))
    }

    const formData = propData.form
    formData.appId = mDefaultAppID
    formData.planBeginTime = timetZone(formData.mettingTime[0])
    formData.planEndTime = timetZone(formData.mettingTime[1])
    autoCreate = true
    requestMeetingCreate(formData)
}

// 时间过滤
function timetZone(time) {
    if (!time) {
      return '';
    }
    const timeMills = Date.parse(time);
    // 时区差,该值为负数
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    // 返回当前时区的时间
    let imetZoneTime = new Date(timeMills - tzoffset).toISOString();
    imetZoneTime = imetZoneTime.substring(0, 19).replace('T', ' ')
    return imetZoneTime;
}