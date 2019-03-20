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
                <el-col :span="24" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        新增
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column label="会员图片" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.vipPic" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="vipName" label="会员名称"  align="center"></el-table-column>
                <el-table-column label="会员权益"  align="center">
                    <template slot-scope="scope">
                        <p>购买即送琅琊豆{{scope.row.giftLangyaCoin}}</p>
                        <p>每天赠送琅琊豆{{scope.row.dailyGiftLangyaCoin}}</p>
                        <p v-if="scope.row.kick=='enable'">可踢低级别会员</p>
                    </template>
                </el-table-column>
                <el-table-column prop="vipLevel" label="会员等级"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center" width="300">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.$index)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">删除</span>
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


        <el-dialog :title="curEntry?'编辑会员计划':'新增会员计划'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="50%" :close-on-click-modal="false">
            <div class="dialog-body">
                <div style="width: 80%;">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="会员图片：" prop="cover">
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
                        <el-form-item label="会员名称：" prop="vipName">
                            <el-input v-model="form.vipName" placeholder="请输入会员名称"></el-input>
                        </el-form-item>
                        <el-form-item label="会员价格：" prop="price">
                            <el-input v-model="form.price" placeholder="请输入会员价格" style="width: 150px;"></el-input>
                            <span class="unit">￥</span>
                        </el-form-item>
                        <el-form-item label="会员等级：" prop="vipLevel">
                            <el-select v-model="form.vipLevel" placeholder="请选择会员等级" style="width: 150px;">
                                <el-option :label="i" v-for="i in 30" :value="i" :key="i"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="会员权益：" prop="">
                            <div>
                                <el-switch
                                    v-model="form.giftLangyaCoinState"
                                    active-text="购买即送琅琊豆"  active-value="enable" inactive-value="disable">
                                </el-switch>
                                <el-input v-model="form.giftLangyaCoin" size="mini" style="width: 50px;"></el-input>
                            </div>
                            <div>
                                <el-switch
                                    v-model="form.dailyGiftLangyaCoinState"
                                    active-text="每天赠送琅琊豆"  active-value="enable" inactive-value="disable">
                                </el-switch>
                                <el-input v-model="form.dailyGiftLangyaCoin" size="mini" style="width: 50px;"></el-input>
                            </div>
                            <div>
                                <el-switch
                                    v-model="form.kick"
                                    active-text="可踢低级别会员" active-value="enable" inactive-value="disable">
                                </el-switch>
                            </div>
                        </el-form-item>
                        <el-form-item label="有效期：" prop="day">
                            <el-input v-model="form.day" placeholder="请输入有效期天数" style="width: 150px;"></el-input>
                            <span class="unit">天</span>
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
                keyword:null,
                entryList:[],
                curEntry:null,



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
                Vue.api.getVipTypeList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=typeof data.vipTypeList=='string'?JSON.parse(data.vipTypeList):data.vipTypeList;
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
            openFormModal:function (index) {
                //
                this.clearForm();
                //
                if(index!=undefined){
                    this.curEntry=this.entryList[index];
                    this.curEntry.index=index;
                    this.form={...this.form,...this.curEntry,cover:this.curEntry.vipPic,price:this.curEntry.price/100}
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
                    giftLangyaCoinState:'disable',
                    dailyGiftLangyaCoinState:'disable',
                    kick:'enable',
                };
                this.$refs['form']&&this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传会员图片'});
                    return;
                }
                if(!this.form.vipName){
                    Vue.operationFeedback({type:'warn',text:'请输入会员名称'});
                    return;
                }
                if(!this.form.price){
                    Vue.operationFeedback({type:'warn',text:'请输入会员价格'});
                    return;
                }
                if(!regex.pNum.test(this.form.price)){
                    Vue.operationFeedback({type:'warn',text:'会员价格输入有误，'+regex.pNumAlert});
                    return;
                }
                if(!this.form.vipLevel){
                    Vue.operationFeedback({type:'warn',text:'请选择会员等级'});
                    return;
                }
                if(this.form.giftLangyaCoinState=='enable'&&(!this.form.giftLangyaCoin||!regex.pInt.test(this.form.giftLangyaCoin))){
                    Vue.operationFeedback({type:'warn',text:'购买即送琅琊豆的数值有误，'+regex.pIntAlert});
                    return;
                }
                if(this.form.dailyGiftLangyaCoinState=='enable'&&(!this.form.dailyGiftLangyaCoin||!regex.pInt.test(this.form.dailyGiftLangyaCoin))){
                    Vue.operationFeedback({type:'warn',text:'每天赠送琅琊豆数值有误，'+regex.pIntAlert});
                    return;
                }
                if(!this.form.day||!regex.pInt.test(this.form.day)){
                    Vue.operationFeedback({type:'warn',text:'有效期天数数值有误，'+regex.pIntAlert});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    vipName:this.form.vipName,
                    price:this.form.price*100,
                    vipLevel:this.form.vipLevel,
                    giftLangyaCoin:this.form.giftLangyaCoin,
                    dailyGiftLangyaCoin:this.form.dailyGiftLangyaCoin,
                    giftLangyaCoinState:this.form.giftLangyaCoinState,
                    dailyGiftLangyaCoinState:this.form.dailyGiftLangyaCoinState,
                    kick:this.form.kick,
                    day:this.form.day,
                    describe:'会员计划',
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    Vue.api.updateMemberPlan({apiParams:params,coverPicFile:this.form.file?this.form.file:null}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addMemberPlan({apiParams:params,coverPicFile:this.form.file}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            remove:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.removeMemberPlan({apiParams:{id:this.entryList[index].id}}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'删除成功'});
                        this.entryList.splice(index,1);
                        if(this.entryList.length==0){
                            this.getList();
                        }
                    }else{
                        fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                    }
                });
            },
            swapSort:function (index,type) {
                let id1=this.entryList[index].id;
                let id2=null;
                let index2=null;
                if(type=='up'&&index>0){
                    index2=index-1;
                }else if(type=='down'&&index<this.entryList.length-1){
                    index2=index+1;
                }else{
                    return;
                }
                id2=this.entryList[index2].id;
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.swapBannerSort({apiParams:{id1:id1,id2:id2,}}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
                });
            },
            stickBanner:function (index) {
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.stickBanner({apiParams:{id:this.entryList[index].id}}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
                });
            },
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                this.form.file=file;
                Vue.tools.fileToBlob(file,(data)=>{
                    this.form.cover=data;
                })
               /* Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        fixedNumber:[320,320],
                        ok:(data)=>{
                            this.form.cover=data.base64;
                            this.form.file=data.blob;
                        }
                    });
                });*/
            },
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.getList();
            //
           /* this.openFormModal();*/


        },
    }
</script>
