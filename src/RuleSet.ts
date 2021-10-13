/**
 * A conditions composer, based on Tobias Koppers RuleSet
 */

// Supports condition types:
// -------------------------
// <condition>: /regExp/
// <condition>: function(arg) {}
// <condition>: "starting"
// <condition>: [<condition>] // or
// <condition>: { and: [<condition>] }
// <condition>: { not: [<condition>] }
// <condition>: { test: <condition>, include: <condition>, exclude: <condition> }
// <condition>: { whitelist: RuleList, blacklist: RuleList }

export type RuleMatcher = (s: any) => boolean;

const notMatcher = (matcher: RuleMatcher): RuleMatcher => {
  return s => !matcher(s)
}

const orMatcher = (items: RuleMatcher[]): RuleMatcher => {
  return s => {
    for (let i = 0, l = items.length; i < l; i++) {
      if (items[i](s)) return true
    }
    return false
  }
}

const andMatcher = (items: RuleMatcher[]): RuleMatcher => {
  return s => {
    for (let i = 0, l = items.length; i < l; i++) {
      if (!items[i](s)) return false
    }
    return true
  }
}

export const normalizeCondition = (condition?: any): RuleMatcher => {
  if (!condition) throw new Error('Expected condition but got falsy value')

  if (typeof condition === 'string') {
    return s => s.startsWith(condition)
  }
  if (typeof condition === 'function') {
    return condition
  }
  // RegExp-Like interface (with **test()**)
  if (typeof condition === 'object' && typeof condition.test === 'function') {
    return condition.test.bind(condition)
  }
  if (Array.isArray(condition)) {
    const items = condition.map(c => normalizeCondition(c))
    return orMatcher(items)
  }

  if (typeof condition !== 'object') {
    throw Error(
      `Unexcepted ${typeof condition} when condition was expected (${condition})`
    )
  }

  const matchers: RuleMatcher[] = []
  Object.keys(condition).forEach(key => {
    const v = condition[key]
    switch (key) {
      case 'include':
      case 'test':
      case 'whitelist':
        if (v) matchers.push(normalizeCondition(v))
        break;
      case 'and':
        if (v) {
          const items = v.map((c: any) => normalizeCondition(c))
          matchers.push(andMatcher(items))
        }
        break;
      case 'not':
      case 'exclude':
      case 'blacklist':
        if (v) {
          matchers.push(notMatcher(normalizeCondition(v)))
        }
        break
      default:
        throw new Error(`Unexcepted property ${key} in condition`)
    }
  })

  if (matchers.length === 0) {
    throw new Error('Excepted condition but got ' + condition)
  }

  if (matchers.length === 1) {
    return matchers[0]
  }

  return andMatcher(matchers)
}
