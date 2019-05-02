import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/customerAdmin',
                    name:'customerAdmin',
                    component: resolve => require(['../page/customer/CustomerAdmin.vue'], resolve)
                },
                {
                    path: '/blacklistAdmin',
                    name:'blacklistAdmin',
                    component: resolve => require(['../page/customer/BlacklistAdmin.vue'], resolve)
                },
                {
                    path: '/bannerAdmin',
                    name:'bannerAdmin',
                    component: resolve => require(['../page/platform/BannerAdmin.vue'], resolve)
                },
                {
                    path: '/gameAdmin',
                    name:'gameAdmin',
                    component: resolve => require(['../page/platform/GameAdmin.vue'], resolve)
                },
                {
                    path: '/memberPlanAdmin',
                    name:'memberPlanAdmin',
                    component: resolve => require(['../page/platform/MemberPlanAdmin.vue'], resolve)
                },
                {
                    path: '/dailyReportAdmin',
                    name:'dailyReportAdmin',
                    component: resolve => require(['../page/report/DailyReportAdmin.vue'], resolve)
                },
                {
                    path: '/giftAdmin',
                    name:'giftAdmin',
                    component: resolve => require(['../page/platform/GiftAdmin.vue'], resolve)
                },
                {
                    path: '/basicConfigAdmin',
                    name:'basicConfigAdmin',
                    component: resolve => require(['../page/platform/BasicConfigAdmin.vue'], resolve)
                },
                {
                    path: '/drawConfigAdmin',
                    name:'drawConfigAdmin',
                    component: resolve => require(['../page/draw/ConfigAdmin.vue'], resolve)
                },
                {
                    path: '/drawRecord',
                    name:'drawRecord',
                    component: resolve => require(['../page/draw/Record.vue'], resolve)
                },
                {
                    path: '/rechargeOrderAdmin',
                    name:'rechargeOrderAdmin',
                    component: resolve => require(['../page/order/RechargeOrderAdmin.vue'], resolve)
                },
                {
                    path: '/vipOrderAdmin',
                    name:'vipOrderAdmin',
                    component: resolve => require(['../page/order/VipOrderAdmin.vue'], resolve)
                },
                {
                    path: '/rateAdmin',
                    name:'rateAdmin',
                    component: resolve => require(['../page/zodiac/RateAdmin.vue'], resolve)
                },
                {
                    path: '/roomAdmin',
                    name:'roomAdmin',
                    component: resolve => require(['../page/zodiac/RoomAdmin.vue'], resolve)
                },
                {
                    path: '/zodiacBasicConfigAdmin',
                    name:'zodiacBasicConfigAdmin',
                    component: resolve => require(['../page/zodiac/BasicConfigAdmin.vue'], resolve)
                },
                {
                    path: '/manorAdmin',
                    name:'manorAdmin',
                    component: resolve => require(['../page/manor/ManorAdmin.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            name:'login',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
    ]
})
