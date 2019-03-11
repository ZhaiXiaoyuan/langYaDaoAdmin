<template>
    <div class="table">
        <div class="crumbs">
          <!--  <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>-->
        </div>
        <div class="container">
          <!--  <el-row class="handle-box">
                <el-col :span="14">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
            </el-row>-->
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column label="日期" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.date|formatDate('yyyy-MM-dd')}}
                    </template>
                </el-table-column>
                <el-table-column prop="registerCount" label="注册人数"  align="center"></el-table-column>
                <el-table-column prop="loginCount" label="登录人数"  align="center" ></el-table-column>
                <el-table-column label="充值金额"  align="center">
                    <template slot-scope="scope">
                        {{scope.row.rechargeAmount/100}}
                    </template>
                </el-table-column>
                <el-table-column label="收取服务费（琅琊豆）" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.brokerage}}(￥{{(scope.row.brokerage/langyaCoinPerYuan).toFixed(2)}})
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change ="getList"
                    layout="prev, pager, next"
                    :page-size="pager.pageSize"
                    :total="pager.total">
                </el-pagination>
            </div>
        </div>


    </div>
</template>
<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

</style>
<script>
    import Vue from 'vue'
    let XLSX = require('xlsx');
    export default {
        data() {
            return {
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                },
                entryList:[],
                langyaCoinPerYuan:1,
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                    userId:'',
                    state:''
                }
                this.pager.loading=true;
                Vue.api.getRechargeOrderList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.rechargeOrderList;
                        this.entryList=list;
                        this.pager.total=data.count;
                        console.log('this.entryList:',this.entryList);
                    }
                    this.pager.loading=false;
                });
            },
        },
        mounted () {
            this.getList();


        },
    }
</script>
