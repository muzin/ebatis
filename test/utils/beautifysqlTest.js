
let assert = require('assert');
let beautifysql  = require('../../lib/utils/beautifysql');



describe('beautifysql Test', ()=>{

    describe('beautifysql', ()=>{

        it('pass',()=>{

            let sql = `
                SELECT 
                *
                    FROM
                    t_user
                    WHERE name =
                    '123'
            `;

            var expect = "SELECT * FROM t_user WHERE name = '123'";
            var result = beautifysql.beautiful(sql).trim();

            console.log(`expect : \n ${ expect }`);
            console.log(`result : \n ${ result }`);

            assert.equal(result, expect);

        });

    })

    describe('beautifysql2', ()=>{

        it('pass',()=>{

            let sql = `
                SELECT 
                *
                    FROM
                    t_user
                    WHERE name =
                    '123'
            `;

            var expect = "SELECT\n" +
                "\t * \n" +
                "FROM\n" +
                "\t t_user \n" +
                "WHERE\n" +
                "\t name = '123'";

            var result = beautifysql.beautiful2(sql).trim();

            console.log(`expect : \n ${ expect }`);
            console.log(`result : \n ${ result }`);

            assert.equal(result, expect);

        });

    })

});