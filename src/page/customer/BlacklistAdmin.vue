<template>
    <div class="table">
        <div class="crumbs">
          <!--  <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>-->
        </div>
        <div class="container">
            <el-row class="handle-box" type="flex" align="middle">
               <!-- <el-col :span="8">
                    <el-radio-group v-model="state" @change="getList()">
                        <el-radio label="">全部</el-radio>
                        <el-radio label="enable">未拉黑</el-radio>
                        <el-radio label="disable">已拉黑</el-radio>
                    </el-radio-group>
                </el-col>-->
                <el-col :span="12">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column prop="user.id" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="user.name" label="昵称"  align="center"></el-table-column>
                <el-table-column prop="user.phone" label="手机号"  align="center"></el-table-column>
                <el-table-column label="微信绑定状态" align="center"  width="50">
                    <template slot-scope="scope">
                        {{scope.row.user.wxOpenId?'已绑定':'未绑定'}}
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.user.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="最近登录时间" align="center" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.user.lastLoginTime"> {{scope.row.user.lastLoginTime|formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="user.lastLocation" label="最近登陆IP"  align="center"></el-table-column>
                <el-table-column prop="user.remark" label="拉黑原因"  align="center"  width="200"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="unBlack(scope.row)"  class="cm-btn cm-link-btn">取消拉黑</span>
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
                defaultAvatar:require('../../images/common/default-avatar.png'),
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                },
                state:'disable',
                keyword:null,
                entryList:[],
                curEntry:null,


                remarkModalFlag:false,
                remarkModalOptions:{
                    ok:null,
                },
                curRemark:null,
                remarkForm:{
                    remark:null,
                },
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
                    searchContent:this.keyword?this.keyword:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                    state:this.state,
                }
                this.pager.loading=true;
                Vue.api.getUserList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=typeof data.userList=='string'?JSON.parse(data.userList):data.userList;
                        this.entryList=list;
                        this.pager.total=data.count;
                          console.log('this.entryList:',this.entryList);
                        //
                       /* this.getUserDetail(this.entryList[1]);*/
                    }
                    this.pager.loading=false;
                });
            },
            unBlack:function (entry) {
                this.$confirm('确定把用户'+entry.user.name+'（'+entry.user.id+'、'+entry.user.phone+'）移除出黑名单吗？', '取消拉黑', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                        let params={
                            id:entry.user.id,
                            state:'enable',
                            remark:'取消拉黑',
                        }
                        let fb=Vue.operationFeedback({text:'操作中...'});
                        Vue.api.updateUserState({apiParams:params}).then((resp)=>{
                            if(resp.respCode=='2000'){
                                this.getList(this.pager.pageIndex);
                                fb.setOptions({type:'complete',text:'操作成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                            }
                        });
                    })
                    .catch(action => {

                    });
            },
        },
        mounted () {
            this.getList();


        },
    }
</script>
