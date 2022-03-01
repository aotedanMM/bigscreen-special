
## 整体说明

通过refs 访问 echarts 的对象

## 人员伤亡

人员伤亡的demo

```js

let  data = [
          {
            name: '海淀',
            value: [1, 2, 5]
          },
          {
            name: '朝阳',
            value: [3, 4, 5]
          },
          {
            name: '丰台',
            value: [2, 4, 5]
          },
          {
            name: '昌平',
            value: [2, 2, 5]
          },
          {
            name: '顺义',
            value: [2, 3, 5]
          }
        ];
  let name = ['死亡', '受伤', '失踪'];

  let option = {
      tooltip: {
        trigger: 'item',
        padding: 10,
        borderColor: '#51b9ca',
        borderWidth: 1,
        formatter: function(params) {
                        const valuesFormatter = [];
                        let str = '';
                        str += `<div class="toolBoxPersonl">${params.seriesName}</div><span style="color:${params.color}">${params.name}</span>: ${params.value}<br>`;
                        valuesFormatter.push(str);
                        return valuesFormatter;
        }
      },
      color: ['rgba(249,71,4,.9)', 'rgba(249,134,6,.9)', 'rgba(244,166,9,.9)'],
      angleAxis: {
        type: 'category',
        z: 10,
        axisLabel: {
          color: '#c1f4fa',
          fontFamily: 'Microsoft YaHei',
          fontSize: 18,
        },
        data: data.map(function(item) {
            return item.name;
        }),
      },
      polar: {
        center: ['50%', '50%'],
        radius: 150,
      },
      radiusAxis: {
        zlevel: 99,
        z: 99,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#13fae2',
            type: 'dotted',
          },
        },
        axisLabel: {
          textStyle: {
            fontSize: 20,
            color: '#13f7e0',
            fontFamily: 'Microsoft YaHei',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#4fb8c9',
            type: 'dotted',
          },
        },
        splitArea: {
          areaStyle: {
            color: 'transparent',
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map((item, index) => {
            return item.value[0];
          }),
          coordinateSystem: 'polar',
          name: name[0],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: data.map((item, index)  => {
            return item.value[1];
          }),
          coordinateSystem: 'polar',
          name: name[1],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: data.map((item, index) => {
            return item.value[2];
          }),
          coordinateSystem: 'polar',
          name: name[2],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 3,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
     
   <Casualties id='idsc' :option='option'></Casualties> 

```
