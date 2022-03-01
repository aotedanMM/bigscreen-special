export class RequestStack {
    public leval: number;
    public rateLeval: boolean;
    public number: number;
    public path: string;
    public header: string;
    constructor(leval: number, rateLeval: boolean , path: string , headString: string ) {
        this.leval = leval;  // 缓冲的等级
        this.rateLeval = rateLeval; // 根据缓冲的等级，对rateLeval进行更新
        this.number = 0; //
        this.path = path ; // 缓冲的key
        this.header = headString;  // 缓冲数据的url
    }
    public setCache(data: any) {
        if (this.number) {
           return this.getCache(this.header + this.path);
        }
        if (this.rateLeval) {
            localStorage.setItem(this.header + this.path, JSON.stringify(data));
            this.number++;
        }
    }
    public getCache(path: string) {
        if (!this.rateLeval) { return false; }
        return localStorage.getItem(this.header + this.path);
    }
    public updata(data: any) {
        localStorage.setItem(this.header + this.path, JSON.stringify(data));
    }
}

export default RequestStack;
