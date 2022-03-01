

## 事件信息列表

```js

  let warningInfoData = [
    {
    "num": 1806,
    "name": "暴雨事件",
    "districtcode": "440882",
    "type": "11B03"
  }, {
    "num": 853,
    "name": "高温事件",
    "districtcode": "360826",
    "type": "11B09"
  }
  ];

  function clickItemWarning(item) {
      console.log(item)
  }

  <WarningInfo :warningInfoData="warningInfoData" :clickItemWarning="clickItemWarning" ></WarningInfo>

```
