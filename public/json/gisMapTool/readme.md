# 配置文件详解

## 配置文件名
  json 的名字是有规则的，不可以任意的起名。
  json的名字要和  public\json\eventConfigJson 文件夹中的json文件相关联。
  如果不需要 不要这样屏蔽 会出现空白按钮  可以放下面保存 下次粘贴
  {
      "//iconName": "gisMapTool-PeripheralQuery",
      "//title": "周边查询",
      "//key": "PeripheralQuery",
      "//mutexkey": [
          "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
          "commonTools.realTimePlotting,mapPrint"
      ]
  }
## 配置文件字段解读  

[
    {
        "iconName": "gisMapTool-celiang", 图标名称
        "title": "测量工具", 鼠标划上提示的名称
        "key": "measuringTools", 唯一key
        "list": [{ 二级菜单
                "iconName": "gisMapTool-celiang-area",
                "title": "测量面积",
                "key": "measureArea",
                "mutexkey": [ 互斥字段
                    "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
                    "commonTools.realTimePlotting,mapPrint,updateExperienceCircle"
                ]
            },
            {
                "iconName": "gisMapTool-celiang-dis",
                "title": "测量距离",
                "key": "measureline",
                "mutexkey": [
                    "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
                    "commonTools.realTimePlotting,mapPrint,updateExperienceCircle"
                ]
            },
            {
                "iconName": "gisMapTool-celiang-height",
                "title": "测量高度",
                "key": "measureHeight",
                "mutexkey": [
                    "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
                    "commonTools.realTimePlotting,mapPrint,updateExperienceCircle"
                ]
            },
            {
                "iconName": "gisMapTool-celiang-slope",
                "title": "测量坡度",
                "key": "measureSlope",
                "mutexkey": [
                    "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
                    "commonTools.realTimePlotting,mapPrint,updateExperienceCircle"
                ]
            }
        ]
    }
]



## 暂时隐藏的按钮
{
    "iconName": "gisMapTool-PeripheralQuery",
    "title": "周边查询",
    "key": "PeripheralQuery",
    "mutexkey": [
      "ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock",
      "commonTools.realTimePlotting,mapPrint"
    ]
}
