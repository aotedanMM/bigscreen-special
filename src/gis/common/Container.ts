/**
 * 容器
 */
export default class Container {
    private data: any = {};
    constructor() {
        //
    }

    public regist(key: string, value: any) {
        this.data[key] = value;
    }

    public resolve(key: string) {
        return this.data[key] || undefined;
    }
}
