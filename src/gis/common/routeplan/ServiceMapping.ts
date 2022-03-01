export class ServiceMapping {
  public conf: any;
  public config: any;

  constructor(config: any) {
    this.config = config;
    const serviceConfig: any = {
      authType: {
        RestWFSService: 'Token',
        RestWCCSService: 'Token',
        RestWBASService: 'Token',
        RestWGCSService: 'Token',
        RestWRGSService: 'Token',
        RestWPSSService: 'Token',
        RestWILSService: 'Token',
        RestWRPSService: 'Token',
        RestWMSService: 'Basic',
        RestWMPSService2: 'Basic',
        SimpleConsultService: 'Token',
        RestWRASService: 'Token',
        RestWRCSService: 'Token',
        RestWRMSService: 'Token',
        RestDICSService: 'Token',
        RestWRDSService: 'Token',
        RestWOPSService: 'Basic',
        RestWTSService: 'Token',
        RestWSQSService: 'Token',
      },
    };
    const common: any = {
      tokenUrl: this.config.tokenServer,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
    };
    this.conf = {
      /** WFS服务 */
      RestWFSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWFSService,
        authType: serviceConfig.authType.RestWFSService,
      }),
      /** 坐标转换服务 */
      RestWCCSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWCCSService,
        authType: serviceConfig.authType.RestWCCSService,
      }),
      /** 缓冲区分析服务 */
      RestWBASService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWBASService,
        authType: serviceConfig.authType.RestWBASService,
      }),
      /** 地理编码服务 */
      RestWGCSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWGCSService,
        authType: serviceConfig.authType.RestWGCSService,
      }),
      /** 逆地理编码服务 */
      RestWRGSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRGSService,
        authType: serviceConfig.authType.RestWRGSService,
      }),
      /** 地图搜索服务 */
      RestWPSSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWPSSService,
        authType: serviceConfig.authType.RestWPSSService,
      }),
      /** 互联网定位服务 */
      RestWILSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWILSService,
        authType: serviceConfig.authType.RestWILSService,
      }),
      /** 路径规划服务 */
      RestWRPSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRPSService,
        authType: serviceConfig.authType.RestWRPSService,
      }),
      RestWTSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWTSService,
        authType: serviceConfig.authType.RestWTSService,
      }),
      /** WMS服务 */
      RestWMSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWMSService,
        authType: serviceConfig.authType.RestWMSService,
      }),
      /**
       * 空间查询服务
       */
      RestWSQSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWSQSService,
        authType: serviceConfig.authType.RestWSQSService,
      }),
      /** 地图打印服务 */

      RestWMPSService2: $.extend({}, common, {
        name: (window as any).egis.ews.RestWMPSService,
        authType: serviceConfig.authType.RestWMPSService2,
      }),
      /** 协同标绘 */
      SimpleConsultService: $.extend({}, common, {
        name: (window as any).egis.ews.SimpleConsultService,
        authType: serviceConfig.authType.SimpleConsultService,
      }),
      /** 应急资源综合分析 */
      RestWRASService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRASService,
        authType: serviceConfig.authType.RestWRASService,
      }),
      /** 应急资源目录 */
      RestWRCSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRCSService,
        authType: serviceConfig.authType.RestWRCSService,
      }),
      /** 资源管理 */
      RestWRMSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRMSService,
        authType: serviceConfig.authType.RestWRMSService,
      }),
      /** 字典 */
      RestDICSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestDICSService,
        authType: serviceConfig.authType.RestDICSService,
      }),
      /** 物资与资源服务 */
      RestWRDSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWRDSService,
        authType: serviceConfig.authType.RestWRDSService,
      }),
      RestWOPSService: $.extend({}, common, {
        name: (window as any).egis.ews.RestWOPSService,
        authType: serviceConfig.authType.RestWOPSService,
      }),
    };
  }
}
