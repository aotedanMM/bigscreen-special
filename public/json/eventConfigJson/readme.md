# 配置文件详解

## 配置文件名
  json 的名字是有规则的，不可以任意的起名。
  json的名字要和  src/util/eventConfigRegistry.ts中的DictMap对象相关联。

## 配置文件字段解读  

{
    "type": 1, // 事件类型
                1 地震
                2 煤矿,属于安全生产事故
                4 非煤矿山,属于安全生产事故
                5 危险品和工贸,属于安全生产事故
                6 火灾
                8 洪涝
                9 森林火灾
                10 台风
                99 其他
    "experienceCircle": "5,10,20,50", // 设置经验圈初始值,
    "defaultExperienceCircle": 3, // 把experienceCircle这个字段作为数组处理后，的数组下标。默认
                                    选中第三个，50
    "funcPanel": [{  功能性按钮，右侧那部分，这里用的是数组，在右侧是组件共存的关系，checked的组件
                        就会渲染
            "name": "实时灾情", // 按钮的显示内容
            "alias": "实时灾情", // 暂时没什么用
            "key": "knownDisaster", // 唯一关键字
            "componetName": "knownDisaster", // 按钮的高亮维护的是一个动态组件的数组，
                                                需要引入的组件的名称
            "checked": true, // 是否显示在小窗(选中),如果选中，则渲染出来
            "icon": "sszq", // 按钮图标
            "enlarge": false, // 判断是否可以放大（放大按钮不存在）
        },
        {
          这里配置剩下的按钮，此处省略
        }
    ],
    "researchPanel": [{ // 这是左侧的研判结果类按钮的配置
            "name": "初步研判", // 按钮上要显示的名字
            "alias": "一键研判", // 暂时没什么用
            "key": "quickStudy", // 唯一关键字,这个关键字是有重要作用的，这个关键字会作为一个新的
                                    配置对象的关键字，在这里主要配置了下面动态组件名字componetName中StudyAndJudgmentContainer这个组件要用到的信息
            "componetName": "StudyAndJudgmentContainer", // 需要引入的组件的名称,该组件用到的配
                                                        置信息，在关键字key==quickStudy的本页面配置中
            "checked": true, // 是否显示，即一进入专题就默认渲染出来
            "icon": "cbyp" // "按钮图标",
            "closed": false, // 是否有关闭按钮,这个是预留的功能吧。（暂时未知）
        },
        {
            其余按钮的相应配置的配置同上
        }
    ],
    "quickStudy": {  // 快速研判这里待确认
        "level": "6级",
        "tabShow": {
            "countyCount": {
                "title": "行政区划",
                "name": "受影响区市",
                "num": 0,
                "danwei": "个",
                "key": "countyCount",
                "clickKey": "countyCount",
                "platoon": true,
                "//platoon": "是否排头",
                "icon": "qx"
            },
            "townCount": {
                "name": "受影响乡镇",
                "num": 0,
                "danwei": "个",
                "platoon": true,
                "//platoon": "是否排头",
                "icon": "xz"
            },
            "population": {
                "title": "人口",
                "name": "人口",
                "num": 0,
                "danwei": "万人",
                "key": "population",
                "clickKey": "population",
                "icon": "rk"
            },
            "totalArea": {
                "name": "面积",
                "num": 0,
                "danwei": "km²",
                "icon": "mj"
            },
            "populationDensity": {
                "name": "人口密度",
                "num": 0,
                "danwei": "人/km²",
                "icon": "rkmd"
            }
        },
        "personnelKey": [
            "bas_school",
            "hospital",
            "airport",
            "railwaystation",
            "hazardous",
            "coal",
            "tailingpond",
            "firework",
            "reservoir",
            "portwharf",
            "nuclear",
            "disinfoper",
            "emergencypart"
        ],
        "contList": {
            "contListAll": [{
                    "title": "人员密集场所",
                    "sum": 0,
                    "list": {
                        "bas_school": {
                            "title": "学校",
                            "name": "学校",
                            "bg": "schoolbg",
                            "num": 0,
                            "danwei": "所",
                            "key": "bas_school",
                            "clickKey": "bas_school",
                            "active": false
                        },
                        "hospital": {
                            "title": "医院",
                            "name": "医院",
                            "bg": "hospitalbg",
                            "num": 0,
                            "danwei": "家",
                            "key": "hospital",
                            "clickKey": "hospital",
                            "active": false
                        },
                        "airport": {
                            "title": "机场",
                            "name": "机场",
                            "bg": "airportbg",
                            "num": 0,
                            "danwei": "个",
                            "key": "airport",
                            "clickKey": "airport",
                            "active": false
                        },
                        "railwaystation": {
                            "title": "火车站",
                            "name": "火车站",
                            "bg": "railwaystationbg",
                            "num": 0,
                            "danwei": "个",
                            "key": "railwaystation",
                            "clickKey": "railwaystation",
                            "active": false
                        }
                    }
                },
                {
                    "title": "高危行业企业",
                    "sum": 0,
                    "list": {
                        "hazardous": {
                            "title": "危化企业",
                            "name": "危化企业",
                            "bg": "hazardousbg",
                            "num": 0,
                            "danwei": "家",
                            "key": "hazardous",
                            "clickKey": "hazardous",
                            "active": false
                        },
                        "coal": {
                            "title": "煤矿企业",
                            "name": "煤矿企业",
                            "bg": "coalMinebg",
                            "num": 0,
                            "danwei": "家",
                            "key": "coal",
                            "clickKey": "coal",
                            "active": false
                        },
                        "tailingpond": {
                            "title": "尾矿库企业",
                            "name": "尾矿库",
                            "bg": "minebg",
                            "num": 0,
                            "danwei": "座",
                            "key": "tailingpond",
                            "clickKey": "tailingpond",
                            "active": false
                        },
                        "firework": {
                            "title": "烟花爆竹企业",
                            "name": "烟花爆竹企业",
                            "bg": "explosivebg",
                            "num": 0,
                            "danwei": "家",
                            "key": "firework",
                            "clickKey": "firework",
                            "active": false
                        }
                    }
                },
                {
                    "title": "重要设施",
                    "sum": 0,
                    "list": {
                        "reservoir": {
                            "title": "水库大坝",
                            "name": "水库大坝",
                            "bg": "reservoirbg",
                            "num": 0,
                            "danwei": "个",
                            "key": "reservoir",
                            "clickKey": "reservoir",
                            "active": false
                        },
                        "portwharf": {
                            "title": "码头",
                            "name": "码头",
                            "bg": "portwharfbg",
                            "num": 0,
                            "danwei": "个",
                            "key": "portwharf",
                            "clickKey": "portwharf",
                            "active": false
                        },
                        "nuclear": {
                            "title": "核设施",
                            "name": "核设施",
                            "bg": "nuclearbg",
                            "num": 0,
                            "danwei": "个",
                            "key": "nuclear",
                            "clickKey": "nuclear",
                            "active": false
                        }
                    }
                },
                {
                    "title": "灾情信息员",
                    "sum": 0,
                    "danwei": "人",
                    "key": "disinfoper",
                    "clickKey": "disinfoper",
                    "name": "灾情信息员",
                    "active": false
                },
                {
                    "title": "应急管理机构",
                    "sum": 0,
                    "danwei": "个",
                    "key": "emergencypart",
                    "clickKey": "emergencypart",
                    "name": "应急管理机构",
                    "active": false
                }
            ]
        }
    },
    "RescueTeamsContainer": { // 力量调度组件用到的配置信息
        "title": "力量调度", // 组件面板的上边的面板标题
        "statisticsList": [{ // 力量调度面板下的队伍统计面板
                "title": "队伍分布", // 第一个整体的队伍统计
                "key": "TeamDistribution", // 这个是这个面板的唯一id，
                "teamnum": 0, // 队伍数量
                "teamUnit": "支", // 队伍单位
                "peoplenum": 0, // 队伍人数
                "personUnit": "人", // 人数单位
                "showSub": false, // 是否显示子菜单（二级菜单），如果需要默认展开，true即可
                "getDataServ": "getStatisticsListByTeamTypeArr", // 这是用来获取当前队伍分布的
                                                                    数据的写在组件中的方法名，之所以在这配置下，是因为，两个数组（前突、队伍分布），他们传的参数、返回都是一样的，就是服务名字不一样。
                "qiantuFlag": false, // 这个代表是否是前突队伍，可以不配置，但是如果是前突队伍的
                                            话，一定要配置 且为true
                "subList": [{ // 关注的队伍类型
                        "name": "矿山（隧道）", // 队伍名字
                        "alias": "矿山", // 队伍简称
                        "codeType": "T001", // 队伍编码
                        "sortNum": 1, // 队伍排序，这个不知道是做什么用的，但是需求给的东西中，有
                                        这个字段，但是没用起来
                        "icon_bg": "icon_bg_normal", // icon的背景图 icon_bg_normal icon_bg_qt 前突和队
                                    伍分布是不一样的
                        "icon": "schoolbg", // icon的背景图
                        "teamnum": 0, // 队伍数量
                        "teamUnit": "支", // 队伍单位
                        "peoplenum": 0, // 队伍人数
                        "personUnit": "人",
                        "active": false ,// 高亮
                    },
                    {其他的队伍的配置}
                ]
            },
            {
                "title": "前突队伍",
                "key": "QiantuTeam",
                "teamnum": 0,
                "teamUnit": "支",
                "peoplenum": 0,
                "personUnit": "人",
                "showSub": false,
                "getDataServ": "getQiantuListByTeamTypeArr",
                "qiantuFlag": true,
                "subList": [{
                        "name": "矿山（隧道）",
                        "alias": "矿山",
                        "codeType": "T001",
                        "sortNum": 1,
                        "icon_bg": "icon_bg_qt",
                        "icon": "schoolbg",
                        "teamnum": 0,
                        "teamUnit": "支",
                        "peoplenum": 0,
                        "personUnit": "人",
                        "clickKey": "bas_school",
                        "active": false
                    },
                    {
                        其他的队伍配置信息
                    }
                ]
            }
        ]
    },
    "halflist": {
        "DisasterRescueTeams": [{
                "name": "救援分布统计",
                "componetName": "DisasterRescueTeams"
            },
            {
                "name": "救援分布列表",
                "componetName": "DisasterRescueTeamsList"
            }
        ],
        "bas_school": [{
                "name": "学校分布统计",
                "componetName": "DisasterSchool"
            },
            {
                "name": "学校分布列表",
                "componetName": "DisaterSchoolList"
            }
        ],
        "hospital": [{
                "name": "医院分布统计",
                "componetName": "DisasterHospital"
            },
            {
                "name": "医院分布列表",
                "componetName": "DisasterHospitalList"
            }
        ],
        "airport": [{
                "name": "机场分布统计",
                "componetName": "DisasterPlane"
            },
            {
                "name": "机场分布列表",
                "componetName": "DisasterPlaneList"
            }
        ],
        "railwaystation": [{
                "name": "火车站分布统计",
                "componetName": "DisasterTrain"
            },
            {
                "name": "火车站分布列表",
                "componetName": "DisasterTrainList"
            }
        ],
        "hazardous": [{
                "name": "危化企业分布统计",
                "componetName": "DisasterCompany"
            },
            {
                "name": "危化企业分布列表",
                "componetName": "DisasterCompanyList"
            }
        ],
        "coal": [{
                "name": "煤矿企业分布统计",
                "componetName": "DisasterCoal"
            },
            {
                "name": "煤矿企业分布列表",
                "componetName": "DisasterCoalList"
            }
        ],
        "tailingpond": [{
                "name": "非煤矿山分布统计",
                "componetName": "DisasterNoCoal"
            },
            {
                "name": "非煤矿山分布列表",
                "componetName": "DisasterNoCoalList"
            }
        ],
        "firework": [{
                "name": "烟花爆竹企业分布统计",
                "componetName": "DisasterFireworks"
            },
            {
                "name": "烟花爆竹企业分布列表",
                "componetName": "DisasterFireworksList"
            }
        ],
        "reservoir": [{
                "name": "水库大坝分布统计",
                "componetName": "DisasterReservoir"
            },
            {
                "name": "水库大坝分布列表",
                "componetName": "DisasterReservoirList"
            }
        ],
        "portwharf": [{
                "name": "码头分布统计",
                "componetName": "DisasterWharf"
            },
            {
                "name": "码头分布列表",
                "componetName": "DisasterWharfList"
            }
        ],
        "nuclear": [{
                "name": "核设施分布统计",
                "componetName": "DisasterNucleus"
            },
            {
                "name": "核设施分布列表",
                "componetName": "DisasterNucleusList"
            }
        ],
        "disinfoper": [{
                "name": "灾情信息员统计",
                "componetName": "DisasterMessenger"
            },
            {
                "name": "灾情信息员列表",
                "componetName": "DisasterMessengerList"
            }
        ],
        "emergencypart": [{
                "name": "应急管理机构统计",
                "componetName": "DisasterEmergencypart"
            },
            {
                "name": "应急管理机构列表",
                "componetName": "DisasterEmergencypartList"
            }
        ],
        "population": [{
                "name": "人口分布统计",
                "componetName": "PopulationFeverBox"
            },
            {
                "name": "人口分布列表",
                "componetName": "PopulationFeverList"
            }
        ],
        "countyCount": [{
                "name": "行政区划",
                "componetName": "DistrictLeftDialog"
            },
            {
                "name": "行政区划",
                "componetName": "DistrictRightDialog"
            }
        ]
    },
    "toolConfig": {
        "mapToolIconEventOverview": "mapToolIconEventOverview_earthQuake.json",
        "mapToolCompared": "mapToolCompared_earthQuake.json",
        "mapCommonTools": "commonTools_earthQuake.json",
        "disasterDecide": "disasterDecide_earthQuake.json"
    }
}
