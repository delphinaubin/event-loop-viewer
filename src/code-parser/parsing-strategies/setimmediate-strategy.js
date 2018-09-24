import * as t from '@babel/types'
import generate from '@babel/generator'
import ParsingStrategy from './parsing-strategy';

export default class SetImmediateStrategy extends ParsingStrategy {
    isApplicable(node) {
        return node.type === 'ExpressionStatement'
        && node.expression.type === 'CallExpression'
        && node.expression.callee.type === 'Identifier'
        && node.expression.callee.name === 'setImmediate'
    }

    getCode(node) {
        const callbackCodeNodes = node.expression.arguments[0].body.body
        const subAst = {
            type: 'Program',
            body: callbackCodeNodes,
        }
        node.expression.callee.name = '_setImmediate'
        node.expression.arguments = [
            t.numericLiteral(callbackCodeNodes[0].loc.start.line),
            t.stringLiteral(generate(subAst).code)
        ]
        return this.removeAddedLineFeed(generate(node).code)
    }
}