# `@daneroo/error`

These two functions are meant to be used in the context of logging errors.

- `isError`: Detects if an argument is an Error
- `preSerialize`: Creates a `JSON.stringify`able object if argument is an error, otherwise returns the argument unmodified. This is because `Error`s produce only `{}` through JSON.stringify.

## Usage

```bash
const { isError, preSeraialize } = require('@daneroo/error')

console.log(isError(42))                   // false
console.log(isError(new Error('Uh Oh!')))  // true

console.log(JSON.stringify(new Error('Uh Oh!')))  // {}

console.log(JSON.stringify(preSeraialize(new Error('Uh Oh!'))))
 > {"name":"Error","message":"Uh Oh!","stack":"Error: Uh Oh!\n    at repl:1:42\n    at Script.runInThisContext (vm.js:96:20)\n    at REPLServer.defaultEval (repl.js:329:29)\n    at bound (domain.js:396:14)\n    at REPLServer.runBound [as eval] (domain.js:409:12)\n    at REPLServer.onLine (repl.js:642:10)\n    at REPLServer.emit (events.js:187:15)\n    at REPLServer.EventEmitter.emit (domain.js:442:20)\n    at REPLServer.Interface._onLine (readline.js:290:10)\n    at REPLServer.Interface._line (readline.js:638:8)"}

```
