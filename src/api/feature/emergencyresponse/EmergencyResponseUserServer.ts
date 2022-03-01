import { RequestServerClass } from '../../../util/request';
export default class EmergencyResponseUserServer {
    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     *
     * @param opts 查烟台的组织机构树
     */
    public getTree() {
        const url = '/gemp-user/api/gemp/user/org/typhoon/trees/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
    *
    * @param opts 查通讯录人员
    */
    public getPeopleList(opts: any) {
        const url = '/gemp-user/api/gemp/user/maillist/person/typhoon/org/users/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }


}
