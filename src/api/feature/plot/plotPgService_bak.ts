declare var $: any;
import {RequestServerClass} from '../../../util/request';
/*事件信息*/
export class PlotPgService {

    public rSerivce: any;
    public options: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.options = opt;
    }

    /**
     * 保存标绘信息
     * @param {g2.plot.PlotSchema} plotSchema 标绘信息
     */
    public save(plotSchema: any) {
        this.initService();
        const url = '/emap/plot/save';
        plotSchema.content = JSON.stringify(plotSchema.content);
        const data = {
            id: plotSchema.id,
            name: plotSchema.name,
            userId: plotSchema.userId,
            content: JSON.stringify(plotSchema),
        };
        return new Promise( (resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                response.data.success = true;
                resolve(response.data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    // 方案名称是否重复验证
    public schemaNameValidation(name: string) {
        return new Promise( (resolve, reject) => {
            resolve();
        });
    }

    /**
     * 列出指定用户在指定时间范围内所有标绘信息
     * @param {String} userid 用户ID
     * @param {Date} beginTime 起始时间
     * @param {Date} endTime 结束时间
     * @param {Number} page 分页
     * @param {Number} limit 分页个数
     * @param {String} name 名称关键字
     */
    public list( userid?: any, beginTime?: any, endTime?: any, page: any = 1, limit: any= 10000, name: any = '') {
        this.initService();
        const url = '/emap/plot/list';
        const data = {
            name,
            userId: userid,
            beginTime,
            endTime,
            pageIndex: page,
            pageSize: limit,
        };
        const result: any = {};
        return new Promise( (resolve, reject) => {
            this.rSerivce.serverObj.get(url, {params: data}).then((response: any) => {
                const res = response.data.data;
                result.array = res.rows;
                resolve(result);
            }).catch((err: any) => {
                console.log(err);
                reject(err);
            });
        });
    }
    /**
     * 载入标绘信息
     * @param {String} id 标绘信息ID
     */
    public load( id: any) {
        this.initService();
        const url = '/emap/plot/load';
        const param = {
            id,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url, {params: param}).then((response: any) => {
                const data = response.data.data;
                const schema = JSON.parse(data.content);
                resolve((G as any).plot.PlotSchema.fromJson(schema));
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 编辑标绘信息
     * @param {g2.plot.PlotSchema} plotSchema 标绘信息
     */
    public edit( plotSchema: any) {
        this.initService();
        const url = '/emap/plot/update';
        plotSchema.content = JSON.stringify(plotSchema.content);
        const data = {
            id: plotSchema.id,
            name: plotSchema.name,
            userId: plotSchema.userId,
            content: JSON.stringify(plotSchema),
        };
        return new Promise( (resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                resolve(response.data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 删除标绘信息
     * @param {String} id 标绘信息ID
     */
    public delete(id: any) {
        this.initService();
        const url = '/emap/plot/delete?id=' + id;
        const data = {
            id,
        };
        return new Promise( (resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                resolve(response.data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    private initService() {
        if (!this.rSerivce) {
            this.rSerivce = new RequestServerClass({ baseURL: this.options.serverUrl });
        }
    }
}
