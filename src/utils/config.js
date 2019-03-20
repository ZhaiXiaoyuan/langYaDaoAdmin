
/*基础配置*/
export default {
    install: function (Vue, options) {
        let isDev=process.env.NODE_ENV=='development';
        Vue.appConfig={
            domain:'http://api.linqi.tech',
          /*  domain:isDev?'http://api.linqi.tech':'http://api.globalmazu.org:8801',*/
            domain2:isDev?'http://api.linqi.tech:8600':'',
            fileDomain:isDev?'http://api.linqi.tech':'',
        }
    },
}
