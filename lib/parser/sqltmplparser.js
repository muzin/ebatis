/**
 * Created by muzin on 2018-01-26 01:13:05.
 */

/**
 * 模板变量的类型
 * @type {{VAR: string, CONST: string}}
 */
const VAR_TYPE = {

    VAR : 'VAR',

    CONST : 'CONST'

}

/**
 * 查询字符串模板的位置
 * 并解析出相关的信息
 * start            : 开始位置的索引
 * end              : 结束位置的索引
 * src              : 原字符串
 * variable         : ${}或#{}中的变量
 * @param str
 * @returns {{
 *  start: number,      
 *  end: number,
 *  src: string,
 *  variable: string|undefined,
 *  vartype: VAR_TYPE.VAR|VAR_TYPE.CONST,
 *  begintext: string|'',
 *  source: *,
 *  next: *
 * }}
 */
function findFlag(str){

    let $firstbegin = str.indexOf('${');
    let xxfirstbegin = str.indexOf('#{');
    let vartype = null;
    let firstbegin = -1;

    if($firstbegin >= 0 &&  xxfirstbegin < 0){
        vartype = VAR_TYPE.VAR;
        firstbegin = $firstbegin;
    }else if(xxfirstbegin >= 0 && $firstbegin < 0){
        vartype = VAR_TYPE.CONST;
        firstbegin = xxfirstbegin;
    }else if(xxfirstbegin >= 0 && $firstbegin >= 0){
        vartype = $firstbegin < xxfirstbegin
            ? VAR_TYPE.VAR
            : VAR_TYPE.CONST;
        firstbegin = $firstbegin < xxfirstbegin
            ? $firstbegin
            : xxfirstbegin;
    }

    let firstend = -1;

    for(let i = firstbegin + 2; i < str.length; i++){
        let code = str[i];
        if(code== '}'){
            firstend = i;
            break;
        }
    }

    let next = null;
    let variable = undefined;
    let begintext = str;

    if(firstbegin != -1) {
        next = str.substr(firstend + 1) == '' ? null : str.substr(firstend + 1);
        variable = str.substring(firstbegin + 2, firstend);
        begintext = str.substring(0, firstbegin)
    }

    return {
        start : firstbegin,
        end : firstend,
        src : str.substring(firstbegin, firstend + 1),
        variable : variable,
        vartype : vartype,
        begintext : begintext,
        source : str,
        next : next,
    }

}

/**
 * 获取sql字符串模板的信息
 * @param str
 * @returns {Array} 模板信息
 */
function getTmplInfo(str) {
    let chain = [];
    let flag = findFlag(str)
    let next = flag.next;

    chain.push(flag);

    while (next) {
        let nextflag = findFlag(next)
        next = nextflag.next;
        chain.push(nextflag);
    }

    return chain;
}


/**
 * 把字符串模板的信息解析成sql，并生成相应的参数
 * @param tmplInfo
 * @returns {{sql:String, param : Array}}
 */
function generatorSubSql(tmplInfo){
    let ret = tmplInfo.reduce((collector, item, index)=>{

        let sql = collector.sql;
        let param = collector.param;

        if(item.variable != undefined){

            if(item.vartype == VAR_TYPE.VAR){
                sql += item.begintext + '?';
                param.push(item.variable ? item.variable.trim() : null);
            }else{

                let subvarCode = item.variable;
                let subvar = item.variable;
                if(typeof subvar == 'string')
                    subvarCode = `'\${${ subvar }}'`;
                sql += item.begintext + subvarCode;

            }

        }else{
            sql += item.begintext;
        }
        collector.sql = sql;
        return collector;
    },{sql : '', param : []});
    return ret;
}

/**
 * 解析sql
 * @param str   sql字符串
 * @returns {{sql:String, param : Array}} 解析后的sql及参数变量数组
 */
function parse(str){
    let tmplInfo = getTmplInfo(str);
    return generatorSubSql(tmplInfo);
}

exports = module.exports = parse;