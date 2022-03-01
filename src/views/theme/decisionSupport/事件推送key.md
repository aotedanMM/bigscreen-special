# 事件推送
**事件id全部用: test1215**
1.	人员伤亡 - 实时灾情
Key: CASUALTIES
```json
"{"data":[{"parentName":"西城区","death":8,"injured":0,"miss":7,"damage":7,"poptotal":95737,"lost":8,"x":116.35581226,"y":39.87521582,"id":"110102","child":[{"town":"西城区","village":"白纸坊街道","id":"11010201995737","death":8,"injured":0,"miss":7,"damage":7,"lost":8,"x":116.35581226,"y":39.87521582,"poptotal":95737}]},{"parentName":"丰台区","death":1,"injured":2,"miss":9,"damage":8,"poptotal":179673,"lost":2,"x":116.35984272,"y":39.86261546,"id":"110106","child":[{"town":"丰台区","village":"右安门街道","id":"11010600183936","death":1,"injured":2,"miss":9,"damage":8,"lost":2,"x":116.35984272,"y":39.86261546,"poptotal":83936}]}],"injured":"2","damage":"15","death":"9"}"
```
2. 房屋损毁 - 实时灾情
key: HOUSESH

``` JSON
"{"data":[{"parentName":"西城区","damage":0,"yazhongsunhuai":8,"yibansunhuai":8,"x":116.35581226,"y":39.87521582,"id":"110102","child":[{"yibansunhuai":8,"yazhongsunhuai":8,"damage":0,"town":"西城区","village":"白纸坊街道","id":"11010201995737","x":116.35581226,"y":39.87521582,"poptotal":95737}],"poptotal":95737},{"parentName":"丰台区","damage":7,"yazhongsunhuai":4,"yibansunhuai":4,"x":116.35984272,"y":39.86261546,"id":"110106","child":[{"yibansunhuai":4,"yazhongsunhuai":4,"damage":7,"town":"丰台区","village":"右安门街道","id":"11010600183936","x":116.35984272,"y":39.86261546,"poptotal":83936}],"poptotal":179673}]}"
```
3. 灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
key: SIZEUP
```JSON
"{"data":{"deathperson":"1","houseclose":"2","emrgencyclose":"3"}}"
```
4. 灾损评估(救出人数、转移人数) - 实时灾情
key: RESCERTRANSFER
```JSON
"{"data":{"rescuerPerson":"4","transferPerson":"5"}}"
```
5. 物资调拨（调拨，到达）
key: EQUIPMENT_DISPATCH
```JSON
"{"event":[{"id":1576587514388,"state":"01","stateName":"调拨","name":"折叠床","code":"01","addressCode":"02","addressName":"南宁","num":"20"},{"id":1576587568519,"state":"02","stateName":"到达","name":"帐篷","code":"03","addressCode":"01","addressName":"昆明","num":"20"},{"id":1576587696338,"state":"01","stateName":"调拨","name":"折叠床","code":"01","addressCode":"01","addressName":"昆明","num":"1"}]}"
```
6. 进展情况(领导批示)
key: SEND_PROGRESS
```JSON
"{"event":{"type":"0","progress":"领导批示","progressTime":"12-17 21:17","progressCont":"天下大事，为我所控","sendDept":"救援协调局"}}"
```
7.	现场队伍（队伍调派）
Key: SEND_FIELDTEAM
```JSON
 "{"event":{"list":[{"name":"吉林森林总队","typeCode":"T004","typeName":"森林消防","num":1679,"teamleader":"","leadermtel":"","address":"吉林省长春市自由大路5070号","x":125.37131,"y":43.864523,"id":"RESSLSLJCZD0002","distance":262.1096297884015,"carnum":"","teamtask":"","sendpeoplenum":1679,"sendplace":"","teamjc":"现场救援队","tox":125.374217,"toy":43.865596},{"name":"吉林总队","typeCode":"T003","typeName":"消防","num":0,"teamleader":"李俊东","leadermtel":"13843159001","address":"吉林省长春市二道区自由大路6699号","x":125.384637,"y":43.863051,"id":"jilin1","distance":882.9873378021626,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"现场救援队","tox":125.374217,"toy":43.865596},{"name":"二道大队","typeCode":"T003","typeName":"消防","num":0,"teamleader":"王英楠","leadermtel":"13578870001","address":"吉林省长春市二道区临河街1662号","x":125.386577,"y":43.872931,"id":"jilin10","distance":1284.7694953806376,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"现场救援队","tox":125.374217,"toy":43.865596}],"userKey":"auser","total":3,"totalNum":1679,"cuntyList":[{"name":"永吉县","code":"220221","x":126.4935,"y":43.6616},{"name":"九台区","code":"220113","x":125.533736,"y":44.007592},{"name":"二道区","code":"220105","x":125.3732,"y":43.885},{"name":"双阳区","code":"220112","x":125.6644,"y":43.5446},{"name":"南关区","code":"220102","x":125.3513,"y":43.8959},{"name":"伊通满族自治县","code":"220323","x":125.2968,"y":43.3425},{"name":"朝阳区","code":"220104","x":125.2883,"y":43.8335},{"name":"公主岭市","code":"220381","x":124.811,"y":43.5078},{"name":"绿园区","code":"220106","x":125.2565,"y":43.8969},{"name":"宽城区","code":"220103","x":125.3265,"y":43.9206},{"name":"农安县","code":"220122","x":125.1732,"y":44.4297},{"name":"德惠市","code":"220183","x":125.7048,"y":44.5331}]}}"
```
8.  赶赴队伍/待命队伍（队伍调派）
Key: SEND_HURRYTEAM
```JSON
"{"event":{"list":[{"name":"右安门中队","typeCode":"T003","typeName":"消防","num":30,"teamleader":"纪彬彬","leadermtel":"13910414319","address":"北京市丰台区右安门中队外大街60号","x":116.358502,"y":39.857671,"id":"beijing89","distance":1552.8623610486104,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"广安门中队","typeCode":"T003","typeName":"消防","num":45,"teamleader":"徐天政","leadermtel":"15801409440","address":"北京市西城区广外红居街15号楼","x":116.330323,"y":39.887448,"id":"beijing20","distance":2568.6802424249986,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"西罗园中队","typeCode":"T003","typeName":"消防","num":16,"teamleader":"蒋泽楠","leadermtel":"18910632969","address":"北京市丰台区马家堡路16号","x":116.378884,"y":39.861877,"id":"beijing91","distance":2628.37444626918,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"北京市地震救援队（武警）","typeCode":"T005","typeName":"地震","num":356,"teamleader":"","leadermtel":"","address":"北京市","x":116.411131,"y":39.905408,"id":"RESDZSJ0072","distance":6542.2321548966265,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"国家地震灾害紧急救援队（中国国际救援队）","typeCode":"T005","typeName":"地震","num":480,"teamleader":"庄乾江","leadermtel":"15331009958","address":"北京市昌平区阳坊镇","x":116.145055,"y":40.14065,"id":"RESDZSJ0001","distance":34829.9236002479,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"天津市地震救援队（消防）","typeCode":"T005","typeName":"地震","num":300,"teamleader":"韩希龙","leadermtel":"","address":"天津市南开区南马路708号","x":117.182328,"y":39.137913,"id":"RESDZSJ0005","distance":108407.28120757287,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":116.35,"toy":39.87},{"name":"经济技术开发区大队","typeCode":"T003","typeName":"消防","num":0,"teamleader":"秦俊龙","leadermtel":"15804308777","address":"吉林省长春市经开区浦东路2268号","x":125.386962,"y":43.855407,"id":"jilin42","distance":1527.402756592642,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":125.374217,"toy":43.865596},{"name":"亚泰中队","typeCode":"T003","typeName":"消防","num":32,"teamleader":"盖天宇","leadermtel":"15843090808","address":"吉林省长春市二道区临河街1662号","x":125.357942,"y":43.873271,"id":"jilin11","distance":1560.73195023893,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":125.374217,"toy":43.865596},{"name":"吉林省地震救援队（武警）","typeCode":"T005","typeName":"地震","num":110,"teamleader":"于磊","leadermtel":"15904428101","address":"吉林省长春市二道区卫星路2666号","x":125.380026,"y":43.832211,"id":"RESDZSJ0015","distance":3745.5464160015067,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"赶赴救援队","tox":125.374217,"toy":43.865596},{"name":"黄河路中队","typeCode":"T003","typeName":"消防","num":33,"teamleader":"孙军","leadermtel":"15943031290","address":"吉林省长春市宽城区黄河路599号","x":125.324692,"y":43.904999,"id":"jilin49","distance":5918.45574080037,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"金宝街中队","typeCode":"T003","typeName":"消防","num":24,"teamleader":"田岩","leadermtel":"15943031726","address":"吉林省长春市净月高新技术产业开发区银湖路1799号","x":125.436918,"y":43.836865,"id":"jilin20","distance":5963.630231087234,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"长春一中队","typeCode":"T003","typeName":"消防","num":53,"teamleader":"郑再文","leadermtel":"15943031613","address":"吉林省长春市朝阳区东民主大街48号","x":125.303936,"y":43.886774,"id":"jilin4","distance":6112.519849284286,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"长春特勤","typeCode":"T003","typeName":"消防","num":0,"teamleader":"杜剑","leadermtel":"18804311217","address":"吉林省长春市朝阳区东民主大街48号","x":125.303473,"y":43.886698,"id":"jilin3","distance":6143.578232183507,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"黑龙江省地震救援队（消防）","typeCode":"T005","typeName":"地震","num":1185,"teamleader":"徐明军","leadermtel":"13803679999","address":"黑龙江省哈尔滨市南岗区长江路366号","x":126.686715,"y":45.749597,"id":"RESDZSJ0018","distance":233936.30817178646,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"辽宁省地震救援队（消防）","typeCode":"T005","typeName":"地震","num":140,"teamleader":"刘佐祥","leadermtel":"13842062656","address":"辽宁省沈阳市皇姑区","x":123.438228,"y":41.824813,"id":"RESDZSJ0014","distance":276708.8954746791,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"辽宁省地震救援队（武警）","typeCode":"T005","typeName":"地震","num":256,"teamleader":"卢鹏","leadermtel":"18804089555","address":"辽宁省沈阳市新民县","x":122.649863,"y":42.059821,"id":"RESDZSJ0013","distance":299406.62477038143,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596},{"name":"辽宁省地震救援队（部队）","typeCode":"T005","typeName":"地震","num":150,"teamleader":"赵相权","leadermtel":"13309884099","address":"辽宁省鞍山市海城市","x":122.755306,"y":40.853177,"id":"RESDZSJ0012","distance":398523.1022558691,"carnum":"","teamtask":"","sendpeoplenum":0,"sendplace":"","teamjc":"请选择...","tox":125.374217,"toy":43.865596}],"userKey":"auser","total":20,"totalNum":0}}"
```
9. 人物信息 - 当地政府
key: SEND_PERSON_INFO
```JSON
"{"event":[{"work":"当地政府","infomationwork":"云南省省长","infomationname":"阮成发","infomationphone":"18888888888"},{"work":"当地政府","infomationwork":"玉溪市长","infomationname":"张德华","infomationphone":"16666666666"}]}"
```

