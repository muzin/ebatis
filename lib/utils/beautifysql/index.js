
function beautifulSql(sql){
    return sql.replace(/\s+/g, ' ');
}

function beautifulSql2(sql){
    return beautifulSql(sql)
        .replace(/(select(\s+distinct)?|insert\ into|update|delete|from|where|set|and|left\ join|right\ join|left\ outer\ join|right\ outer\ join|inner\ join|join|order\ by|group\ by|having|limit|values?)/ig,'\n$1\n\t')
}

exports = module.exports = {

    beautiful : beautifulSql,

    beautiful2 : beautifulSql2

};