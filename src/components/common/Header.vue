<template>
    <div class="header">
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="title">
            <i class="icon logo-icon"></i><span>琅琊岛后台管理系统</span>
        </div>
        <div class="user-info">
            <span class="greed"> 您好，管理员</span>
            <el-button  size="mini" type="" class="logo-out-btn" @click="logout()">
                退出登录
            </el-button>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                name: 'linxin',
                accountInfo:{},
            }
        },
        computed:{

        },
        methods:{
            logout(command) {
                Vue.cookie.set('account','');
                let loginPage=localStorage.getItem('loginPage');
                this.$router.push({name:loginPage?loginPage:'login'});
            },
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
        },
        created(){
           /* this.accountInfo=this.getAccountInfo();*/
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color: #fff;
        background: #0d2249;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
    }
    .collapse-btn:hover{
        background: rgb(40,52,70);
    }
    .header .logo-icon{
        position: relative;
        display: inline-block;
        background: url("../../images/common/logo.png") no-repeat;
        width: 35px;
        height: 35px;
        background-size: 100% 100%;
        margin-right: 5px;
    }
    .title{
        margin-left: 10px;
        float: left;
        height: 60px;
        display: flex;
        align-items: center;
        font-size: 22px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 18px;
        color: #fff;
    }
   .user-info  .greed{
       font-size: 12px;
   }
    .logo-out-btn{
        margin-left: 10px;
    }
</style>
