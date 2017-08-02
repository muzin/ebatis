/**
 * Created by muzin on 17-7-30.
 */
var fs = require('fs');

/**
 * After you load the configuration, return a JSON object that records the configuration
 * @constructor
 */
var ConfigLoader = function(){

    var ret = {};

    // If you have no arguments, go to the project directory
    // to find the configuration file for Ebatis
    if(arguments.length == 0){

        var configJsFilePath = process.cwd() + '/EbatisConfig.js',
            configJsonFilePath = process.cwd() + '/EbatisConfig.json',
            isExistsConfigJs = fs.existsSync(configJsFilePath),
            isExistsConfigJson =fs.existsSync(configJsonFilePath);

        if(isExistsConfigJs){
            try{
                ret = require(configJsFilePath);
            }catch(e){
                console.log("[Error] I made an error loading the JS configuration file. " +
                    "Please check the JS configuration file. " +
                    "Maybe you forget add 'exports = module.exports = {object}'")
            }
        }else if(isExistsConfigJson){
            var fileData = fs.readFileSync(configJsonFilePath);
            try {
                ret = fileData ? JSON.parse(fileData) : {};
            }catch(e){
                console.log("[Error] I have made an error while parsing the JSON configuration file. " +
                    "Please check the JSON configuration file.");
            }
        }else{
            console.log("[Error] I didn't find configuration file For Ebatis." )
        }

        // If there is a parameter that determines whether the parameter is a string or JSON object,
        // the configuration information is resolved by type
    }else if(arguments.length == 1){
        if(typeof arguments[0] == 'string'){                                // if param is string
            var path = arguments[0],
                configFileType = path.endsWith('js') ? 'js' : 'json',
                isExistsConfigFile = fs.existsSync(process.cwd() + '/' + path);

            if(isExistsConfigFile){                                         // if find configuration file, load
                if(configFileType == 'js'){
                    ret = require(process.cwd() + '/' + path);
                }else{
                    ret = JSON.parse(fs.readFileSync(configJsonFilePath));
                }
            }else{
                console.log("[Error] I didn't find configuration file For Ebatis." )
            }
        }else if(typeof arguments[0] == 'object'){                          // if param is object of json
            ret = arguments[0];
        }else{
            throw '[Error] I\'m Sorry. The params is not available for configuration info of Ebatis.';
        }
    }

    return ret;

}


module.exports = ConfigLoader;