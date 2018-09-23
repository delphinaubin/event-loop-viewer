export default class ParsingStrategy {
    removeAddedLineFeed(code) {
        return code
            .replace('\\nif', 'if')
            .replace('\\nwhile', 'while')
    }
}