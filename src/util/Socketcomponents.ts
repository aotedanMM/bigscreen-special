import socket from './socket';


const Socketcomponents: any  = {
    /**
     *
     * @param callback
     * @description 事件信息
     */
  eventInfo(callback: any ) {
    socket.get('eventInfo', 'componts', callback);
    },
    /**
     *
     * @param callback
     * @description 物资调派
     */
    materialDispatch(callback: any ) {
    socket.get('materialDispatch', 'componts', callback);
    },
    /**
     * @description 重点事件
     * @param callback
     */
    keyEvent(callback: any ) {
    socket.get('keyEvent', 'componts', callback);
    },
    /**
     * @description 当地政府
     * @param callback
     */
    localGovernment(callback: any ) {
    socket.get('localGovernment', 'componts', callback);
    },
    /**
     * @description 处置建议
     * @param callback
     */
    disposalAdvice(callback: any ) {
    socket.get('disposalAdvice', 'componts', callback);
    },
    /**
     * @description 领导批示
     * @param callback
     */
    leaderInstruction(callback: any ) {
    socket.get('leaderInstruction', 'componts', callback);
    },
    /**
     * @description 进展情况
     * @param callback
     */
    theProgress(callback: any ) {
    socket.get('theProgress', 'componts', callback);
    },
    /**
     * @description 实时灾情
     * @param callback
     */
    knownDisaster(callback: any ) {
    socket.get('knownDisaster', 'componts', callback);
    },
    /**
     * @description 队伍调派
     * @param callback
     */
    teamTransfer(callback: any ) {
    socket.get('teamTransfer', 'componts', callback);
    },
};


// Socketcomponents.eventInfo()

export default Socketcomponents;

