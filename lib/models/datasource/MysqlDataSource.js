/**
 * Created by muzin on 17-8-5.
 */

var util = require('util');
var DataSource = require('./DataSource');


function MysqlDataSource(){

}

util.inherits(MysqlDataSource, DataSource);

console.log(MysqlDataSource);
var m = new MysqlDataSource();

console.log(m);


//exports = module.exports = MysqlDataSource;