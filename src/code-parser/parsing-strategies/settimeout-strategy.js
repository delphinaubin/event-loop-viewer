import generate from '@babel/generator'
import * as t from '@babel/types'
import ParsingStrategy from './parsing-strategy';

export default class SetTimeoutStrategy extends ParsingStrategy {
    isApplicable(node) {
        return node.type === 'ExpressionStatement'
        && node.expression.type === 'CallExpression'
        && node.expression.callee.type === 'Identifier'
        && node.expression.callee.name === 'setTimeout'
    }
    getCode(node) {
        const timeArgument = node.expression.arguments[1]
        const callbackCodeNodes = node.expression.arguments[0].body.body
        const subAst = {
            type: 'Program',
            body: callbackCodeNodes,
        }
        node.expression.callee.name = '_setTimeout'
        node.expression.arguments = [
            t.numericLiteral(callbackCodeNodes[0].loc.start.line),
            t.stringLiteral(generate(subAst).code),
            timeArgument
        ]
        return this.removeAddedLineFeed(generate(node).code)
    }
}

