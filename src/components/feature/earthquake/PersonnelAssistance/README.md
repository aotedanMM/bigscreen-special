
## 整体说明

通过refs 访问 echarts 的对象

## 人员密集场所

人员救助组件的demo

```js

    const personalOption = {
            tooltip: {
                trigger: 'axis',
                textStyle:{
                    fontSize:20
                }
            },
            grid: {
                top: '40',
                left: '5%',
                right: '15%',
                bottom: '3%',
                // height: '80%',
                containLabel: true
            },
            xAxis: {
                name: '(小时)',
                type: 'category',
                data: data.xdata ,
                nameTextStyle:{
                    color: '#fff',
                    fontSize: 20
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'white',
                        fontSize: 28,
                    },
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                name: '(人)',
                axisLabel: {
                    textStyle: {
                        color: 'white',
                        fontSize: 28,
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#fff',
                    },
                    show:false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#fff',

                    },
                },
                nameTextStyle: {
                    color: '#fff',
                    fontSize:20,
                },
                splitArea: {
                    show: false
                }
            },
            series: [{
                name: '救出',
                type: 'line',
                data: data.ydata1,
                color: '#ffae00',
                lineStyle: {
                    normal: {
                        width: 5,
                        color: {
                            type: 'linear',
                            colorStops: [{
                                offset: 0,
                                color: '#ffae00' // 0% 处的颜色
                            }, {
                                offset: 0.4,
                                color: '#ffae00' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: '#ffae00' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(245,128,128, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetY: 7
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffae00',
                        borderWidth: 10,
                        /*shadowColor: 'rgba(72,216,191, 0.3)',
                         shadowBlur: 100,*/
                        borderColor: '#ffae00',
                    }
                },
                smooth: true,
            },
                // {
                //     name: '救治',
                //     type: 'line',
                //     data: data.ydata2,
                //     lineStyle: {
                //         normal: {
                //             width: 5,
                //             color: {
                //                 type: 'linear',
                //                 colorStops: [{
                //                     offset: 0,
                //                     color: '#00a2ff' // 0% 处的颜色
                //                 },
                //                     {
                //                         offset: 0.4,
                //                         color: '#00a2ff' // 100% 处的颜色
                //                     }, {
                //                         offset: 1,
                //                         color: '#00a2ff' // 100% 处的颜色
                //                     }
                //                 ],
                //                 globalCoord: false // 缺省为 false
                //             },
                //             shadowColor: 'rgba(71,216,190, 0.5)',
                //             shadowBlur: 10,
                //             shadowOffsetY: 7
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#00a2ff',
                //             borderWidth: 10,
                //             /*shadowColor: 'rgba(72,216,191, 0.3)',
                //              shadowBlur: 100,*/
                //             borderColor: "#00a2ff"
                //         }
                //     },
                //     smooth: true
                // },
                {
                    name: '转移',
                    type: 'line',
                    data: data.ydata3 ,
                    lineStyle: {
                        normal: {
                            width: 5,
                            color: {
                                type: 'linear',
                                colorStops: [{
                                    offset: 0,
                                    color: '#01e1fb', // 0% 处的颜色
                                },
                                    {
                                        offset: 0.4,
                                        color: '#01e1fb', // 100% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#01e1fb', // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(249,165,137, 0.5)',
                            shadowBlur: 10,
                            shadowOffsetY: 7,
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#01e1fb',
                            borderWidth: 10,
                            /*shadowColor: 'rgba(72,216,191, 0.3)',
                             shadowBlur: 100,*/
                            borderColor: '#01e1fb',
                        }
                    },
                    smooth: true,
                }
            ]
        };
    <PersonalAssistance
        id='ddd'
        :option='personalOption'
    ></PersonalAssistance>

```
