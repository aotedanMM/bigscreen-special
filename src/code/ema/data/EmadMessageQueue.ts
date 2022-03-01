import EmadMessage from './EmadMessage';
export default class EmadMessageQueue {
    private items: EmadMessage[] = new Array(0);
    /**
     * 向队列添加消息
     * @param msg {EmadMessage}
     */
    public enter(msg: EmadMessage): void {
        this.items.push(msg);
    }

    /**
     * 从队列获取最新消息
     * @returns EmadMessage | null
     */
    public top() {
        if (this.items.length > 0) {
            const message: any = this.items[0];
            this.items.splice(0, 1);
            return message;
        }
        return null;
    }
    /**
     * 从队列获取指定消息
     * @param index {Number} 索引
     * @returns EmadMessage | null
     */
    public take(index: number) {
        if (index < this.items.length && index >= 0) {
            const message: EmadMessage = this.items[index];
            this.items.splice(index, 1);
            return message;
        }
        return null;
    }
}
