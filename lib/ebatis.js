
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Yaml = require('yamljs');
var gulp = require('gulp');

var proto = require('./application');
var mixin = require('./utils/mixin');
var SqlChainFactory = require('./chain/sqlchainfactory');
var Scope = require('./scope');


function Ebatis(){};
var app = Ebatis;

Ebatis.setRootPath = function setRootPath(rootpath){
    this.$root = rootpath;
};

/**
 * load config info
 * @param obj
 */
Ebatis.loadConfig = function loadConfig (obj) {

    if(!('$root' in this)){
        console.warn('root path is null');
    }

    this.load('config', obj);
    this.emit('loadconfigfinish', this.getScope('config'));
};

/**
 * @deprecated
 * @param filename
 */
Ebatis.loadConfigFile = function loadConfigFile (filename) {

    let filepath = filename.toLowerCase();

    let config = {};

    if(filepath.endsWith('yml')){
        config = Yaml.load(filename);
    } else if(filepath.endsWith('js')){
        config = require(filename);
    } else if(filepath.endsWith('json')){
        config = JSON.parse(fs.readFileSync(filename).toString());
    }

    this.load('config', config);
    this.emit('loadconfigfinish', this.getScope('config'));
};

/**
 * @deprecated
 * @param data
 */
Ebatis.loadMapper = function (data){ };
/**
 * @deprecated
 * @param file
 */
Ebatis.loadMapperFile = function (file){
    var filedata = fs.readFileSync(file);
    this.loadMapper(filedata);
};

/**
 * ebatis 装载完成的回调函数
 * @private
 */
Ebatis._finish = function _finish(){  };

/**
 * 设置ebatis装载完成的回调函数
 * @param callback
 */
Ebatis.finish = function finish (callback){
    if(callback instanceof Function){
        this._finish = callback;
    }
    this.on('finish', this._finish);
};

/**
 * 获取mapper对象
 * @param name
 * @returns {*}
 */
Ebatis.getMapper = function getMapper(name){
    let mapperScope = Scope.getScope('mapper');
    return mapperScope[name];
};

/**
 * @deprecated
 * @param bool
 */
Ebatis.dev = function devMode(bool = false){
    if(!bool) return;

    gulp.watch('./**/**.js');

};

mixin.extend(app, EventEmitter.prototype);
mixin.extend(app, proto);


app.init();

function createApplication(){
    return app;
}

exports = module.exports = createApplication;
exports.application = proto;

/**
 * exports SqlChainFactory
 * @type {SqlChainFactory}
 */
exports.SqlChainFactory = SqlChainFactory;