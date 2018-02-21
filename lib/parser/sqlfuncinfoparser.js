/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let sqlinfoparser = require('./sqlinfoparser');


function SqlFuncInfoParser(mapper){

    this.mapper = mapper;
    this.includes = {};

}

exports = module.exports = SqlFuncInfoParser;

SqlFuncInfoParser.prototype.parse = function parse(){
    var {namespace, database, sqlInfos} = sqlinfoparser.parseXmlFile(this.mapper);
    return sqlInfos.reduce((collector, sql) => {

        let name = sql.name;
        let attrs = sql.attrs;
        let nodes = sql.nodes;
        let func_name = attrs['id'];
        let func_param = attrs['param'] || '';

        if(~[undefined, null, ''].indexOf(func_name))
            throw Error(`id cannot be null. Namespace [${ namespace }] ${ name }`);

        if(name == 'sql'){
            this.includes[func_name] = sql;
        }else{
            let func_code = this.parseXmlNodes(nodes).replace(/\n/g, '\n\t');
            let code = this.generSqlInfoCode({
                name :func_name,
                param : func_param,
                code : func_code
            });

            let cod = null;
            try{
                cod = eval(`global.__temp__ = ${ code }`);
            }catch(e){
                throw ReferenceError(code + "\n\n" + e);
            }


            collector[attrs['id']] = cod;
        }
        return collector;
    },{
        _namespace : namespace,
        _database : database,
        _includes:this.includes,
        _srcpath : this.mapper
    });
};


SqlFuncInfoParser.prototype.parseXmlData = function parse(xmldata){
    var {namespace, database, sqlInfos} = sqlinfoparser.parseXmlData(xmldata);
    return sqlInfos.reduce((collector, sql) => {

        let name = sql.name;
        let attrs = sql.attrs;
        let nodes = sql.nodes;
        let func_name = attrs['id'];
        let func_param = attrs['param'] || '';

        if(~[undefined, null, ''].indexOf(func_name))
            throw Error(`id cannot be null. Namespace [${ namespace }] ${ name }`);

        if(name == 'sql'){
            this.includes[func_name] = sql;
        }else{
            let func_code = this.parseXmlNodes(nodes).replace(/\n/g, '\n\t');
            let code = this.generSqlInfoCode({
                name :func_name,
                param : func_param,
                code : func_code
            });

            let cod = null;
            try{
                cod = eval(`global.__temp__ = ${ code }`);
            }catch(e){
                throw ReferenceError(code + "\n\n" + e);
            }


            collector[attrs['id']] = cod;
        }
        return collector;
    },{
        _namespace : namespace,
        _database : database,
        _includes:this.includes,
        _srcpath : this.mapper
    });
};

/**
 * 生成sql调用函数
 * @param name
 * @param param
 * @param code
 * @returns {string}
 */
SqlFuncInfoParser.prototype.generSqlInfoCode = function generSqlInfoCode({name, param, code}){
    let ret = '';
    ret += `function ${ name }(${ param }) {\n`;
    ret += `   var __values__ = [];\n`;
    ret += `   var __sql__ = '';\n`;
    ret += `   ${ code }\n`;
    ret += `   return {sql : __sql__, values : __values__ };\n`;
    ret += `}\n`;
    return ret;
}

/**
 * 解析标签下的各个节点
 * @param nodes
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlNodes = function parseXmlNodes(nodes){
    let ret = '';
    nodes.map((item)=>{
        ret += `${ this.parseXmlNode(item) }`
    });
    return ret;
}

/**
 * 解析xml中的各种节点
 * @param node
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlNode = function parseXmlNode(node){
    let name = node.name;
    let ret = '';

    switch(name){
        case 'text':
            ret = this.parseXmlText(node);
            break;
        case 'fortext':
            ret = this.parseXmlForText(node);
            break;
        case 'if':
            ret = this.parseXmlIf(node);
            break;
        case 'for':
            ret = this.parseXmlFor(node);
            break;
        case 'set':
            ret = this.parseXmlSet(node);
            break;
        case 'where':
            ret = this.parseXmlWhere(node);
            break;
        case 'choose':
            ret = this.parseXmlChoose(node);
            break;
        case 'when':
            ret = this.parseXmlWhen(node);
            break;
        case 'otherwise':
            ret = this.parseXmlOtherwise(node);
            break;
        case 'include':
            ret = this.parseXmlInclude(this.includes[node.attrs['ref']]);
            break;
        default :
            break;
    }

    return ret;
}

/**
 * 解析xml中的include标签
 * @param node
 */
