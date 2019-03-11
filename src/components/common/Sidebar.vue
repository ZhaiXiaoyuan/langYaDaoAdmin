<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#0d2249"
            text-color="#bfcbd9" active-text-color="#0fa9fb" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" :popper-class="'sub-menu'">
                        <template slot="title" :class="'submenu'">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="item.icon"></use>
                            </svg>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item  v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" :class="{'active':subItem.index.indexOf(pageName)>-1}">
                            &nbsp;&nbsp; &nbsp;&nbsp;
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" :class="{'active':item.index.indexOf(pageName)>-1}">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.icon"></use>
                        </svg>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .sidebar{
        display: block;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 60px;
        bottom:0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 220px;
    }
    .sidebar > ul {
        height:100%;
    }
    .icon{
        width: 18px;
        height: 18px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .el-menu-item.active{
        color: #0fa9fb !important;
    }
</style>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                pageName:null,
                collapse: false,

                itemsConfig:[
                    {
                        code:'01',
                        icon: '#icon-tongji',
                        index: '/dailyReportAdmin',
                        title: '运营日报',
                    },
                    {
                        code:'02',
                        icon: '#icon-kehu',
                        index: 'user',
                        title: '用户管理',
                        subs:[
                            {
                                code:'021',
                                index: '/customerAdmin',
                                title: '用户管理',
                            },
                            {
                                code:'022',
                                index: '/blacklistAdmin',
                                title: '黑名单管理',
                            }
                        ],
                    },
                    {
                        code:'03',
                        icon: '#icon-ico_AD',
                        index: 'platform',
                        title: '平台管理',
                        subs:[
                            {
                                code:'031',
                                index: '/bannerAdmin',
                                title: 'banner管理',
                            },
                            {
                                code:'032',
                                index: '/memberPlanAdmin',
                                title: '会员计划管理',
                            },
                            {
                                code:'033',
                                index: '/giftAdmin',
                                title: '礼物管理',
                            },
                            {
                                code:'034',
                                index: '/basicConfigAdmin',
                                title: '基础配置',
                            },
                        ],
                    },
                    {
                        code:'04',
                        icon: '#icon-iconfontyouxihudong',
                        index: '/gameAdmin',
                        title: '游戏管理',
                    },
                    {
                        code:'05',
                        icon: '#icon-ico_AD',
                        index: 'draw',
                        title: '转盘管理',
                        subs:[
                            {
                                code:'051',
                                index: '/configAdmin',
                                title: '基础配置',
                            },
                            {
                                code:'052',
                                index: '/drawRecord',
                                title: '中奖纪录',
                            },
                        ],
                    },
                ],
                items: []
            }
        },
        computed:{
            onRoutes(){
                this.pageName=this.$route.name;
                return this.$route.path.replace('/','');
            }
        },
        created(){
            //
            this.pageName=this.$route.name;
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
            //
            this.accountInfo=this.getAccountInfo();
            this.accountAccess=null;
            //临时测试
            if(true||this.accountInfo.type=='superManager'){
                this.accountAccess=['01','02','03','04','05','06','07'];
               /* this.accountAccess='all';*/
            }else if(this.accountInfo.type=='marketManager'){
                this.accountAccess=['01','02','10'];
            }else if(this.accountInfo.type=='accountantManager'){
                this.accountAccess=['03'];
            }else if(this.accountInfo.type=='userManager'){
                this.accountAccess=['06','07','08'];
            } else if(this.accountInfo.type=='shopManager'){
               /* this.accountAccess=['07','08'];*/
            }
            if(this.accountAccess=='all'){
                this.items=this.itemsConfig;
            }else if(this.accountAccess&&this.accountAccess.length>0){
                this.accountAccess.forEach((value,index)=>{
                    for(let i=0;i<this.itemsConfig.length;i++){
                        if(value==this.itemsConfig[i].code){
                            this.items.push(this.itemsConfig[i]);
                        }
                    }
                })
            }
        }
    }
</script>
