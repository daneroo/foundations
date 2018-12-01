# `@daneroo/error`

Detects if an argument is an Error

## Usage

```bash
const { isError, preSeraialize } = require('@daneroo/error')

console.log(isError(42))                   // false
console.log(isError(new Error('Uh Oh!')))  // true

console.log(JSON.stringify(new Error('Uh Oh!')))  // {}

console.log(JSON.stringify(preSeraialize(new Error('Uh Oh!'))))
 > {"name":"Error","message":"Uh Oh!","stack":"Error: Uh Oh!\n    at repl:1:42\n    at Script.runInThisContext (vm.js:96:20)\n    at REPLServer.defaultEval (repl.js:329:29)\n    at bound (domain.js:396:14)\n    at REPLServer.runBound [as eval] (domain.js:409:12)\n    at REPLServer.onLine (repl.js:642:10)\n    at REPLServer.emit (events.js:187:15)\n    at REPLServer.EventEmitter.emit (domain.js:442:20)\n    at REPLServer.Interface._onLine (readline.js:290:10)\n    at REPLServer.Interface._line (readline.js:638:8)"}

```

## Reference

- [other implementation](https://github.com/yefremov/iserror)
- [other implementation](https://github.com/Xotic750/is-error-x/blob/master/tests/spec/test.js)

let error
f = async (path)=>{ 
  try{
    await fs.readFile('/some/file/that/does-not-exist')
  } catch (err){
    error=err
  }
}
