import EmadMessageSuccessor from './EmadMessageSuccessor';
import EmadMessageCacher from './EmadMessageCacher';
import EmadMessagePersistentor from './EmadMessagePersistentor';
import EmadMessageDispatcher from './EmadMessageDispatcher';
import EmadMessageIntercepter from './EmadMessageIntercepter';
import EmadMessage from '../data/EmadMessage';
/**
 * 消息接收
 */
export default class EventMessageReceiver {

    public successor: EmadMessagePersistentor;

    public messageIntercepter: EmadMessageIntercepter = new EmadMessageIntercepter();

    constructor() {
        const dispatcher: EmadMessageDispatcher = new EmadMessageDispatcher();
        const cacheSuccessor: EmadMessageCacher = new EmadMessageCacher();
        cacheSuccessor.setSuccessor(dispatcher);
        const persistentor: EmadMessagePersistentor = new EmadMessagePersistentor();
        persistentor.setSuccessor(cacheSuccessor);
        this.successor = persistentor;
    }

    /**
     * 接收websocket 消息
     * @param data {Object} 消息内容
     */
    public onMessage(data: any) {
        const msg: EmadMessage = this.messageIntercepter.cast(data);
        this.successor.doIt(msg);
    }
}
