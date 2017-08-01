/**
 * Created by muzin on 17-7-30.
 */



function Ebatis(){

    // save all components for Ebatis.
    this.components = {};

    this.datasources= {};

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
    console.log(arguments[0]);
    console.log(ConfigLoader(arguments[0]));

}

// Register to global object
/*
(function(_window){
    _window['ebatis'] = new Ebatis();
})('undefined' == typeof global ? window : global);
*/


function createEbatis(){
    return new Ebatis(arguments);
}

exports = module.exports = createEbatis;

