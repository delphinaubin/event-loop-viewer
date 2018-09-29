<template>
  <div id="app">
    <code-editor
      v-model="content"
      @init="editorInit"
      lang="javascript"
      theme="merbivore"
      width="700"
      height="300"
    ></code-editor>
    <button
      @click="playCode()"
    >Play</button>
    <event-loop
      :queues="queues"
    >
    </event-loop>
  </div>
</template>

<script>
import CodeEditor from 'vue2-ace-editor'
import 'brace/ext/language_tools' // language extension prerequsite...
import 'brace/mode/javascript'    // language
import 'brace/theme/merbivore'
import 'brace/snippets/javascript' // snippet
import EventLoop from './components/EventLoop'
import parseCode from './code-parser/code-parser'
import { parse } from '@babel/parser'
const geval = eval // Usefull to keep all declared var (in eval) in the same scope
export default {
  name: 'app',
  components: {
    CodeEditor,
    EventLoop,
  },
  data: () => ({
    content: `console.log('yolo');\nsetImmediate(() => {console.log('immediate')});\nsetTimeout(() => { console.log('timeout');}, 1000);\nfs.readFile('toto', (err, fileContent) => {\n  if(err) {\n    throw err;\n  }\n  console.log(fileContent);\n})\n\nfs.writeFile('file.txt', () => { console.log('file writed'); })`,
    numberOfSelectedStatement: -1,
    queues: {
      timers: [],
      io:[],
      immediates: [],
    }
  }),
  methods: {
    editorInit: () => {},
    playCode: function(){
      // eslint-disable-next-line no-console
      console.log(parse(this.content))
      window._setTimeout = (line, code, time) => {
        this.queues.timers.push({
            instruction: 'setTimeout',
            time,
            execute: () => runCode(code, 0, line-1)
          })
      }
      window._setImmediate = (line, code) => {
        this.queues.immediates.push({
            instruction: 'setImmediate',
            execute: () => runCode(code, 0, line-1)
          })
      }
      
      window._fsReadFile = (line, code) => {
        this.queues.io.push({
            instruction: 'fs.readFile',
            execute: () => {
              runCode(code, 0, line-1)
              runCode(code, 1, line-2)
              runCode(code, 2, line-3)
            }
          })
      }
      window._fsWriteFile = (line, code) => {
        this.queues.io.push({
            instruction: 'fs.writeFile',
            execute: () => {
              runCode(code, 0, line-1)
              runCode(code, 1, line-2)
            }
          })
      }
      window.require = () => {}
      runCode(this.content, ++this.numberOfSelectedStatement)
      
    }
  }
}

function runCode(code, lineNumber, selectionDelta = 0) {
  const lines = parseCode(code)    
  const lineToSelect = lines[lineNumber]
  // eslint-disable-next-line no-console
  console.log('lineToSelect', lineToSelect)
  if(lineToSelect) {
    lightCodeLines(lineToSelect.start + selectionDelta, lineToSelect.end + selectionDelta)
    geval(lineToSelect.code)
  }
}
function lightCodeLines(lineStart, lineEnd) {
  const selectedLineElements = document.querySelectorAll('.selected-line')
  selectedLineElements && Array.from(selectedLineElements).forEach(lineToUnselect => {
    lineToUnselect.classList.remove('selected-line')
  })
  const lines = document.querySelectorAll('.ace_line')
  for(let i=lineStart-1;i<=lineEnd-1 && i<=lines.length;i++) {
    lines[i] && lines[i].classList.add('selected-line')
  }
}

</script>

<style>

body {
  background-color: #222;
}

.selected-line {
  background-color: #060;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #FFF;
  
}
</style>
