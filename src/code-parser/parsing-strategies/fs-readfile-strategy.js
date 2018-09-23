import generate from '@babel/generator'
import template from '@babel/template'
import * as t from '@babel/types'
import ParsingStrategy from './parsing-strategy';

export default class FsReadFileStrategy extends ParsingStrategy {
    isApplicable(node) {
        return node.type === 'ExpressionStatement'
        && node.expression.type === 'CallExpression'
        && node.expression.callee.type === 'MemberExpression'
        && node.expression.callee.object.name === 'fs'
        && node.expression.callee.property.name === 'readFile'
    }
    getCode(node) {
        const callbackCodeNodes = node.expression.arguments[1].body.body
        const subAst = {
            type: 'Program',
            body: callbackCodeNodes,
        }
        const callBackArgIndex = node.expression.arguments.length === 3 ? 2: 1
        const isThereArgToError = node.expression.arguments[callBackArgIndex]
            && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.expression.arguments[callBackArgIndex].type)
            && node.expression.arguments[callBackArgIndex].params
            && node.expression.arguments[callBackArgIndex].params.length >=1
        const isThereArgToCallback = isThereArgToError
            && node.expression.arguments[callBackArgIndex].params.length >=2

        let errorVarName = 'UNGUESSABLE_ERROR_VAR_NAME';
        let callbackVarName = 'UNGUESSABLE_CALLBACK_VAR_NAME';

        if (isThereArgToError) {
            errorVarName = node.expression.arguments[callBackArgIndex].params[0].name
        }
        if (isThereArgToCallback) {
            callbackVarName = node.expression.arguments[callBackArgIndex].params[1].name
        }
        subAst.body = [
            template('var VAR_NAME = undefined;')({
                VAR_NAME: errorVarName,
            }),
            template('var VAR_NAME = \'The file content\';')({
                VAR_NAME: callbackVarName,
            }),
        ].concat(callbackCodeNodes)
        node.expression.callee.type = 'Identifier'
        node.expression.callee.name = '_fsReadFile'
        node.expression.arguments = [
            t.numericLiteral(callbackCodeNodes[0].loc.start.line),
            t.stringLiteral(generate(subAst).code),
        ]
        return this.removeAddedLineFeed(generate(node).code)
    }
}