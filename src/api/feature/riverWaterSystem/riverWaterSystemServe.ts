import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 河网水系接口
export class RiverWaterSystemServe {

    public rSerivce: any;
    public rSerivce2: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.rSerivce2 = new RequestServerClass({
            baseURL: publishObjectPath.value.floodServerPath,
        });
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 全部区市接口
    public getCityList() {
        const url = '/api/district/' + publishObjectPath.value.district.root + '/childs/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url).then((response: any) => {
                resolve(response);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    // 全部区市接口
    public getTownList(opts: any) {
        const url = '/api/public/dlgbouaxiang/bypac/v1';
        const data = {
            center: opts.point[0] + ' ' + opts.point[1],
            pac: opts.code,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                response.data.forEach((town: any) => {
                    town.lon = town.geom.coordinates[0];
                    town.lat = town.geom.coordinates[1];
                    town._id = town.id;
                    town.area = parseFloat((town.tag.arear / (1000 * 1000)).toFixed(3));
                    town.population = town.tag.pouplationNum ? (town.tag.pouplationNum / 10000).toFixed(6) : 0;
                    town.shape_area = town.tag.arear;
                    town.name = town.tag.name;
                    town.shortname = town.tag.shortname;
                    town.popdensity = ((town.population * 10000) / (town.area * 1)).toFixed(2);
                    town._distance = (parseFloat(town.distance)).toFixed(2);
                });
                const compare = function(a: any, b: any) {
                    return (a._distance < b._distance) ? -1 : 0;
                };
                const beforeSorted = response.data;
                const sortedData = beforeSorted.sort(compare);
                response.data = sortedData;
                resolve(response);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    // 获取重要河流和其他河流的条数
    public getStatImportantInfo() {
        const url = '/tSwsshc/v1/statImportantInfo';
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.get(url).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    // 河流列表
    public getRiverList(opts: any) {
        // if (opts.keyword && !opts.name) {
        //     opts.name = opts.keyword;
        //     delete opts.keyword;
        // }
        if (opts.keyword) {
            const arr = [];
            for (let index = 0; index < opts.keyword.length; index++) {
                let word = opts.keyword.charAt(index);
                if (word === '%') {
                    // arr.push('\\' + word);
                    // continue;
                    word = '#';
                }
                arr.push(word);
            }
            opts.keyword = arr.join('');
        }
        const url = '/tSwsshc/v1/stream/page';
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    // 河流详情
    public getRiverDetail(id: string) {
        const url = '/tSwsshc/v1/stream/detail?id=' + id;
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.get(url).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 河流查询
     * @param opts.keyword 非必填。关键字
     * @param opts.districtCode 非必填。区域编码
     * @param opts.isImportantRiver 非必填。是否为重要河流。1是重要。0是不重要。
     */
    public findeAllRiver(opts: any) {
        const url = '/tSwsshc/v1/findAll/stream';
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 缓冲区
     * @param opts
     * @param opts.geom  wkt字符串
     * @param opts.radius  缓冲半径
     */
    public riverBuffer(opts: any) {
        const url = publishObjectPath.value.floodServerPath + '/tSwsshc/v1/radius';
        // return new Promise((resolve, reject) => {
        // this.rSerivce2.serverObj.post(url, opts).then((response: any) => {
        //     resolve(response.data);
        // }, (err: any) => {
        //     reject(err);
        // });
        let result = opts.geom;
        $.ajax({
            url,
            type: 'POST',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            data: JSON.stringify(opts),
            async: false,
            success: (res) => {
                result = res.data;
            },
        });
        return result;
        // });
    }
}
