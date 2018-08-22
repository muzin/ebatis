
function beautifulSql(sql){
    return sql.replace(/\s+/g, ' ');
}

function beautifulSql2(sql){
    return beautifulSql(sql)
        .replace(/(\s*select(\s+distinct)\s+?|\s*insert\s+\ into\s+|\s*update\s+|\s*delete\s+|\s*from\s+|\s*where\s+|\s*set\s+|\s*and\s+|\s*left\ join\s+|\s*right\ join\s+|\s*left\ outer\ join|\s*right\ outer\ join\s+|\s*inner\ join\s+|\s*join\s+|\s*order\ by\s+|\s*group\ by\s+|\s*having\s+|\s*limit\s+|\s*values?\s+)/ig,'\n$1\n\t')
}

exports = module.exports = {

    beautiful : beautifulSql,

    beautiful2 : beautifulSql2

};