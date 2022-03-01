window.EMapServerV2.RiskQueryServiceConfig ={
    'dz': {
    "tables": [
        {
            "id":"huapo",
            "table": "BAS_GEOLOGICHAZARD",
            "query": {
                "tag.GEOHAZARDTYPECODE":{
                    "$in":["20104.0300","20104.0200","20104.0100"]
                }
            },
            "fieldMap":{
                "title": "HAZARDNAME",
                "monitorType":"MONITMODE",
                "monitorTel":"MONRESPPEROTEL",
                "monitorMeasure":"TREATSTEP",
                "dsBaseLevel":"HAZARDLEVELCODE",
                "dsBaseType":"GEOHAZARDTYPECODE",
                "dsBaseAdress":"ADDRESS",
                "dsThreatenNum":"MAXPERSONNUM",
                "dsThreatenObj":"THREATOBJ",
                "dsThreatenProperty":"THREATWEALTH"
            }
        }
    ]
},
    'qy': {
    "tables": [
        {
            "//": "危化品企业",
            "id":"hazardous",
            "table": "ANJIAN_DAGCHEMENT",
            "fieldMap": {
                "title": "DAGCHEMENTNAME",
                "longitude": "LONGITUDE",
                "latitude": "LATITUDE",
                "enBaseAdress": "ADDRESS",
                "enBaseLevel":"RISKLEVEL",
                "enBaseEnTel": "EMERASKTEL",
                "enBaseStaffNum": "EMPNUM"
            }
        },
        {
            "//": "煤矿企业",
            "id":"coalMine",
            "table": "ANJIAN_COAL",
            "fieldMap": {
                "title": "COALNAME",
                "enBaseAdress": "ADDRESS",
                "enBaseLevel":"RISKLEVEL",
                "enBaseEnTel": "CONTROLCENTERTEL",
                "enBaseStaffNum":"WORERNUM"
            }
        },
        {
            "//": "烟花爆竹企业",
            "id":"firework",
            "table": "ANJIAN_FIREWORKENT",
            "fieldMap": {
                "title": "FIREWORKENTNAME",
                "enBaseEnTel": "TEL",
                "enBaseAdress": "ADDRESS",
                "longitude": "LONGITUDE",
                "latitude": "LATITUDE",
                "enBaseStaffNum":"WORKERNUM"
            }
        },
        {
            "//": "非煤矿山企业",
            "id":"mine",
            "table": "ANJIAN_TAILINGPOND",
            "fieldMap": {
                "title": "WKKMC",
                "enBaseEnTel": "WKKFZRYDDH",
                "enBaseAdress": "WKKDZMC",
                "longitude": "LONGITUDE",
                "latitude": "LATITUDE",
                "respper": "WKKFZR",
                "enBaseStaffNum": "TZZYRYSL"
            }
        }
    ]
},
    'ss': {
    "tables": [
        {
            "//": "水库",
            "id":"reservoir",
            "table": "BAS_RESERVOIR",
            "fieldMap": {
                "title": "NAME",
                "CODE": "CODE"
            }
        },
        {
            "//": "桥梁",
            "id":"tunnel",
            "table": "BAS_BRIDGE",
            "fieldMap": {
                "title": "BRIDGENAME",
                "inBaseEnTel": "RESPOTEL",
                "inBaseAdress": "ADDRESS",
                "respper": "RESPPER",
                "BRIDGECATEGORYCODE":"BRIDGECATEGORYCODE",
                "DISTRICTCODE":"DISTRICTNAME"
            }
        }
    ]
}
}