<template>
    <div class="roadPopUpBox">
        <h3 class="title">{{info.szLocationName}}</h3>
        <div class="contentBox">
            <div class="itemsBox">
                <p>方向</p>
                <p>{{info.szDirectionName}}</p>
            </div>
            <div class="itemsBox">
                <p>设备名称</p>
                <p>{{info.szDeviceName}}</p>
            </div>
            <div class="itemsBox">
                <p>设备编号</p>
                <p>{{info.szDeviceNo}}</p>
            </div>
            <div class="itemsBox">
                <p>设备IP</p>
                <p>{{info.szDeviceIP}}</p>
            </div>
            <div class="itemsBox">
                <p>起始时间</p>
                <p>{{info.start}}</p>
            </div>
            <div class="itemsBox">
                <p>截止时间</p>
                <p>{{info.end}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data(){
        return{
            title: '学府路',
            info:{}
        }
    },
    props:['roadData'],
    mounted(){
        console.log(this.$props.roadData)
        this.info = this.$props.roadData
        this.info.start = moment(this.info.timeStart).format('YYYY-MM-DD hh:mm:ss')
        this.info.end = moment(this.info.timeEnd).format('YYYY-MM-DD hh:mm:ss')
    }
}
</script>
<style  scoped>
    .roadPopUpBox{
        width: 100%;
        display: flex;
        flex-direction: column;
        /* justify-content: flex-start; */
        align-items: center;
    }
    .title{
        text-align: center;
        color: aliceblue;
    }
    .contentBox{
        width: 100%;
    }
    .itemsBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    .itemsBox p {
        margin: 5px 0;
    }
</style>

