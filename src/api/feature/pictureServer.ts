import {RequestServerClass} from '../../util/request';
// （图片）
export class PictureServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 互联网情报图片
    public getInternetIntelligenceData() {
      const url = './json/InternetIntelligence.json';
      return this.rSerivce.serverObj.get(url);
    }
    // 回传图像图片
    public getReturnImgData() {
      const url = './json/returnImgData.json';
      return this.rSerivce.serverObj.get(url);
    }
    // PDF演练模板图片
    public getPDFData() {
      const url = './json/PDFBanner.json';
      return this.rSerivce.serverObj.get(url);
    }
}
