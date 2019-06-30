
/*基础配置*/
export default {
    install: function (Vue, options) {
        let isDev=process.env.NODE_ENV=='development';
        //临时测试
        isDev=false;
        Vue.appConfig={
            domain:isDev?'/api':'http://www.31ent.com',
            domain2:isDev?'http://api.linqi.tech:8600':'http://www.31ent.com:8600',
            domain3:isDev?'http://api.linqi.tech:8602':'http://www.31ent.com:8602',
            fileDomain:isDev?'http://api.linqi.tech':'http://www.31ent.com',
        }
    },
}
