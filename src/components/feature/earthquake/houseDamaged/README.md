
## 整体说明

通过refs 访问 echarts 的对象

## 房屋损毁组件

线性echart图-demo

```js

let option  =  {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    grid: {
        top: '0%',
        left: '2%',
        bottom: '2%',
        right: '2%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        axisTick: {show: false},
        splitLine: {show: false},
    },
    yAxis: {
        type: 'category',
        axisLabel: {
            textStyle: {
                color: '#D8DFEA',
                fontSize: 20,
            },
        },
        interval: 10,
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    dataset: {
        source: [
        {parentName: '汶川县', yibansunhuai: 20, yazhongsunhuai: 10, damage: 60},
        {parentName: '茂茂县', yibansunhuai: 10, yazhongsunhuai: 30, damage: 50},
        {parentName: '安茂县', yibansunhuai: 10, yazhongsunhuai: 20, damage: 60},
        {parentName: '平武县', yibansunhuai: 20, yazhongsunhuai: 30, damage: 40},
        {parentName: '棉竹县', yibansunhuai: 20, yazhongsunhuai: 30, damage: 40},
        ],
    },
    series: [
        {
            type: 'bar',
            barWidth: '12',
            barCategoryGap: '0%',
            stack: 'a',
            name: '一般受损',
            itemStyle: {
                color: '#0d6547',
                barBorderRadius: [3, 0, 0, 3],
            },
        },
        {
            type: 'bar',
            barWidth: '10%',
            stack: 'a',
            name: '严重受损',
            itemStyle: {
                color: '#09839b',
            },
        },
        {
            type: 'bar',
            barWidth: '10%',
            stack: 'a',
            name: '房屋倒塌',
            itemStyle: {
                color: '#946d1a',
                barBorderRadius: [0, 3, 3, 0],
            },
        }],
    };

<HousesDamaged id="HousesDamagedid" :option="option"></HousesDamaged>

```


## echart图例


```js

     let legend = {
        isShow : true,
        type: 0, // 0| 1 | 2
        data: [
            {
                title: '一般受损',
                iconClass: 'primary',
            }, {
                title: '严重受损',
                iconClass: 'warning',
            }, {
                title: '房屋倒塌',
                iconClass: 'danger',
            }],
    };
     <ChartLegend :originData="legend"></ChartLegend>

```
