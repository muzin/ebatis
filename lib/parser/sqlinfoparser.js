/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let libxmljs = require("libxmljs");
let fs = require('fs');

let sqlTmplParser = require('./sqltmplparser');

/**
 * 格式化属性
 * @param attrs
 * @returns { Object }
 */
function parseAttrs(attrs){
    return attrs.reduce((collector, item) => { collector[item.name()] = item.value(); return collector; },{});
}
/**
 * 获取sqls 的 信息
 * 将sql 解析成
 * {
 *      name,
 *      attr,
 *      nodes
 * }
 * @param collector
 * @param item
 * @returns {Array}
 */
function getSqlsInfo(collector, item) {

    let name = item.name();
    let attrs = parseAttrs(item.attrs());
    let nodes = getSqlNodes(item);

    if(!~['text','comment'].indexOf(name)){
        collector.push({
            name,
            attrs,
            nodes
        });
    }

    return collector;
}

/**
 * 递归查找出所有子节点的信息
 * @param node
 * @returns {*|Uint8Array|any[]|Int32Array|Uint16Array|Uint32Array}
 */
function getSqlNodes(node){

    let nodes = node.childNodes();

    return nodes.map((item)=>{

        let ret = null;

        let name = item.name();

        if(!~['text','comment'].indexOf(name)){

            let attrs = parseAttrs(item.attrs());

            let nodes = getSqlNodes(item);

            ret = {
                name,
                attrs,
                nodes
            }
        }else{
            ret = {
                name,
                text : sqlTmplParser(item.text())
            }
        }

        return ret;

    });

}

/**
 * 获取根节点的信息
 * @param root
 * @returns {{namespace: *|string, attrs: Object}}
 */
function getRootInfo(root){
    let attrs = parseAttrs(root.attrs());
    return {
        namespace : attrs['namespace'] || '',
        database : attrs['database'] || '',
        attrs : attrs
    }
}

exports = module.exports = {
    parseXmlFile : function(filepath){

        let xml =  fs.readFileSync(filepath).toString();
        let xmlDoc = null;
        try{
            xmlDoc = libxmljs.parseXml(xml);
        }catch(e){
            console.error('error file:', filepath)
            console.error('line:', e.line, 'column:', e.column, 'error:', e.message)
        }

        if(!xmlDoc) return;

        let root = xmlDoc.root();
        let childrens = root.childNodes();
        let sqlChilds = childrens.reduce(getSqlsInfo, []);

        let rootInfo = getRootInfo(root);
        rootInfo.sqlInfos = sqlChilds;

        return rootInfo;
    },
    parseXmlData : function(data){

        let xmlDoc = null;
        try{
            xmlDoc = libxmljs.parseXml(xml);
        }catch(e){
            console.error('line:', e.line, 'column:', e.column, 'error:', e.message)
        }

        if(!xmlDoc) return;

        let root = xmlDoc.root();
        let childrens = root.childNodes();
        let sqlChilds = childrens.reduce(getSqlsInfo, []);

        let rootInfo = getRootInfo(root);
        rootInfo.sqlChilds = sqlChilds;

        return rootInfo;
    }
}
