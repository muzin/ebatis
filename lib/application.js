
var scope = require('./scope');
var mixin = require('./utils/mixin');
var SqlChainFactory = require('./chain/sqlchainfactory');
var ConfigParser    = require('./parser/configparser');


var app = exports = module.exports = {};

/**
 * Initinalize the application
 */
app.init = function init() {
    this.$scope = scope;
    this.$root = null;

    this.defineConfiguration();
};

/**
 * initialize application configure
 */
app.defineConfiguration = function defineConfiguration(){

    this.on('setrootpathfinish', function setrootpathfinish(){



    });

    // 监听加载配置文件完成
    this.on('loadconfigfinish', function onconfigfinish(obj){
        console.log('接收到配置完成事件')

        if(this.$root)
            ConfigParser.rootpath = this.$root;

        ConfigParser.parse(obj, ()=>{
            this.emit('finish');
        });

        this.emit('parseconfigfinish');
    });

    // 监听开始配置文件解析
    this.on('parseconfigfinish', function parseconfigfinish(){
        console.log('监听配置文件解析事件');


    });




};

/**
 * load configure info and other info
 * @param name
 * @param obj
 */
app.load = function load (name, obj){
    var _self = this;
    var $scope = this.getScope();
    if('config' === name){
        $scope[name + 'scope'] = mixin.extend(obj, $scope[name + 'scope']);
    }

};

/**
 * load config info
 * @param obj
 */
app.loadConfig = function loadConfig (obj) {
    var _self = this;
    this.load('config', obj);
    this.emit('loadconfigfinish', this.getScope('config'));
};

/**
 * get scope
 * @returns {*|Scope}
 */
app.getScope = function getScope(name){
    var _self = this;
    if(name){
        return this.$scope[name + 'scope'];
    }else{
        return this.$scope;
    }

};

/**
 * @param rootpath
 */
app.setRootPath = function setRootPath(rootpath){
    this.$root = rootpath;
}