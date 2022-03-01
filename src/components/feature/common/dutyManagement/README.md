

## 值班信息

```js

  const  MEMdataDemo = {
        leader: '许尔锋',
        MEMinfo: {
            title: '北京市值班信息',
            leader: '刘斌',
            monitor: [
                 {
                    name: '卞杰成',
                    time: '08:30 - 17:00',
                },
                {
                    name: '李东洲',
                    time: '17:00 - 08:00',
                },
            ],
            information: '钱山',
            yardman: '翁民',
            firemen: '谢清顺',
            synthesis: '单青生',
        },
        selectList: [
                {
                    selectName: '救援协调和预案管理局',
                    personName: [
                        {
                            title: '火情处置',
                            content: [
                                {
                                    name: '王岩',
                                    tel: 13364603988,
                                },
                                {
                                    name: '张志如',
                                    tel: 13364898255,
                                },
                            ],
                        },
                        {
                            title: '林火检测',
                            content: [
                                {
                                    name: '知性',
                                    tel: 13568842554,
                                },
                            ],
                        },
                    ],
                },
                {
                    selectName: '安全生产应急救援中心',
                    personName: [
                        {
                            title: '火情处置',
                            content: [
                                {
                                    name: '王岩',
                                    tel: 13364603988,
                                },
                                {
                                    name: '张志如',
                                    tel: 13364898255,
                                },
                            ],
                        },
                        {
                            title: '林火检测',
                            content: [
                                {
                                    name: '知性',
                                    tel: 13568842554,
                                },
                            ],
                        },
                    ],
                },
                {
                    selectName: '21号办工区综合办公室',
                    personName: [
                        {
                            title: '火情处置',
                            content: [
                                {
                                    name: '王岩',
                                    tel: 13364603988,
                                },
                                {
                                    name: '张志如',
                                    tel: 13364898255,
                                },
                            ],
                        },
                        {
                            title: '林火检测',
                            content: [
                                {
                                    name: '知性',
                                    tel: 13568842554,
                                },
                            ],
                        },
                    ],
                },
                {
                    selectName: '火灾防治管理司',
                    personName: [
                        {
                            title: '火情处置',
                            content: [
                                {
                                    name: '王岩',
                                    tel: 13364603988,
                                },
                                {
                                    name: '张志如',
                                    tel: 13364898255,
                                },
                            ],
                        },
                        {
                            title: '林火检测',
                            content: [
                                {
                                    name: '知性',
                                    tel: 13568842554,
                                },
                            ],
                        },
                    ],
                },
            ] ,
        } ;

 <duty-management :MEMdata="MEMdataDemo" ></duty-management>

```
