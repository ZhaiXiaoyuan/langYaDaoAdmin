<template>
    <div class="table">
        <div class="crumbs">
          <!--  <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>-->
        </div>
        <div class="container">
            <el-row class="handle-box">

            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="会员名称"  align="center"></el-table-column>
                <el-table-column label="奖品图片" align="center" width="100">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.prizePic" style="width: 40px;height: 40px;" v-if="scope.row.prizePic" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="probability" label="中奖概率"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.$index)" class="cm-btn cm-link-btn">编辑</span>
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


        <el-dialog :title="curEntry?'编辑奖品':'新增奖品'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="50%" :close-on-click-modal="false">
            <div class="dialog-body">
                <div style="width: 80%;">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="序号：" prop="headline" v-if="form.index!=undefined">
                            <span>{{form.index+1}}</span>
                        </el-form-item>
                        <el-form-item label="奖品类型：" prop="vipLevel">
                            <el-select v-model="form.type" placeholder="请选择奖品类型" style="width: 150px;">
                                <el-option label="会员" value="vip"></el-option>
                                <el-option label="游戏币" value="langyaCoin"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖品：" prop="vipTypeId" v-if="form.type=='vip'">
                            <el-select v-model="form.vipTypeId" placeholder="请选择会员计划名称" style="width: 150px;">
                                <el-option :label="item.vipName" v-for="(item,index) in memberList" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖品：" prop="langyaCoin" v-if="form.type=='langyaCoin'">
                            <el-input v-model="form.langyaCoin" placeholder="请输入游戏币数量" style="width: 150px;"></el-input><span class="unit">&nbsp;游戏币</span>
                        </el-form-item>
                        <el-form-item label="奖品名称：" prop="vipName">
                            <el-input v-model="form.name" placeholder="请输入奖品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="奖品图片：" prop="cover">
                            <div class="cm-pic-uploader" :class="{'anew':form.cover}">
                                <div class="wrapper">
                                    <img :src="form.file?form.cover:basicConfig.coverBasicUrl+form.cover" v-if="form.cover">
                                    <div class="btn-wrap">
                                        <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                                        <div class="cm-btn upload-btn"><i class="icon el-icon-plus"></i></div>
                                        <span class="cm-btn cm-link-btn text-upload-btn">重新上传</span>
                                    </div>
                                </div>
                              <!--  <p class="tips">上传图片建议比例为1920*320，格式为jpg、png，大小不超过10M</p>-->
                            </div>
                        </el-form-item>
                        <el-form-item label="中奖概率：" prop="probability">
                            <el-input v-model="form.probability" placeholder="请输入中奖概率"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>

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

    export default {
        data() {
            return {
                account:{},
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                  loading:false
                },
                entryList:[],
                curEntry:null,
                memberList:[],

                formModalFlag:false,
                form:{

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
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getBonusLotteryList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=typeof data.bonusLotteryList=='string'?JSON.parse(data.bonusLotteryList):data.bonusLotteryList;
                        this.entryList=list;
                        console.log('test:',this.entryList);
                        this.pager.total=data.count;
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            getMemberList:function (pageIndex) {
                let params={
                    pageIndex:1,
                    pageSize:50,
                }
                this.pager.loading=true;
                Vue.api.getMemberPlanList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        this.memberList=JSON.parse(resp.respMsg).vipTypeList;
                        console.log('this.memberList:',this.memberList);
                    }
                });
            },
            openFormModal:function (index) {
                //
                this.clearForm();
                //
                if(index!=undefined){
                    this.curEntry=this.entryList[index];
                    this.curEntry.index=index;
                    this.form={...this.form,...this.curEntry,cover:this.curEntry.prizePic}
                }
                this.formModalFlag=true;
            },
            closeFormModal:function () {
                this.formModalFlag=false;
            },
            clearForm:function () {
                this.form={
                    cover:null,
                    file:null,
                    type:'vip',
                };
                this.$refs['form']&&this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.type){
                    Vue.operationFeedback({type:'warn',text:'请选择奖品类型'});
                    return;
                }
                if(this.form.type=='vip'&&!this.form.vipTypeId){
                    Vue.operationFeedback({type:'warn',text:'请选择会员计划名称'});
                    return;
                }
                if(this.form.type=='langyaCoin'&&(!this.form.langyaCoin||!regex.pInt.test(this.form.langyaCoin))){
                    Vue.operationFeedback({type:'warn',text:'奖品游戏币数量输入有误，'+regex.pIntAlert});
                    return;
                }
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'请输入奖品名称'});
                    return;
                }
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传奖品图片'});
                    return;
                }
                if(!this.form.probability||this.form.probability>1){
                    Vue.operationFeedback({type:'warn',text:'中奖概率数值有误，请输入小于1的小数'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    type:this.form.type,
                    name:this.form.name,
                    probability:this.form.probability,
                    vipTypeId:this.form.vipTypeId?this.form.vipTypeId:'',
                    langyaCoin:this.form.langyaCoin
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    Vue.api.updateBonusLottery({apiParams:params,coverPicFile:this.form.file?this.form.file:null}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                /*this.form.file=file;
                Vue.tools.fileToBlob(file,(data)=>{
                    this.form.cover=data;
                })*/
                Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        fixedNumber:[320,320],
                        ok:(data)=>{
                            this.form.cover=data.base64;
                            this.form.file=data.blob;
                        }
                    });
                });
            },
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.getList();
            this.getMemberList();
            //
           /* this.openFormModal();*/


        },
    }
</script>
