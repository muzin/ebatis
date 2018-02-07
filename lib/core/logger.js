
let fs = require('fs');
let path = require('path');

function Logger(name, config){

    if('enable' in config)
        this.setEnable(config.enable);
    if('console' in config)
        this.setToConsole(config.console);
    if('file' in config)
        this.setToFile(config.file);
    if('filepath' in config)
        this.setFilepath(config.filepath);

    if(this.toFile){
        fdescripter = fs.openSync(this.filepath);
    }

}

Logger.prototype.enable = true;

Logger.prototype.toConsole = true;

Logger.prototype.toFile = false;

Logger.prototype.filepath = './';

Logger.prototype.fdescripter = null;

Logger.prototype.setEnable = function setEnable(enable){
    if(enable && typeof enable === 'boolean')
        this.enable = enable;
};

Logger.prototype.setToConsole = function setToConsole(bool){
    if(bool && typeof bool === 'boolean')
        this.toConsole = bool;
};

Logger.prototype.setToFile = function setToFile(bool){
    if(bool && typeof bool === 'boolean')
        this.toFile = bool;
};

Logger.prototype.setFilepath = function setFilepath(filepath){
    if(filepath && typeof filepath === 'string')
        this.filepath = filepath;
};

Logger.prototype.info = function info(...message){

};

Logger.prototype.log = function log(...message){

};

Logger.prototype.warn = function warn(...message){

};

Logger.prototype.error = function error(...message){

};
