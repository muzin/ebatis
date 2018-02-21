/**
 * Created by muzin on 2018-01-26 01:13:05.
 */

function DataSourceParser(){}

/**
 * 加载数据源配置
 * @param datasource
 * @returns {{}}
 */
DataSourceParser.prototype.parse = function parse(datasource){

    let ret = {};
    let dslist = [];

    if(datasource instanceof Array){
        dslist.concat(datasource);
    } else {
        dslist.push(datasource);
    }

    if(dslist.length == 1 && !('_name' in dslist[0]) && dslist[0]['_name'] == ''){
        dslist[0]['_name'] = 'default';
    }

    for(let ds of dslist){
        if('_name' in ds){
            let dsname = ds['_name'];
            ret[dsname] = ds;
        }
    }

    return ret;
}

exports = module.exports = new DataSourceParser();