/**
 * Created by muzin on 17-7-30.
 */



function Ebatis(){

    // save all components for Ebatis.
    this.components = {};

    this.configuration = {};

    this.datasources= [];

    this.databases = {};


    //
    this.loadComp = function(name){
        if(typeof name == 'string'){
            var destComponent = require('./components/' + name);

            if(destComponent){
                this.components[name] = destComponent;
                console.log("[Success] I found it and loaded it. (" + name + ")");
            }else{
                console.log("[Warn] I\'m Sorry. I didn't load this Component (" + name + "). " +
                    "I can't find it in the components directory");
            }
        }else if(name instanceof Array){
            for(var i = 0; i < name.length; i++){
                var item = name[i];
                var destComponent = require('./components/' + item);
                if(destComponent){
                    this.components[item] = destComponent;
                    console.log("[Success] I found it and loaded it. (" + item + ")");
                }else{
                    console.log("[Warn] I\'m Sorry. I didn't load this Component (" + item + "). " +
                        "I can't find it in the components directory");
                }
            }
        }
    }

    this.getComp = function (name){
        if(name in this.components){
            return this.components[name];
        }else{
            console.log("[Warn] I\'m Sorry. I didn't find this Component (" + name + ").");
            return null;
        }
    }


    // load Components
    this.loadComp([
        'ConfigLoader',
        'DatasourceConfigParser',
        'DatasourceLoader',
        'DatabaseConnectionParser',
        'DatabaseConnectionLoader',
        'DatabaseConnectionTester',
        'DatabaseTableStructLoader',
        'DatabaseDynamicSqlLoader'
    ]);


    var ConfigLoader = this.getComp('ConfigLoader');
    this.configuration = ConfigLoader(arguments[0]);

    var DatasourceLoader = this.getComp('DatasourceLoader');
    this.datasources = DatasourceLoader(this.configuration);

}

// Register to global object
/*
(function(_window){
    _window['ebatis'] = new Ebatis();
})('undefined' == typeof global ? window : global);
*/

var ebatis = null;


function createEbatis(){

    if(ebatis != null)
        return ebatis;

    console.log(arguments)
    if(arguments.length == 0){
        ebatis = new Ebatis();
    }else if(arguments.length == 1){
        ebatis = new Ebatis(arguments[0]);
    }else if(arugments.length == 2){
        ebatis = new Ebatis(arguments[0], arguments[1]);
    }else{
        throw '[Error] The param is not available.'
    }

    return ebatis;
}

exports = module.exports = createEbatis;

