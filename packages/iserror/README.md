# `@daneroo/iserror`

Detects if an argument is an Error

## Usage

```bash
const { isError } = require('@daneroo/error');

// TODO: DEMONSTRATE API
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
