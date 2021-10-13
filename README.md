# @tdio/rule-set

Rule set with condition compose and lisp whitelist manage

## Installation

```sh
yarn add @tdio/rule-set -D
```

## Usage

```
import { createRuleList, normalizeCondition } from '@tdio/rule-set'

const whitelist = ['/',
  ['monitor',
    ['platform']],
  ['logCenter',
    ['servicelog']],
  ['system',
    ['tag'], ['certificate']]
]

const conditions = {
  exclude: (s) => s.endsWith('/tag'),
  whitelist: createRuleList(whitelist),
  and: ['/system']
}

const matcher1 = normalizeCondition(conditions)
expect(matcher1('/system/tag')).toBe(false)
expect(matcher1('/system/certificate')).toBe(true)
expect(matcher1('/monitor/platform')).toBe(false)
```

## License

[MIT](http://opensource.org/licenses/MIT) Copyright (c) [Allex Wang][1]

[1]: https://github.com/allex/
