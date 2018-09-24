import template from '@babel/template'
import {parse} from '@babel/parser'
import SetImmediateStrategy from './setimmediate-strategy'
const strategy = new SetImmediateStrategy()

describe('SetImmediate parsing strategy', () => {
    describe('isApplicable', () => {
        it('should return true if the given node is a SetImmediate call', () => {
            const SET_IMMEDIATE_NODE = template('setImmediate(() => {console.log(\'setimmediate\');})')()
            expect(strategy.isApplicable(SET_IMMEDIATE_NODE)).toBe(true)
        })

        it('should return false for a non fs.readFile instruction', () => {
            const A_NON_FS_READFILE_NODE = template('console.log(\'test\');')()
            expect(strategy.isApplicable(A_NON_FS_READFILE_NODE)).toBe(false)
        })
    })

    describe('getCode', () => {
        it('should return valid metadata for a setImmediate node', () => {
            const SET_IMMEDIATE_CODE = 'setTimeout(() => { console.log(\'set immediate\'); })'
            const NODE = parse(SET_IMMEDIATE_CODE).program.body[0]
            const result = strategy.getCode(NODE)
            expect(result).toEqual('_setImmediate(1, "console.log(\'set immediate\');");')
        })
    })
})