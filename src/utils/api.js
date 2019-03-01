/**
 * Created by Designer on 2017/12/21.
 */
import router from '../router'


export default {
  install: function (Vue, options) {


    Vue.http.options.emulateJSON = true;
    Vue.http.interceptors.push((request, next)  =>{

      next((response) => {
        //对于有作登录状态的接口你，未未登录时跳转到登录页
        if(response.status==401){
         /* router.push({name:''});*/
        }
        return response
      });

    });
    /*自定义ajax函数，自带的不好用*/
    Vue.http.ajax = async function (options) {
      if(options.params.apiParams){
          options.params.apiParams=JSON.stringify(options.params.apiParams);
      }
      if(options.type=='formData'){
          options.params=Vue.toFormData(options.params);
      }
      if(options.method.toUpperCase() == 'GET'){
        let res = await Vue.http.get(options.url, {params: options.params});
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }else if(options.method.toUpperCase() == 'POST'){
        let res = await Vue.http.post(options.url, options.params,);
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }
    }

      let basicUrl=Vue.appConfig.domain;

      function sessionInfo() {
          return{
              token:'',
              timeStamp:Date.parse(new Date())/1000,
              random:parseInt(Math.random()*1000000),
              signature:''
          }
      }
    Vue.api={
        //管理员登录
        login:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/admin/login',
                params: params
            });
        },
        //增加banner
        addBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/addBanner',
                type:'formData',
                params: params
            });
        },
        //编辑banner
        updateBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/updateBanner',
                type:'formData',
                params: params
            });
        },
        //获取banner列表
        getBannerList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/getBannerList',
                params: params
            });
        },
        //删除banner
        removeBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/removeBanner',
                params: params
            });
        },
        //置顶banner
        stickBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/stickBanner',
                params: params
            });
        },
        //banner排序
        swapBannerSort:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/swapBannerSort',
                params: params
            });
        },
        //获取游戏列表
        getGameList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/getGameList',
                params: params
            });
        },
        //增加游戏
        addGame:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/banner/addGame',
                type:'formData',
                params: params
            });
        },
        //增加会员计划
        addMemberPlan:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/vipType/addVipType',
                type:'formData',
                params: params
            });
        },
        //编辑会员计划
       updateMemberPlan:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/vipType/updateVipType',
                type:'formData',
                params: params
            });
        },
        //获取会员计划列表
        getMemberPlanList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/vipType/getVipTypeList',
                params: params
            });
        },
        //获取运营日报
        getDailyReportData:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/outcomes/getOutcomesList',
                params: params
            });
        },
        //获取用户列表
        getUserList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/user/getUserList',
                params: params
            });
        },
        //更新用户状态
        updateUserState:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/user/updateUserState',
                params: params
            });
        },
        //获取礼物列表
        getGiftList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/getGiftList',
                params: params
            });
        },
        //添加礼物
        addGift:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/addGift',
                type:'formData',
                params: params
            });
        },
        //更新礼物
        updateGift:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/updateGift',
                type:'formData',
                params: params
            });
        },
        //删除礼物
        removeGift:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/removeGift',
                params: params
            });
        },
        //置顶礼物
        stickGift:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/stickGift',
                params: params
            });
        },
        //礼物排序
        swapGiftSort:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/gift/swapGiftSort',
                params: params
            });
        },
    }
  },

}