--------------------------------------------------------

10. 队伍需求（需求队伍人数）
key: SEND_RESCUEDEMAND
```JSON
"{"event":{"list":[{"x":"116.330323","y":"39.887448","district":"广安门中队","workers":[{"typeCode":"T005","typeName":"地震救援队","typetitle":"广安门中队","num":"4444"}]}]}}"
```

11. 物资需求（重点物资需求）
key: GOODS_DISPATCH
```JSON
"{"event":{"list":[{"x":"116.4927","y":"39.315","district":"永清县","contact":"袁术","contactTel":"123456778909","placing":[{"name":"救灾帐篷","code":"TP001","num":"52","unit":"件"}],"unplaced":[{"name":"救灾被服","code":"TP002","num":"3","unit":"件"}],"placed":[]}]}}"
```

12. 人员安置
key: SEND_PERSONNELPLACEMENT
```JSON
"{"event":{"list":[{"district":"固安县","districtCode":"131022","id":"131022","x":116.3003,"y":39.4352,"totalCapacity":475,"totalCapacityPlaced":194,"totalPlacement":497,"totalPlacementVictims":182},{"district":"永清县","districtCode":"131023","id":"131023","x":116.4927,"y":39.315,"totalCapacity":400,"totalCapacityPlaced":171,"totalPlacement":377,"totalPlacementVictims":190}]}}"
```

