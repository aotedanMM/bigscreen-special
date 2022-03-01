
// var DetachableServiceManger = {}
// 插拔式服务构造函数
function AnyChatDetachableService (option) {
    this.detachableId  = option.detachableId || BRAC_GetSDKOptionString(BRAC_SO_CORESDK_NEWGUID);
    this.serverFlag = 2164260864;
    this.detachableServiceManger = [];
    this.statusManger = [];
    // if(typeof (option.callbackEvent) === "function"){
    //     ServiceGuidManger[option.detachableId] = option.callbackEvent
    // }
    // this.connectToDetachableServer()
};
AnyChatDetachableService.prototype = {
    constructor: AnyChatDetachableService,
    // 获取当前实例
    getCurrentInstance:function(){
        return this
    },
    //连接插拔式接口
    connectToDetachableServer: function (detachableId ,serverFlag) {
        if(detachableId === void 0){detachableId = this.detachableId}
        // if(serverFlag === void 0){serverFlag = this.serverFlag}
        //初始化插拔式服务
        var errorCode =  this.requestToServer({"cmd":1,'detachableId':detachableId});
        return errorCode
    },
    //发送数据
    sendData: function (data) {
        var sendData = {
            "cmd":4,
            'detachableId':data.detachableId,
            'appid':data.appid,
            'userid':data.userid,
            'sync':data.sync,
            'timeout':data.timeout,
            'databuf':data.databuf,
            // 'guid':data.guid
        }

        var errorCode = this.requestToServer(sendData);
        return errorCode
    },
    //断开插拔式接口
    closeDetachableServerConnect: function (detachableId) {
        if(detachableId === void 0){detachableId = this.detachableId}
        var errorCode = this.requestToServer({"cmd":2,'detachableId':detachableId});
        return errorCode
    },


    //发送信息到插拔式服务
    requestToServer:function (cmd) {
        var jsoncmd = {
            "cmd":cmd.cmd,
            "serverobject":cmd.detachableId,
        };
        if(cmd.cmd == 4){
            jsoncmd.appid = cmd.appid;
            jsoncmd.userid = cmd.userid.toString();
            jsoncmd.sync = cmd.sync;
            jsoncmd.timeout = cmd.timeout || 3000;
            jsoncmd.databuf = cmd.databuf
        }else{
            jsoncmd.svrflags = this.serverFlag
        }
        console.log("发送到插拔式服务：");
        console.log(jsoncmd);
        var errorObj = BRAC_SDKControl(ANYCHAT_SDKCTRL_SERVEROBJECT, JSON.stringify(jsoncmd));
        if(JSON.parse(errorObj).errorcode != 0){
            console.log('错误信息:'+errorObj);
        }
        //加入本地日志
        var strLog ="BRAC_SDKControl(" + ANYCHAT_SDKCTRL_SERVEROBJECT +","+ JSON.stringify(jsoncmd)+")=" + errorObj;
        if(strLog.length > 4000){
            strLog ="BRAC_SDKControl(...)(数据过大自动省略)" ;
        }
        BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
        // addAnyChatLog(strLog);
        return JSON.parse(errorObj).errorcode
    },

}
//添加本地日志
// function addAnyChatLog(message) {
//     BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,message);
// }
//处理服务器返回插拔式数据
function handleDetachableServiceData (lpEventJsonStr) {
    var AnyChatDetachableService =  AnyChatWebSDK.anychatSDKInstance.AnyChatDetachableService;
    console.log("handleDetachableServiceData接收服务消息：");
    //加入本地日志
    var strLog ="handleDetachableServiceData("+ lpEventJsonStr+")";//数据过长会写不进去
    if(strLog.length > 4000){
        strLog ="handleDetachableServiceData(...)(数据过大自动省略)" ;
    }
    // addAnyChatLog(strLog);
    BRAC_SetSDKOption(BRAC_SO_CORESDK_WRITELOG,strLog);
    var jsonData = JSON.parse(lpEventJsonStr);
    console.log(jsonData);
    if(typeof jsonData == 'object'){
        if(jsonData.hasOwnProperty('eventtype')){
            if(jsonData.eventtype == 1){
                if(jsonData.errorcode != 0){
                    //连接失败/中途断开
                    console.log('插拔式服务初始化失败/中途断开')
                    if(AnyChatDetachableService.statusManger.hasOwnProperty(jsonData.serverobject) &&
                        AnyChatDetachableService.statusManger[jsonData.serverobject].connect){
                        //中途断开
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type: "onAnyChatDetachableServiceDisConnect",
                            result: JSON.stringify(jsonData),
                        })
                    }else{
                        //如果还未初始化过，此时断开视为初始化失败
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type: "onAnyChatDetachableServiceConnect",
                            result: JSON.stringify(jsonData),
                        });
                    }

                }
            }else if(jsonData.eventtype == 2){
                if(jsonData.status == 1){
                    //断开成功
                    console.log('插拔式服务连接断开')
                    if(jsonData.errorcode == 0){
                        console.log('插拔式服务主动连接断开')
                    }else{
                        console.log('插拔式服务异常连接断开')
                    }

                    AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                        type: "onAnyChatDetachableServiceDisConnect",
                        result: JSON.stringify(jsonData),
                    });

                }else if(jsonData.status == 3){
                    //初始化成功
                    console.log('插拔式服务初始化成功')
                    var obj = {};
                    if(AnyChatDetachableService.statusManger.hasOwnProperty(jsonData.serverobject)){
                        //重连成功
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type: "onAnyChatDetachableServiceReConnect",
                            result: JSON.stringify(jsonData),
                        });
                    }else{
                        //初始化连接成功
                        obj[jsonData.serverobject] = {
                            connect:true
                        }
                        AnyChatDetachableService.statusManger.push(obj);
                        AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                            type: "onAnyChatDetachableServiceConnect",
                            result: JSON.stringify(jsonData),
                        });
                    }


                }
            }
        }else{
            console.log('插拔式服务业务消息')
            AnyChatWebSDK.anychatSDKInstance.eventTarget.fireEvent({
                type: "onAnyChatDetachableServiceReceiveData",
                result: JSON.stringify(jsonData),
            });
        }
    }
}
