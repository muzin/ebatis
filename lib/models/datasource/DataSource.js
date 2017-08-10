/**
 * Created by muzin on 17-8-5.
 */

function DataSource(config){

    var type = null;

    var name = null;

    var info = null;

    var database = {
        tables : {                      // Table Model

        },
        mappers : {                     // Mapper ( Dynamic Sql )

        },
        connection : function(){
            this.connectionProto().getConnection()
        },
        connectionProto : function(){

        }
    };


    this.getType = function(){
        return type;
    }

    this.getName = function(){
        return name;
    }

    this.getInfo = function(){
        return info;
    }

    this.getDatabase = function(){
        return dataSource;
    }

    this.getTable = function(name){
        if(name in database.tables){
            return database.tables[name];
        }else{
            return null;
        }
    }

    this.getMapper = function(name){
        if(name in database.mappers){
            return database.mappers[name];
        }else{
            return null;
        }
    }


}

exports = module.exports = DataSource;