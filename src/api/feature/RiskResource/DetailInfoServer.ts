
import { RequestServerClass } from '../../../util/request';

// 灾情研判服务
export class DetailInfoServer {

    public rSerivce: any;
    public detailInfoService: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.detailInfoService = null;
    }

    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getFireTeamDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getFireTeamDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getRescueTeamDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getRescueTeamDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getReposityDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getReposityDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getWarBaseDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getWarBaseDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getExpertDataDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getExpertDataDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getShelterDataDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getShelterDataDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     */
    public getDangerQYDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getDangerQYDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getGMQYDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getGMQYDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getMKQYDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getMKQYDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getFMKQYDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getGMQYDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getGEODISASTERDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getGEODISASTERDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getYHBZQYDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getYHBZQYDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getDangerDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getDangerDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getBaseDataDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getBaseDataDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id {String}
     */
    public getEquipDataDetail(opts: any) {
        if (!this.detailInfoService) {
            this.detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        }
        return new Promise((resolve, reject) => {
            this.detailInfoService.getEquipDataDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
}
