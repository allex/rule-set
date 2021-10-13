export type RuleMatcher = (s: string) => boolean;

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
  if (condition instanceof RegExp) {
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
      case 'exclude':
      case 'blacklist':
        matchers.push(notMatcher(v))
        break
      case 'whitelist':
        matchers.push(v)
        break
      default:
        throw new Error(`Unexcepted property ${key} in condition`)
    }
  })

  return andMatcher(matchers)
}
