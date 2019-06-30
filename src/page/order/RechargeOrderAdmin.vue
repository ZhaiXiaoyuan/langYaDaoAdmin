<template>
    <div class="table">
        <div class="crumbs">

        </div>
        <div class="container">
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column label="订单生成时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderId" label="订单编号"  align="center"></el-table-column>
                <el-table-column prop="langyaCoin" label="充值游戏币数量"  align="center" ></el-table-column>
                <el-table-column label="订单金额"  align="center">
                    <template slot-scope="scope">
                        ￥{{scope.row.amount/100}}
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID"  align="center"></el-table-column>
                <el-table-column prop="userName" label="用户昵称"  align="center"></el-table-column>
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
                this.entryList=[];
                Vue.api.getRechargeOrderList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=typeof data.rechargeOrderList=='string'?JSON.parse(data.rechargeOrderList):data.rechargeOrderList;
                        list.forEach((item,i)=>{
                            this.entryList.push(
                                {
                                    userName:item.userName,
                                    ...item.rechargeOrder
                                }
                            );
                        });
                        this.pager.total=data.count;
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
