import template from '@babel/template'
import FsWriteFileStrategy from './fs-writefile-strategy'
import { parse } from '@babel/parser'
const strategy = new FsWriteFileStrategy()
describe('fs.writeFile parsing strategy', () => {
    describe('is applicable', () => {
        it('should return true if the parsed line is a fs.writeFile instruction', () => {
            const A_FS_READFILE_NODE = template('fs.writeFile(\'file.txt\', (err) => { console.log(\'yolo\'); })')()
            expect(strategy.isApplicable(A_FS_READFILE_NODE)).toBe(true)          
        })
        it('should return false for a non fs.readFile instruction', () => {
            const A_NON_FS_READFILE_NODE = template('console.log(\'test\');')()
            expect(strategy.isApplicable(A_NON_FS_READFILE_NODE)).toBe(false)
        })
    })

    describe('getCode', () => {
        it('should return valid metadata for a fs.writeFile call with an arrow function callback', () => {
            const CODE_WITH_ARROW = 'fs.writeFile(\'toto\', (err) => { console.log(\'coucou\'); })'
            const EXPECTED =  '_fsWriteFile(1, "var err = undefined;\\nconsole.log(\'coucou\');");'
            const NODE_WITH_ARROW = parse(CODE_WITH_ARROW).program.body[0]
            expect(strategy.getCode(NODE_WITH_ARROW)).toEqual(EXPECTED)
        })
        it('should return valid metadata for a fs.writeFile call with a function callback', () => {
            const CODE_WITH_FUNCTION = 'fs.writeFile(\'toto\', function(err){ console.log(\'coucou\'); })'
            const EXPECTED =  '_fsWriteFile(1, "var err = undefined;\\nconsole.log(\'coucou\');");'
            const NODE = parse(CODE_WITH_FUNCTION).program.body[0]
            expect(strategy.getCode(NODE)).toEqual(EXPECTED)
        })
    })
})