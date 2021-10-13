export type LispTree = Array<string | LispTree>

/**
 * A rule list manager (aka `whitelist`), based on `LISP` tree struct, provide some collection api and whitelist evaluation `test`
 *
 * ```
 * const blacklist: LispTree = [
 *   '/',
 *   ['monitor',
 *     ['platform']],
 *   ['logCenter',
 *     ['servicelog']],
 *   ['system',
 *     ['tag'], ['certificate']]
 * ]
 * ```
 */
export interface RuleList {
  test (path: string, loose?: boolean): boolean;
  size (): number;
  forEach (callbackfn: (value: string, index: number, array: readonly string[]) => void, thisArg?: any): void;
}

type WalkContext = [ string, string[], Record<string, boolean> ]

const walk = (tree: LispTree, [root, paths, pathMap]: WalkContext): void => {
  const len = tree.length
  if (!len) {
    return
  }
  const path = tree[0] as string
  const curr = !root ? path : (root === '/' ? `/${path}` : `${root}/${path}`)
  if (len === 1 && path !== '/') {
    if (!pathMap[curr]) {
      pathMap[curr] = true
      paths.push(curr)
    }
  } else {
    for (let i = 0; ++i < len;) {
      walk(tree[i] as LispTree, [curr, paths, pathMap])
    }
  }
}

export const createRuleList = (whitelist: LispTree): RuleList => {
  const ctx: WalkContext = ['', [], Object.create(null)]

  // initial process
  walk(whitelist, ctx)

  const [_, pathList, pathMap] = ctx

  return {
    test (path: string, loose?: boolean) {
      if (loose) {
        return !!pathMap[path] || pathList.some(k => path.startsWith(k))
      }
      return !!pathMap[path]
    },
    size () {
      return pathList.length
    },
    forEach (callbackfn) {
      pathList.forEach(callbackfn)
    }
  }
}
