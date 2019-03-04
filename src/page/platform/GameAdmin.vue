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
             <!--   <el-col :span="10">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>-->
                <el-col :span="24" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        新增
                    </el-button>
              <!--      <el-button type="primary" icon="el-icon-upload2">
                        批量上架
                    </el-button>
                    <el-button type="primary" icon="el-icon-download">
                        批量下架
                    </el-button>-->
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column label="封面" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.gamePic" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="gameName" label="游戏名称"  align="center"></el-table-column>
                <el-table-column prop="gameName" label="游戏状态"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.state=='enable'?'已上架':'已下架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="游戏配置"  align="center">
                    <template slot-scope="scope">
                        <a :href="scope.row.configUrl" target="_blank">进入游戏配置</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center" width="300">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.$index)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="swapSort(scope.$index,'up')" class="cm-btn cm-link-btn">上移</span>
                        <span @click="swapSort(scope.$index,'down')" class="cm-btn cm-link-btn">下移</span>
                        <span @click="stick(scope.$index)" class="cm-btn cm-link-btn">置顶</span>
                        <span @click="setStatus(scope.$index,'enable')" v-if="scope.row.state=='disable'" class="cm-btn cm-link-btn">上架</span>
                        <span @click="setStatus(scope.$index,'disable')"  v-if="scope.row.state=='enable'"  class="cm-btn cm-link-btn">下架</span>
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


        <el-dialog :title="curEntry?'编辑游戏':'新增游戏'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="60%" :close-on-click-modal="false">
            <div class="dialog-body">
                <div style="width: 80%;">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="序号：" prop="headline" v-if="form.index!=undefined">
                            <span>{{form.index+1}}</span>
                        </el-form-item>
                        <el-form-item label="游戏头图：" prop="cover">
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
                        <el-form-item label="游戏名称：" prop="gameName">
                            <el-input v-model="form.gameName" placeholder="请输入游戏名称"></el-input>
                        </el-form-item>
                        <el-form-item label="游戏链接：" prop="gameUrl">
                            <el-input v-model="form.gameUrl" placeholder="请输入游戏链接"></el-input>
                        </el-form-item>
                        <el-form-item label="配置链接：" prop="configUrl">
                            <el-input v-model="form.configUrl" placeholder="请输入配置链接"></el-input>
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
                    cover:null,
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
                    state:''
                }
                this.pager.loading=true;
                Vue.api.getGameList({apiParams:params}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.gameList;
                        this.entryList=list;
                        this.pager.total=data.count;
                        console.log('this.entryList:',this.entryList);
                    }
                    this.pager.loading=false;
                });
            },
            openFormModal:function (index) {
                //
                this.clearForm();
                //
                if(index!=undefined){
                    this.curEntry=this.entryList[index];
                    this.curEntry.index=index;
                    this.form={...this.curEntry,cover:this.curEntry.gamePic}
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
                };
                this.$refs['form']&&this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传游戏头图'});
                    return;
                }
                if(!this.form.gameName){
                    Vue.operationFeedback({type:'warn',text:'请输入游戏名称'});
                    return;
                }
                if(!this.form.gameUrl){
                    Vue.operationFeedback({type:'warn',text:'请输入游戏链接'});
                    return;
                }
                if(!this.form.configUrl){
                    Vue.operationFeedback({type:'warn',text:'请输入配置链接'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    gameName:this.form.gameName,
                    gameUrl:this.form.gameUrl,
                    configUrl:this.form.configUrl,
                    describe:'',
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    params.state=this.curEntry.state;
                    Vue.api.updateGame({apiParams:params,coverPicFile:this.form.file?this.form.file:null}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addGame({apiParams:params,coverPicFile:this.form.file}).then((resp)=>{
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
                Vue.api.removeGame({apiParams:{id:this.entryList[index].id}}).then((resp)=>{
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
                Vue.api.swapGameSort({apiParams:{id1:id1,id2:id2,}}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
                });
            },

            stick:function (index) {
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.stickGame({apiParams:{id:this.entryList[index].id}}).then((resp)=>{
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
            setStatus:function (index,type) {
                let entry=this.entryList[index];
                let params={
                    ...entry,
                    state:type
                }
                let tips='';
                switch (type){
                    case 'enable':
                        tips='上架';
                        break;
                    case 'disable':
                        tips='下架';
                        break
                }
                let fb=Vue.operationFeedback({text:tips+'中...'});
                Vue.api.updateGameState({apiParams:{id:entry.id,state:type}}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:tips+'成功'});
                        entry.state=type;
                    }else{
                        fb.setOptions({type:'warn',text:tips+'失败，'+resp.respMsg});
                    }
                });
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
