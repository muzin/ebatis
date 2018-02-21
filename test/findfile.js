
var gulp = require('gulp')


var fs = require('fs');
var path = require('path');

//                       /home/muzin/ebatis/xml/**/*.xml
var filelist = [];

/*
var rootdir = '../lib';
var rootdirreg = '../lib/utils/!**!/!*.js';
var crt_path = __dirname;
function bianli(dir){

    var stat = fs.statSync(dir);
    if(stat.isDirectory()){
        var files = fs.readdirSync(dir);
        //console.log(files);
        for(var f of files){
            bianli(`${ dir }/${ f }`);
        }
    }else{
        filelist.push(dir);
    }
}

var rootdirs = path.resolve(crt_path, rootdir);
var rootdirsregs = path.resolve(crt_path, rootdirreg);

bianli(rootdirs);

console.log(rootdirs);
console.log(rootdirsregs);

var xing = rootdirsregs.replace(rootdirs, '');
console.log(xing);

console.log(filelist);


*/












var filename = [
    '/home/muzin/ebatis/xml/aa/bb/abc.xml',
    '/home/muzin/ebatis/xml/aa/bb/abc1.xml',
    '/home/muzin/ebatis/xml/aa/abc2.xml',
    '/home/muzin/ebatis/xml/aa/abc3.xml'
];

/*
var regstr = '/home/muzin/ebatis/xml/!**!/!*.xml';
var regstr2 = regstr.replace(/\//g,'\\/');
var reg = new RegExp(regstr2, 'g');
*/

var g = gulp.src('./*.xml').on('data',function(file){
    filelist.push(file.history[0]);
}).on('end', function(e){
    console.log(filelist);
});



 /*   .pipe(function(e){
    console.log(e);
});*/

//console.log(1);

/*

filename.map((name)=>{

    console.log(reg.test(name));


})*/