-------------------------

13. 交通情况
key: TRAFFIC
```JSON
"{"data":[{"name":"北京-广州","isblock":"0","blocksit":null,"isResume":"0","selectid":"0","startDotted":"华为","endDotted":"网易","distance":"5758.72","type":"公路","count":1,"geom":{"type":"MultiLineString","coordinates":[[[116.34027008,39.8484956],[116.34027583,39.84853718],[116.34031136,39.84887721],[116.34034098,39.84920116],[116.34040715,39.84992484],[116.34056152,39.85119248],[116.34163206,39.86009346],[116.34166909,39.86040128],[116.34211644,39.86420976],[116.34229721,39.8667709],[116.3423726,39.86759223],[116.3424,39.86802543],[116.34255208,39.86910922],[116.34256661,39.86921789],[116.34299703,39.8724375],[116.34311139,39.87329293],[116.34311977,39.87388497],[116.34308925,39.87466281],[116.34306802,39.87627659],[116.34306575,39.87644855],[116.34278154,39.87943524],[116.34257905,39.88374357],[116.34256882,39.88546045],[116.34256873,39.88625885],[116.34251312,39.888247]]]},"dealStatus":1},{"name":"南三环中路","isblock":"1","blocksit":null,"isResume":"0","selectid":"1","startDotted":"苹果","endDotted":"谷歌","distance":"5506.14","type":"公路","count":1,"geom":{"type":"MultiLineString","coordinates":[[[116.39394133,39.85569184],[116.39247943,39.8556988],[116.38833546,39.85566334],[116.38787609,39.8556635],[116.38537825,39.85567903],[116.38419154,39.85567938],[116.38059055,39.85570072],[116.37717056,39.85572352],[116.37670118,39.85572496],[116.3766647,39.85572507],[116.3731815,39.85575923],[116.36934419,39.85575993],[116.36838304,39.85569881],[116.36739299,39.85565441],[116.36547381,39.85540816],[116.36544176,39.85540405],[116.36437218,39.85517026],[116.3619006,39.85450775],[116.35884411,39.85366297],[116.35763687,39.85332927],[116.3568868,39.85312652],[116.35406072,39.85234953],[116.35354885,39.85220902],[116.35306646,39.85207712],[116.3508795,39.85147788],[116.34793174,39.8506593],[116.34771816,39.85059879],[116.34769835,39.85059318],[116.3457099,39.85002979]]]},"dealStatus":0},{"name":"北京-深圳","isblock":"2","blocksit":null,"isResume":"0","selectid":"2","startDotted":"YouTube","endDotted":"Netflix","distance":"4417.17","type":"公路","count":1,"geom":{"type":"MultiLineString","coordinates":[[[116.34251312,39.888247],[116.34140161,39.88828754],[116.33987337,39.88834327],[116.33648921,39.88846662],[116.33644161,39.88846834],[116.33368594,39.88851396],[116.33008544,39.88857346],[116.33003644,39.88857434],[116.32887855,39.88859507],[116.32781573,39.88861409],[116.32568826,39.88865213],[116.32519783,39.8886609],[116.32265189,39.88867313],[116.321687,39.88867776],[116.3207808,39.88866609],[116.32022204,39.88871064],[116.31986982,39.88866468],[116.31888754,39.88867704],[116.31792384,39.88857071],[116.31773097,39.8885397],[116.3169909,39.88842071],[116.31682251,39.88839364],[116.3156552,39.88816934],[116.3151782,39.88802334],[116.31513011,39.8880086],[116.31470519,39.88787834],[116.31367436,39.88743838],[116.31323969,39.88725286],[116.31034578,39.88601764],[116.30710615,39.88463471],[116.30468367,39.88360052],[116.30449904,39.8835217],[116.30446393,39.88350078]]]},"dealStatus":1}]}"
```

