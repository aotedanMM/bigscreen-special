declare var $: any;
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';

// const qs = require('qs');
const conttype = 'application/json';

/*事件信息*/
export class PlotNoSqlService {

    public rSerivce: any;
    public deserializer: any;
    public dataSetId1: any;
    public options: any;


    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    /**
     * 保存标绘信息
     * @param {g2.plot.PlotSchema} plotSchema 标绘信息
     * @param {Function} success 成功时回调的函数
     * @param {Function} error 失败时回调的函数
     */
    public save(plotSchema: any, success: any, error: any) {
        // console.log('save');
        this.options.serverUrl = publishObjectPath.value.emapService;
        const url: any = this.options.serverUrl + '/dataOperate/create';
        const self: any = this;
        const array: any = [];
        array.push({
            _id: plotSchema.id,
            tag: {
                RELATION_ID: plotSchema.name,
                ORG_PERS_ID: plotSchema.userId,
                content: JSON.stringify(plotSchema),
            },
        });
        const opts: any = {};
        opts.url = encodeURI(url);
        // opts.dataType = 'jsonp';
        opts.type = 'post';
        opts.data = {
            dataSetId: this.dataSetId1,
            data: JSON.stringify(array),
            eId: 'safety',
        },
            window.G.utils.LoggerUtil.info('存储标绘方案');
        return new Promise((resolve, reject) => {

            // get(url, data, responseType, contentType){
            //     url += url.match(/\?/) ? "&" : "?";
            //     url += "timestamp=" + (new Date()).getTime(); // 解决IE浏览器下缓存问题
            //     return this.http.send('get', url, data, responseType, contentType);
            // }
            //

            // self.rSerivce.get(opts.url, opts.data).then((result) => {
            //     resolve(result);
            // }).catch(reason => {
            //     G.utils.LoggerUtil.info('存储同步数据失败！');
            //     reject(reason);
            // })
            self.schemaNameValidation(plotSchema.name).then((res: any) => {
                if (res) {
                    $.ajax(opts)
                        .done((data: any) => {
                            resolve(data);
                        })
                        .fail((data: any) => {
                            window.G.utils.LoggerUtil.info('存储同步数据失败！');
                            reject(data);
                        });
                } else {
                    const err = {
                        responseJSON: {
                            message: 'SchemaNameIsExitError',
                        },
                    };
                    reject(err);
                }
            });

        });
    }
    // 方案名称是否重复验证
    public schemaNameValidation(name: string) {
        return new Promise((resolve, reject) => {
            const httpRequest = new G.base.HttpRequest();
            const url = this.options.serverUrl;
            const queryService = new G.servicev2.ResourceQueryServiceImpl({
                httpRequest,
                url,
            });
            const params: any = {};
            params.table = 'planPlotData';
            const selectFields: any = ['RELATION_ID'];
            params.select = selectFields.join(',');
            params.where = `RELATION_ID=\'${name}\'`;
            queryService.getList(params).then((data: any) => {
                const list: any = data.list;
                if (list && list.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
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
     * @param {Function} success 成功时回调的函数
     * @param {Function} error 失败时回调的函数
     */
    public list(userid?: any, beginTime?: any, endTime?: any, page: any = 1, limit: any = 10000, name: any = '', success?: any, error?: any) {
        // console.log('list')
        const url: any = this.options.serverUrl + '/dataOperate/query';
        const opts: any = {};
        opts.url = encodeURI(url);
        opts.dataType = 'jsonp';
        opts.type = 'get';
        opts.data = {
            dataSetId: this.dataSetId1,
            query: JSON.stringify({
                'tag.ORG_PERS_ID': userid,
                'tag.RELATION_ID': {
                    $regex: name,
                },
            }),
            select: '_id tag.ORG_PERS_ID tag.RELATION_ID createTime',
            page,
            limit,
            startTime: beginTime,
            endTime,
            eId: 'safety',
            sort: '-createTime',
        };
        window.G.utils.LoggerUtil.info('查询标绘方案！');
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax(opts)
                .done((data: any) => {
                    const array: any = [];
                    for (let i = 0, len = data.data.result.length; i < len; i++) {
                        const str = data.data.result[i] || '';
                        array.push({
                            createTime: str.createTime,
                            id: str.id,
                            name: str.tag.RELATION_ID,
                            userid: str.tag.ORG_PERS_ID,
                        });
                    }
                    const obj = {
                        array,
                        totalCount: data.data.totalCount,
                    };
                    resolve(obj);
                })
                .fail((data: any) => {
                    window.G.utils.LoggerUtil.info('存储同步数据失败！');
                    reject(data);
                });
        });

    }
    /**
     * 载入标绘信息
     * @param {String} id 标绘信息ID
     * @param {Function} success 成功时回调的函数
     * @param {Function} error 失败时回调的函数
     */
    public load(id: any, success: any, error: any) {

        // console.log('load')

        const objDeserializer: any = this.deserializer;
        const url: any = this.options.serverUrl + '/dataOperate/query';
        const opts: any = {};
        opts.url = encodeURI(url);
        opts.dataType = 'jsonp';
        opts.type = 'get';
        opts.data = {
            dataSetId: this.dataSetId1,
            query: JSON.stringify({
                _id: id,
            }),
            eId: 'safety',
        },
            window.G.utils.LoggerUtil.info('加载标绘方案');
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax(opts)
                .done((data: any) => {
                    const str = data.data.result[0] || '';
                    const schema = str.tag.content;
                    // resolve(objDeserializer.createJsInstance(schema));
                    resolve((G as any).plot.PlotSchema.fromJson(schema));
                })
                .fail((data: any) => {
                    window.G.utils.LoggerUtil.info('存储同步数据失败！');
                    reject(data);
                });
        });


    }
    /**
     * 编辑标绘信息
     * @param {String} id 标绘信息ID
     * @param {Function} success 成功时回调的函数
     * @param {Function} error 失败时回调的函数
     */
    public edit(plotSchema: any, success: any, error: any) {

        // console.log('edit')

        const url: any = this.options.serverUrl + '/dataOperate/update';
        const array: any = [];
        array.push({
            _id: plotSchema.id,
            tag: {
                RELATION_ID: plotSchema.name,
                ORG_PERS_ID: plotSchema.userId,
                content: JSON.stringify(plotSchema),
            },
        });
        const opts: any = {};
        opts.url = encodeURI(url);
        // opts.dataType = 'jsonp';
        opts.type = 'post';
        opts.data = {
            dataSetId: this.dataSetId1,
            data: JSON.stringify(array),
            eId: 'safety',
        },
            window.G.utils.LoggerUtil.info('更新标绘方案');
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax(opts)
                .done((data: any) => {
                    const res: any = data;
                    resolve(res.success);
                })
                .fail((data: any) => {
                    const res: any = data;
                    window.G.utils.LoggerUtil.info('更新标绘方案失败！');
                    reject(res.success);
                });
        });

    }
    /**
     * 删除标绘信息
     * @param {String} id 标绘信息ID
     * @param {Function} success 成功时回调的函数
     * @param {Function} error 失败时回调的函数
     */
    public delete(id: any, success: any, error: any) {

        // console.log('delete')

        const url: any = this.options.serverUrl + '/dataOperate/deleteByIds';
        const opts: any = {};
        opts.url = encodeURI(url);
        opts.dataType = 'json';
        opts.type = 'get';
        opts.data = {
            dataSetId: this.dataSetId1,
            ids: id,
            eId: 'safety',
        },
            window.G.utils.LoggerUtil.info('删除标绘方案');
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax(opts)
                .done((data: any) => {
                    resolve(data);
                })
                .fail((data: any) => {
                    window.G.utils.LoggerUtil.info('存储同步数据失败！');
                    reject(data);
                });
        });

    }
    /**
     * 创建保存标绘内容数据的表;
     * @param options
     */
    public createDataTable(options: any) {

        // console.log('createDataTable')

        const url: any = this.options.serverUrl + '/dataSet/saveDataSet';
        const model: any = [];
        model.push({
            fieldName: 'CONTENT',
            fieldDesc: '标绘内容',
            fieldType: 'String',
            fieldNote: '保存标绘方案的内容',
        });
        model.push({
            fieldName: 'ORG_PERS_ID',
            fieldDesc: '组织人员编码',
            fieldType: 'String',
            fieldNote: '组织人员编码',
        });
        model.push({
            fieldName: 'RELATION_ID',
            fieldDesc: '方案名称',
            fieldType: 'String',
            fieldNote: '方案名称',
        });
        const data = {
            dataSetId: 'planPlotData',
            name: '保存的标绘方案',
            dataSetType: 'notSpacial',
            public_: 'write',
            model: JSON.stringify(model),
        };
        // let self = this;
        // return new Promise(function (resolve, reject){
        //     $.ajax(opts)
        //         .done(function(data){
        //             resolve(data);
        //         })
        //         .fail(function(data){
        //             G.utils.LoggerUtil.info('存储同步数据失败！');
        //             reject(data);
        //         });
        // })
        $.ajax({
            url,
            data,
        });
    }

}







