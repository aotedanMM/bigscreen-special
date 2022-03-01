


import {RequestStack} from './requestStack';
import {REQUEST_LEVAL} from './requestLeval' ;

/**
 * 缓冲说明
 * 当leval 为 1，2 的情况
 * 当为1.2的时候
 * 1.先从本地读取缓冲，如果有，则不进行请求
 * 2.如果没有，则把这个缓冲进行添加，此时，存到自己的堆里面，当页面不刷新时，则再进行时，则直接返回此缓冲
 * 3.第一次进入时，则把这个数据缓冲起来
 * 当为3的时候 ，此时，只缓冲一次即可。
 * 此部目前还未做
 * 使用流程
 * 1.在对应请求文件中调用
 * const that = this;
 *  @param url 请求路径
 *  @param that 请求的this
 *  @param cb 回调
 *  @param methods 请求的方法, 默认为get
 *  @param header 请求根路径
 *  @param leval 缓冲等级;
 * res.getData(url, this, cb);
 * 2.清空时，
 * 单个清空。则调用clearSingleCache(path,header)
 * 3.全部清空时，
 * 调用clearAllCache 方法
 * 后续功能:
 * 1、请求失败时，可调用缓冲，统一截取请求失败时的处理
 * 2、清求3的情况，要进行处理下
 * 3、缓冲只为5m，要时行扩展方案
 * 4、给请求封装一个装饰器
 * 5、给获取、添加、更新封闭装饰器
 * 6、发布npm功能，直接通过npm下
 * 后续大的功能：
 * 1、新增请求错误截取，通知服务器，
 * 2、缓冲策略，由配置进行管理处理
*/

class RequestBuffer {
    public stack: any;
    constructor() {
        this.stack = [];
    }
    /**
     * @param leval
     * @param path
     * @param header
     */
    public add(leval: number = 1 , path: string , header: string = '/') {
       const rateLeval =  leval === 3 ? false : true;
       let flat  = false;
       // 第一次加载的情况
       for (const i of this.stack) {
            if (i.header === header && i.path === path) {
                flat = true;
            }
       }
       if (flat) { return false; }
       const newStack = new RequestStack(leval, rateLeval, path, header);
       this.stack.push(newStack);
    }
    public setdata(path: string , header: string = '/' , data: any) {
        for (const i of this.stack) {
            if (i.header === header && i.path === path) {
                    i.setCache(data);
            }
        }
    }
    // 请求出现，直接返回之前缓冲的数据
    public error( path: string , header: string = '/') {
        // const allPath = header + path ;
        for (const i of this.stack) {
            if (i.header === header && i.path === path) {
                return i.getCache();
            }
        }
    }
    // 初始化方法 ，如果有缓冲，直接返回，如果没有。则添加缓冲
    public cache(leval: number = 1 , path: string , header: string = '/') {
        let markFlag = true;
        if (leval !== 3 ) {
            const refult: any = this.getLocal(header, path);
            if (refult) {
                return true ;
            }
        }
        for (const i of this.stack) {
            if (i.header === header && i.path === path) {
                return i.getCache();
                markFlag = false;
            }
        }
        if (markFlag) {
            this.add(leval, path , header);
        }
    }
    // 更新缓冲，如数据变了，则对之前的缓冲进行更新
    public update(path: string , header: string = '/' , data: any) {
        const allPath = header + path ;
        for (const i of this.stack) {
            if (i.header === header && i.path === path) {
                    i.update(data);
            }
        }
    }
    public getLocal(parentPath: string , path: string) {
        return localStorage.getItem(parentPath + path);
    }
    /**
     *
     * @param url 请求路径
     * @param that 请求的this
     * @param cb 回调
     * @param methods 请求的方法,默认为get
     * @param param 请求的参数
     * @param header 请求根路径
     * @param leval 缓冲等级
     */
    public getData( url: string, that: any, cb: any, methods: string = 'get', param: any = {}, header: string = '/' , leval: number = 1) {
        const obj =  this.cache(1, url, that.opt.url);
        if (obj) {
            cb(JSON.parse(obj));
        } else {
            this.add(1, url, that.opt.url);
            that.rSerivce.serverObj[methods](url, param).then((data: any) => {
                const resData = data.data;
                this.setdata(url, that.opt.url, resData);
                cb(resData);
            });
        }
    }
    /**
     * 清除所有缓冲
    */
    public clearAllCache() {
        localStorage.clear();
    }
    /**
     * @param path 请求路径
     * @param header 请求头
     */
    public clearSingleCache(path: string , header: string ) {
         localStorage.setItem(header + path, '');
    }
}

export default RequestBuffer;
