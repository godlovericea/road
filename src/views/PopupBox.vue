<template>
    <div class="roadPopUpBox">
        <h3 class="title">{{title}}</h3>
        <div class="itemsBox">
            <p>流量</p>
            <p>100</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: '学府路'
        }
    },
    props:['roadData'],
    mounted(){
        console.log(this.$props)
    },
    methods:{
        
    }
}
</script>
<style  scoped>
    .roadPopUpBox{
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .title{
        text-align: center;
        color: aliceblue;
    }
    .itemsBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

