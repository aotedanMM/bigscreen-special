import EmadMessageSuccessor from './EmadMessageSuccessor';
import EmergencyEventObserver from './EmergencyEventObserver';
import EmadMessage from '../data/EmadMessage';
/**
 * 消息分发器
 */
export default class EmadMessageDispatcher extends EmadMessageSuccessor {


    private observers: Map<string, EmergencyEventObserver[]> = new Map();

    /**
     * 订阅
     * @param subject 主题
     * @param observer 观察者
     */
    public on(subject: string, observer: EmergencyEventObserver): void {
        const list: EmergencyEventObserver[] = this.getObserverList(subject);
        const index: number = list.indexOf(observer);
        if (index >= 0) {
            list.splice(index, 1);
        }
        list.push(observer);
        this.observers.set(subject, list);
    }

    /**
     * 取消订阅
     * @param subject 主题
     * @param observer 观察者
     */
    public off(subject: string, observer: EmergencyEventObserver): void {
        const list: EmergencyEventObserver[] = this.getObserverList(subject);
        const index: number = list.indexOf(observer);
        if (index >= 0) {
            list.splice(index, 1);
        }
        if (list.length > 0) {
            this.observers.set(subject, list);
        } else {
            this.observers.delete(subject);
        }
    }

    public doIt(msg: EmadMessage) {
        // todo 处理、分发消息
        //
        super.doIt(msg);
    }

    // 获取指定注定观察者集合
    private getObserverList(subject: string): EmergencyEventObserver[] {
        if (this.observers.has(subject)) {
            return (this.observers.get(subject) as EmergencyEventObserver[]);
        }
        return new Array(0);
    }

    /**
     * 通知
     * @param subject 主题
     * @param args 参数
     */
    private notify(subject: string, ...args: any[]) {
        const list: EmergencyEventObserver[] = this.getObserverList(subject);
        list.forEach((observer: EmergencyEventObserver, index: number) => {
            observer.onEvent(args[0], args[1]);
        });
    }
}