SqlFuncInfoParser.prototype.parseXmlInclude = function parseXmlInclude(node){
    return this.parseXmlNodes(node.nodes);
};

/**
 * 解析if标签
 * @param attrs
 * @param nodes
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlIf = function parseXmlIf({attrs, nodes, __prt_var__ = '__sql__'}){
    let test = attrs['test'] || '';
    let istest = test.trim() != '';
    let ret = '';

    if(istest){
        test = test.replace(/\t\r\n/g, ' ').replace(/\ and\ /g, ' && ').replace(/\ or\ /g, ' || ');
        ret += `\nif(${ test }) {\n`;

        nodes.map((item)=>{
            item.__prt_var__ = __prt_var__;
            ret += this.parseXmlNode(item).replace(/\n/g, '\n\t');
        });

        ret += `\n}\n`;
    }

    return ret;
}

/**
 * 解析xml中的for标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlFor = function parseXmlFor({attrs, nodes, __prt_var__ = '__sql__'}){
    let suffix = attrs['suffix'] || '';
    let prefix = attrs['prefix'] || '';
    let separate = attrs['separate'] || '';
    let varr = attrs['var'];

    let ret = '';

    if(suffix != '')
        ret += `\t\t${ __prt_var__ } += '${suffix}';\n`;

    let v = varr.trim().startsWith('var ') || varr.trim().startsWith('let ');
    ret += `{\n\tlet __forsqls__ = [];\n`;
    ret += `\tfor(${ v ? varr : 'var ' + varr }) {\n`;

    ret += `\t\tlet __forinnersql__ = '';\n`;

    if(nodes.length > 0)
        this.changeTextToForText(nodes);

    let subret = nodes.reduce((collector, item)=>{
        item.__prt_var__ = '__forinnersql__';
        let ret = this.parseXmlNode(item).replace(/\n/g, '\n\t\t');
        if(ret != ''){
            collector.push(ret);
        }
        return collector;
    }, []);

    subret.map((item)=>{
       ret += `${ item }\n`;                                                    // join sub sql
    });

    ret += `\t\t__forsqls__.push(__forinnersql__); `;                           // join forinnersql to forsqls
    ret += `\n\t}\n`;                                                           // for end
    ret += `\t${ __prt_var__ } += __forsqls__.join('${ separate }');`           // merge forsqls data
    ret += `\n}\n`;                                                             // let end

    if(prefix != '')                                                            // if prefix is not '', then join prefix
        ret += `${ __prt_var__ } += '${prefix}';\n`;

    return ret;
};

SqlFuncInfoParser.prototype.changeTextToForText = function changeTextToForText(nodes){
    if(nodes != undefined && nodes != null && nodes.length > 0){
        nodes.map((item) => {
            if (item.name == 'text') {
                item.name = 'fortext';
            } else {
                this.changeTextToForText(item.nodes);
            }
        });
    }
}

/**
 * 解析xml中的where标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlWhere = function parseXmlWhere({attrs, nodes, __prt_var__ = '__sql__'}){
    let ret = '';
    let whereitems = [];
    ret += `${ __prt_var__ } += '\\nWHERE\\n';\n`;

    ret += `{\n\tlet __wheresql__ = [];\n`;
    nodes.map((item)=>{
        item.__prt_var__ = '__wheresql__';
        let subret = this.parseXmlNode(item).replace(/\n/g, '\n\t');
        if(subret != '')
            whereitems.push(subret);
    });

    ret += whereitems.join('\n');

    ret += `${ __prt_var__ } += __wheresql__.join('\\nAND\\n');\n`;
    ret += `}\n`;

    return ret;
}

/**
 * 解析xml中的set标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlSet = function parseXmlSet({attrs, nodes, __prt_var__ = '__sql__'}){
    let ret = '';
    let setitems = [];
    ret += `${ __prt_var__ } += '\\nSET\\n';\n`;

    ret += `{\n\tlet __setsql__ = [];\n`;
    nodes.map((item)=>{
        item.__prt_var__ = '__setsql__';
        let subret = this.parseXmlNode(item).replace(/\n/g, '\n\t');
        if(subret != '')
            setitems.push(subret);
    });

    ret += setitems.join('\n');

    ret += `${ __prt_var__ } += __setsql__.join(',\\n');\n`;
    ret += `}\n`;


    return ret;
}

/**
 * 解析xml中的choose标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 */
