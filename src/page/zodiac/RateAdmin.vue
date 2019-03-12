<template>
    <div class="cm-page-content-min rate-admin">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>竞猜率设定</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div style="width: 60%;padding: 40px 0px;">
                    <el-form :inline="true" label-width="60px" >
                        <div class="block">
                            <div class="block-hd"></div>
                            <div class="block-bd">
                                <el-form-item label="生肖：">
                                    <el-input v-model="form.生肖" class="el-input"></el-input>
                                </el-form-item>
                                <el-form-item label="神兽：">
                                    <el-input v-model="form.神兽" class="el-input"></el-input>
                                </el-form-item>
                                <el-form-item label="天地：">
                                    <el-input v-model="form.天地" class="el-input"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="handle" style="margin-top: 50px;text-align: center;">
                            <el-button type="primary" style="width: 120px;" size="medium " @click="save()">保存</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .rate-admin{
        .block-hd{
            font-size: 20px;
        }
        .block-bd{
        /*    display: flex;
            justify-content: center;*/
            padding: 5px 10px;
        }
        .el-form-item__label{
            padding-right: 0px;
        }
        .el-form-item{
            margin-bottom: 10px;
        }
        .el-input{
            width: 80px;
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
                  '生肖':'',
                  '神兽':'',
                  '天地':''
              }
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           getData:function () {
               Vue.api.getGameConfigInfo({apiParams:{property:"赔率"}}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       this.configData=JSON.parse(resp.respMsg);
                       this.configData.forEach((item)=>{
                           this.form[item.configName]=parseInt(item.configValue);
                       });
                   }
               });
           } ,
           save:function () {
               for(let key in this.form){
                   let value=this.form[key];
                   if(!value||!regex.pInt.test(value)){
                       Vue.operationFeedback({type:'warn',text:key+'竞猜率数值有误，'+regex.pIntAlert});
                       return;
                   }
               }

               let params={rateJSONObjectString:JSON.stringify(this.form)};
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.updataRate({apiParams:params}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       fb.setOptions({type:'complete',text:'保存成功'});
                   }else{
                       fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                   }
               })
           },
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.getData();
        },
    }
</script>
