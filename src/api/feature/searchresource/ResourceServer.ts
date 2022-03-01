
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class ResourceServer {

    public rSerivce: any;
    public queryService: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        //
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
    }

    /**
     * 根据救援队id查询装备
     * @param opts
     * @param opts.id 必填
     * @param opts.pageSize 每页记录数，默认为10
     * @param opts.pageNo 页数，从1开始计数
     * @param opts.select 可选
     */
    public getEquipmentByWarBaseId(opts: any) {
        return new Promise(async (resolve, reject) => {
            const params: any = {};
            params.table = 'JC_EQUIPMENT';
            const selectFields: any = ['EQUIPMENTID', 'EQUIPMENTNAME', 'EQUIPMENTNUM', 'WATERCARRYCAP', 'FOAMOUTPUT', 'LIFTHEIGHT', 'DRYPOWERQUY'];
            params.select = opts.select || selectFields.join(',');
            params.where = `TEAMSTAID=\'${opts.id}\'`;
            params.pageSize = opts.pageSize;
            params.pageNo = opts.pageNo;
            this.queryService.getPageList(params).then( (result: any) => {
                resolve(result);
            });
        });
    }

    /**
     * 根据救援队id查询装备
     * @param opts
     * @param opts.id 必填
     * @param opts.pageSize 每页记录数，默认为10
     * @param opts.pageNo 页数，从1开始计数
     * @param opts.select 可选
     */
    public getMaterialByReposityId(opts: any) {
        return new Promise(async (resolve, reject) => {
            const materialSet: any = {
                TP001: {
                  label: '救灾帐篷',
                  unit: '顶',
                },
                TP002: {
                  label: '救灾被服',
                  unit: '件',
                },
                TP003: {
                  label: '救灾食品',
                  unit: '件',
                },
                TP004: {
                  label: '生活用品',
                  unit: '件',
                },
                TP005: {
                  label: '照明用具',
                  unit: '件',
                },
                TP006: {
                  label: '能源动力',
                  unit: '件',
                },
                TP007: {
                  label: '应急救生',
                  unit: '件',
                },
                TP008: {
                  label: '交通工具',
                  unit: '台',
                },
                TP009: {
                  label: '彩条苫布',
                  unit: '件',
                },
                TP010: {
                  label: '卫生设施',
                  unit: '件',
                },
                TP011: {
                  label: '生活家具',
                  unit: '件',
                },
                TP012: {
                  label: '装备工具',
                  unit: '件',
                },
                TP013: {
                  label: '个体防护',
                  unit: '件',
                },
                TP014: {
                  label: '侦测与搜寻',
                  unit: '件',
                },
              };
            const params: any = {};
            params.table = 'JC_MATERIAL_INFO';
            params.where = `REPERTORYID=\'${opts.id}\'`;
            this.queryService.getList(params).then( (result: any) => {
                const list: any = [];
                for (const item of result.list) {
                    const temp: any = {};
                    temp.name = item.MATERIALNAME;
                    temp.value = item.MATERIALNUM;
                    const config: any = materialSet[item.MATERIALTYPE];
                    temp.unit = config.unit;
                    list.push(temp);
                }
                resolve(list);
            });
        });
    }
}

