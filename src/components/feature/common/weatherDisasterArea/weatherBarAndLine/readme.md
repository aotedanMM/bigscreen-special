# 气温和降水趋势图


```js

let id='BarAndLineContainer';
let option = {
        grid: {
            top: '20%',
            left: '6%',
            right: '6%',
            bottom: '12%',
            containLabel: false,
        },
        legend: {
          data: ['气温', '降水量'],
          top: '-2%',
          textStyle: {
            color: '#fff',
            fontSize: 18,
          },
        },
        xAxis: [
            {
              type: 'category',
              show: true,
              boundaryGap: true,
              splitLine: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#fff',
                },
              },
              axisTick: {
                show: true,
                inside: false,
                length: 5,
                lineStyle: {
                  color: '#fff',
                },
              },
              axisLabel: {
                show: true,
                margin: 5,
                color: '#fff',
                fontSize: 18,
              },
              data:['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
            },
          ],
        yAxis: [
        {
            type: 'value',
            name: '气温(℃)',
            nameGap: 20,
            nameTextStyle: {
            color: '#50c6fc',
            fontSize: 18,
            },

            splitLine: {
            show: false,
            },
            axisLine: {
            show: false,
            },
            axisTick: {
            show: false,
            },
            axisLabel: {
            show: true,
            margin: 8,
            color: '#50c6fc',
            fontSize: 18,
            },
        },
           {
            type: 'value',
            name: '降水量(mm)',
            nameGap: 20,
            nameTextStyle: {
            color: '#6dd2d4',
            fontSize: 18,
            },
            splitLine: {
            show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
            show: true,
            margin: 8,
            color: '#6dd2d4',
            fontSize: 18,
            },
        },
        ],
        series: [
            {
              name: '气温',
              type: 'line',
              yAxisIndex: 0,
              symbol: 'circle',
              symbolSize: 10,
              smooth: true,
              itemStyle: {
                  color: '#fbea4e',
              },
              label: {
                show: true,
                position: 'top',
                distance: 10,
                fontSize: 18,
                color: '#fbea4e',
              },
              data: [16, 25, 26, 22, 24, 26, 24, 18],
            },
            {
              name: '降水量',
              type: 'bar',
              yAxisIndex: 1,
              barWidth: '20px',
              itemStyle: {
                  color: '#6dd2d4',

              },
              label: {
                show: true,
                position: 'top',
                distance: 10,
                fontSize: 18,
                color: '#6dd2d4',
              },
              data: [0.3, 0.5, 0.8, 0.4, 0.7, 0.5, 0.6, 0.4],
            },
        ],
    };

 <BarAndLineCommon
            :id='id'
            :option='option'
    ></BarAndLineCommon>
```




