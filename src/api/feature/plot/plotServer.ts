import {RequestServerClass} from '../../../util/request';

export class PlotServer {

    public rSerivce: any;
    private eventTypeMap: any = {
        9 : {
            desc: '森林火灾',
            frequentlyPlotFilePath: 'frequentlyPlot-9.json', // 常用标绘符号
            emergencyPlotFilePath: 'emergencyPlotSymbol-9.json', // 应急标绘符号
            normalPlotFilePath: 'normalPlot-9.json', // 标绘符号
        },
        default: { // 默认图标方案
            desc: '',
            frequentlyPlotFilePath: 'frequentlyPlot.json', // 常用标绘符号
            emergencyPlotFilePath: 'emergencyPlotSymbol.json', // 应急标绘符号
            normalPlotFilePath: 'normalPlot.json', // 标绘符号
        },
    };
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getConfig(url: string) {
        return this.rSerivce.serverObj.get(url);
    }

    public saveLocalPic(json: any) {
        return localStorage.setItem('localPic', JSON.stringify(json));
    }

    public getLocalPic() {
        return new Promise((resolve, reject) => {
            const str: any = localStorage.getItem('localPic');
            if (str) {
                resolve(JSON.parse(str));
            }
        });
    }
    /**
    * 获取常用标绘符号
    * @param opts
    * @param opts.eventType 事件类型
    */
    public getFrequentPlotSymbol(opts?: any) {
        const rooturl = './json/plot/';
        opts = opts || {};
        const eventType: string = opts.eventType || 'default';
        const eventTypeObj = this.eventTypeMap[eventType] || this.eventTypeMap.default;
        const  filePath: string = eventTypeObj.frequentlyPlotFilePath;
        const url = rooturl + filePath;
        return this.rSerivce.serverObj.get(url);
    }
    /**
    * 获取应急标绘符号
    * @param opts
    * @param opts.eventType 事件类型
    */
    public getEmergencyPlotSymbol(opts?: any) {
        const rooturl = './json/plot/';
        opts = opts || {};
        const eventType: string = opts.eventType || 'default';
        const eventTypeObj = this.eventTypeMap[eventType] || this.eventTypeMap.default;
        const  filePath: string = eventTypeObj.emergencyPlotFilePath;
        const url = rooturl + filePath;
        return this.rSerivce.serverObj.get(url);
    }
    /**
    * 获取基础标绘符号
    * @param opts
    * @param opts.eventType 事件类型
    */
    public getNormalPlotSymbol(opts?: any) {
        const rooturl = './json/plot/';
        opts = opts || {};
        const eventType: string = opts.eventType || 'default';
        const eventTypeObj = this.eventTypeMap[eventType] || this.eventTypeMap.default;
        const  filePath: string = eventTypeObj.normalPlotFilePath;
        const url = rooturl + filePath;
        return this.rSerivce.serverObj.get(url);
    }
    /**
    * 获取中文名称对照
    * @param opts
    */
   public getNameRef(opts?: any) {
    const url = './json/plot/nameRef.json';
    return this.rSerivce.serverObj.get(url);
   }
    /**
    * 获取标绘图标
    * @param opts
    */
   public getPlotIcons(opts?: any) {
    const url = './json/plot/plotIcons.json';
    return this.rSerivce.serverObj.get(url);
   }
}







