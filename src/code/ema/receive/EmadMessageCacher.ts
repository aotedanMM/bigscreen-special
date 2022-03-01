import EmadMessageSuccessor from './EmadMessageSuccessor';
import EmadMessage from '../data/EmadMessage';
/**
 * 消息缓存
 */
export default class EmadMessageCacher extends EmadMessageSuccessor {
    public items: EmadMessage[] = new Array(0);

    /**
     * 刷新缓存
     */
    public refresh(): void {
        //
    }
}
