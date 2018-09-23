import SetTimeoutStrategy from './settimeout-strategy'
import template from '@babel/template'
import { parse } from '@babel/parser'
const strategy = new SetTimeoutStrategy()
describe('setTimeout parsing strategy', () => {
    describe('is applicable', () => {
        it('should return true for setTimeout node', () => {
            const A_SET_TIMEOUT_NODE = template('setTimeout(() => { console.log(\'time out\'); }, 1000)')()
            expect(strategy.isApplicable(A_SET_TIMEOUT_NODE)).toBe(true)
        })
        it('should return false for a non setTimeout node', () => {
            const A_NON_SET_TIMEOUT_NODE = template('console.log(\'test\');')()
            expect(strategy.isApplicable(A_NON_SET_TIMEOUT_NODE)).toBe(false)
        })
    })
    describe('getCode', () => {
        it('should return valid metadata for a setTimeout code', () => {
            const SET_TIMEOUT_CODE = 'setTimeout(() => { console.log(\'time out\'); }, 1000)'
            const NODE = parse(SET_TIMEOUT_CODE).program.body[0]
            const result = strategy.getCode(NODE)
            expect(result).toEqual('_setTimeout(1, "console.log(\'time out\');", 1000);')
        })
    })
})