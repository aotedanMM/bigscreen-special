<script lang="js">
   /**
    *  基础业务组件
    */
export default {
    name: 'BasicSystem',
         /**
       * 获取到的数据;
       */
    props: ['value'],
    methods: {
        Fntest(i) {
             window.location.href = i;
        },
        test(t) {
            this.$emit('test', this.Fntest(t) );
        },
    },
    render() {
        return this.$scopedSlots.default({
            tagsw: this.value, // 将传过来的JSON数据再暴漏给父组件/消费组件
            test: this.test, // 将点击跳转的方法，暴漏给父组件/消费组件
        });
    },
};
</script>
