import parseCode from './code-parser'

describe('code-parser', () => {
    describe('classic code parsing', () => {
        it('should return valid metadata for a classic (note time, io or setImmediate) code', () => {
            const SOME_CLASSIC_CODE_LINES = [
                'console.log(\'test\');',
                'let i = 1;'
            ]
            const result = parseCode(SOME_CLASSIC_CODE_LINES.join('\n'))
            const expected = [
                { start: 1, end: 1, code: SOME_CLASSIC_CODE_LINES[0] },
                { start: 2, end: 2, code: SOME_CLASSIC_CODE_LINES[1] },
            ]
            expect(result).toEqual(expected)
        })
        it('should work with multi line instructions', () => {
            const SOME_CLASSIC_CODE = [
                '(',
                '  () => {',
                '    console.log(\'yolo\');',
                ' }',
                ')()',
            ].join('\n')
            const result = parseCode(SOME_CLASSIC_CODE)
            expect(result).toHaveLength(1)
            expect(result[0].start).toBe(1)
            expect(result[0].end).toBe(5)
        })
    })
    describe('time events parsing and transpilation', () => {
        describe('setTimeout', () => {
            it('should return valid metadata for a setTimeout', () => {
                const CODE = 'setTimeout(() => { console.log(\'time out\'); }, 1000)'
                const result = parseCode(CODE)
                expect(result).toEqual([
                    {
                        start: 1,
                        end: 1,
                        code: '_setTimeout(1, "console.log(\'time out\');", 1000);'
                    }
                ])
            })
            it('should work with multiline statements', () => {
                const CODE = [
                    'setTimeout(',
                    '  () => {',
                    '    console.log(\'time out\');',
                    '  }, 1000)'
                ].join('\n')
                const result = parseCode(CODE)
                expect(result).toEqual([
                    {
                        start: 1,
                        end: 4,
                        code: '_setTimeout(3, "console.log(\'time out\');", 1000);'
                    }
                ])
            })
        })
    })
    describe('io event parsing', () => {
        describe('fs.readFile()', () => {
            it('should return valid metadata for a fs.readFile call', () => {
                const CODE_WITH_ARROW = 'fs.readFile(\'toto\', (err, fileContent) => { console.log(fileContent); })'
                const CODE_WITH_FUNCTION = 'fs.readFile(\'toto\', function(err, fileContent){ console.log(fileContent); })'
                const EXPECTED = [
                    {
                        start: 1,
                        end: 1,
                        code: '_fsReadFile(1, "var err = undefined;\\nvar fileContent = \'The file content\';\\nconsole.log(fileContent);");'
                    }
                ]
                expect(parseCode(CODE_WITH_ARROW)).toEqual(EXPECTED)
                expect(parseCode(CODE_WITH_FUNCTION)).toEqual(EXPECTED)
            })
        }),
        describe('fs.writeFile()', () => {
            it('should return valid metadata for a fs.writeFile call', () => {
                const CODE_WITH_ARROW = 'fs.writeFile(\'toto\', (err) => { console.log(\'coucou\'); })'
                const CODE_WITH_FUNCTION = 'fs.writeFile(\'toto\', function(err){ console.log(\'coucou\'); })'
                const EXPECTED = [
                    {
                        start: 1,
                        end: 1,
                        code: '_fsWriteFile(1, "var err = undefined;\\nconsole.log(\'coucou\');");'
                    }
                ]
                expect(parseCode(CODE_WITH_ARROW)).toEqual(EXPECTED)
                expect(parseCode(CODE_WITH_FUNCTION)).toEqual(EXPECTED)
            })
        })
    })

})
