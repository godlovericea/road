<template>
    <div id="map">
        <div class="headerBox">
            <img src="../../src/assets/images/logo.png" alt="">
            <p class="title">江苏省5G产业联盟产业生态图</p>
        </div>
        <div class="switchBox">
            <span class="switchTitle">卫星影像</span><el-switch v-model="switchMap" active-color="#13ce66" inactive-color="#ff4949" @change="setMapTheme"></el-switch>
        </div>
        <div class="bottomBox">
            <div v-for="item in navBarList" :key="item.id" :class="[isClick === item.id ? 'activeitemsNav' : 'itemsNav']" @click="getPrivinceData(item.id)">
                <i :class="item.icon"></i>
                <p class="name">{{item.name}}</p>
            </div>
            <div>
                <el-button size="small" @click="goLogin" v-if="!comName" type="primary" round>登录</el-button>
                <span class="bottomNmae" v-if="comName">{{comName}}</span>
            </div>
        </div>
        <div class="leftBox">
            <div class="leftItemsBox">
                <div class="leftheaderBox">
                    <p class="headerTitle">企业数量</p>
                </div>
                <div class="etitle">总数:{{amount}}家</div>
                <div id="outputValue"></div>
            </div>
            <div class="leftItemsBox">
                <div class="leftheaderBox">
                    <p class="headerTitle">产业规模</p>
                </div>
                <div class="etitle">总产值：{{totalValue}}亿元</div>
                <div id="modelll"></div>
            </div>
        </div>
        <div class="rightBox">
            <el-input v-model="search" placeholder="请输入企业名称或项目名称">
                <el-button slot="append" icon="el-icon-search" @click="getSearchResult"></el-button>
            </el-input>
            <div style="height:20px"></div>
            <div class="leftheaderBox">
                <p class="headerTitle">产业链分布</p>
            </div>
            <div class="content">
                <div class="btnGroups">
                    <md-tabs @md-changed="getScenList" md-alignment="fixed">
                        <md-tab class="movies" id="1" md-label="产品">
                            <div class="cardBox" v-for="(item,index) in productList" :key="index">
                                <div class="cardContent">
                                    <p class="cardTitle">{{item.productName}}</p>
                                    <p class="cardDetail">{{item.productIntroduce}}</p>
                                    <el-button type="text" style="color:'#ffffff';text-align: right;" @click="showProductDetail(item)">查看更多>></el-button>
                                </div>
                            </div>
                        </md-tab>

                        <md-tab id="2" class="movies" md-label="项目">
                            <div class="cardBox" v-for="(item,index) in projectList" :key="index">
                                <div v-if="!adminFlag">
                                    <div class="cardContent" v-if="item.isEncryption === 0">
                                        <p class="cardTitle">{{item.projectName}}</p>
                                        <p class="cardDetail">{{item.projectIntroduce}}</p>
                                        <el-button type="text" style="color:'#ffffff';text-align: right;" @click="showProjectDetail(item)">查看更多>></el-button>
                                    </div>
                                    <div class="cardContent" v-if="item.isEncryption === 1">
                                        <p class="cardTitle">{{item.projectName}}</p>
                                        <p class="cardDetail">加密：{{item.encryptionCode}}</p>
                                    </div>
                                </div>
                                <div v-if="adminFlag">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.projectName}}</p>
                                        <p class="cardDetail">{{item.projectIntroduce}}</p>
                                        <el-button type="text" style="color:'#ffffff';text-align: right;" @click="showProjectDetail(item)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>
                        <md-tab id="3" class="movies" md-label="需求">
                            <div class="cardBox" v-for="(item,index) in needList" :key="index">
                                <div v-if="!adminFlag">
                                    <div class="cardContent" v-if="item.isEncryption === 0">
                                        <p class="cardTitle">{{item.demandName}}</p>
                                        <p class="cardDetail">{{item.demandInfo}}</p>
                                        <el-button type="text" style="color:'#ffffff';text-align: right;" @click="showProjectDetail(item)">查看更多>></el-button>
                                    </div>
                                    <div class="cardContent" v-if="item.isEncryption === 1">
                                        <p class="cardTitle">{{item.demandName}}</p>
                                        <p class="cardDetail">加密：{{item.encryptionCode}}</p>
                                    </div>
                                </div>
                                <div v-if="adminFlag">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.demandName}}</p>
                                        <p class="cardDetail">{{item.demandIndo}}</p>
                                        <el-button type="text" style="color:'#ffffff';text-align: right;" @click="showNeedDetail(item)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>
                    </md-tabs>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="用户管理" name="1">产品</el-tab-pane>
                        <el-tab-pane label="配置管理" name="2">项目</el-tab-pane>
                        <el-tab-pane label="角色管理" name="3">需求</el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="sceanFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{sceanData.title}}</p>
                <i class="el-icon-close" @click="closeDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="sceanBox">
                <p class="stepsTitle">① 描述:</p>
                <div class="stepsContent">
                    <p class="stepsDetail">{{sceanData.info}}</p>
                </div>
                <p class="stepsTitle">② 图片和视频介绍:</p>
                <div class="stepsContent">
                    <!-- <img class="shortcut" v-for="(item,index) in companySceneImgDTOList" :key="index" :src="item.scenarioImg" alt=""> -->
                    <el-image 
                        style="width: 200px; height: 120px"
                        :src="url"
                        :preview-src-list="srcList">
                    </el-image>
                    <!-- <el-carousel :interval="4000">
                        <el-carousel-item v-for="(item,index) in companySceneImgDTOList" :key="index">
                            <el-popover placement="top" trigger="click">
                                <img class="realImg" :src="item.scenarioImg" alt="">
                                <img class="shortcut" slot="reference" :src="item.scenarioImg" alt="">
                            </el-popover>
                        </el-carousel-item>
                    </el-carousel> -->
                    <!-- <video class="myVideo" :src="videoUrl" controls></video> -->
                </div>
                <p class="stepsTitle">③ 视频介绍:</p>
                <div class="stepsContent">
                    <video class="myVideo" :src="videoUrl" controls></video>
                </div>
                <!-- <p class="stepsTitle">④ 关联企业:</p>
                <div class="stepsContent">
                    <div class="sceanEnterBox">
                        <div class="sceanEnterItems" v-for="item in officeList" :key="item.index" @click="showInMapbox(item.companyName)">
                            <p class="enterName">{{item.companyName}}</p>
                            <p class="enterP">项目:{{item.business}}</p>
                            <p class="enterP">注册资金:{{item.registeredCapital}}万元</p>
                            <p class="enterP">地址:{{item.area}}</p>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="enterpriseFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{parkName}}</p>
                <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="enterpriseBox">
                <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 200px;" :stretch="false" @tab-click="handleTabClick">
                    <el-tab-pane  v-for="(item,index) in enterpriseList" :key="index" :label="item.comName">
                        <div class="enterpriseDetail">
                            <!-- <singleEcharts :id="item.company"></singleEcharts> -->
                            <div class="detailBox">
                                <p>主营：{{item.business}}</p>
                                <p>2019收入：{{item.income}}万元</p>
                                <p>产品：{{item.product}}</p>
                                <p>预期效果：{{item.hopelis}}</p>
                            </div>
                        </div>
                       <div class="tagBox">
                            <p class="qichachaTitle">公司基本信息（以下数据来源于企查查）</p>
                            <div class="taglist">
                                <p class="tagTitle">主要职员：</p>
                                <div v-for="(item,index) in Employees" :key="index" class="tagCintent">
                                    <p>
                                        <span>{{item.Name}}</span>
                                        <span class="secondSpan">{{item.Job}}</span>
                                    </p>
                                </div>
                                <p class="tagTitle">产品信息：</p>
                                <div v-for="(item,index) in CompanyProducts" :key="index" class="tagCintent">
                                    <p>所属领域:<span class="secondSpan">{{item.Domain}}</span></p> 
                                    <p>商标图片:<a :href="item.ImageUrl" target="_blank" style="color:#fff;margin-left:10px">{{item.ImageUrl}}</a></p>
                                    <p>商标名称:<span class="secondSpan">{{item.Name}}</span></p>
                                    <p>官网地址:<a :href="item.Link" target="_blank" style="color:#fff;margin-left:10px">{{item.Link}}</a></p>
                                    <p>产品标签:<span class="secondSpan">{{item.Tags}}</span></p>
                                </div>
                                <p class="tagTitle">知识产权：</p>
                                <div class="tagCintent">
                                    <p>专利数量：{{knowledge}}</p>
                                </div>
                                <p class="tagTitle">产业信息：</p>
                                <div class="tagCintent">
                                    <p>产业范围：{{Industry.Industry}}</p>
                                </div>
                                <p class="tagTitle">股东信息：</p>
                                <div v-for="item in Partners" :key="item.KeyNo" class="tagCintent">
                                    <span>{{item.StockName}}</span>
                                    <span class="secondSpan">{{item.StockPercent}}</span>
                                </div>
                                <p class="tagTitle">主营业务：</p>
                                <div class="tagCintent">
                                    <p>{{ScopeIn}}</p>
                                </div>
                                <p class="tagTitle">联系方式：</p>
                                <div class="tagCintent">
                                    <p>地址：<span class="secondSpan">{{ContactInfo.adress}}</span></p>
                                    <!-- <p>电话：<span class="secondSpan">{{ContactInfo.PhoneNumber}}</span></p> -->
                                </div>
                            </div>
                       </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="searchFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{searchEnterprise}}</p>
                <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="enterpriseBox">
                <el-tabs :tab-position="tabPosition" :stretch="false">
                    <el-tab-pane  :label="enterpriseName">
                        <div class="enterpriseDetail">
                            <singleEcharts :id="enterpriseName"></singleEcharts>
                            <div class="detailBox">
                                <!-- <p>法人：{{enterprise.legalPerson}}</p> -->
                                <p>主营：{{enterprise.business}}</p>
                                <p>2019收入：{{enterprise.income}}</p>
                                <p>产品：{{enterprise.product}}</p>
                                <p>预期效果：{{enterprise.hopelis}}</p>
                            </div>
                        </div>
                       <div class="tagBox">
                            <el-tag effect="dark" type="warning" closable v-for="(item,index) in elementsList" :key="index">{{item}}</el-tag>
                       </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div>
                为优化体验效果，请点击下载<a target="_blank" href="https://www.google.cn/chrome/">chrome浏览器</a>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="查看图片"
            :visible.sync="imgDialogVisible"
            width="50%"
            center>
            <el-image 
                style="width: 100px; height: 100px"
                :src="url" 
                :preview-src-list="srcList">
            </el-image>
            <el-carousel :interval="4000">
                <el-carousel-item v-for="(item,index) in companySceneImgDTOList" :key="index">
                    <img class="realImg" :src="item.scenarioImg" alt="">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
