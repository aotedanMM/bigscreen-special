
## 整体说明

通过refs 访问 echarts 的对象

## 人员密集场所

人员密集场所组件的demo

```js

    let personalOption = {
        color: ['#0187d9', '#15b873', '#cd910d', '#06c2d8'],
        dataset: {
            source: [{ name: '学校', value: 1072},
                     { name: '居民区', value: 618},
                     { name: '商场', value: 600},
                     { name: '医院', value: 12}]
        },
        series: [
            {
                type: 'pie',
                radius: ['47%', '57%'],
                label: {
                    padding: [5, -55],
                    formatter(params) {
                        const name = params.data.name;
                        const value = params.data.value;
                        return '{aa|' + value + '家' + name + '}';
                    },
                    rich: {
                        aa: {
                            fontSize: 22,
                            padding: [7, 10],
                        },
                    },
                },
                labelLine: {
                    length: 25,
                    length2: 20,
                }
            },
            {
                z: 0,
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['37%', '57%'],
                data: [1],
                itemStyle: {
                    color: '#071c44',
                },
                hoverAnimation: false,
                label: {
                    padding: 10,
                    formatter: 0 + '',
                    position: 'center',
                    color: '#00d2ff',
                    fontSize: 30,
                    borderRadius: 100,
                    backgroundColor: '#1c2a3e'
                },
            }
            ]
    };
    <PersonalCasualty
        id='ddd'
        :option='personalOption'
    ></PersonalCasualty>

```
