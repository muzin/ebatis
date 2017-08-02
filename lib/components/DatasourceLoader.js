/**
 * Created by muzin on 17-7-30.
 */

var DatasourceLoader = function(config){
    // If 'dataSources' is exists, continue
    if('dataSources' in config){

        // If datasources is an array, there are multiple data sources.
        if(config['dataSources'] instanceof Array){




        // else there is only one data source.
        }else{

        }

    }else{
        throw "[Error] I didn't find 'dataSources' in the configuration."
    }
}

exports = module.exports = DatasourceLoader;