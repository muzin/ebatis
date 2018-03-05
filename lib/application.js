
var scope = require('./scope');
var mixin = require('./utils/mixin');
var SqlChainFactory = require('./chain/sqlchainfactory');
var ConfigParser    = require('./parser/configparser');
var Logger          = require('./core/logger');

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

    this.on('setrootpathfinish', function setrootpathfinish(){ });

    // 监听加载配置文件完成
    this.on('loadconfigfinish', function onconfigfinish(obj){
        var logger_default = mixin.extend({
            enable : true,
            console : true
        }, obj.logger || {});

        var logger = new Logger('out', logger_default);
        var sqlChainLogger = new Logger('sqlchain', logger_default);
        this.Logger = logger;
        this.SqlChainLogger = sqlChainLogger;

        this.Logger.info('Load config info');

        if(this.$root)
            ConfigParser.rootpath = this.$root;

        ConfigParser.parse(obj, ()=>{
            this.Logger.info('Load config info is finished');
            this.emit('finish');
        });

        //this.emit('parseconfigfinish');
    });

    //this.on('parseconfigfinish', function parseconfigfinish(){ });

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