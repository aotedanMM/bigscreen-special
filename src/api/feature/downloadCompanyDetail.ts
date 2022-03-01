import { RequestServerClass } from '../../util/request';
import publishObjectPath from '@/util/configRegistry';
//
export class DownloadCompanyDetail {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  // 下载企业详情
  public downloadCompanyDetailFun(param: any, urlParam: any) {
    const dataApiServer =
  publishObjectPath.value && publishObjectPath.value.serverPath;
    const url = urlParam;
    const src = dataApiServer + url + encodeURI(param);
    const downloadfile: any = {
      iframe: '',
    };
    // if (typeof download_file.iframe == 'undefined') {
    const iframe: any = document.createElement('iframe');
    downloadfile.iframe = iframe;
    document.body.appendChild(downloadfile.iframe);
    // }
    downloadfile.iframe.src = src;
    downloadfile.iframe.style.display = 'none';
    return this.rSerivce.serverObj.get(url + encodeURI(param));
  }
}
