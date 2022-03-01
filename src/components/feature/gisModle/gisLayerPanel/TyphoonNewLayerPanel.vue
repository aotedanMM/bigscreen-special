<template>
  <!-- 新图层图例 -->
  <div class="layer_legend">
    <div class="layer_title">台风</div>
    <div class="layer_content">
      <el-scrollbar style="height: 300px">
        <div v-for="(item, key) in typhoonData" :key="key">
          <div class="title">{{ item.title }}</div>
          <ul>
            <li v-for="(text, key1) in item.list" :key="key1">
              <span v-if="key === 1" class="circle" :style="'border: 1px solid #fff; background: ' + colorList[key][key1]"></span>
              <span v-else class="circle" :style="'height: 0; border: 1px dashed ' +   colorList[key][key1]"></span>
              <!-- <span class="circle" :style="addRandomColor()"></span> -->
              {{ text }}
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({
  name: 'TyphoonNewLayerPanel',
  components: {},
})
export default class TyphoonNewLayerPanel extends Vue {
  private typhoonData: any = [
    {
      title: '预报机构',
      list: ['中国', '中国香港', '美国', '日本'],
    },
    {
      title: '等级',
      list: ['常态气压', '热带低压', '热带风暴', '强热带风暴', '台风', '强台风', '超强台风'],
    },
  ];
  private colorList: any = [
    ['#72d4e5', '#d991b3', '#e7cf1d', '#e719ec'],
    ['#000000', '#02FF02', '#39C7CF', '#FBF9CC', '#FFDE75', '#FF8515', '#FF5252'],
  ];

  private cityLegendDict: any = {
    中国: {
      rgb: '#FF0000',
      display: 1,
    },
    中国香港: {
      rgb: '#FFA500',
      display: 1,
    },
    中国台湾: {
      rgb: '#FFFF00',
      display: 0,
    },
    日本: {
      rgb: '#00FF00',
      display: 1,
    },
    美国: {
      rgb: '#0000FF',
      display: 1,
    },
    韩国: {
      rgb: '#B97A57',
      display: 0,
    },
    南海: {
      rgb: '#800080',
      display: 0,
    },
    浙江: {
      rgb: '#FFC0CB',
      display: 0,
    },
    菲律宾: {
      rgb: '#22B14C',
      display: 0,
    },
    广东: {
      rgb: '#4B0082',
      display: 0,
    },
    欧洲: {
      rgb: '#B5E61D',
      display: 0,
    },
  };

  private created() {
    const keys: any = [];
    const values: any = [];
    for (const item in this.cityLegendDict) {
      if (this.cityLegendDict[item].display === 1) {
        keys.push(item);
        values.push(this.cityLegendDict[item].rgb);
      }
    }

    this.typhoonData[0].list = keys;
    this.colorList[0] = values;
  }
}
</script>

<style lang="less" scoped>
@imgPath: "../../../../assets/img/gisModule/legendPlanel";
.layer_legend {
  box-sizing: border-box;
  padding: 25px 15px 20px 35px;
  .circle {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    background: #7fee1d;
    -moz-border-radius: 60px;
    -webkit-border-radius: 60px;
    border-radius: 60px;
  }
  .layer_title {
    font-size: 26px;
    color: #00e4fe;
  }
  .layer_content {
    .title {
      color: #b6d1dd;
      font-size: 22px;
      margin: 4px 0;
    }
    ul {
      li {
        padding-left: 10px;
        color: #e2f4ff;
        font-size: 20px;
        line-height: 30px;
        height: 29px;
        display: flex;
        justify-content: left;
        align-items: center;
      }
    }
  }
}
</style>
