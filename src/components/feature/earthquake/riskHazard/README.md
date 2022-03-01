
## 整体说明

通过refs 访问 echarts 的对象

## 地灾隐患点

地灾隐患点的demo

```js

    let optionLatentDanger = {
        xAxis: {
                data: ['特大', '重大', '较大', '一般'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 28 ,
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff' ,
                    },
                }
            },
            yAxis: {
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false ,
                }
            },
            series: [{
                type: 'bar',
                data: [3, 4, 6, 8],
                barWidth: 16 ,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#81feff',
                                fontSize: 28 ,
                            },
                        },
                        color(params) {
                            const colorList = ['#8c0613', '#986d13', '#9fa30e', '#016093'];
                            return colorList[params.dataIndex];
                        }
                    }
                },
            }]
    };
    <EarthDisaster title="地灾隐患点" total="21" :option="optionLatentDanger"  id="sa1" ></EarthDisaster>

```


## 重点企业

重点企业的demo

```js

    let optionEnterprise = {
        xAxis: {
                data: ['特大', '重大', '较大', '一般'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 28 ,
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff' ,
                    },
                }
            },
            yAxis: {
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false ,
                }
            },
            series: [{
                type: 'bar',
                data: [0, 2, 4, 6],
                barWidth: 16 ,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#81feff',
                                fontSize: 28 ,
                            },
                        },
                        color(params) {
                            const colorList = ['#8c0613', '#986d13', '#9fa30e', '#016093'];
                            return colorList[params.dataIndex];
                        }
                    }
                },
            }]
    };
    <EarthDisaster title="重点企业" total="12" :option="optionEnterprise"  id="sa2" ></EarthDisaster>

```

## 重点设施

重点设施的demo

```js

    let optionEnterprise = {
        xAxis: {
                data: ['特大', '重大', '较大', '一般'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 28 ,
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff' ,
                    },
                }
            },
            yAxis: {
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false ,
                }
            },
            series: [{
                type: 'bar',
                data: [1, 2, 4, 5],
                barWidth: 16 ,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#81feff',
                                fontSize: 28 ,
                            },
                        },
                        color(params) {
                            const colorList = ['#8c0613', '#986d13', '#9fa30e', '#016093'];
                            return colorList[params.dataIndex];
                        }
                    }
                },
            }]
    };
    <EarthDisaster title="重点设施" total="12" :option="optionEnterprise"  id="sa3" ></EarthDisaster>

```