SqlFuncInfoParser.prototype.parseXmlChoose = function parseXmlChoose({attrs, nodes, __prt_var__ = '__sql__'}){

    let ret = '';
    let setitems = [];
    let chooseitems = [];

    nodes.map((item)=>{
        item.__prt_var__ = __prt_var__;
        let subret = this.parseXmlNode(item);
        if(subret != '')
            chooseitems.push(subret);
    });

    for(let i = 0; i < chooseitems.length; i++){
        if(i == 0){
            ret += '\t';
        }else if(i > 0 && i < (chooseitems.length - 1)){
            ret += 'else ';
        }
        ret += chooseitems[i];
    }

    return ret;

}

/**
 * 解析xml中的when标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 */
SqlFuncInfoParser.prototype.parseXmlWhen = function parseXmlWhen({attrs, nodes, __prt_var__ = '__sql__'}){

    let test = attrs['test'] || '';
    let istest = test.trim() != '';
    let ret = '';

    if(istest){
        test = test.replace(/\t\r\n/g, ' ').replace(/\ and\ /g, ' && ').replace(/\ or\ /g, ' || ');
        ret += `if(${ test }) {\n`;

        nodes.map((item)=>{
            item.__prt_var__ = __prt_var__;
            ret += this.parseXmlNode(item).replace(/\n/g, '\n\t');
        });

        ret += `\n}`;
    }

    return ret;

}

/**
 * 解析xml中的otherwise标签
 * @param attrs
 * @param nodes
 * @param __prt_var__
 */
SqlFuncInfoParser.prototype.parseXmlOtherwise = function parseXmlOtherwise({attrs, nodes, __prt_var__ = '__sql__'}){
    let ret = '';

    ret += ` else {\n`;

    nodes.map((item)=>{
        item.__prt_var__ = __prt_var__;
        ret += this.parseXmlNode(item).replace(/\n/g, '\n\t');
    });

    ret += `\n}\n`;

    return ret;
}

/**
 * 解析xml中的文本(非for标签中的文本)
 * @param text
 * @param __prt_var__
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlText = function parseXmlText({text, __prt_var__ = '__sql__'}){
    let {sql, param} = text;
    let tmpsql = sql.trim().replace(/\t\r\n/g, '');
    sql = sql.replace(/`/g, '\\`');
    let ret = '';

    if(tmpsql.length > 0){

        if(~['__wheresql__','__setsql__'].indexOf(__prt_var__))
            ret = `\n${ __prt_var__ }.push(\`${ sql }\`);\n`;
        else
            ret = `\n${ __prt_var__ } += \`${ sql }\`;\n`;

        if(param.length > 0)
            ret += `\n__values__.push(${ param.join(', ') });`;
    }

    return ret;
};

/**
 * 解析xml中for循环内的文本
 * @param text
 * @param __prt_var__
 * @returns {string}
 */
SqlFuncInfoParser.prototype.parseXmlForText =
        function parseXmlForText({text = {sql:'',param:[]}, __prt_var__ = '__sql__'}){
    let {sql, param} = text;
    let tmpsql = sql.trim().replace(/\t\r\n/g, '').replace(/`/g, '\\`');
    let ret = '';

    if(tmpsql.length > 0){
        if(~['__wheresql__','__setsql__'].indexOf(__prt_var__))
            ret = `\n${ __prt_var__ }.push(\`${ tmpsql }\`);\n`;
        else
            ret = `\n${ __prt_var__ } += \`${ tmpsql }\`;\n`;

        if(param.length > 0)
            ret += `\n__values__.push(${ param.join(', ') });`;
    }

    return ret;
};