14. 电力受损
key: POWER
```JSON
"{"data":[{"parentName":"西城区","poptotal":147614,"dianxianhao":3,"dianzhancount":3,"x":116.35581226,"y":39.87521582,"id":"110102","child":[{"town":"西城区","village":"白纸坊街道","id":"11010201995737","x":116.35581226,"y":39.87521582,"dianzhancount":3,"dianxianhao":3,"poptotal":95737,"suiJi":1,"goodNum":2,"type":1},{"town":"西城区","village":"牛街街道","id":"11010201851877","x":116.35574273,"y":39.8849606,"dianzhancount":1,"dianxianhao":0,"poptotal":51877,"suiJi":0,"goodNum":1,"type":0}],"death":null,"injured":null,"miss":null,"damage":null,"lost":null},{"parentName":"丰台区","poptotal":231550,"dianxianhao":2,"dianzhancount":1,"x":116.35984272,"y":39.86261546,"id":"110106","child":[{"town":"丰台区","village":"右安门街道","id":"11010600183936","x":116.35984272,"y":39.86261546,"dianzhancount":1,"dianxianhao":2,"poptotal":83936,"suiJi":1,"goodNum":3,"type":0}]}]}"
```

15. 重点设施（风险隐患排查）
key: GKYH
```JSON
"{"data":{"dealNum":0,"dealObj":{"industry":[],"hazardous1":[]},"nodealNum":1,"nodealObj":{"industry":[{"title":"北京昊华能源股份有限公司大台煤矿","id":"110109002759","graphType":"enterprise","suggestType":"coalMine","enBaseAdress":"北京市门头沟区大台地区大台","enBaseEnTel":"15701161860","enBaseStaffNum":null,"x":115.857,"y":39.9362,"address":"北京市门头沟区大台地区大台","name":"北京昊华能源股份有限公司大台煤矿","respper":"李忠学","phone":"15701161860","type":"coalMine","typename":"煤矿企业","status":"1","statusname":"已排查有问题","send":"","question":""}],"hazardous1":[]},"key":"industryMinePoint","TroubledCont":1,"NotcheckedCont":2,"CheckitOutCont":1}}"
```
