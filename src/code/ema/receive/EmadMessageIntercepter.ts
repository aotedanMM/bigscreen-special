import EmadMessage from '../data/EmadMessage';
/**
 * 消息实例化
 */
export default class EmadMessageIntercepter {
    /**
     * 将原始消息，转换为消息实例
     * @param data 原始消息内容
     */
    public cast(data: any): EmadMessage {
        const msg: EmadMessage = new EmadMessage();
        // todo 处理消息
        //
        return msg;
    }
}
