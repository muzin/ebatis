/**
 * Created by muzin on 17-8-2.
 */

function DataSourceList(){
    var dataSourceList = [];

    var dataSourceComp = {};

    /**
     * add data source
     */
    this.add = function(dataSource){

    }

    /**
     *
     */
    this.get = function(index){
        if(index >= 0){
            return this.dataSourceList[index];
        }else{
            console.log('[Error] When index is used to obtain data source, index is out of bounds');
            return null;
        }
    }

    this.dataSource = function(name){

    }
}

exports = module.exports = DataSourceList;
