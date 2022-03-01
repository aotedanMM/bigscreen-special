
import axios from 'axios';

export class RequestServerClass {

    public serverObj: any;

    constructor(opt?: object) {
        const obj = Object.assign({}, opt);
        /**
* 密码加密方法
*/
        function aesEncrypt(message: any, key: any, iv?: any) {
            const CryptoJS = require('crypto-js');
            const encryptKey = CryptoJS.enc.Utf8.parse(key);
            const cipher = CryptoJS.AES.encrypt(message, encryptKey, {
                iv: !!iv ? CryptoJS.enc.Hex.parse(iv) : null,
                mode: !!iv ? CryptoJS.mode.CBC : CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            return cipher.ciphertext.toString(CryptoJS.enc.Base64);
        }
        this.serverObj = axios.create(
            obj,
        );
        this.serverObj.interceptors.request.use((config: any) => {
            let rs = '';
            if (config.baseURL && (config.url.indexOf('api/universal') !== -1)) {
                // 传递的参数都进行加密
                if (config.data && config.method !== 'get') {
                    rs = aesEncrypt(JSON.stringify(config.data), 'yj@Gsafety#2020*');
                    config.data = rs;
                    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                } else if (config.params && config.method !== 'get') {
                    rs = aesEncrypt(JSON.stringify(config.params), 'yj@Gsafety#2020*');
                    config.params = { param: rs };
                    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                }
            }
            return config;
        }, (error: any) => {
            return Promise.reject(error);
        });
    }
}
