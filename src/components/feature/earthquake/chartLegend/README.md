
## echart图例


```vue

<template>
    <div class="container">
       <ChartLegend :originData="legend"> </ChartLegend>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                legend:{
                isShow : true,
                data: [
                    {
                        title: '一般受损',
                        iconClass: 'primary',
                    }, {
                        title: '严重受损',
                        iconClass: 'warning',
                    }, {
                        title: '房屋倒塌',
                        iconClass: 'danger',
                    }]
                }
            }
        }
    }
</script>
    
    
```
