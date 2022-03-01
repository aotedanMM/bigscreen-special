// 自定义轨迹更新器示例
import ITrackUpdater from '../ITrackUpdater';
export default class TrackUpdaterTest implements ITrackUpdater {
    private handler: any = null;
    private timer: any = null;
    private interval: any = null;
    private lock: number = 0;
    constructor(interval: number) {
      this.interval = interval;
    }
    /**
     * 设置处理器
     * @param handler
     */
    public setHandler(handler: any): void {
      this.handler = handler;
    }
    /**
     * 开启定时刷新
     */
    public start(): void {
      this._clear();
      this.lock = 0;
      this.timer = setInterval(() => {
          // 这里调用服务获取轨迹
          Promise.resolve().then(() => {
            if (this.lock === 0) {
              this.invoke();
            }
          });
      }, this.interval);
    }
    /**
     * 结束定时刷新
     */
    public stop(): void {
      this._clear();
      this.lock = 1;
    }
    /**
     * 执行更新
     */
    public invoke(): void {
      if (this.handler) {
        const data: any = {
          time: new Date().getTime(),
          data: [
            {
              startTime: '',
              endTime: '',
              points: [],
            },
          ],
          location: [], // 当前位置
        };
        this.handler.onTrackUpdate(data);
      }
    }
    private _clear() {
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      this.timer = null;
    }
  }
