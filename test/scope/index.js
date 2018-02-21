
let assert = require('assert');
let scope  = require('../../lib/scope');

describe('scope Test', ()=>{


    it('exists Field : datasourcescope', ()=>{
        assert.equal('datasourcescope' in scope, true);
    });

    it('exists Field : connectionscope', ()=>{
        assert.equal('connectionscope' in scope, true);
    });

    it('exists Field : sqlscope', ()=>{
        assert.equal('sqlscope' in scope, true);
    });

    it('exists Field : configscope', ()=>{
        assert.equal('configscope' in scope, true);
    });

    it('exists Method : getScope', ()=>{
        assert.equal('getScope' in scope, true);
    });

});