import generate from '@babel/generator'
export default class DefaultStrategy {
    isApplicable() {
        return true
    }

    getCode(node) {
        return generate(node).code
    }
    
}