// 万里
import mapboxgl from 'mapbox-gl'
import parkList from '../jsonFile/汇总.json'
import algorithm from '../assets/distributeFile/算法.json'
import idCard from '../assets/distributeFile/芯片.json'
import model from '../assets/distributeFile/模块.json'
import system from '../assets/distributeFile/系统.json'
import network from '../assets/distributeFile/网络.json'
import platform from '../assets/distributeFile/平台.json'
import terminal from '../assets/distributeFile/终端.json'
import smartGov from '../assets/distributeFile/智慧政务.json'
import echarts from 'echarts'
import singleEcharts from '../components/singleEcharts'
import axios from 'axios'
import enterpriseAll from '../fiveData/enterpriseAll.json'
import enterprise from '../fiveData/enterprise.json'
import jiangsusheng from '../cityJson/江苏省.json'
import nanjingDis from '../cityJson/南京市.json'
import {listBaseInfoByStream,listProductByStream,getCompanyDemand,getCompanyProject,getProduct,getScale} from '@/api/home'

export default {
    data(){
        return{
            centerDialogVisible:false,
            map:'',//地图实例
            switchMap:false,
            navBarList:[
                {
                    id:1,
                    name:'上游产业链',
                    icon:'iconfont icon-wangluo'
                },
                {
                    id:2,
                    name:'中游产业链',
                    icon:'iconfont icon-xinpian'
                },
                {
                    id:3,
                    name:'下游产业链',
                    icon:'iconfont icon-modular'
                },
                {
                    id:4,
                    name:'全部',
                    icon:'iconfont icon-quanbu'
                },

            ],// 底部导航栏菜单
            isClick:4,// 默认选择全部
            search:'',//搜索框输入内容
            scean:1,//场景,
            sceanList:[],
            sceanFlag:false,
            sceanData:{},
            enterpriseFlag:false,
            tabPosition:"left",
            markers:{},
            markersOnScreen:{},
            colors:['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'],
            marker:'',
            enterpriseList:[],
            parkName:'',
            activeIndex:0,
            radar:'',
            radarFlag:false,
            elementsList:['算法','芯片', '终端', '系统', '平台'],
            searchReault:{
                type: "FeatureCollection",
                crs: {
                    type: "name",
                    properties: {
                        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                },
                features:[

                ]
            },
            cityList:[
                {
                    id:1,
                    city:'南京市',
                    coordinates: [118.796539,32.058441]
                },
                {
                    id:2,
                    city:'无锡市',
                    coordinates: [ 120.312332,31.491756]
                },
                {
                    id:3,
                    city:'徐州市',
                    coordinates: [117.284042, 34.206741]
                },
                {
                    id:4,
                    city:'常州市',
                    coordinates: [119.59794,31.72322]
                },
                {
                    id:5,
                    city:'苏州市',
                    coordinates: [120.585297,31.29904]
                },
                {
                    id:6,
                    city:'南通市',
                    coordinates: [120.894287,31.98078]
                },
                {
                    id:7,
                    city:'连云港市',
                    coordinates: [119.1773,34.84065]
                },
                {
                    id:8,
                    city:'淮安市',
                    coordinates: [119.021263,33.597507]
                },
                {
                    id:9,
                    city:'盐城市',
                    coordinates: [120.50102,33.20107]
                },
                {
                    id:10,
                    city:'扬州市',
                    coordinates: [119.43157,32.39463]
                },
                {
                    id:11,
                    city:'镇江市',
                    coordinates: [119.43396,32.13188]
                },
                {
                    id:12,
                    city:'泰州市',
                    coordinates: [119.922981,32.45615]
                },
                {
                    id:13,
                    city:'宿迁市',
                    coordinates: [118.241703,33.964418]
                }
            ],
            searchFlag:false,
            searchEnterprise:'',
            enterprise:{},
            officeList:[],
            totalValue:581.95,
            amount:0,
            activeName:'first',
            CompanyProducts:[],
            Employees:[],
            detail:{},
            Industry:{},
            Partners:[],
            ScopeIn:'',
            knowledge:0,
            legalPerson:'',
            ContactInfo:{},
            companySceneImgDTOList:[],
            videoUrl:'',
            imgTitle:'',
            imgDialogVisible:false,
            url:'',
            srcList:[],
            newSceanListArr:[],
            productList:[],
            projectList:[],
            needList:[],
            marker:'',
            markersList:[],
            signmarker:'',
            dataValue:{},
            loginFlag:false,
            adminFlag:false,
            comName:'',
            oldActiveTab:1,
            newActiveTab:0
        }
    },
    components:{
        singleEcharts
    },
    watch:{
        oldActiveTab(newVal,oldVal){
            // console.log(newVal + "new")
            // console.log(oldVal + "old")
            this.newActiveTab = newVal
            this.getScenList(this.newActiveTab)
        }
    },
    mounted(){
        this.checkBrowserVersion()
        this.initMap()
        this.getEchartsData()
        this.checkLogin()
    },
    methods:{
        checkBrowserVersion(){
            var browser=navigator.appName
            var b_version=navigator.appVersion
            var version=parseFloat(b_version)
            if(browser === 'Netscape' && version < 5){
                // alert("请下载最新版浏览器")
                window.location.href="https://www.google.cn/chrome/"
                return false
            }
            // var Sys = {};
            // var ua = navigator.userAgent.toLowerCase();
            // var s;
            // (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            // (s = ua.match(/firefox/([\d.]+)/)) ? Sys.firefox = s[1] :
            // (s = ua.match(/chrome/([\d.]+)/)) ? Sys.chrome = s[1] :
            // (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            // (s = ua.match(/version/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            // /以下进行测试/
            // if (Sys.ie) {
            //     this.centerDialogVisible = true
            // };
            // if (Sys.firefox) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.chrome) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.opera) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.safari) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.ie == 9.0 || Sys.ie == 8.0 || Sys.ie == 7.0 || Sys.ie == 7.0){
            //     window.location.href="https://www.google.cn/chrome/"
            // }
            // var Sys = {};  
            // var ua = navigator.userAgent.toLowerCase();  
            // var s;  
            // (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :  
            // (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :  
            // (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :  
            // (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :  
            // (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;  
            // /*以下进行测试*/  
            // if (Sys.ie) this.centerDialogVisible = true;  
            // if (Sys.firefox) this.centerDialogVisible = false;  
            // if (Sys.chrome) this.centerDialogVisible = false;  
            // if (Sys.opera) this.centerDialogVisible = false;  
            // if (Sys.safari) this.centerDialogVisible = false;  
        
            // if (Sys.ie == 9.0 || Sys.ie == 8.0 || Sys.ie == 7.0 || Sys.ie == 6.0){
            //     window.location.href="https://www.google.cn/chrome/"
            // }
        },
        checkLogin(){
            if(!sessionStorage.getItem("user")){
                this.adminFlag = false
            }else{
                this.adminFlag = JSON.parse(sessionStorage.getItem("user")).isAdmin === 1 ? true :false
                this.comName = JSON.parse(sessionStorage.getItem("user")).comName
            }
        },
        initMap(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoibnl5anl5YW5mYXBlbmciLCJhIjoiY2p3ajU4eXI2MGdxcDQ4cGI4cHI2bHhjcSJ9.m4FzyOH_5Yo3YVnroLxk-w';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'http://106.15.47.224:8688/styles/newblue/style.json',
                center: [119.8526,32.910144],
                zoom: 7.5,
                pitch:60,
                bearing:-0.03
            })
            // this.map.getSource('earthquakes').setData(enterpriseAll)
            this.map.on("styledata", ()=>{
                this.getPrivinceData(4);
                this.getQixiaDistribute();
                
            })
        },
        getEchartsData(){
            getScale()
            .then(res=>{
                this.dataValue = res.data.result
                this.getEnterpriseMode()
                this.getOutputValue()
                this.totalValue = (this.dataValue.downstreamValueSum + this.dataValue.midstreamValueSum + this.dataValue.upstreamValueSum)/10000
                this.amount = this.dataValue.downstreamCount + this.dataValue.midstreamCount + this.dataValue.upstreamCount
            })
        },
        getPrivinceData(id){
            this.isClick = id
            let myData = {
                type:id
            }
            console.log(myData)
            listBaseInfoByStream(myData)
            .then(res=>{
                if(res.data.code === 200){
                    this.searchReault.features = res.data.result
                    var mag1 = ["<", ["get", "mag"], 5];
                    var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
                    var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
                    var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
                    var mag5 = [">=", ["get", "mag"], 40];

                    if (!this.map.getSource('earthquakes')){
                        this.map.addSource('earthquakes', {
                            "type": "geojson",
                            "data": this.searchReault,
                            "cluster": false,
                            "clusterRadius": 80,
                            "clusterProperties": { // keep separate counts for each magnitude category in a cluster
                                "mag1": ["+", ["case", mag1, 1, 0]],
                                "mag2": ["+", ["case", mag2, 1, 0]],
                                "mag3": ["+", ["case", mag3, 1, 0]],
                                "mag4": ["+", ["case", mag4, 1, 0]],
                                "mag5": ["+", ["case", mag5, 1, 0]]
                            }
                        });
                    }else{
                        this.map.getSource('earthquakes').setData(this.searchReault)
                    }

                    if (!this.map.getLayer('earthquake_circle')){
                        this.map.addLayer({
                            "id": "earthquake_circle",
                            "type": "circle",
                            "source": "earthquakes",
                            "filter": ["!=", "cluster", true],
                            "paint": {
                                "circle-color": ["case",
                                mag1, this.colors[0],
                                mag2, this.colors[1],
                                mag3, this.colors[2],
                                mag4, this.colors[3], this.colors[4]],
                                "circle-opacity": 0.6,
                                "circle-radius": 20
                            }
                        });
                    }

                    if (!this.map.getLayer('earthquake_label')){
                        this.map.addLayer({
                            "id": "earthquake_label",
                            "type": "symbol",
                            "source": "earthquakes",
                            "cluster": false,
                            // "filter": ["!=", "cluster", true],
                            
                            "layout": {
                                "text-field": ["number-format", ["get", "mag"], {"min-fraction-digits": 0, "max-fraction-digits": 1}],
                                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                                "text-size": 18,
                                "text-allow-overlap":true
                            },
                            "paint": {
                                // "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
                                "text-color": "white"
                            }
                        });
                    }
                    // console.log("data没有进来了")
                    this.map.on('data', (e)=> {
                        this.map.on('click','earthquake_label',this.handleMarkerClick);
                    });
                    
                    this.getScenList(this.activeTab)
                }
            })
        },
        // 获取雷达图
        getRadarEnterprise(){
            let myChart=echarts.init(document.getElementById('enterprise'))
            let option = {
                // title: {
                //     text: '基础雷达图'
                // },
                tooltip: {},
                // legend: {
                //     data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                // },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            // backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '算法', max: 36500},
                        { name: '芯片', max: 16000},
                        { name: '模块', max: 30000},
                        { name: '终端', max: 38000},
                        { name: '系统', max: 52000},
                        { name: '网络', max: 25000},
                        { name: '平台', max: 25000}
                    ],
                    splitArea: {
                        areaStyle: {
                            color: ['#101B26'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10,
                            
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    }
                },
                series: [{
                    name: '从业人数',
                    type: 'radar',
                    areaStyle: {normal: {
                        color: "#1087F6", // 图表中各个图区域的颜色
                        areaStyle: {
                            type: 'default',
                            opacity: 0.8, // 图表中各个图区域的透明度
                            color: "#ff0000" // 图表中各个图区域的颜色
                        }
                    }},
                    data : [
                        {
                            value : [14300, 10000, 28000, 35000, 50000, 19000, 5200],
                            name : '从业人数',
                            itemStyle:{
                                normal:{
                                    color: "#1087F6", // 图表中各个图区域的颜色
                                }
                                
                            }
                        }
                    ]
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        // 获取柱状图
        getEnterpriseMode(){
            let myChart=echarts.init(document.getElementById('modelll'))
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '15%',
                    right: '3%',
                    left: '10%',
                    bottom: '20%'
                },
                xAxis: [{
                    type: 'category',
                    data:['上游','中游','下游'],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#e2e9ff',
                        textStyle: {
                            fontSize: 14
                        },
                    },
                }],
                yAxis: [{
                    type:'value',
                    name:'数量',
                    nameTextStyle:{
                        color:'#fff',
                    },
                    splitNumber:5,
                    axisLabel: {
                        formatter:'{value}',
                        color: '#e2e9ff',
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                }
                ],
                series: [{
                    type: 'bar',
                    barWidth: '20px',
                    data: [{
                        name:'上游产业链',
                        value:200,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(242,241,110,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(242,241,110,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(242,241,110,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'中游产业链',
                        value:50,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(242,183,101,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(242,183,101,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(242,183,101,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'下游产业链',
                        value:260,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0,219,177,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(0,219,177,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(0,219,177,1)',
                                shadowBlur: 4,
                            }
                        }
                    }],
                }]
            };
            option.series[0].data[0].value = this.dataValue.upstreamValueSum
            option.series[0].data[1].value = this.dataValue.midstreamValueSum
            option.series[0].data[2].value = this.dataValue.downstreamValueSum
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        // 获取产值饼图
        getOutputValue(){
            let myChart=echarts.init(document.getElementById('outputValue'))

            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    // x: 'right',
                    right:30,
                    top:10,
                    data:['上游','中游','下游'],
                    textStyle:{
                        color:'#ffffff'
                    },

                },
                series: [
                    {
                        name:'数量',
                        type:'pie',
                        center:['40%','50%'],
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:348, name:'上游',itemStyle:{
                                color:'#F2F16E'
                            }},
                            {value:135, name:'中游',itemStyle:{
                                color:'#CC496D'
                            }},
                            {value:348, name:'下游',itemStyle:{
                                color:'#1679D4'
                            }}
                        ]
                    }
                ]
            }
            option.series[0].data[0].value = this.dataValue.upstreamCount
            option.series[0].data[1].value = this.dataValue.midstreamCount
            option.series[0].data[2].value = this.dataValue.downstreamCount
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        getSearchResult(){
            if(!this.search){
                this.map.getSource('earthquakes').setData(parkList)
            }
            // this.enterpriseFlag = true
            parkList.features.forEach(el=>{
                el.properties.test.forEach(l=>{
                    if(l.enterpriseName.indexOf(this.search)){
                        this.searchReault.features[0].properties.test.push(l)
                        this.searchReault.features[0].geometry.coordinates = el.geometry.coordinates
                    }
                })
            })
            this.map.getSource('earthquakes').setData(this.searchReault)
            // this.searchEnterprise = this.searchReault.features[0].properties.test[0].enterpriseName
            // console.log(this.searchReault.features[0].properties)
        },
        // 点击场景设置图层数据
        clusterMapDis(name){
            
            // this.map.getSource('earthquakes').setData(smartGov)
            this.newSceanListArr.forEach(l=>{
                if(l.properties.id === name){
                    this.map.flyTo({
                        center:l.geometry.coordinates,
                        zoom: 15
                    })
                }
            })
            
            
            // this.handleAnimateCircle()
        },
        closeDialog(){
            this.sceanFlag = false
            this.sceanData = {}
        },
        closeEnterpriseDialog(){
            this.enterpriseFlag = false
        },
        getSomeOneRadarEnterprise(){
            let myChart=echarts.init(document.getElementById(this.radar))
            let option = {
                // title: {
                //     text: '南邮研究院',
                //     textStyle:{
                //         color:'#ffffff'
                //     }
                // },
                tooltip: {},
                // legend: {
                //     data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                // },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            // backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '算法', max: 6500},
                        { name: '芯片', max: 16000},
                        { name: '模块', max: 30000},
                        { name: '终端', max: 38000},
                        { name: '系统', max: 52000},
                        { name: '网络', max: 25000},
                        { name: '平台', max: 25000}
                    ],
                    splitArea: {
                        areaStyle: {
                            color: ['#114474'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10,
                            
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    }
                },
                series: [{
                    name: '预算 vs 开销（Budget vs spending）',
                    type: 'radar',
                    areaStyle: {normal: {
                        color: "#1087F6", // 图表中各个图区域的颜色
                        areaStyle: {
                            type: 'default',
                            opacity: 0.8, // 图表中各个图区域的透明度
                            color: "#ff0000" // 图表中各个图区域的颜色
                        }
                    }},
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000, 5200],
                            name : '预算分配（Allocated Budget）',
                            itemStyle:{
                                normal:{
                                    color: "#1087F6", // 图表中各个图区域的颜色
                                }
                                
                            }
                        }
                    ]
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        getAllDistribute(){
            var mag1 = ["<", ["get", "mag"], 5];
            var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
            var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
            var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
            var mag5 = [">=", ["get", "mag"], 40];

            if (!this.map.getSource('earthquakes')){
                this.map.addSource('earthquakes', {
                    "type": "geojson",
                    "data": enterpriseAll,
                    "cluster": false,
                    "clusterRadius": 80,
                    "clusterProperties": { // keep separate counts for each magnitude category in a cluster
                        "mag1": ["+", ["case", mag1, 1, 0]],
                        "mag2": ["+", ["case", mag2, 1, 0]],
                        "mag3": ["+", ["case", mag3, 1, 0]],
                        "mag4": ["+", ["case", mag4, 1, 0]],
                        "mag5": ["+", ["case", mag5, 1, 0]]
                    }
                });
            }

            if (!this.map.getLayer('earthquake_circle')){
                this.map.addLayer({
                    "id": "earthquake_circle",
                    "type": "circle",
                    "source": "earthquakes",
                    "filter": ["!=", "cluster", true],
                    "paint": {
                        "circle-color": ["case",
                        mag1, this.colors[0],
                        mag2, this.colors[1],
                        mag3, this.colors[2],
                        mag4, this.colors[3], this.colors[4]],
                        "circle-opacity": 0.6,
                        "circle-radius": 20
                    }
                });
            }

            if (!this.map.getLayer('earthquake_label')){
                this.map.addLayer({
                    "id": "earthquake_label",
                    "type": "symbol",
                    "source": "earthquakes",
                    "cluster": false,
                    // "filter": ["!=", "cluster", true],
                    
                    "layout": {
                        "text-field": ["number-format", ["get", "mag"], {"min-fraction-digits": 0, "max-fraction-digits": 1}],
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-size": 18,
                        "text-allow-overlap":true
                    },
                    "paint": {
                        // "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
                        "text-color": "white"
                    }
                });
            }
            // console.log("data没有进来了")
            this.map.on('data', (e)=> {
                // console.log("data进来了")
                // console.log(e)
                if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) {
                    return;
                }
                this.map.on('click','earthquake_label',this.handleMarkerClick);
            });
        },
        handleMarkerClick(e){
            // console.log(e);
           
            this.enterpriseFlag = true
            
            const features = this.map.queryRenderedFeatures(e.point,  { layers: ['earthquake_label'] });
            // console.log(features);
            this.parkName = features[0].properties.id
            if (features.length > 0){
                const enterList = JSON.parse(features[0].properties.comList)
                // console.log(enterList)
                // this.enterpriseList = JSON.parse(features[0].properties.test)
                this.enterpriseList = enterList
            }
        },
        handleTabClick(tab,event){
            this.getQichachaData(tab.label)
        },
        getQixiaDistribute(){
            const dottedLine = jiangsusheng
            // console.log("123")
            if(!this.map.getSource('dottedlines_label')){
                this.map.addSource('dottedlines_label',jiangsusheng);
                // this.map.addSource('dottedlines_label_nj',nanjingDis);
            }else{
                return false
            }
            
            // console.log("456")
            // if (!this.map.getLayer('qixiaDis')){
                this.map.addLayer({
                    'id': 'qixiaDis',
                    'type': 'fill',
                    'source':'dottedlines_label',
                    'paint': {
                        "fill-color":"#ffffff",
                        "fill-opacity":0.05,
                    }
                });
                this.map.addLayer({
                    'id': 'qixiaDisline',
                    'type': 'line',
                    'source':'dottedlines_label',
                    'paint': {
                        'line-dasharray':[3,2],
                        'line-width': 1.5,
                        "line-opacity":1,
                        'line-color': '#ffffff'
                    }
                });
                // this.map.addLayer({
                //     'id': 'njDis',
                //     'type': 'fill',
                //     'source':'dottedlines_label_nj',
                //     'paint': {
                //         "fill-color":"#ffffff",
                //         "fill-opacity":0.05,
                //     }
                // });
                // this.map.addLayer({
                //     'id': 'njDisline',
                //     'type': 'line',
                //     'source':'dottedlines_label_nj',
                //     'paint': {
                //         'line-dasharray':[3,2],
                //         'line-width': 1.5,
                //         "line-opacity":1,
                //         'line-color': '#ffffff'
                //     }
                // });
            // }
        },
        selectScean(params){
            this.scean = params
        },
        handleAnimateCircle(){
            var size = 200;
            var pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),
                
                onAdd: () =>{
                    var canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                },
                
                render:()=>{
                    var duration = 1000;
                    var t = (performance.now() % duration) / duration;
                    
                    var radius = size / 2 * 0.3;
                    var outerRadius = size / 2 * 0.7 * t + radius;
                    var context = this.context;
                    
                    // draw outer circle
                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                    context.fill();
                    
                    // draw inner circle
                    context.beginPath();
                    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(255, 100, 100, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();
                    
                    // update this image's data with data from the canvas
                    this.data = context.getImageData(0, 0, this.width, this.height).data;
                    
                    // keep the map repainting
                    this.map.triggerRepaint();
                    
                    // return `true` to let the map know that the image was updated
                    return true;
                }
            };
           
 
            this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
            
            this.map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [118.8972030341, 32.1540342558]
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "pulsing-dot"
                }
            });
        },
        getQichachaData(name){
            axios.post('http://120.55.161.93:6011/qichacha/industryDetail?name='+name)
            .then(res=>{
                if(res.data.result && res.data.code === 200){
                    // console.log(res.data.Result)
                    let myData = res.data.result
                    // console.log(myData)
                    // console.log("789poi")
                    // this.CompanyProducts = myData.Result.CompanyProducts
                    this.Employees = myData.Result.Employees
                    this.Industry = myData.Result.Industry
                    this.Partners = myData.Result.Partners
                    this.ScopeIn = myData.Result.Scope
                    this.legalPerson = myData.Result.OperName
                    this.ContactInfo = {
                        adress:myData.Result.Address,
                        phone:myData.Result.Address,
                    }
                    axios.post("http://120.55.161.93:6011/qichacha/getPatentCount?name="+name)
                    .then(res=>{
                        this.knowledge = res.data.result
                    })
                }
            })
        },
        showInMapbox(params){
            console.log(params)
            this.sceanFlag = false
            let sceanEnterPrise = []
            enterpriseAll.features.forEach(l=>{
                l.properties.test.forEach(el=>{
                    if(params === el.company){
                        // console.log(el)
                        sceanEnterPrise.push(el)
                        this.searchReault.features[0].properties.test = sceanEnterPrise
                        this.searchReault.features[0].properties.id = l.properties.id
                        this.searchReault.features[0].geometry.coordinates = l.geometry.coordinates
                    }
                })
            })
            // console.log(this.searchReault)
            this.map.flyTo({
                center:this.searchReault.features[0].geometry.coordinates,
                zoom: 15
            })
            this.map.getSource('earthquakes').setData(this.searchReault)
        },
        setMapTheme(){
            if(this.switchMap){
                this.map.setStyle('mapbox://styles/mapbox/satellite-streets-v11')
            }else{
                this.map.setStyle('http://106.15.47.224:8688/styles/newblue/style.json') 
            }
        },
        getScenList(params){
            this.productList = []
            this.projectList = []
            this.needList = []
            console.log(params + "params")
            
            // console.log(this.activeTab + 'ac')
            
            if(!params){
                this.oldActiveTab = 1
            }else{
                this.oldActiveTab = params
            }
            let myData = {
                "companyName": "",
                "productName": "",
                "productType": Number(this.newActiveTab),
                "type": this.isClick,
            }
            listProductByStream(myData)
            .then(res=>{
                // console.log(res)
                this.productList = res.data.result.companyProductDTOList
                this.projectList = res.data.result.companyProjectDTOList
                this.needList = res.data.result.companyDemandDTOList
            })
        },
        showDetail(params,index){
            this.enterpriseFlag = false
            console.log(params)
            this.sceanFlag = true
            let id = parseInt(params)
            axios.post('http://120.55.161.93:6011/companyInfo/getCompanyScene?companySceneId='+id)
            .then(res=>{
                console.log(res)
                this.sceanData = res.data.result
                res.data.result.companySceneImgDTOList.forEach(l=>{
                    // l.scenarioImg = 'http://'+ l.scenarioImg
                    // l.scenarioImg = 'http://'+ l.scenarioImg
                    // console.log(l.scenarioImg.substring(21))
                    l.scenarioImg = 'http://qiniu.iwooke'+ l.scenarioImg.substring(21)
                })
                this.companySceneImgDTOList = res.data.result.companySceneImgDTOList
                this.srcList = []
                this.companySceneImgDTOList.forEach(l=>{
                    this.srcList.push(l.scenarioImg)
                })
                this.url = this.srcList[0]
                // this.videoUrl =  'http://'+ res.data.result.video
                this.videoUrl =  'http://qiniu.iwooke'+ res.data.result.video.substring(21)
            })
            
            this.officeList =[]
            let templ = {
                "type": "FeatureCollection",
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                },
                "features":[]
            }
            let myIndex = index + 1
            if(myIndex >4){
                myIndex = 2
            }
            axios.post('http://120.55.161.93:6011/city/getCompanyByScene?scene='+myIndex)
            .then(res=>{
                if(res.data.code===200){
                    console.log(res.data.result)
                    templ.features = res.data.result
                    res.data.result.forEach(l=>{
                        this.officeList.push(l.properties.test[0])
                    })
                    console.log(this.officeList)
                    this.map.getSource('earthquakes').setData(templ)
                }
            })
        },
        showProductDetail(params){
            this.enterpriseFlag = false
            console.log(params)
            this.sceanFlag = true
            let myData = {
                companyProductId:params.companyProductId
            }
            getProduct(myData)
            .then(res=>{
                this.sceanData = res.data.result
                this.sceanData.title = res.data.result.productName
                this.sceanData.info = res.data.result.productIntroduce
                
                this.srcList = []
                res.data.result.imgList.forEach(l=>{
                    l.imgUrl = 'http://qiniu.iwooke'+ l.imgUrl.substring(21)
                    this.srcList.push(l.imgUrl)
                })
                this.url = this.srcList[0]
            })

        },
        showProjectDetail(params){
            this.enterpriseFlag = false
            console.log(params)
            this.sceanFlag = true
            let myData = {
                companyProjectId:params.companyProjectId
            }
            getCompanyProject(myData)
            .then(res=>{
                this.sceanData = res.data.result
                this.sceanData.title = res.data.result.projectName
                this.sceanData.info = res.data.result.projectIntroduce
                this.srcList = []
                res.data.result.imgList.forEach(l=>{
                    l.imgUrl = 'http://qiniu.iwooke'+ l.imgUrl.substring(21)
                    this.srcList.push(l.imgUrl)
                })
                this.url = this.srcList[0]
            })
        },
        showNeedDetail(params){
            this.enterpriseFlag = false
            console.log(params)
            this.sceanFlag = true
            let myData = {
                companyDemandId:params.companyDemandId
            }
            getCompanyDemand(myData)
            .then(res=>{
                this.sceanData = res.data.result
                this.sceanData.title = res.data.result.demandName
                this.sceanData.info = res.data.result.demandIndo
                this.srcList = []
                res.data.result.imgList.forEach(l=>{
                    l.imgUrl = 'http://qiniu.iwooke'+ l.imgUrl.substring(21)
                    this.srcList.push(l.imgUrl)
                })
                this.url = this.srcList[0]
            })
        },
        showImgBox(){
            // this.imgTitle = 
            this.imgDialogVisible = true
        },
        goLogin(){
            this.$router.push({
                path:'/login'
            })
        },
        // getPrivinceData(id){
        //     console.log(this.markersList)
        //     if(this.markersList.length > 0){
        //         this.markersList.forEach(el=>{
        //             console.log(el)
        //             el.addTo(this.map);
        //             console.log(el);
        //             el.remove();
        //         });
        //     };
        //     this.markersList = [];
        //     mapboxgl.clearStorage();
        //     this.isClick = id
        //     let myData = {
        //         type:id
        //     }
        //     listBaseInfoByStream(myData)
        //     .then(res=>{
        //         if(res.data.code === 200){
        //             this.markersList = []
        //             this.searchReault.features = res.data.result
        //             console.log(this.searchReault.features);
        //             this.searchReault.features.forEach(marker => {
        //                 console.log(marker)
        //                 var el = document.createElement("div");
        //                 var txt = document.createElement("h1");
        //                 txt.innerText = marker.properties.mag;

        //                 el.appendChild(txt);
        //                 let magNum = parseInt(marker.properties.mag)

        //                 if(magNum< 9.5){
        //                     el.style.backgroundImage = "url(" + require("../svg/icon-01.png") + ")";
        //                 }else if(magNum > 9.5 && magNum <20.5){
        //                     el.style.backgroundImage = "url(" + require("../svg/icon-02.png") + ")";
        //                 }else if(magNum > 20.5 && magNum <30.5){
        //                     el.style.backgroundImage ="url(" + require("../svg/icon-03.png") + ")";
        //                 }else if(magNum > 30.5 && magNum <40.5){
        //                     el.style.backgroundImage = "url(" + require("../svg/icon-04.png") + ")";
        //                 }else if(magNum > 50.5 && magNum <60.5){
        //                     el.style.backgroundImage = "url(" + require("../svg/icon-05.png") + ")";
        //                 }else{
        //                     el.style.backgroundImage = "url(" + require("../svg/icon-06.png") + ")";
        //                 }
        //                 el.className = "marker";
        //                 el.style.width = "43px";
        //                 el.style.height = "53px";
        //                 el.addEventListener("click", ()=> {
        //                     // window.alert(marker.properties.id);
        //                     this.enterpriseFlag = true
                        
        //                     this.parkName = marker.properties.city
        //                     const enterList = marker.properties.comList
        //                     this.enterpriseList = enterList
        //                     this.getQichachaData(this.enterpriseList[0].comName)
        //                 });
        //                 // add marker to map
        //                 var aMarker =  new mapboxgl.Marker(el)
        //                     .setLngLat(marker.geometry.coordinates)
        //                     .addTo(this.map);
        //                 console.log(aMarker);
        //                 this.markersList.push(aMarker);
        //                 console.log(this.markersList);
        //             });
        //             this.getScenList()
        //         }
        //     })
        // },
    }
}
</script>

<style scoped lang="css">
    #map{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .headerBox{
        position: absolute;
        left: 20px;
        z-index: 2;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .switchBox{
        position: absolute;
        right: 20px;
        top: 50px;
        z-index: 2;
        color: #ffffff;
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
     .switchTitle{
        font-size: 18px;
        margin-right: 10px;
    }
    .title{
        color: #ffffff;
        font-size: 30px;
        margin-left: 10px;
    }
    .bottomBox{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 2;
    }
    .bottomNmae{
        color: #ffffff;
    }
    .itemsNav{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 200px;
        cursor: pointer;
    }
    .itemsNav i{
        color: #ffffff;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .itemsNav .name{
        color: #ffffff;
        font-size: 20px;
        margin: 10px 0 0 0;
    }
    .activeitemsNav{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 200px;
        cursor: pointer;
    }
    .activeitemsNav i{
        color: #F9CE5F;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .activeitemsNav .name{
       color: #F9CE5F;
        font-size: 20px;
        margin: 10px 0 0 0;
    }
</style>