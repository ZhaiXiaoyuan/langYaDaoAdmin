<template>
    <div class="cm-page-content-min">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>竞猜率设定</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div style="width: 60%;padding: 40px 0px;">
                    <el-form label-width="150px" >
                        <div class="block">
                            <div class="block-hd"></div>
                            <div class="block-bd">
                                <el-form-item label="挑战者服务费比例：">
                                    <el-input v-model="form.挑战者服务费比例"  style="width: 80px;"></el-input><span class="unit">‰（千分之）</span>
                                </el-form-item>
                                <el-form-item label="擂主服务费比例：">
                                    <el-input v-model="form.擂主服务费比例" style="width: 80px;"></el-input><span class="unit">‰（千分之）</span>
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
<style lang="less" rel="stylesheet/less" scoped>
    .unit{
        position: relative;
        top:5px;
        margin-left: 5px;
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
                  挑战者服务费比例:'',
                  擂主服务费比例:'',
              }
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           getData:function () {
               Vue.api.getGameConfigInfo({apiParams:{property:"基础设定"}}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       this.configData=JSON.parse(resp.respMsg);
                       console.log('this.configData:',this.configData);
                       this.configData.forEach((item)=>{
                           this.form[item.configName]=item.configValue*1000;
                       });
                   }
               });
           } ,
           save:function () {
               for(let key in this.form){
                   let value=this.form[key];
                   if(!value||!regex.pInt.test(value)){
                       Vue.operationFeedback({type:'warn',text:key+'数值有误，'+regex.pIntAlert});
                       return;
                   }
               }

               let params={configJSONObjectString:JSON.stringify(this.form)};
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.setBaseConfigg({apiParams:params}).then((resp)=>{
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
