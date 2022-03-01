
export default interface ITrackUpdater {

    /**
     * 设置处理器
     * @param handler {ITrackUpdateHandler}
     */
    setHandler(handler: any): void;

    /**
     * 开启定时刷新
     */
    start(): void;

    /**
     * 结束定时刷新
     */
    stop(): void;

    /**
     * 执行
     */
    invoke(): void;
}
