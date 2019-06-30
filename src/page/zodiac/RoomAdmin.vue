<template>
    <div class="cm-page-content-min room-admin">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>房间管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="type" @tab-click="handleClick">
                <el-tab-pane label="初级房" name="初级房"></el-tab-pane>
                <el-tab-pane label="中级房" name="中级房"></el-tab-pane>
                <el-tab-pane label="高级房" name="高级房"></el-tab-pane>
                <el-tab-pane label="大师房" name="大师房"></el-tab-pane>
            </el-tabs>
            <div class="tab-content" v-loading="loading">
                <div style="width: 580px;margin: 20px auto 30px auto;">
                    <el-form label-width="160px">
                        <el-form-item label="进入门槛：">
                            <span class="unit">大于&nbsp;</span><el-input v-model="form.进入门槛"  class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span>
                        </el-form-item>
                        <el-form-item label="举手申请擂主门槛：">
                            <span class="unit">大于&nbsp;</span><el-input v-model="form.擂主门槛"   class="input-item" placeholder="" ></el-input><span class="unit">&nbsp;游戏币，数值不能小于每人每轮最大赔付数*11*6</span>
                        </el-form-item>
                        <el-form-item label="桌子数：">
                            <el-input-number v-model="form.桌子数" :min="1" :max="1000" label="描述文字"></el-input-number><span class="tips">注：每张桌子固定最大进入11个人</span>
                        </el-form-item>
                        <el-form-item label="每轮每人最大赔付数：">
                            <el-input v-model="form.每轮每玩家最大赔付数"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span>
                        </el-form-item>
                        <el-form-item label="筹码设定：">
                           <div class="input-row">
                               <span>筹码1</span>
                          <!--     <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码1文本"   class="input-item" placeholder=""></el-input></div>-->
                               <div class="input-box">面额&nbsp;<el-input v-model="form.筹码1"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                           </div>
                            <div class="input-row">
                                <span>筹码2</span>
                           <!--     <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码2文本"   class="input-item" placeholder=""></el-input></div>-->
                                <div class="input-box">面额&nbsp;<el-input v-model="form.筹码2"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                            </div>
                            <div class="input-row">
                                <span>筹码3</span>
                               <!-- <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码3文本"   class="input-item" placeholder=""></el-input></div>-->
                                <div class="input-box">面额&nbsp;<el-input v-model="form.筹码3"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                            </div>
                            <div class="input-row">
                                <span>筹码4</span>
                               <!-- <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码4文本"   class="input-item" placeholder=""></el-input></div>-->
                                <div class="input-box">面额&nbsp;<el-input v-model="form.筹码4"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                            </div>
                            <div class="input-row">
                                <span>筹码5</span>
                            <!--    <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码5文本"   class="input-item" placeholder=""></el-input></div>-->
                                <div class="input-box">面额&nbsp;<el-input v-model="form.筹码5"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                            </div>
                            <div class="input-row">
                                <span>筹码6</span>
                              <!--  <div class="input-box">展示文本&nbsp;<el-input v-model="form.筹码6文本"   class="input-item" placeholder=""></el-input></div>-->
                                <div class="input-box">面额&nbsp;<el-input v-model="form.筹码6"   class="input-item" placeholder=""></el-input><span class="unit">&nbsp;游戏币</span></div>
                            </div>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button type="primary" style="width: 100%;margin-top: 20px;" @click="save()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .room-admin{
        .tab-content{
            .input-item{
                width: 80px;
            }
            .tips{
                padding-left: 5px;
            }
            .input-row{
                display: flex;
                .input-box{
                    margin-left: 20px;
                }
                &+.input-row{
                    margin-top: 8px;
                }
            }
        }
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
              account:{},
              configData:{},
              form:{

              },
              type:'初级房',//初级房,中级房，高级房，大师房
              loading:false,
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           getData:function () {
               this.loading=true;
               Vue.api.getGameConfigInfo({apiParams:{property:this.type+'配置'}}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       this.configData=JSON.parse(resp.respMsg);
                       console.log('this.configData:',this.configData);
                       this.configData.forEach((item)=>{
                           this.form[item.configName]=parseInt(item.configValue);
                       });
                   }else{
                   }
                   setTimeout(()=>{
                       this.loading=false;
                   },500);
               });
           } ,
           save:function () {
               if(!regex.pInt.test(this.form.进入门槛)){
                   Vue.operationFeedback({type:'warn',text:'进入门槛数值有误，'+regex.pIntAlert});
                   return;
               }
               if(!regex.pInt.test(this.form.擂主门槛)){
                   Vue.operationFeedback({type:'warn',text:'擂主门槛数值有误，'+regex.pIntAlert});
                   return;
               }
               if(!regex.pInt.test(this.form.桌子数)){
                   Vue.operationFeedback({type:'warn',text:'桌子数数值有误，'+regex.pIntAlert});
                   return;
               }
               if(!regex.pInt.test(this.form.每轮每玩家最大赔付数)){
                   Vue.operationFeedback({type:'warn',text:'每轮每玩家最大赔付数数值有误，'+regex.pIntAlert});
                   return;
               }
               for(let i=1;i<7;i++){
                   let key1='筹码'+i+'文本';
                   let key2='筹码'+i;
                  /* if(!this.form[key1]){
                       Vue.operationFeedback({type:'warn',text:'请输入'+key1});
                       return;
                   }*/
                   if(!this.form[key2]){
                       Vue.operationFeedback({type:'warn',text:'请输入'+key2+'面额'});
                       return;
                   }
               }
               this.form['房间名称']=this.type;
               this.form['最大进入人数']=this.form['桌子数']*11;
               console.log('this.form:',this.form);
              /* return;*/
               let params={configJSONObjectString:JSON.stringify(this.form),property:this.type+'配置'};
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.setRoomConfig({apiParams:params}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       fb.setOptions({type:'complete',text:'保存成功'});
                   }else{
                       fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                   }
               })
           },
           handleClick:function () {
               this.getData();
           }
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.getData();
        },
    }
</script>
