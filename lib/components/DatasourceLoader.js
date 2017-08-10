/**
 * Created by muzin on 17-7-30.
 */

var DatasourceLoader = function(config){

    var datasource = [];

    // If 'dataSources' is exists, continue
    if('dataSources' in config){

        // If datasources is an array, there are multiple data sources.
        if(config['dataSources'] instanceof Array){
            for(var i = 0; i < config['dataSources'].length; i++){
                datasource.push(config['dataSources'][i]);
            }
        // else there is only one data source.
        }else{
            datasource.push(config['dataSources']);
        }

    }else{
        throw "[Error] I didn't find 'dataSources' in the configuration."
    }

    return datasource;
}

exports = module.exports = DatasourceLoader;