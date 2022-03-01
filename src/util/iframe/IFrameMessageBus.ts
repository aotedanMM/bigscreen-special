/**
 * frame间通信工具类
 */
export class IFrameMessageBus {
    // 当前窗口
    private thisWindow: any = null;
    // 目标窗口
    private targetWindows: Window[] = [];
    // 事件处理
    private eventHandlerMap: any = {};
    // window message事件监听
    private onWindowMessage: any = null;

    /**
     * 绑定当前窗口
     * @param thisWindow
     */
    public bind(someWindow: Window) {
        this.unbind();
        this.thisWindow = someWindow;
        this.onWindowMessage = (event: any) => {
            const msgData: any = event.data;
            if (msgData && msgData.event) {
                this.onMessage(msgData.event, msgData.data, event.origin, event.source);
            }
        };
        this.thisWindow.addEventListener('message', this.onWindowMessage);
    }

    public unbind() {
        if (this.thisWindow !== null) {
            this.thisWindow.removeEventListener('message', this.onWindowMessage);
            this.thisWindow = null;
        }
        this.eventHandlerMap = {};
    }

    /**
     * 添加目标窗口实例
     * @param targetWindow 目标窗口实例
     */
    public addTargetWindow(targetWindow: Window) {
        this.targetWindows.push(targetWindow);
    }

    /**
     * 发送消息给目标窗口
     * @param event 消息名
     * @param data 消息数据
     * @param targetOrigin 目标
     */
    public dispatch(event: string, data: any, targetOrigin: string = '*'): void {
        const messageData: any = {
            event,
            data,
        };
        console.debug(`发送消息${event}`, data);
        for (const targetWindow of this.targetWindows) {
            try {
                targetWindow.postMessage(messageData, targetOrigin);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 监听当前窗口事件
     * @param event 事件名
     * @param handler 事件处理方法
     */
    public listen(event: string, handler: (data: any, origin: string, source: any) => void) {
        const eventHandlers: any = this.eventHandlerMap[event] || [];
        eventHandlers.push(handler);
        this.eventHandlerMap[event] = eventHandlers;
    }

    /**
     * 取消监听当前窗口事件
     * @param event 事件名
     * @param handler 事件处理方法
     */
    public unlisten(event: string, handler: any = null) {
        const eventHandlers: any = this.eventHandlerMap[event] || [];
        if (handler === null || handler === undefined) { // 全部取消
            eventHandlers.splice(0, eventHandlers.length);
        } else { // 去掉匹配的处理方法
            let index: number = eventHandlers.length - 1;
            while (index >= 0) {
                const eventHandler: any = eventHandlers[index];
                if (eventHandler === handler) {
                    eventHandlers.splice(index, 1);
                }
                index --;
            }
        }
    }

    /**
     * 消息处理
     */
    public onMessage(event: any, data: any, origin: any, source: any) {
        console.debug(`接收消息${event}`, data);
        const eventHandlers: any = this.eventHandlerMap[event] || [];
        if (eventHandlers && eventHandlers.length > 0) {
            for (const eventHandler of eventHandlers) { // 触发所有监听
                try {
                    eventHandler(data, event.origin, event.source);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

}

