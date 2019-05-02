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
                <el-table-column label="神兽等级"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.level|beastLevel}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="动物价值"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.langyaCoinPrice}}琅琊豆</span>
                    </template>
                </el-table-column>
                <el-table-column label="饲料价值"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.fodderPrice}}琅琊豆</span>
                    </template>
                </el-table-column>
                <el-table-column label="收成价值"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.eggPrice}}琅琊豆</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center" width="300">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.$index)" class="cm-btn cm-link-btn">编辑</span>
                     <!--   <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">删除</span>-->
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


        <el-dialog :title="curEntry?'编辑神兽':'新增神兽'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="30%" :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="神兽等级：" prop="vipLevel">
                            <el-select v-model="form.level" placeholder="" style="width: 150px;">
                                <el-option :label="item.label" v-for="(item,index) in levelOptions" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="神兽价值：" prop="price">
                            <el-input v-model="form.langyaCoinPrice" placeholder="" style="width: 150px;"></el-input>
                            <span class="unit">琅琊豆</span>
                        </el-form-item>
                        <el-form-item label="饲料价格：" prop="price">
                            <el-input v-model="form.fodderPrice" placeholder="" style="width: 150px;"></el-input>
                            <span class="unit">琅琊豆</span>
                        </el-form-item>
                        <el-form-item label="收成价值：" prop="price">
                            <el-input v-model="form.eggPrice" placeholder="" style="width: 150px;"></el-input>
                            <span class="unit">琅琊豆</span>
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
                levelOptions:[
                    {
                        label:'青铜',
                        value:'bronze',
                    },
                    {
                        label:'白银',
                        value:'silver',
                    },
                    {
                        label:'黄金',
                        value:'gold',
                    },
                    {
                        label:'钻石',
                        value:'diamond',
                    },
                ],
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
                Vue.api.getAnimalList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=typeof data.animalList=='string'?JSON.parse(data.animalList):data.animalList;
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
                if(!this.form.level){
                    Vue.operationFeedback({type:'warn',text:'请悬着神兽等级'});
                    return;
                }
                if(!this.form.langyaCoinPrice||!regex.pInt.test(this.form.langyaCoinPrice)){
                    Vue.operationFeedback({type:'warn',text:'神兽价值有误，'+regex.pIntAlert});
                    return;
                }
                if(!this.form.fodderPrice||!regex.pInt.test(this.form.fodderPrice)){
                    Vue.operationFeedback({type:'warn',text:'饲料价格有误，'+regex.pIntAlert});
                    return;
                }
                if(!this.form.eggPrice||!regex.pInt.test(this.form.eggPrice)){
                    Vue.operationFeedback({type:'warn',text:'收成价值有误，'+regex.pIntAlert});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    name:'',
                    ...this.form
                }
                if(this.curEntry){
                    Vue.api.updateAnimal({apiParams:params,coverPicFile:null}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addAnimal({apiParams:params,coverPicFile:null}).then((resp)=>{
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
