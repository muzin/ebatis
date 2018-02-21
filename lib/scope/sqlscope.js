/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
function SqlScope(){

    this.namespace = null;
    this.includes = new SqlIncludeScope();
    this.datasource = null;
    this.connectioner = null;
    this.sqls = {};

}

SqlScope.prototype.add = function(fn){
    var fnname = fn.name;
    this[fnname] = fn;
    return this;
};

function SqlIncludeScope(){}

SqlIncludeScope.prototype.get = function(name){
    let ret = null;
    if(name in this)
        ret = this[name];
    return ret;
};

exports = module.exports = SqlScope;