## 小弹窗
1. 引入
import PopupsDevelopment from '@/components/feature/gisModle/disasterJudgeDialog/popups/PopupsDevelopment.vue';
2. 关联
@Component({
  components: {
    LayoutHome,
    DecisionSupprotHome,
    PopupsDevelopment,
  },
})
3. 使用
`    <PopupsDevelopment
    :showPopups= true
    title="以彼之道"
    :list="[
      {
        name: '距离',
        value: '8.10km',
      },
      {
        name: '电话',
        value: '无',
      },
      {
        name: '地址',
        value: '南苑镇',
      },
    ]"
    btnText="周边分析"
    @btnEvent="extraEvent"></PopupsDevelopment>`

## 大弹窗
1. 引入
import PopupsCompany from '@/components/feature/gisModle/disasterJudgeDialog/popups/PopupsCompany.vue';
2. 关联
@Component({
  components: {
    PopupsCompany
  },
})
3. 使用
`<PopupsCompany
:popupsStatus="true"
 :data="{
             title: '企业专业信息',
        status: '未知',
        list: [
            {
                name: '单位类型',
                value: '',
            },
        ],
        biserialList: [
            [
                {
                    name: '单位类型',
                    value: '',
                },
                {
                    name: '单位类型',
                    value: '',
                },
            ],
            [
                {
                    name: '单位类型',
                    value: '',
                },
                {
                    name: '单位类型',
                    value: '',
                },
            ],
        ],
        info: [
            {
                name: '组织机构代码',
                value: '',
            },
            {
                name: '组织机构代码',
                value: '',
            },
            {
                name: '组织机构代码',
                value: '',
            },
        ],
        company: [
            {
                name: '企业工商变更',
                value: '',
            },
            {
                name: '行政处罚',
                value: '',
            },
            {
                name: '税务处罚',
                value: '',
            },
        ],
        risk: [
            {
                name: '企业安全生产风险',
                value: '',
            },
            {
                name: '经营活动舆情',
                value: '',
            },
            {
                name: '安全事故舆情',
                value: '',
            },
            {
                name: '其他负面舆情',
                value: '',
            },
        ],
 }"
></PopupsCompany>`
popupsStatus 弹窗的显示和隐藏
data 页面的所有数据
    title 标题
    