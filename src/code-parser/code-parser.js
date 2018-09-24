import { parse } from '@babel/parser'
import DefaultStrategy from './parsing-strategies/default-strategy';
import SetTimeoutStrategy from './parsing-strategies/settimeout-strategy'
import FsWriteFileStrategy from './parsing-strategies/fs-writefile-strategy';
import FsReadFileStrategy from './parsing-strategies/fs-readfile-strategy'
import SetImmediateStrategy from './parsing-strategies/setimmediate-strategy';


export default function parseCode(code) {
    const ast = parse(code);
    return ast.program.body.map(node => {
        const start = node.loc.start.line
        const end = node.loc.end.line
        const strategies = [
            new SetTimeoutStrategy(),
            new FsReadFileStrategy(),
            new FsWriteFileStrategy(),
            new SetImmediateStrategy(),
            new DefaultStrategy(),
        ]
        const strategyToApply = strategies
            .find(s => s.isApplicable(node))
        return {
            start,
            end,
            code: strategyToApply.getCode(node)
        }
    })
}
