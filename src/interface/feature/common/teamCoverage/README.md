## 队伍覆盖率

```js

  public option: any = {
    color: ["#ffae00", "#01e3fd"],
    dataset: {
      source: [
        {
          name: "现场队伍人数",
          value: 10
        },
        {
          name: "需要队伍人数",
          value: 230
        }
      ]
    },
    series: [
      {
        name: "环形图",
        type: "pie",
        label: {
          padding: [5, -180],
          formatter(params: any) {
            const name = params.data.name;
            const value = params.data.value ? params.data.value : "--";
            return `{aa|${value}人\n${name}}`;
          },
          rich: {
            aa: {
              fontSize: 22,
              padding: [7, 0]
            }
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 180,
          lineStyle: {
            width: 2
          }
        },
        startAngle: 180,
        radius: ["50%", "60%"]
      },
      {
        z: 0,
        type: "pie",
        center: ["50%", "50%"],
        radius: ["30%", "60%"],
        data: [1],
        itemStyle: {
          color: "#071c44"
        },
        hoverAnimation: false,
        label: {
          show: false
        }
      }
    ]
  };

  <team-coverage :option="option"/>

```
