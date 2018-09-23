import template from '@babel/template'
import FsReadFileStrategy from './fs-readfile-strategy'
import { parse } from '@babel/parser'
const strategy = new FsReadFileStrategy()
describe('fs.readFile parsing strategy', () => {
    describe('is applicable', () => {
        it('should return true if the parsed line is a fs.readFile instruction', () => {
            const A_FS_READFILE_NODE = template('fs.readFile(\'toto\', (err, fileContent) => { console.log(fileContent); })')()
            expect(strategy.isApplicable(A_FS_READFILE_NODE)).toBe(true)          
        })
        it('should return false for a non fs.readFile instruction', () => {
            const A_NON_FS_READFILE_NODE = template('console.log(\'test\');')()
            expect(strategy.isApplicable(A_NON_FS_READFILE_NODE)).toBe(false)
        })
    })

    describe('getCode', () => {
        it('should return valid metadata for a fs.readFile call with an arrow function callback', () => {
            const CODE_WITH_ARROW = 'fs.readFile(\'toto\', (err, fileContent) => { console.log(fileContent); })'
            const EXPECTED =  '_fsReadFile(1, "var err = undefined;\\nvar fileContent = \'The file content\';\\nconsole.log(fileContent);");'
            const NODE_WITH_ARROW = parse(CODE_WITH_ARROW).program.body[0]
            expect(strategy.getCode(NODE_WITH_ARROW)).toEqual(EXPECTED)
        })
        it('should return valid metadata for a fs.readFile call with a function callback', () => {
            const CODE_WITH_FUNCTION = 'fs.readFile(\'toto\', function(err, fileContent){ console.log(fileContent); })'
            const EXPECTED =  '_fsReadFile(1, "var err = undefined;\\nvar fileContent = \'The file content\';\\nconsole.log(fileContent);");'
            const NODE = parse(CODE_WITH_FUNCTION).program.body[0]
            expect(strategy.getCode(NODE)).toEqual(EXPECTED)
        })
    })
})