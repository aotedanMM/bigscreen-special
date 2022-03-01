const componentBase = (G as any).base.ComponentBase;
export default abstract class BaseLayer extends componentBase {
    protected map: any = null;
    protected layer: any = null;
    protected options: any = null;
    // 状态 1 = 初始化 2 = 加载  -2 = 卸载  -1 = 销毁
    protected state: number = 0;
    constructor(map: any, options: any) {
        super();
        this.map = map;
        this.layer = null;
        this.options = options;
        this.state = 1;
    }
    /**
     * 添加
     * @param params
     */
    public abstract load(params: any): void;
    /**
     * 移除
     */
    public abstract unload(): void;

    /**
     * 控制显隐
     * @param visible
     */
    public abstract setVisible(visible: boolean): void;

    /**
     * 更新
     * @param params {Object}
     */
    public update(params: any): void {
        //
    }

    /**
     * 销毁
     */
    public destroy() {
        this.state = -1;
        this.unload();
    }

    /**
     * 是否处于激活状态
     */
    public isLoaded() {
        return this.state > 0;
    }
}
