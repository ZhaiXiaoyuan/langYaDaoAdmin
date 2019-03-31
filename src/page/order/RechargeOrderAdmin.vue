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
                <el-table-column label="订单生成时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderId" label="订单编号"  align="center"></el-table-column>
                <el-table-column prop="langyaCoin" label="充值琅琊豆数量"  align="center" ></el-table-column>
                <el-table-column label="订单金额"  align="center">
                    <template slot-scope="scope">
                        ￥{{scope.row.amount/100}}
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID"  align="center"></el-table-column>
                <el-table-column prop="" label="用户昵称"  align="center"></el-table-column>
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
                        let list=typeof data.rechargeOrderList=='string'?JSON.parse(data.rechargeOrderList):data.rechargeOrderList;
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
