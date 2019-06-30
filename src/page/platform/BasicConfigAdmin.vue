<template>
    <div class="cm-page-content-min system-setting">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>基础配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div style="width: 420px;margin: 50px auto 0px auto;">
                    <el-form label-width="160px">
                        <el-form-item label="虚拟币名称：">
                            <el-input v-model="form.langyaCoinName" placeholder="请输入虚拟币名称"></el-input>
                        </el-form-item>
                        <el-form-item label="充值兑换比例：">
                            <span class="unit">1元=&nbsp;</span><el-input v-model="form.langyaCoinPerYuan" placeholder="请输入充值兑换比例" style="width: 150px;"></el-input><span class="unit">&nbsp;个游戏币</span>
                        </el-form-item>
                        <el-form-item label="积分设定：">
                          <el-input v-model="form.langyaCoinPerBonus" placeholder="请输入积分设定" style="width: 150px;"></el-input><span class="unit">&nbsp;个游戏币=1积分</span>
                        </el-form-item>
                        <el-form-item label="每次抽奖所需积分数：">
                            <el-input v-model="form.bonusLotteryPrice" placeholder="请输入每次抽奖所需积分数"></el-input>
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
<style lang="less" rel="stylesheet/less" scoped>
    .system-setting{
        .container{
            min-height: 500px;
        }
    }
    .unit{
        font-size: 14px;
        color: #333;
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
              account:{},
              configData:{},
              form:{}
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           getData:function () {
               Vue.api.getBaseGlobalVariable({apiParams:{}}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       this.configData=JSON.parse(resp.respMsg);
                       this.form={...this.form,...this.configData}
                   }
               });
           } ,
           save:function () {
               if(!this.form.langyaCoinName||this.form.langyaCoinName==''){
                   Vue.operationFeedback({type:'warn',text:'请输入虚拟币名称'});
                   return;
               }
               if((!this.form.langyaCoinPerYuan||this.form.langyaCoinPerYuan=='')||!regex.pInt.test(this.form.langyaCoinPerYuan)){
                   Vue.operationFeedback({type:'warn',text:'充值兑换比例数值有误，'+regex.pIntAlert});
                   return;
               }
               if((!this.form.langyaCoinPerBonus||this.form.langyaCoinPerBonus=='')||!regex.pInt.test(this.form.langyaCoinPerBonus)){
                   Vue.operationFeedback({type:'warn',text:'积分设定数值有误，'+regex.pIntAlert});
                   return;
               }
               if((!this.form.bonusLotteryPrice||this.form.bonusLotteryPrice=='')||!regex.pInt.test(this.form.bonusLotteryPrice)){
                   Vue.operationFeedback({type:'warn',text:'每次抽奖所需积分数数值有误，'+regex.pIntAlert});
                   return;
               }
               let params={...this.form}
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.updateBaseGlobalVariable({apiParams:params}).then((resp)=>{
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
