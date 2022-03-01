

## 事件信息列表

```js

  let eventInfoData = [
    {
    "id": "daf5cf584f194c0f88ab4d0b2e6380fb",
    "title": "台湾花莲县发生4.1级地震初步报告",
    "eventType": "地震灾害",
    "reportTime": "2019-08-03 06:27:37",
    "location": "台湾省台湾省[]",
    "longitude": "121.508903",
    "latitude": "25.044319",
    "eventDesc": "台湾花莲县发生4.1级地震初步报告"
    }, {
    "id": "ca28d59d20fa46878fe7bab2fdd568bf",
    "title": "续报（三）：孝感市发生一起火灾事故，无人员伤亡",
    "eventType": "火灾事故",
    "reportTime": "2019-08-04 01:43:09",
    "location": "湖北省孝感市孝南区",
    "longitude": "113.916902",
    "latitude": "30.924568",
    "eventDesc": "续报（三）：孝感市发生一起火灾事故，无人员伤亡"
  }
  ];

  function clickPerItemData(item) {
      console.log(item)
  }

  <EventInfo :eventInfoData='eventInfoData' :clickPerItemData='clickPerItemData'
  ></EventInfo>

```
