import DefaultStrategy from './default-strategy'
import template from '@babel/template'
const strategy = new DefaultStrategy()
describe('default parsing strategy', () => {
    describe('is applicable', () => {
        it('should return always true', () => {
            expect(strategy.isApplicable()).toBe(true)
        })
    })
    describe('getCode', () => {
        it('should return valid metadata for a classic (note time, io or setImmediate) code', () => {
            const SOME_CODE = 'console.log(\'test\');'
            const A_CLASSIC_LINE = template(SOME_CODE)()
            const result = strategy.getCode(A_CLASSIC_LINE)
            expect(result).toEqual(SOME_CODE)
        })
    })
})