<template>
    <div class="cm-page-content-min system-setting">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div style="width: 300px;margin: 50px auto 0px auto;">
                    <el-form label-width="40px">
                        <el-form-item label="账号">
                            <el-input v-model="form.account" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.rePassword" type="password" placeholder="请再次输入密码"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;">
                        <el-button type="primary" style="text-align: center;" @click="save()">保存密码</el-button>
                    </div>
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
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
              account:{},
              form:{

              }
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           save:function () {
               if(!this.form.password||this.form.password==''){
                   Vue.operationFeedback({type:'warn',text:'请输入密码'});
                   return;
               }
               if(this.form.password.length<6){
                   Vue.operationFeedback({type:'warn',text:'密码长度不能少于6个字符'});
                   return;
               }
               if(!this.form.rePassword||this.form.rePassword==''){
                   Vue.operationFeedback({type:'warn',text:'请再次输入密码'});
                   return;
               }
               if(this.form.password!=this.form.rePassword){
                   Vue.operationFeedback({type:'warn',text:'两次输入的密码不相等'});
                   return;
               }
               let params={
                   id:this.account.id,
                   account:this.account.account,
                   password:this.form.password,
               }
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.updatePwd({apiParams:params}).then((resp)=>{
                   if(resp.respCode=='2000'){
                       fb.setOptions({type:'complete',text:'保存成功，稍后系统将退出账号，请您重新登录'});
                       setTimeout(()=>{
                           this.logout();
                       },3000)
                   }else{
                       fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                   }
               })
           },
           logout:function () {
               Vue.cookie.set('AdminAccount','');
               let loginPage=localStorage.getItem('loginPage');
               this.$router.push({name:'login'});
           }
        },
        mounted () {
            this.account=this.getAccountInfo();
            this.form={...this.form,...this.account}
            console.log('this.form:',this.form);
        },
    }
</script>
