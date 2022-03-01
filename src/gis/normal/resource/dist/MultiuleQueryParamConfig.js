"use strict";
exports.__esModule = true;
// 资源查询配置
var MultiuleQueryConfig = {
    // 滑坡
    landslide: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103010000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 泥石流
    debrisflow: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103020000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 崩塌
    mountaincollapse: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103030000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 地面塌陷
    bottomcollapse: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103050000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 采空塌陷
    miningcollapse: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103090000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 地裂缝
    groundfissure: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (text) {
            return 'and a.featurecode = \'100103060000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 地裂缝
    landsubsidence: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (text) {
            return 'and a.featurecode = \'100103040000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 不稳定斜坡
    unstableslopes: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,b.districtname as fullname,c.featurename,a.disasterscale,d.hazardlevelname,a.risknum,a.thrproperty,a.inducingfactors,a.personinfo,a.protection,a.chargedept,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_nah_geo_geologichaz a left join public.code_bas_district b on a.pac=b.districtcode left join fangxun.code_feature c on a.featurecode=c.featurecode left join fangxun.code_hazard_level d on a.disasterlevelcode=d.hazardlevelcode';
        },
        where: function (data) {
            return 'and a.featurecode = \'100103040000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'disscalecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 危化企业
    hazardous: {
        fileFn: function (data) {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: function (data) {
            return 'and a.iscancel=\'0\'';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.dagchementid=\'' + id + '\'';
        }
    },
    // 生产企业
    productionindustry: {
        fileFn: function (data) {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'1\' and a.iscancel=\'0\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.dagchementid=\'' + id + '\'';
        }
    },
    // 经营企业
    runeddustry: {
        fileFn: function (data) {
            return 'a.longitude,a.latitude,a.haikangflag,a.detectionflag,a.dagchementid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename';
        },
        tableName: function () {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'2\' and a.iscancel=\'0\' and a.istackstofac=\'1\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.dagchementid=\'' + id + '\'';
        }
    },
    // 使用企业
    useddustry: {
        fileFn: function (data) {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.dagchementid,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.propertycode=\'3\' and a.iscancel=\'0\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.dagchementid=\'' + id + '\'';
        }
    },
    // 其它企业
    otherdustry: {
        fileFn: function (data) {
            return 'a.dagchementid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.dagchementname as name,a.address,b.industryname,a.principal,a.artificialper,a.jyfw,a.contactper,a.contactpertel,a.xzxkyxqxksrq,a.xzxkyxqxjsrq,a.regstartdate,a.regenddate,a.changeinfo,a.productstatus,a.highlytoxicchemicals,a.explosivechemicals,a.operationmode,a.xzxkzbh,c.districtname as fullname,a.mainprotandscalestr,a.totalstorcap,a.sumoutput,a.empnum,a.hazardlevelcode,a.economictypes1name,a.CREATEDATE,a.certificatime,a.safetymager,a.safetymagertel,a.principaltel,a.safedutytel,a.emerasktel,a.dangerlevel,a.precursorchemicals,a.salesincome,a.updatetime,a.companycode,a.creditcode,d.propertyname,e.entscalename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_dagchement a left join code_dagchem_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode left join code_dagchem_property d on a.propertycode=d.propertycode left join code_dagchem_entscale e on a.entscalecode=e.entscalecode';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and (a.propertycode=\'4\' or a.propertycode=\'5\') and a.iscancel=\'0\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.dagchementid=\'' + id + '\'';
        }
    },
    // 重大危险源
    majordanger: {
        fileFn: function (data) {
            return 'a.dangerid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.firmname, a.dangertypename,a.hazardlevelcode,a.address,a.cindustryclass,a.dangername as name,a.danmatname,a.danmatnum,a.stoorprd,a.dsispark,a.competdep,a.chargeper,a.chargepertel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_danger a left join code_bas_district b on a.county=b.districtcode';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.dangerid=\'' + id + '\'';
        }
    },
    // 尾矿库
    tailingpond: {
        fileFn: function (data) {
            return 'a.wkkid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.wkkmc as name,a.WKKDZMC as address,b.runstatusname,c.wkkaqdname,d.wkkdbname,a.isoverlibrary,a.affectnum,a.mineralspe,a.designservlife,a.servlife,a.wkkfzrbgsdh,a.isdilatation,a.sfazzxjcxt,a.designdamht,a.mqdjbgd,a.designcapa,a.xzqkr,a.dammethod,a.wkkfzr,e.noncoalentname,a.wkkfzryddh,a.sfaqscxkz,a.aqscxkzjzrq,a.countyrespper,a.countyrespperduty,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_tailingpond a left join code_tailingpond_runstatus b on a.runstatuscode=b.runstatuscode left join code_tailingpond_safety c on a.wkkaqdcode=c.wkkaqdcode left join code_tailingpond_grade d on a.wkkdbcode=d.wkkdbcode left join anjian_noncoalent e on a.noncoalentid=e.noncoalentid';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.wkkid=\'' + id + '\'';
        }
    },
    // 烟花爆竹企业
    firework: {
        fileFn: function (data) {
            return 'a.fireworkentid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.fireworkentname as name,a.address,a.busilicvaliddate,a.busscope,a.waraddress,a.warnum,a.wararea,a.showloc,a.designstock,a.peakstock,a.artificialper,a.tel,a.workernum,a.trancar,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_fireworkent a';
        },
        where: function (data) {
            return 'and a.iscancel=\'0\'';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.fireworkentid=\'' + id + '\'';
        }
    },
    // 烟花爆竹仓库
    fireworkhouse: {
        fileFn: function (data) {
            return 'a.warehouseid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.warehousename as name,a.address,a.respper as contactper,a.resppermtel as contacttel,a.longitude,a.latitude,b.districtname as fullname,c.fireworkentname';
        },
        tableName: function () {
            return 'fangxun.for_fireworkwarehouse a left join public.code_bas_district b on a.districtcode=b.districtcode left join public.anjian_fireworkent c on a.fireworkentid=c.fireworkentid';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.warehouseid=\'' + id + '\'';
        }
    },
    // 非煤矿山
    metalnonmetal: {
        fileFn: function (data) {
            return 'a.metalnonmetalid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.ksmc as name,a.ksdzmc as address,b.industryminename,a.desproscale,a.nowtailpond,c.economytypename,a.ksfzr,a.ksfzryddh,a.aqfzr,a.aqfzryddh,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_metalnonmetal a left join code_metal_industry_minetype b on a.sckz=b.industryminecode left join code_coal_economytype c on a.chargenature=c.economytypecode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.metalnonmetalid=\'' + id + '\'';
        }
    },
    // 煤矿企业
    coal: {
        fileFn: function (data) {
            return 'a.coalid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.coalname as name,a.chargedept,a.address,a.minearea,a.worernum,a.LEGAL_NAME,a.controlcentertel,a.APPROVED_MINE_DEPTH,a.product_date,a.hydrogeological,a.ws_grade,a.a_mine_firedescrip,a.a_grime_explosivedescrip,a.rockburst,a.PRINCIPAL,a.principal_cell,a.service_years,a.design_output,a.proved_output,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_coal a';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.coalid=\'' + id + '\'';
        }
    },
    // 非煤企业
    noncoal: {
        fileFn: function (data) {
            return 'a.noncoalentid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.noncoalentname as name,a.artificialper,a.address,a.artificialperotel,a.artificialpermtel,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_noncoalent a';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1 = 1' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.noncoalentid=\'' + id + '\'';
        }
    },
    // 冶金行业
    metallurgical: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'01\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 有色行业
    nonferrous: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'02\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 机械铸造
    mechanical: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'03\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 建材行业
    buildingmaterial: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'04\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 轻工行业
    lightindustry: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'05\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 纺织行业
    spin: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'06\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 烟草行业
    tobacco: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'07\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 商贸行业
    commerce: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and a.industrycode=\'08\'' + btnflagsWhere;
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 粉尘涉爆
    dust: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (data) {
            return 'and a.industrycode=\'04\'';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 涉氨制冷
    refrigeration: {
        fileFn: function (data) {
            return 'a.whsmyhbzid as id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.WHSMYHBZNAME as name,a.address,a.contactper,a.contactpertel,b.industryname,a.businscope,a.mianprd,a.capaprd,c.districtname as county,a.ishavtemequ,a.outvalue,a.invflournum,a.liquidrese,a.singlefreezer,a.isamrefaircond,a.runtype,a.issepworkshop,a.quickfreezer,a.indsmalltype,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'anjian_ent_whsmyhbz a left join code_whsmyhbz_industry b on a.industrycode=b.industrycode left join code_bas_district c on a.county=c.districtcode ';
        },
        where: function (data) {
            return 'and a.industrycode=\'05\'';
        },
        group: function () {
            return 'a.county';
        },
        id: function (id) {
            return 'and a.whsmyhbzid=\'' + id + '\'';
        }
    },
    // 救援装备
    equipment: {
        fileFn: function (data) {
            return 'a.equipmentid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.equipname as name,a.address,a.rescuename,b.equiptypename,a.leader,a.leadermtel,a.equipnum,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'v_equipment a left join equip_equ_type b on a.equiptypecode=b.equiptypecode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.equipmentid=\'' + id + '\'';
        }
    },
    // 救援队伍全部
    rescueteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and a.rescounty LIKE \'1304\'||\'%\' and a.rescuetypecode in (\'120301130000\',\'120301010000\',\'120301030000\',\'120301050000\',\'120301040000\',\'120301010000\',\'120301460000\',\'120301140000\',\'120301180000\',\'120301170000\',\'120301290000\',\'120301200000\',\'120301230000\',\'120301090000\',\'120301470000\',\'120301210000\',\'120301480000\',\'120301490000\',\'120301500000\',\'120301120000\',\'120301510000\',\'120301520000\',\'120301530000\',\'120301540000\',\'120301990000\')';
        },
        group: function () {
            return 'a.rescounty';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 防汛抗旱队
    floodteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301130000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 消防救援队
    fireteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府消防救援队
    fireteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业消防救援队
    fireteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301010000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 森林消防队
    forestfireteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 市级森林消防救援队
    forestfireteamcity: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 区县级森林消防救援队
    forestfireteamcounty: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 市级森林消防应急队伍
    forest_citysenlin: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'0\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 区县级森林消防应急队伍
    forest_countysenlin: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301030000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'1\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 危化品救援队
    hazardousteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府危化品救援队
    hazardousteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业危化品救援队
    hazardousteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301050000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 煤矿救援队
    mineteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府煤矿救援队
    mineteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业煤矿救援队
    mineteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301040000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 非煤矿山救援队改为【政府救援队伍】
    nonmineteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescuetypecode=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120303000000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 商贸流通救援队
    corecompetenceteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301460000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 交通运输救援队
    transportationteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301140000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 应急供电救援队
    powerteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府应急供电救援队
    powerteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业应急供电救援队
    powerteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301180000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 移动通信救援队
    mobileteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府移动通信救援队
    mobileteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业移动通信救援队
    mobileteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301170000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 燃气救援队
    gasteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301290000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 环境救援队
    environmentteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301200000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 打捞救援队
    salvageteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301230000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 海上救援队
    searescueteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301090000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 船舶溢油救援队
    shipspillteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301470000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 医疗卫生救援队
    healthyteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府医疗卫生救援队
    healthyteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业医疗卫生救援队
    healthyteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301210000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 港口抢险救援队
    portrescueteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301480000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 港口客运场站应急队
    portpassengerteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301490000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 港口施工安全队
    portconstructionteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301500000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 建筑应急救援队
    buildingemergencyteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301120000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 客运应急救援队
    passengeremergencyteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301510000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 应急运力队
    emergencytransportteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301520000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 清雪队伍
    snowteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301530000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 机械设备社会力量
    equipteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301540000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 民间救援队改为【其他救援队伍】
    civilianteam: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 政府其他救援队伍
    civilianteamgovernment: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'2\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 企业其他救援队伍
    civilianteamcompany: {
        fileFn: function (data) {
            return 'a.rescueid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,	a.rescuename as name,a.address,a.ishavairport,a.dutytel,a.leadertel,b.levelname,a.foresteamtype,a.leadermtel as phone,a.chargeconper,a.chargecontel,a.rescuegrade,a.timequality,a.leader as captain,a.chargedept,a.rescuetypecode,a.totalpernum,c.districtname,d.rescuetypename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jyxx_tea_rescue a  left join code_rescue_level b on a.rescuegrade=b.levelcode left join code_bas_district c on a.rescounty=c.districtcode left join equip_rescuetype d on a.rescuetypecode=d.rescuetypecode';
        },
        where: function (data) {
            return 'and 	a.rescuetypecode = \'120301990000\' and a.rescounty LIKE \'1304\'||\'%\' and a.teamlevel=\'3\'';
        },
        group: function () {
            return 'a.equiptypecode';
        },
        id: function (id) {
            return 'and a.rescueid=\'' + id + '\'';
        }
    },
    // 所有储备库
    repository: {
        fileFn: function (data) {
            return 'a.repertoryid as id, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode in (\'01\',\'02\',\'03\',\'04\',\'05\',\'06\',\'07\',\'08\',\'09\',\'10\',\'11\',\'12\')';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 通用储备库
    generalrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'01\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 防汛抗旱物资库
    floodrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'02\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 城市防汛物资库
    cityrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'03\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 消防设施物资库
    firerepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'04\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 防火物资库
    firepreventionrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'05\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 本地物资库
    localrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'13\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 委托物资库
    entrustrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'14\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 电力设施物资库
    powerrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'06\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 通讯物资库
    communicationrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'07\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 生物防疫物资库
    biologyrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'08\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 机场消防物资库
    airrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'09\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 溢油防治物资库
    oilrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'10\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 防震物资库
    earthrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'11\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 港口救援物资库
    pottrepository: {
        fileFn: function (data) {
            return 'a.repertoryid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.repertoryname as name,a.address,a.concateper,a.concatemobtel,b.repertorytypename,a.chargedept,c.levelname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_repertory a left join code_rep_type b on a.repertorytypecode=b.repertorytypecode left join code_rep_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.repertorytypecode=\'12\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.repertoryid=\'' + id + '\'';
        }
    },
    // 避难场所
    shelter: {
        fileFn: function (data) {
            return 'a.shelterid as id,ST_Distance_Spheroid(a.geom,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.sheltername as name, a.address,b.levelname,c.districtname as fullname,a.sheltertypecode,a.chargedept,a.notes,a.maxpersonnum,a.sheltertype,a.abacusarea,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_shelter a left join code_bas_level b on a.levelcode=b.levelcode left join code_bas_district c on a.districtcode=c.districtcode ';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.shelterid=\'' + id + '\'';
        }
    },
    // 非煤矿山专家
    nonmineexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 危险化学品专家
    chemicalexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 工商贸专家
    tradexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 应急救援专家
    emergenceexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 火灾防治专家
    fireexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 防汛抗旱专家
    floodexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 地震地质灾害专家
    earthquakeexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 烟花爆竹专家
    fireworkexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 政策法规专家
    lawexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 宣教与信息化专家
    infomationexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 煤矿专家
    coalexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 救灾减灾专家
    mitigationexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 省级应急救援指挥专家
    investigationexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580024\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 综合安全专家
    comprehensiveexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 安全文化专家
    safetycultureexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 特邀专家
    invitedxpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580023\' and a.levelcode=\'3\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 省级
    // 应急救援专家
    provinceemergenceexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580003\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 安全文化专家
    provincesafetycultureexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580022\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 火灾防治专家
    provincefireexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580004\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 防汛抗旱专家
    provincefloodexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580005\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 地震地质灾害专家
    provinceearthquakeexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580006\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 烟花爆竹专家
    provincefireworkexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580007\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 政策法规专家
    provincelawexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580008\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 宣教与信息化专家
    provinceinfomationexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580009\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 煤矿专家
    provincecoalexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580011\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 救灾减灾专家
    provincemitigationexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580020\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 综合安全专家
    provincecomprehensiveexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580021\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 非煤矿山专家
    provincenonmineexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580000\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 危险化学品专家
    provincechemicalexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 工商贸专家
    provincetradexpert: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'2\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 专业人员
    professional: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.levelcode=\'9\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 国家级危险化学品专家
    chemicalexpertg: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580001\' and a.levelcode=\'1\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 国家工商贸专家
    tradexpertg: {
        fileFn: function (data) {
            return 'a.expertid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.expertname as name,a.sexcode,a.deptname,a.goodatind,a.tel,a.currentmajor,b.groupname,c.levelname,a.duties,a.protitle,a.achihonor,a.address,a.harvest';
        },
        tableName: function () {
            return 'jc_expert a left join emergencydev.res_expert_group b on a.expertgroup=b.groupid left join code_bas_level c on a.levelcode=c.levelcode';
        },
        where: function (data) {
            return 'and a.expertgroup=\'3c9282c76d719afb016d71c90e580002\' and a.levelcode=\'1\'';
        },
        group: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.expertid=\'' + id + '\'';
        }
    },
    // 港口码头
    portwharf: {
        fileFn: function (data) {
            return 'a.portwharfid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.portwharfname as name,a.address,a.respper as contactper,a.respmtel as contactpermtel,a.grossarea,a.berthnum,a.inusedate,a.useyearnum,b.districtname,a.longitude,a.latitude,c.defobjtypename';
        },
        tableName: function () {
            return 'bas_portwharf a left join code_bas_district b on a.districtcode=b.districtcode left join emergencydev.obj_defobj_type c on a.defobjtypecode=c.defobjtypecode ';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.portwharfid=\'' + id + '\'';
        }
    },
    // 机场
    airport: {
        fileFn: function (data) {
            return 'a.airportid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.airportname as name, a.address,a.respper as contactper,a.respotel as contactmtel,a.longitude,a.latitude,a.RUNWAYLENGTH,a.RUNWAYWIDTH,a.RUNWAYDIRECTION,a.PARKINGAPRONNUM,a.NOTES,b.districtname';
        },
        tableName: function () {
            return 'bas_airport a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.airportid=\'' + id + '\'';
        }
    },
    // 火车站
    railwaystation: {
        fileFn: function (data) {
            return 'a.stationid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.stationname as name,a.address,a.respper as contactper,a.respotel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_railwaystation a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.stationid=\'' + id + '\'';
        }
    },
    // 汽车站
    coachstation: {
        fileFn: function (data) {
            return 'a.guid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.name,a.address,a.respper,a.respmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_coachstation a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  a.code=\'32B04\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        id: function (id) {
            return 'and a.guid=\'' + id + '\'';
        }
    },
    // 学校
    bas_school: {
        fileFn: function (data) {
            return 'a.schoolid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.schoolname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,a.studentnum,a.facultynum,a.buildarea,b.schooltypename,c.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_school a  left join code_school_type b on a.defobjtypecode=b.schooltypecode left join code_bas_district c on a.districtcode=c.districtcode';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'defobjtypecode';
        },
        id: function (id) {
            return 'and a.schoolid=\'' + id + '\'';
        }
    },
    // 学校
    school: {
        fileFn: function (data) {
            return 'a.schoolid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.schoolname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,a.studentnum,a.facultynum,a.buildarea,b.schooltypename,c.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_school a  left join code_school_type b on a.defobjtypecode=b.schooltypecode left join code_bas_district c on a.districtcode=c.districtcode';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'defobjtypecode';
        },
        id: function (id) {
            return 'and a.schoolid=\'' + id + '\'';
        }
    },
    // 地震监测台站
    monitorstation: {
        fileFn: function (data) {
            return 'a.stationid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.stationname as name,a.address,b.districtname as fullname,a.monitoritem,a.stationtypecode,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.mon_monitorstation_earthquake a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            if (data) {
                return ' and 1=1';
            }
            else {
                return 'and 1 = 1';
            }
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'defobjtypecode';
        },
        id: function (id) {
            return 'and a.stationid=\'' + id + '\'';
        }
    },
    // 医院
    hospital: {
        fileFn: function (data) {
            return 'a.orgid as id,a.orgname as name,a.address,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,c.orgtypename,d.districtname,a.respper as contactper,a.dutytel as contactmtel,a.bednum,a.nursenum,b.orggradename,a.longitude,a.latitude';
        },
        tableName: function () {
            return ' bas_healthorg a left join code_hospital_grade b on a.orggradecode=b.orggradecode left join code_healthorg_type c on a.orgtypecode=c.orgtypecode left join code_bas_district d on a.districtcode=d.districtcode';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.orgid=\'' + id + '\'';
        }
    },
    // 文物保护单位
    culturalrelicunit: {
        fileFn: function (data) {
            return 'a.relicid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.relicname as name,a.address,a.respper as contactper,a.respotel as contactmtel,a.area,a.relicage,a.relicdescrip,b.districtname,c.featurename,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_culturalrelicunit a left join code_bas_district b on a.districtcode=b.districtcode left join fangxun.code_feature c on a.relictypecode=c.featurecode';
        },
        where: function (data) {
            return 'and 1 = 1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.relicid=\'' + id + '\'';
        }
    },
    // 党政机关
    government: {
        fileFn: function (data) {
            return 'a.partygovtid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.partygovtname as name,a.address,a.respper as contactper,a.respotel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_partygovt a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and a.partygovtname like \'%\'||\'人民政府\'||\'%\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.partygovtid=\'' + id + '\'';
        }
    },
    // 档案馆
    archives: {
        fileFn: function (data) {
            return 'a.defobjid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.defobjname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'emergencydev.obj_defobj_pt a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and a.defobjtypecode=\'31H11\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.defobjid=\'' + id + '\'';
        }
    },
    // 电视台
    tvcast: {
        fileFn: function (data) {
            return 'a.stationid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.stationname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_newscast a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and a.defobjtypecode=\'31D01\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.stationid=\'' + id + '\'';
        }
    },
    // 广播电台
    newscast: {
        fileFn: function (data) {
            return 'a.stationid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.stationname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_newscast a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and a.defobjtypecode=\'31D02\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.stationid=\'' + id + '\'';
        }
    },
    // 科研机构
    researchinstitution: {
        fileFn: function (data) {
            return 'a.resinsid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.resinsname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_resins a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and (a.defobjtypecode=\'31C99\' or a.defobjtypecode=\'31C01\' or a.defobjtypecode=\'31C00\')';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.resinsid=\'' + id + '\'';
        }
    },
    // 金融机构
    financialins: {
        fileFn: function (data) {
            return 'a.financialid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.financialname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_financialins a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.financialid=\'' + id + '\'';
        }
    },
    // 宾馆饭店
    hotel: {
        fileFn: function (data) {
            return 'a.hotelid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.hotelname as name,a.address,a.respper as contactper,a.respotel as contactmtel,a.respmtel,b.districtname,a.longitude,a.latitude,a.restlevelcode,a.servecap,a.firefacilities,a.exitdesc';
        },
        tableName: function () {
            return 'bas_hotel a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.hotelid=\'' + id + '\'';
        }
    },
    // 大型商贸
    market: {
        fileFn: function (data) {
            return 'a.marketid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.marketname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_market a  left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.marketid=\'' + id + '\'';
        }
    },
    // 集贸市场
    bazaar: {
        fileFn: function (data) {
            return 'a.bazaarid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.bazaarname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude,a.businessarea,a.material,a.exitdesc,c.defobjtypename';
        },
        tableName: function () {
            return 'bas_bazaar a  left join code_bas_district b on a.districtcode=b.districtcode left join emergencydev.obj_defobj_type c on a.defobjtypecode=c.defobjtypecode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.bazaarid=\'' + id + '\'';
        }
    },
    // 大型文化体育场所
    Gymnasium: {
        fileFn: function (data) {
            return 'a.gymid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.gymname as name,a.address,a.respper as contactper,a.respmtel as contactmtel,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'bas_gymnasium a  left join code_bas_district b on a.districtcode=b.districtcode ';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.gymid=\'' + id + '\'';
        }
    },
    // 旅游景区
    tourist: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.name,a.address,a.personinfo,a.levelcode,a.exitdesc,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_gat_gathingplace_t a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: function (data) {
            return 'and a.featurecode=\'110214000000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 文化场馆
    culturalvenues: {
        fileFn: function (data) {
            return ' a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.name,a.address,a.personinfo,a.levelcode,a.exitdesc,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_gat_gathingplace_t a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: function (data) {
            return 'and a.featurecode=\'110209060000\'';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 供电设施
    powerfacilities: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_puf_powerfacilities_t a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 供水设施
    supwatfacil: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_puf_supwatfacil a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 燃气供应设施
    gasfacil: {
        fileFn: function (data) {
            return ' a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_puf_gasfacil a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: function (data) {
            return 'and  (a.typecode=\'42D00\' or a.typecode=\'42D01\' or a.typecode=\'42D02\' or a.typecode=\'42D03\' or a.typecode=\'42D04\' or a.typecode=\'42D05\' or a.typecode=\'42D06\' or a.typecode=\'42D07\' or a.typecode=\'42D08\' or a.typecode=\'42D09\') ';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 大型能源动力设施
    powerfacil: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,   a.name,a.address,a.personinfo,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'fangxun.v_puf_gasfacil a  left join code_bas_district b on a.pac=b.districtcode ';
        },
        where: function (data) {
            return 'and  a.typecode=\'42D10\' ';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 水闸工程
    sluice: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.name,a.address,b.districtname,a.longitude,a.latitude,a.zhzh,a.lxdh,a.usestatus,a.gldwbh,a.sluiceno,a.sluicetype,a.factory,a.gatemodel,a.gateheight,a.clearheight,a.clearwide,a.gatenum,a.gatelimit,a.gatematerial,a.opencloform,a.coverarea';
        },
        tableName: function () {
            return 'fangxun.puf_wcf_sluice a  left join code_bas_district b on a.pac=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1 ';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 海洋牧场
    ocepasture: {
        fileFn: function (data) {
            return 'a.id,ST_Distance_Spheroid(a.geom,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, a.pasturename as name,a.address,b.districtname,a.longitude,a.latitude,st_astext(a.geom) as geom,a.area,c.personinfo,c.brespecies,c.superiordept,d.typename';
        },
        tableName: function () {
            return 'fangxun.puf_oce_pasture_a a  left join code_bas_district b on a.pac=b.districtcode left join fangxun.v_puf_oce_pasture c on a.id=c.id left join fangxun.code_ocepasture_type d on a.typecode=d.typecode';
        },
        where: function (data) {
            return 'and  1=1 ';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 畜牧养殖场
    farm: {
        fileFn: function (data) {
            return 'a.farmid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,  a.farmname as name,a.address,b.districtname,a.longitude,a.latitude,a.respperson,a.contacttel,a.breedingspecies,a.chargedept';
        },
        tableName: function () {
            return 'obj_farm a  left join code_bas_district b on a.districtcode=b.districtcode  ';
        },
        where: function (data) {
            return 'and  1=1 ';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.farmid=\'' + id + '\'';
        }
    },
    // 加油站
    gasstation: {
        fileFn: function (data) {
            return 'a.id,a.haikangflag,a.detectionflag,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a. name,a.address,b.districtname,a.longitude,a.latitude,a.districtcode';
        },
        tableName: function () {
            return 'bas_gasstation a  left join code_bas_district b on a.districtcode=b.districtcode  ';
        },
        where: function (btnflags) {
            var btnflagsWhere = '';
            if (btnflags === '0') {
                btnflagsWhere = 'and  a.haikangflag=\'1\'';
            }
            else if (btnflags === '1') {
                btnflagsWhere = 'and  a.detectionflag=\'1\'';
            }
            return 'and 1=1' + btnflagsWhere;
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 直升机取水点
    for_watersource: {
        fileFn: function (data) {
            return 'a.watersourceid as id ,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: function () {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  a.watersourcetypecode=\'2\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.watersourceid=\'' + id + '\'';
        }
    },
    // 直升机取水码头
    for_waterport: {
        fileFn: function (data) {
            return 'a.watersourceid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: function () {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  a.watersourcetypecode=\'1\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.watersourceid=\'' + id + '\'';
        }
    },
    // 直升机取水点取水码头
    for_watersourceport: {
        fileFn: function (data) {
            return 'a.watersourceid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.watersourceid,a.watersourcename as name,a.watersourcetypecode,a.districtcode,a.address,a.longitude,a.latitude,a.capacity,a.sourcedept,a.geosourcedept,a.notes,a.waterdepth,a.ALTITUDE,a.AIRLINE,b.districtname';
        },
        tableName: function () {
            return 'fangxun.for_watersource a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  a.watersourcetypecode=\'3\'';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.watersourceid=\'' + id + '\'';
        }
    },
    // 国有林场
    for_forestfarm: {
        fileFn: function (data) {
            return 'a.forestfarmid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.forestfarmid,a.forestfarmname as name,a.address,a.longitude,a.latitude,a.businesstype,a.businessarea,a.personnum,a.respper,a.respperotel,a.resppermtel,a.contactper,a.contactperotel,a.contactpermtel,b.districtname';
        },
        tableName: function () {
            return 'fangxun.for_forestfarm a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.forestfarmid=\'' + id + '\'';
        }
    },
    // 邯郸市林业防火自然保护地
    forest_fire_prevention_natural_reserve: {
        fileFn: function (data) {
            return 'a.ID as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.NAME as name,a.TYPE as type,a.longitude,a.latitude,a.firechief,a.firechiefphone,a.district,a.arealevel';
        },
        tableName: function () {
            return 'PUBLIC.forest_fire_prevention_natural_reserve a left join code_bas_district b on a.arealevel=b.districtcode';
        },
        where: function (data) {
            return 'and 1=1 ';
        },
        group: function () {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.ID=\'' + id + '\'';
        }
    },
    // 邯郸市林业防火重点部位
    fores_fire_prevention_important_place: {
        fileFn: function (data) {
            return 'a.id as id,a.importantplacename as name,a.type as type,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.sphereofInfluence,a.threatpopulation,a.threatproperty,a.monitoringway,a.department,a.contactsandphone,a.treatmentmeasure,a.district,a.arealevel';
        },
        tableName: function () {
            return 'PUBLIC.fores_fire_prevention_important_place a left join code_bas_district b on a.arealevel=b.districtcode';
        },
        where: function (data) {
            return ' and 1=1 ';
        },
        group: function () {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 邯郸市林业防火装备
    forest_fire_prevention: {
        fileFn: function (data) {
            return 'a.id as id,a.equipmentname as name,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.principal,a.phone,a.district,a.arealevel';
        },
        tableName: function () {
            return 'PUBLIC.forest_fire_prevention_equipment a left join code_bas_district b on a.arealevel=b.districtcode';
        },
        where: function (data) {
            return ' and 1=1 ';
        },
        group: function () {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 邯郸市林业防火阻隔带信息
    forest_fire_prevention_barrier_strip: {
        fileFn: function (data) {
            return 'a.id as id,a.type as type,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.length,a.breadth,a.district,a.arealevel';
        },
        tableName: function () {
            return 'PUBLIC.forest_fire_prevention_barrier_strip a left join code_bas_district b on a.arealevel=b.districtcode';
        },
        where: function (data) {
            return ' and 1=1 ';
        },
        group: function () {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 邯郸市林业防火气象监测站
    forest_fire_prevention_meteorological_monitoring_station: {
        fileFn: function (data) {
            return 'a.id as id,a.monitoringstationname as monitoringstationname,a.principalandphone as principalandphone,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.district,a.arealevel';
        },
        tableName: function () {
            return 'PUBLIC.forest_fire_prevention_meteorological_monitoring_station a left join code_bas_district b on a.arealevel=b.districtcode';
        },
        where: function (data) {
            return ' and 1=1 ';
        },
        group: function () {
            return 'a.arealevel';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'a.district';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 自然保护区
    for_naturalreserve: {
        fileFn: function (data) {
            return 'a.naturalreserveid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.naturalreserveid,a.naturalreservename as name,a.naturalreservetype,a.address,a.area,a.coordinaterange,a.longitude,a.latitude,a.chargedept,a.respper,a.respperotel,a.resppermtel,a.approvalauthority,a.approvalnumber,a.forestcoverage,b.districtname as fullname';
        },
        tableName: function () {
            return 'fangxun.for_naturalreserve a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.pac';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.naturalreserveid=\'' + id + '\'';
        }
    },
    // 停机坪
    for_heliport: {
        fileFn: function (data) {
            return ' a.heliportid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.heliportname as name,a.address,a.longitude,a.latitude,a.sourcedept,a.geosourcedept,a.altitude,a.AREA,a.CONDITION,a.CLEARANCE,a.HELICOPTERNUM,a.ADMINORG,b.districtname';
        },
        tableName: function () {
            return 'fangxun.for_heliport a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.heliportid=\'' + id + '\'';
        }
    },
    // 水库大坝
    reservoir: {
        fileFn: function (data) {
            return 'a.reservoirid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\') as distance,a.name,a.telephone,a.address, a.respper,b.districtname,a.longitude,a.latitude ';
        },
        tableName: function () {
            return 'bas_reservoir a left join code_bas_district b on a.code=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.code';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.reservoirid=\'' + id + '\'';
        }
    },
    // 灾情信息员
    disinfoper: {
        fileFn: function (data) {
            return 'a.disinfoperid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.disinfopername as name,a.post,a.districtname,a.mobphone,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_disinfoper a ';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.disinfoperid=\'' + id + '\'';
        }
    },
    // 应急管理机构
    emergencypart: {
        fileFn: function (data) {
            return 'a.vdtid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,b.districtname，a.unitname as name,a.unitaddress as address,a.longitude,a.latitude';
        },
        tableName: function () {
            return 'jc_huaw_vdt a left join code_bas_district b on a.districtcode=b.districtcode ';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.vdtid=\'' + id + '\'';
        }
    },
    // 核设施
    nuclear: {
        fileFn: function (data) {
            return 'a.nuclearid as id,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.nuclearname as name,b.districtname,a.longitude,a.latitude';
        },
        tableName: function () {
            return ' bas_nuclearinfo a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.nuclearid=\'' + id + '\'';
        }
    },
    // 瞭望塔
    lookouttower: {
        fileFn: function (data) {
            return ' a.id,a.name,a.address,b.districtname,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.contacts,a.contacts_cell';
        },
        tableName: function () {
            return ' fangxun.for_lookouttower a left join code_bas_district b on a.districtcode=b.districtcode';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    },
    // 防火检查站
    fireinspectionstation: {
        fileFn: function (data) {
            return ' a.id,a.name,a.address,c.stationtypename as stationtype,b.districtname,ST_Distance_Spheroid(a.shape,st_geomfromtext(\'' + data.centerPoint + '\',4490),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,a.longitude,a.latitude,a.contacts,a.contacts_cell';
        },
        tableName: function () {
            return ' fangxun.for_fireinspectionstation a left join code_bas_district b on a.districtcode=b.districtcode left join fangxun.code_station_type c on a.stationtype=c.stationtype';
        },
        where: function (data) {
            return 'and  1=1';
        },
        group: function () {
            return 'a.districtcode';
        },
        // 子类过滤字段
        filtfield: function () {
            return 'm.orgtypecode';
        },
        id: function (id) {
            return 'and a.id=\'' + id + '\'';
        }
    }
};
exports["default"] = MultiuleQueryConfig;
