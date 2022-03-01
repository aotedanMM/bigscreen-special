1. 引入组件
import Coordinate from '@/views/theme/decisionSupport/module/gisModel/common/coordinate/Coordinate.vue';
2. 挂载模板
@Component({
  components: {
    Coordinate,
  },
})
3. 使用标签
<Coordinate :longitude="114" :latitude="41"></Coordinate>
参数
longitude 经度 type number
latitude 纬度 type number
