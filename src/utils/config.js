
/*基础配置*/
export default {
    install: function (Vue, options) {
        let isDev=process.env.NODE_ENV=='development';
        Vue.appConfig={
            domain:'http://39.108.252.213:8601',
          /*  domain:isDev?'http://api.linqi.tech':'http://api.globalmazu.org:8801',*/
            domain2:isDev?'http://zyugoodluck.vicp.cc:15852':'http://api.globalmazu.org:8801',
            fileDomain:isDev?'http://1493v261y2.51mypc.cn:40805':'http://www.globalmazu.org/',
        }
    },
}
