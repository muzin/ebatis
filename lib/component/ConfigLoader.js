/**
 * Created by muzin on 17-7-30.
 */

/**
 * After you load the configuration, return a JSON object that records the configuration
 * @constructor
 */
var ConfigLoader = function(){

    var ret = {};

    // If you have no arguments, go to the project directory
    // to find the configuration file for Ebatis
    if(arguments.length == 0){


        // If there is a parameter that determines whether the parameter is a string or JSON object,
        // the configuration information is resolved by type
    }else if(arguments.length == 1){
        if(typeof arugments[0] == 'string'){

        }else if(typeof arguments[0] == 'object'){
            var conf = JSON.parse(arugments[0]);




        }else{
            throw '[Error] I\'m Sorry. The params is not available for Ebatis.';
        }
    }

    return ret;

}


module.exports = ConfigLoader;