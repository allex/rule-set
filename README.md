# @tdio/rule-set

Rule set with condition compose and lisp whilte list manage

## Installation

```sh
yarn add @tdio/rule-set -D
```

## Usage

```
import { LispTree, createRuleList, RuleMatcher, normalizeCondition } from '@tdio/rule-set'

const { whitelist, blacklist } = {
  whitelist: ['/',
    ['monitor'],
    ['logCenter'],
    ['tenantCenter'],
    ['system']
  ],
  blacklist: ['/',
    ['monitor',
      ['platform']],
    ['logCenter',
      ['servicelog']],
    ['system',
      ['tag'], ['certificate']]
  ]
}

const conditions: Kv<RuleMatcher> = {}

const wlObj = createRuleList(whitelist)
if (wlObj.size() > 0) {
  conditions.whitelist = s => wlObj.test(s, true)
}

const blObj = createRuleList(blacklist)
conditions.blacklist = s => blObj.test(s)

conditions.exclude = s => s == '/monitor/notAllow'

export const matcher: RuleMatcher = normalizeCondition(conditions)
console.log(matcher('/monitor'))  // true
console.log(matcher('/monitor/ok')) // true
console.log(matcher('/monitor/notAllow')) // false
console.log(matcher('/monitor/platform')) // false
```

## License

[MIT](http://opensource.org/licenses/MIT) Copyright (c) [Allex Wang][1]

[1]: https://github.com/allex/
