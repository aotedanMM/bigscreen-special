// 处理详情查询的映射
// tslint:disable-next-line:variable-name
const MultiuleQueryParamConfigList_yt: any = {
    // 滑坡
    landslide: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103010000\'';
            } else {
                return 'and a.featurecode = \'100103010000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 泥石流
    debrisflow: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103020000\'';
            } else {
                return 'and a.featurecode = \'100103020000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 崩塌
    mountaincollapse: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103030000\'';
            } else {
                return 'and a.featurecode = \'100103030000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 地面塌陷
    bottomcollapse: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103050000\'';
            } else {
                return 'and a.featurecode = \'100103050000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 地裂缝
    groundfissure: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103060000\'';
            } else {
                return 'and a.featurecode = \'100103060000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 采空塌陷
    miningcollapse: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103090000\'';
            } else {
                return 'and a.featurecode = \'100103090000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 地面沉降
    landsubsidence: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103070000\'';
            } else {
                return 'and a.featurecode = \'100103070000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 不稳定斜坡
    unstableslopes: {
        fileFn: (data: any) => {
            return 'a.id,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode = \'100103040000\'';
            } else {
                return 'and a.featurecode = \'100103040000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'disscalecode';
        },
    },
    // 危化企业
    hazardous: {
        fileFn: (data: any) => {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,a.haikangflag,a.detectionflag,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.iscancel=\'0\'';
            } else {
                return ' and a.iscancel=\'0\' and a.istackstofac=\'1\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        id: (id: any) => {
            return 'and a.dagchementid=\'' + id + '\'';
        },
    },
    // 生产企业
    productionindustry: {
        fileFn: (data: any) => {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'1\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 经营企业
    runeddustry: {
        fileFn: (data: any) => {
            return 'a.longitude,a.haikangflag,a.detectionflag,a.latitude,a.dagchementid as id,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename';
        },
        tableName: () => {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'2\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 使用企业
    useddustry: {
        fileFn: (data: any) => {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'3\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 其它企业
    otherdustry: {
        fileFn: (data: any) => {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'4\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 重大危险源
    majordanger: {
        fileFn: (data: any) => {
            return 'a.dangerid as id,a.haikangflag,a.detectionflag,a.firmname,a.dangertypename,a.hazardlevelcode,a.dangername as name,a.danmatnum,a.stoorprd,a.address,a.latitude,a.dsispark,a.competdep,a.chargeper,a.chargepertel,b.districtname,a.longitude';
        },
        tableName: () => {
            return 'anjian_danger a left join code_bas_district b on a.county=b.districtcode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.dangername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 尾矿库
    tailingpond: {
        fileFn: (data?: any) => {
            return 'a.wkkid as id,a.haikangflag,a.detectionflag,a.wkkmc as name,a.WKKDZMC as address,b.runstatusname,c.wkkaqdname,d.wkkdbname,a.isoverlibrary,a.affectnum,a.mineralspe,a.designservlife,a.servlife,a.wkkfzrbgsdh,a.isdilatation,a.sfazzxjcxt,a.designdamht,a.mqdjbgd,a.designcapa,a.xzqkr,a.dammethod,a.wkkfzr,e.noncoalentname,a.wkkfzryddh,a.sfaqscxkz,a.aqscxkzjzrq,a.countyrespper,a.countyrespperduty,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_tailingpond a left join code_tailingpond_runstatus b on a.runstatuscode=b.runstatuscode left join code_tailingpond_safety c on a.wkkaqdcode=c.wkkaqdcode left join code_tailingpond_grade d on a.wkkdbcode=d.wkkdbcode left join anjian_noncoalent e on a.noncoalentid=e.noncoalentid';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.wkkmc like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.county';
        },
    },
    // 烟花爆竹企业
    firework: {
        fileFn: (data?: any) => {
            return 'a.fireworkentid as id,a.haikangflag,a.detectionflag,a.fireworkentname as name,a.address,a.busilicvaliddate,a.busscope,a.waraddress,a.warnum,a.wararea,a.showloc,a.designstock,a.peakstock,a.artificialper,a.tel,a.workernum,a.trancar,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_fireworkent a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.fireworkentname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.iscancel=\'0\'';
            } else {
                return 'and a.iscancel=\'0\'';
            }
        },
        group: () => {
            return 'a.county';
        },
    },
    // 烟花爆竹仓库
    fireworkhouse: {
        fileFn: (data?: any) => {
            return 'a.warehouseid as id, a.warehousename as name,a.address,a.respper as contactper,a.resppermtel as contacttel,a.longitude,a.latitude,b.districtname as fullname,c.fireworkentname';
        },
        tableName: () => {
            return 'fangxun.for_fireworkwarehouse a left join public.code_bas_district b on a.districtcode=b.districtcode left join public.anjian_fireworkent c on a.fireworkentid=c.fireworkentid';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.fireworkentname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 非煤矿山
    metalnonmetal: {
        fileFn: (data?: any) => {
            return 'a.metalnonmetalid as id,a.haikangflag,a.detectionflag,a.ksmc as name,a.ksdzmc as address,b.industryminename,a.desproscale,a.nowtailpond,c.economytypename,a.ksfzr,a.ksfzryddh,a.aqfzr,a.aqfzryddh,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_metalnonmetal a left join code_metal_industry_minetype b on a.sckz=b.industryminecode left join code_coal_economytype c on a.chargenature=c.economytypecode';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.ksmc like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 煤矿企业
    coal: {
        fileFn: (data?: any) => {
            return 'a.coalid as id,a.haikangflag,a.detectionflag,a.coalname as name,a.chargedept,a.address,a.minearea,a.worernum,a.LEGAL_NAME,a.controlcentertel,a.APPROVED_MINE_DEPTH,a.product_date,a.hydrogeological,a.ws_grade,a.a_mine_firedescrip,a.a_grime_explosivedescrip,a.rockburst,a.PRINCIPAL,a.principal_cell,a.service_years,a.design_output,a.proved_output,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_coal a';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.coalname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 非煤企业
    noncoal: {
        fileFn: (data?: any) => {
            return 'a.noncoalentid as id,a.haikangflag,a.detectionflag,a.noncoalentname as name,a.artificialper,a.address,a.artificialperotel,a.artificialpermtel,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_noncoalent a';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.noncoalentname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 冶金行业
    metallurgical: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'01\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'01\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 有色行业
    nonferrous: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'01\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'02\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 机械铸造
    mechanical: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'03\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'03\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 建材行业
    buildingmaterial: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'04\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'04\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 轻工行业
    lightindustry: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'05\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'05\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 纺织行业
    spin: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'06\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'06\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
     // 烟草行业
    tobacco: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'07\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'07\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
     // 商贸行业
    commerce: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'08\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'08\'' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.county';
        },
    },
    // 粉尘涉爆
    dust: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'04\'';
            } else {
                return 'and a.industrycode=\'04\'';
            }
        },
        group: () => {
            return 'a.county';
        },
    },
    // 涉氨制冷
    refrigeration: {
        fileFn: (data?: any) => {
            return 'a.whsmyhbzid as id,a.WHSMYHBZNAME as name,a.address,a.haikangflag,a.detectionflag,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.WHSMYHBZNAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.industrycode=\'05\'';
            } else {
                return 'and a.industrycode=\'05\'';
            }
        },
        group: () => {
            return 'a.county';
        },
    },
    // 救援装备
    equipment: {
        fileFn: (data?: any) => {
            return 'a.equipmentid as id,a.equipname as name,a.address,a.rescuename,b.equiptypename,a.leader,a.leadermtel,a.equipnum,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'v_equipment a left join equip_equ_type b on a.equiptypecode=b.equiptypecode';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.rescueid=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 应急电力保障设备  (应急资源--救援装备字段配置 毕东方  2021.11.23 )
    t_electricity_safeguard_equipme: {
        fileFn: (data?: any) => {
            return 'a.id as id,a.device_name,a.type,a.number,a.rated_power,a.nominal_voltage,a.rated_current,a.contact_department, a.address,a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_electricity_safeguard_equipme a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.device_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.type';
        },
    },
    // 应急救援吊装设备
    t_lifting_equipment: {
        fileFn: (data?: any) => {
            return 'a.id as id,a.equipment_name,a.type,a.number,a.working_range,a.boom_reach,a.radius,a.weight,a.contact_department,a.address,a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_lifting_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.type';
        },
    },
    // 防火设备
    t_fire_fighting_equipment: {
        fileFn: (data?: any) => {
            return 'a.id,a.device_name,a.number,a.effective_jet_distance, a.effective_jet_time,a.contact_department, a.address, a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_fire_fighting_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.device_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 应急救援监测设备
    t_monitor_equipment: {
        fileFn: (data?: any) => {
            return 'a.id,a.equipment_name,a.type,a.number,a.applied_range,a.monitor_mode,a.monitor_distance,a.contact_department,a.address,a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_monitor_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 应急救援破拆设备
    t_forcible_entry_equipment: {
        fileFn: (data?: any) => {
            return 'a.id,a.equipment_name,a.type,a.number,a.application_range,a.application_environment,a.contact_department,a.address,a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_forcible_entry_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 应急救援人身防护设备
    t_person_protective_equipment: {
        fileFn: (data?: any) => {
            return 'a.id,a.equipment_name, a.type, a.number,a.protective_part,a.protective_function,a.contact_department,a.address,a.principal,a.phone,a.duty_phone';
        },
        tableName: () => {
            return 't_person_protective_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 应急救援喷水设备
    t_spray_water_equiment: {
        fileFn: (data?: any) => {
            return 'a.id,a.equipment_name,a.type,a.number,a.rated_head,a.volume,a.contact_department,a.address,a.principal,a.phone,a.duty_phone,a.use_type';
        },
        tableName: () => {
            return 't_spray_water_equiment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 排水设备
    t_pumping_equiment: {
        fileFn: (data?: any) => {
            return 'a.id,a.equipment_name,a.type,a.number,a.rated_head,a.rated_flow,a.drain_pipe_type,a.electrical_machinery_type,a.rated_power,a.nominal_voltage,a.contact_department,a.address,a.principal,a.phone, a.duty_phone';
        },
        tableName: () => {
            return 't_pumping_equiment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.equipment_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 应急局救援装备
    emergency_department_equipment: {
        fileFn: (data?: any) => {
            return 'a.id,a.name,a.classes,a.type,a.numbers,a.section,a.remark';
        },
        tableName: () => {
            return 'emergency_department_equipment a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 传感器类型代码表
    code_detector_type: {
        fileFn: (data?: any) => {
            return 'a.id,a.detector_type_name';
        },
        tableName: () => {
            return 'code_detector_type a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.detector_type_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 传感器
    enterprise_detector: {
        fileFn: (data?: any) => {
            return 'a.id,a.code,a.name,a.type,a.des,a.facility_code,a.facility_id,a.latitude, a.longitude,a.manufacturer,a.model,a.max_meas,a.min_meas,a.meas_unit,a.qy_id,a.create_time,a.update_time,a.create_user,a.update_user, a.del_flag';
        },
        tableName: () => {
            return 'enterprise_detector a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 网关设备
    enterprise_facility: {
        fileFn: (data?: any) => {
            return 'a.id,a.facility_code,a.facility_type,a.facility_name,a.facility_number,a.des,a.address,a.longitude,a.latitude,a.hazard_code,a.hazard_level,a.is_major_hazard,a.qy_id,a.create_time,a.update_time,a.create_user, a.update_user,a.del_flag';
        },
        tableName: () => {
            return 'enterprise_facility a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.facility_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
     // 减灾委成员
     reduce_disaster_committee_membe: {
        fileFn: (data?: any) => {
            return 'a.id,a.name,a.organization,a.duty,a.office_phone,a.on_duty_phone,a.cell_phone,a.list_name,a.fax';
        },
        tableName: () => {
            return 'reduce_disaster_committee_membe a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
     // 地震地质救援指挥部成员
     t_headquarters_member_address_b: {
        fileFn: (data?: any) => {
            return 'a.id,a.member_type,a.unit_name,a.member_name,a.member_office_telephone,a.member_phone_number,a.liaison_name,a.office_fax,a.liaison_office_telephone,a.liaison_phone_number,a.address_book_type,a.title_name';
        },
        tableName: () => {
            return 't_headquarters_member_address_b a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.member_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
     // 尾矿库基本信息及包保信息
     t_tailings_pond_and_government: {
        fileFn: (data?: any) => {
            return 'a.id,a.tailings_pond_name,a.address,a.company,a.pr_name,a.pr_company,a.pr_post,a.pr_name_two,a.pr_company_two,a.pr_post_two';
        },
        tableName: () => {
            return 't_tailings_pond_and_government a';
        },
        where: (text: any, teamid: any) => {
            let keywordWhere = '';
            let teamidWhere = '';
            if (text) {
                keywordWhere = 'and a.tailings_pond_name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (teamid) {
                teamidWhere = 'and a.id=\'' + teamid + '\'';
            } else {
                teamidWhere = '';
            }
            return 'and 1=1' + keywordWhere + teamidWhere;
        },
        group: () => {
            return 'a.id';
        },
    },
    // 救援队伍全部
    rescueteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text: any, district: any) => {
            let textwhere: string = '';
            let optionwhere: string = '';
            if (text) {
                textwhere = ' and a.rescuename like \'%' + text + '%\'';
            } else {
                textwhere = '';
            }
            if (district) {
                optionwhere = 'and a.rescuetypecode in (' + district + ')';
            } else {
                optionwhere = 'and a.rescuetypecode in (\'120301130000\',\'120301010000\',\'120301030000\',\'120301050000\',\'120301040000\',\'120303000000\',\'120301460000\',\'120301140000\',\'120301180000\',\'120301170000\',\'120301290000\',\'120301200000\',\'120301230000\',\'120301090000\',\'120301470000\',\'120301210000\',\'120301480000\',\'120301490000\',\'120301500000\',\'120301120000\',\'120301510000\',\'120301520000\',\'120301530000\',\'120301540000\',\'120301990000\')';
            }
            return textwhere + optionwhere + 'and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 防汛抗旱队
    floodteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301130000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120301130000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 消防救援队
    fireteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府消防救援队
    fireteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业消防救援队
    fireteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 森林消防队
    forestfireteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 市级森林消防救援队
    forestfireteamcity: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
            } else {
                return 'and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 区县级森林消防救援队
    forestfireteamcounty: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
            } else {
                return 'and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 市级森林消防应急队伍
    forest_citysenlin: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
            } else {
                return 'and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 区县级森林消防应急队伍
    forest_countysenlin: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
            } else {
                return 'and a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 危化品救援队
    hazardousteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府危化品救援队
    hazardousteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\'and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业危化品救援队
    hazardousteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 煤矿救援队
    mineteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府煤矿救援队
    mineteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业煤矿救援队
    mineteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 非煤矿山救援队改为【政府救援队伍】
    nonmineteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescuetypecode=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120303000000\' and a.rescounty LIKE \'1304\'||\'%\'';
            } else {
                return 'and a.rescuetypecode = \'120303000000\' and a.rescounty LIKE \'1304\'||\'%\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 商贸流通救援队
    corecompetenceteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301460000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 交通运输救援队
    transportationteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301140000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 应急供电救援队
    powerteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府应急供电救援队
    powerteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业应急供电救援队
    powerteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 移动通信救援队
    mobileteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府移动通信救援队
    mobileteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业移动通信救援队
    mobileteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 燃气救援队
    gasteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301290000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 环境救援队
    environmentteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301200000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 打捞救援队
    salvageteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301230000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 海上救援队
    searescueteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301090000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 船舶溢油救援队
    shipspillteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301470000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 医疗卫生救援队
    healthyteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府医疗卫生救援队
    healthyteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 企业医疗卫生救援队
    healthyteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 港口抢险救援队
    portrescueteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301480000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 港口客运场站应急队
    portpassengerteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301490000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 港口施工安全队
    portconstructionteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301500000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 建筑应急救援队
    buildingemergencyteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301120000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 客运应急救援队
    passengeremergencyteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301510000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 应急运力队
    emergencytransportteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301520000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 清雪队伍
    snowteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301530000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 机械设备社会力量
    equipteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301540000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 民间救援队改为【其他救援队伍】
    civilianteam: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (data?: any) => {
            return 'and 	a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 政府其他救援队伍
    civilianteamgovernment: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            } else {
                return 'and a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
     // 企业其他救援队伍
     civilianteamcompany: {
        fileFn: (data?: any) => {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.rescuename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            } else {
                return 'and a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
            }
        },
        group: () => {
            return 'a.rescounty';
        },
    },
    // 储备库储备物资
    meterialinfo: {
        fileFn: (data: any) => {
            return ' a.materialid as id,a.materialname as name,a.repertoryid,a.measureunit,a.materialnum,b.materialtypename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'JC_MATERIAL_INFO a left join jc_material_type b on a.materialtype=b.materialtypecoe';
        },
        where: (text: any, repertoryid: any) => {
            let textwhere: string = '';
            let optionwhere: string = '';
            if (text) {
                textwhere = ' and a.materialname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' ';
            } else {
                textwhere = '';
            }
            if (repertoryid) {
                optionwhere = 'and a.repertoryid=\'' + repertoryid + '\'';
            } else {
                optionwhere = '';
            }
            return 'and 1=1' + textwhere + optionwhere;
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 所有储备库
    repository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text: any, typecode: any) => {
            let textwhere: string = '';
            let optionwhere: string = '';
            if (text) {
                textwhere = ' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' ';
            } else {
                textwhere = '';
            }
            if (typecode) {
                optionwhere = 'and a.repertorytypecode in (' + typecode + ')';
            } else {
                optionwhere = 'and a.repertorytypecode in (\'01\',\'02\',\'03\',\'04\',\'05\',\'06\',\'07\',\'08\',\'09\',\'10\',\'11\',\'12\')';
            }
            return textwhere + optionwhere;
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 通用储备库
    generalrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'01\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'01\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 防汛抗旱物资库
    floodrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'02\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'02\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 城市防汛物资库
    cityrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'03\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'03\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 消防设施物资库
    firerepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'04\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'04\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 防火物资库
    firepreventionrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'05\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'05\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 本地物资库
    localrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'13\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'13\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 委托物资库
    entrustrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'14\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'14\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 电力设施物资库
    powerrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'06\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'06\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 通讯物资库
    communicationrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'07\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'07\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 生物防疫物资库
    biologyrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'08\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'08\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 机场消防物资库
    airrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'09\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'09\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 溢油防治物资库
    oilrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'10\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'10\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 防震物资库
    earthrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'11\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'11\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 港口救援物资库
    pottrepository: {
        fileFn: (data: any) => {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.repertorytypecode=\'12\' and a.repertoryname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and a.repertorytypecode=\'12\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 避难场所
    shelter: {
        fileFn: (data: any) => {
            return 'a.shelterid as id,a.sheltername as name, a.address,b.levelname,c.districtname as fullname,a.sheltertypecode,a.chargedept,a.notes,a.maxpersonnum,a.sheltertype,a.abacusarea,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_shelter a left join code_bas_level b on a.levelcode=b.levelcode left join code_bas_district c on a.districtcode=c.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.sheltername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' ';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 非煤矿山专家
    nonmineexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 危险化学品专家
    chemicalexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 工商贸专家
    tradexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 应急救援专家
    emergenceexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 火灾防治专家
    fireexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 防汛抗旱专家
    floodexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 地震地质灾害专家
    earthquakeexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 烟花爆竹专家
    fireworkexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 政策法规专家
    lawexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 宣教与信息化专家
    infomationexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 煤矿专家
    coalexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 救灾减灾专家
    mitigationexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 救援评估专家
    investigationexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580024\'  and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580024\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 综合安全专家
    comprehensiveexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 安全文化专家
    safetycultureexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 特邀专家
    invitedxpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580023\' and a.levelcode=\'3\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580023\' and a.levelcode=\'3\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 省级
    // 非煤矿山专家
    provincenonmineexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 危险化学品专家
    provincechemicalexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 工商贸专家
    provincetradexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 省级应急救援专家
    provinceemergenceexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 火灾防治专家
    provincefireexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 防汛抗旱专家
    provincefloodexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 地震地质灾害专家
    provinceearthquakeexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 烟花爆竹专家
    provincefireworkexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 政策法规专家
    provincelawexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 宣教与信息化专家
    provinceinfomationexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 煤矿专家
    provincecoalexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 救灾减灾专家
    provincemitigationexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 综合安全专家
    provincecomprehensiveexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 安全文化专家
    provincesafetycultureexpert: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'2\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'2\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    professional: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.levelcode=\'9\'';
            } else {
                return 'and a.levelcode=\'9\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 国家级危险化学品专家
    chemicalexpertg: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'1\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'1\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 工商贸专家
    tradexpertg: {
        fileFn: (data: any) => {
            return 'a.expertid as id,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: () => {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'1\'';
            } else {
                return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'1\'';
            }
        },
        group: () => {
            return 'a.district';
        },
    },
    // 港口码头
    portwharf: {
        fileFn: (data: any) => {
            return 'a.portwharfid as id,a.portwharfname as name,a.address,a.respper as contactper,a.respmtel as contactpermtel,a.grossarea,a.berthnum,a.inusedate,a.useyearnum,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_portwharf a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.portwharfname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 机场
    airport: {
        fileFn: (data: any) => {
            return 'a.airportid as id,a.airportname as name, a.address,a.respper as contactper,a.respotel as contactmtel,a.longitude,a.latitude,a.RUNWAYLENGTH,a.RUNWAYWIDTH,a.RUNWAYDIRECTION,a.PARKINGAPRONNUM,a.NOTES,b.districtname';
        },
        tableName: () => {
            return 'bas_airport a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.airportname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 火车站
    railwaystation: {
        fileFn: (data: any) => {
            return 'a.stationid as id,a.stationname as name,a.address,a.respper as contactper,a.respotel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_railwaystation a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.stationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 汽车站
    coachstation: {
        fileFn: (data: any) => {
            return 'a.guid as id,a.name,a.address,a.respper,a.respmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_coachstation a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.code=\'32B04\'';
            } else {
                return 'and a.code=\'32B04\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
    },
    // 学校
    bas_school: {
        fileFn: (data: any) => {
            return 'a.schoolid as id,longitude,latitude,schoolname as name,address, districtcode,defobjtypecode as typecode';
        },
        tableName: () => {
            return 'bas_school a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.schoolname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'defobjtypecode';
        },
    },
    // 地震监测台站
    monitorstation: {
        fileFn: (data: any) => {
            return 'a.stationid as id,a.stationname as name,a.address,b.districtname,a.monitoritem,a.stationtypecode,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.mon_monitorstation_earthquake a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.stationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'defobjtypecode';
        },
    },
    // 医院
    hospital: {
        fileFn: (data: any) => {
            return 'a.orgid as id, a.orgname as name,a.address,a.respper as contactper,a.dutytel as contactmtel,a.bednum,a.nursenum,b.orggradename,c.orgtypename,d.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return ' bas_healthorg a left join code_hospital_grade b on a.orggradecode=b.orggradecode left join code_healthorg_type c on a.orgtypecode=c.orgtypecode left join code_bas_district d on a.districtcode=d.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.orgname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 文物保护单位
    culturalrelicunit: {
        fileFn: (data: any) => {
            return 'a.relicid as id, a.relicname as name,a.address,a.respper as contactper,a.respotel as contactmtel,a.area,a.relicage,a.relicdescrip,b.districtname,c.featurename,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_culturalrelicunit a left join code_bas_district b on a.districtcode=b.districtcode left join fangxun.code_feature c on a.relictypecode=c.featurecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.relicname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1 = 1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 党政机关
    government: {
        fileFn: (data: any) => {
            return 'a.partygovtid as id,a.partygovtname,a.address,a.respper as contactper,a.respotel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_partygovt a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.partygovtname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.partygovtname like \'%\'||\'人民政府\'||\'%\'';
            } else {
                return 'and a.partygovtname like \'%\'||\'人民政府\'||\'%\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 档案馆
    archives: {
        fileFn: (data: any) => {
            return 'a.defobjid as id, a.defobjname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'emergencydev.obj_defobj_pt a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.defobjname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.defobjtypecode=\'31H11\'';
            } else {
                return 'and a.defobjtypecode=\'31H11\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 电视台
    tvcast: {
        fileFn: (data: any) => {
            return 'a.stationid as id, a.stationname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_newscast a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.stationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.defobjtypecode=\'31D01\'';
            } else {
                return 'and a.defobjtypecode=\'31D01\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 广播电台
    newscast: {
        fileFn: (data: any) => {
            return 'a.stationid as id, a.stationname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_newscast a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.stationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.defobjtypecode=\'31D02\'';
            } else {
                return 'and a.defobjtypecode=\'31D02\'';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 科研机构
    researchinstitution: {
        fileFn: (data: any) => {
            return 'a.resinsid as id,  a.resinsname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_resins a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.resinsname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and ( a.defobjtypecode=\'31C99\' or a.defobjtypecode=\'31C01\' or a.defobjtypecode=\'31C00\')';
            } else {
                return 'and (a.defobjtypecode=\'31C99\' or a.defobjtypecode=\'31C01\' or a.defobjtypecode=\'31C00\')';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 金融机构
    financialins: {
        fileFn: (data: any) => {
            return 'a.financialid as id,  a.financialname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_financialins a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.financialname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 宾馆饭店
    hotel: {
        fileFn: (data: any) => {
            return 'a.hotelid as id, a.hotelname as name,a.address,a.respper as contactper,a.respotel as contactmtel,a.respmtel,b.districtname,a.longitude,a.latitude,a.restlevelcode,a.servecap,a.firefacilities,a.exitdesc';
        },
        tableName: () => {
            return 'bas_hotel a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.hotelname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 大型商贸
    market: {
        fileFn: (data: any) => {
            return 'a.marketid as id, a.marketname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_market a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.marketname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 集贸市场
    bazaar: {
        fileFn: (data: any) => {
            return 'a.bazaarid as id, a.bazaarname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude,a.businessarea,a.material,a.exitdesc,c.defobjtypename';
        },
        tableName: () => {
            return 'bas_bazaar a  left join code_bas_district b on a.districtcode=b.districtcode left join emergencydev.obj_defobj_type c on a.defobjtypecode=c.defobjtypecode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.bazaarname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 大型文化体育场所
    Gymnasium: {
        fileFn: (data: any) => {
            return 'a.gymid as id, a.gymname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'bas_gymnasium a  left join code_bas_district b on a.districtcode=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.gymname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 旅游景区
    tourist: {
        fileFn: (data: any) => {
            return ' a.id,  a.name,a.address,a.personinfo,a.levelcode,a.exitdesc,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_gat_gathingplace_t a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode=\'110214000000\'';
            } else {
                return 'and a.featurecode=\'110214000000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 文化场馆
    culturalvenues: {
        fileFn: (data: any) => {
            return 'a.id,   a.name,a.address,a.personinfo,a.levelcode,a.exitdesc,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_gat_gathingplace_t a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.featurecode=\'110209060000\'';
            } else {
                return 'and a.featurecode=\'110209060000\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 供电设施
    powerfacilities: {
        fileFn: (data: any) => {
            return 'a.id,   a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_puf_powerfacilities_t a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 供水设施
    supwatfacil: {
        fileFn: (data: any) => {
            return 'a.id,   a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_puf_supwatfacil a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 燃气供应设施
    gasfacil: {
        fileFn: (data: any) => {
            return ' a.id,   a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_puf_gasfacil a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and  a.typecode=\'42D00\' or a.typecode=\'42D01\' or a.typecode=\'42D02\' or a.typecode=\'42D03\' or a.typecode=\'42D04\' or a.typecode=\'42D05\' or a.typecode=\'42D06\' or a.typecode=\'42D07\' or a.typecode=\'42D08\' or a.typecode=\'42D09\'';
            } else {
                return 'and  a.typecode=\'42D00\' or a.typecode=\'42D01\' or a.typecode=\'42D02\' or a.typecode=\'42D03\' or a.typecode=\'42D04\' or a.typecode=\'42D05\' or a.typecode=\'42D06\' or a.typecode=\'42D07\' or a.typecode=\'42D08\' or a.typecode=\'42D09\' ';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 大型能源动力设施
    powerfacil: {
        fileFn: (data: any) => {
            return 'a.id,    a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'fangxun.v_puf_gasfacil a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and a.typecode=\'42D10\'';
            } else {
                return 'and  a.typecode=\'42D10\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 水闸工程
    sluice: {
        fileFn: (data: any) => {
            return 'a.id, a.name,a.address,b.districtname,a.longitude,a.latitude,a.zhzh,a.lxdh,a.usestatus,a.gldwbh,a.sluiceno,a.sluicetype,a.factory,a.gatemodel,a.gateheight,a.clearheight,a.clearwide,a.gatenum,a.gatelimit,a.gatematerial,a.opencloform,a.coverarea';
        },
        tableName: () => {
            return 'fangxun.puf_wcf_sluice a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 海洋牧场
    ocepasture: {
        fileFn: (data: any) => {
            return 'a.id,  a.pasturename as name,a.address,b.districtname,a.longitude,a.latitude,st_astext(a.geom) as geom,a.area';
        },
        tableName: () => {
            return 'fangxun.puf_oce_pasture_a a  left join code_bas_district b on a.pac=b.districtcode  ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.pasturename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 畜牧养殖场
    farm: {
        fileFn: (data: any) => {
            return ' a.farmid as id, a.farmname as name,a.address,b.districtname,a.longitude,a.latitude,a.respperson,a.contacttel,a.breedingspecies,a.chargedept';
        },
        tableName: () => {
            return 'obj_farm a  left join code_bas_district b on a.districtcode=b.districtcode  ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.farmname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 加油站
    gasstation: {
        fileFn: (data: any) => {
            return 'a.id,a.haikangflag,a.detectionflag,a.name,a.address,b.districtname,a.longitude,a.latitude,a.districtcode';
        },
        tableName: () => {
            return 'bas_gasstation a  left join code_bas_district b on a.districtcode=b.districtcode  ';
        },
        where: (text?: any, btnflags?: any) => {
            let keywordWhere = '';
            let btnflagsWhere = '';
            if (text) {
                keywordWhere = 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                keywordWhere = '';
            }
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            } else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1=1' + keywordWhere + btnflagsWhere;
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 直升机取水点
    for_watersource: {
        fileFn: (data: any) => {
            return 'a.watersourceid as id,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: () => {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.watersourcename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and  a.watersourcetypecode=\'2\'';
            } else {
                return 'and  a.watersourcetypecode=\'2\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 直升机取水码头
    for_waterport: {
        fileFn: (data: any) => {
            return 'a.watersourceid as id,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: () => {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.watersourcename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and  a.watersourcetypecode=\'1\'';
            } else {
                return 'and  a.watersourcetypecode=\'1\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 直升机取水点取水码头
    for_watersourceport: {
        fileFn: (data: any) => {
            return 'a.watersourceid as id,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: () => {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.watersourcename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\' and  a.watersourcetypecode=\'3\'';
            } else {
                return 'and  a.watersourcetypecode=\'3\'';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 国有林场
    for_forestfarm: {
        fileFn: (data: any) => {
            return 'a.forestfarmid as id,a.forestfarmid,a.forestfarmname as name,a.address,a.longitude,a.latitude,a.businesstype,a.businessarea,a.personnum,a.respper,a.respperotel,a.resppermtel,a.contactper,a.contactperotel,a.contactpermtel,b.districtname';
        },
        tableName: () => {
            return 'fangxun.for_forestfarm a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.forestfarmname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 自然保护区
    for_naturalreserve: {
        fileFn: (data: any) => {
            return 'a.naturalreserveid as id,a.naturalreserveid,a.naturalreservename as name,a.naturalreservetype,a.address,a.area,a.coordinaterange,a.longitude,a.latitude,a.chargedept,a.respper,a.respperotel,a.resppermtel,a.approvalauthority,a.approvalnumber,a.forestcoverage,b.districtname as fullname';
        },
        tableName: () => {
            return 'fangxun.for_naturalreserve a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.naturalreservename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 停机坪
    for_heliport: {
        fileFn: (data: any) => {
            return ' a.heliportid as id,a.heliportname as name,a.address,a.longitude,a.latitude,a.sourcedept,a.geosourcedept,a.altitude,a.AREA,a.CONDITION,a.CLEARANCE,a.HELICOPTERNUM,a.ADMINORG,b.districtname';
        },
        tableName: () => {
            return 'fangxun.for_heliport a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.heliportname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
        id: (id: any) => {
            return 'and a.heliportid=\'' + id + '\'';
        },
    },
    // 水库大坝
    reservoir: {
        fileFn: (data: any) => {
            return 'a.reservoirid as id,a.name,a.telephone,a.address, a.respper,b.districtname ';
        },
        tableName: () => {
            return 'bas_reservoir a left join code_bas_district b on a.code=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.code';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 灾情信息员
    disinfoper: {
        fileFn: (data: any) => {
            return 'a.disinfoperid as id,a.disinfopername as name,a.post,a.districtname,a.mobphone,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_disinfoper a ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.disinfopername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 应急管理机构
    emergencypart: {
        fileFn: (data: any) => {
            return 'a.vdtid as id,b.districtname，a.unitname as name,a.unitaddress as address,a.longitude,a.latitude';
        },
        tableName: () => {
            return 'jc_huaw_vdt a left join code_bas_district b on a.districtcode=b.districtcode ';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.unitname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 核设施
    nuclear: {
        fileFn: (data: any) => {
            return 'a.nuclearid as id,a.nuclearname as name,b.districtname,a.longitude,a.latitude';
        },
        tableName: () => {
            return ' bas_nuclearinfo a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.nuclearname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 瞭望塔
    lookouttower: {
        fileFn: (data: any) => {
            return ' a.id,a.name,a.address,b.districtname,a.longitude,a.latitude,a.contacts,a.contacts_cell';
        },
        tableName: () => {
            return ' fangxun.for_lookouttower a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    // 防火检查站
    fireinspectionstation: {
        fileFn: (data: any) => {
            return ' a.id,a.name,a.address,c.stationtypename as stationtype,b.districtname,a.longitude,a.latitude,a.contacts,a.contacts_cell';
        },
        tableName: () => {
            return ' fangxun.for_fireinspectionstation a left join code_bas_district b on a.districtcode=b.districtcode left join fangxun.code_station_type c on a.stationtype=c.stationtype';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and  1=1';
            }
        },
        group: () => {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'm.orgtypecode';
        },
    },
    //  邯郸市林业防火自然保护地
    forest_fire_prevention_natural_reserve: {
        fileFn: (data: any) => {
            return 'a.ID as id,a.NAME as name,a.TYPE as type,a.longitude,a.latitude,a.firechief,a.firechiefphone,a.district,a.arealevel';
        },
        tableName: () => {
            return 'PUBLIC.forest_fire_prevention_natural_reserve a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.NAME like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'a.district';
        },
        id: (id: any) => {
            return 'and a.ID=\'' + id + '\'';
        },
    },
    //  邯郸市林业防火重点部位
    fores_fire_prevention_important_place: {
        fileFn: (data: any) => {
            return 'a.id as id,a.importantplacename as name,a.type as type,a.longitude,a.latitude,a.sphereofInfluence,a.threatpopulation,a.threatproperty,a.monitoringway,a.department,a.contactsandphone,a.treatmentmeasure,a.district,a.arealevel';
        },
        tableName: () => {
            return 'PUBLIC.fores_fire_prevention_important_place a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.importantplacename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'a.district';
        },
        id: (id: any) => {
            return 'and a.id=\'' + id + '\'';
        },
    },
    //  邯郸市林业防火装备
    forest_fire_prevention: {
        fileFn: (data: any) => {
            return 'a.id as id,a.equipmentname as equipmentname,a.longitude,a.latitude,a.principal,a.phone,a.district,a.arealevel';
        },
        tableName: () => {
            return 'PUBLIC.forest_fire_prevention_equipment a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.equipmentname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'a.district';
        },
        id: (id: any) => {
            return 'and a.id=\'' + id + '\'';
        },
    },
    //  邯郸市林业防火阻隔带信息
    forest_fire_prevention_barrier_strip: {
        fileFn: (data: any) => {
            return 'a.id as id,a.type as type,a.length,a.breadth,a.longitude,a.latitude,a.district,a.arealevel';
        },
        tableName: () => {
            return 'PUBLIC.forest_fire_prevention_barrier_strip a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'a.district';
        },
        id: (id: any) => {
            return 'and a.id=\'' + id + '\'';
        },
    },
    //  邯郸市林业防火气象监测站
    forest_fire_prevention_meteorological_monitoring_station: {
        fileFn: (data: any) => {
            return 'a.id as id,a.monitoringstationname as monitoringstationname,a.longitude,a.latitude,a.principalandphone,a.district,a.arealevel';
        },
        tableName: () => {
            return 'PUBLIC.forest_fire_prevention_meteorological_monitoring_station a';
        },
        where: (text?: any) => {
            if (text) {
                return 'and a.monitoringstationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
            } else {
                return 'and 1=1';
            }
        },
        group: () => {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: () => {
            return 'a.district';
        },
        id: (id: any) => {
            return 'and a.id=\'' + id + '\'';
        },
    },
};
export default MultiuleQueryParamConfigList_yt;
