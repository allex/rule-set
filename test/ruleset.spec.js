/* global describe: true */
/* global test: true */
/* eslint no-new-wrappers: off */

import { createRuleList, normalizeCondition } from '../'

const createTestWhitelist = () => {
  const lisptree = ['/',
    ['monitor',
      ['platform']],
    ['logCenter',
      ['servicelog']],
    ['system',
      ['tag'], ['certificate']]
  ]
  const blacklist = createRuleList(lisptree)
  return blacklist
}

describe('rule-list', () => {
  test('transform lisp tree to a whitelist', () => {
    const blacklist = createTestWhitelist()
    expect(blacklist.size()).toBe(4)
    expect(blacklist.test('/system/tag')).toBe(true)
    expect(blacklist.test('/system/false')).toBe(false)

    const list = []
    blacklist.forEach(item => {
      list.push(item)
    })
    expect(list).toMatchSnapshot()
  })
})

describe('rule-set', () => {
  test('condition `exclude` with typeof regexp', () => {
    const conditions = {
      exclude: /\/images\/.*/
    }
    const matcher = normalizeCondition(conditions.exclude)
    expect(matcher('/images/abc')).toBe(true)

    const matcher1 = normalizeCondition(conditions)
    expect(matcher1('/images/abc')).toBe(false)
  })

  test('condition `exclude` with typeof custom func', () => {
    const conditions = {
      exclude: v => v > 5
    }

    const matcher = normalizeCondition(conditions.exclude)
    expect(matcher(3)).toBe(false)
    expect(matcher(6)).toBe(true)

    const matcher1 = normalizeCondition(conditions)
    expect(matcher1(3)).toBe(true)
    expect(matcher1(6)).toBe(false)
  })

  test('compose conditions', () => {
    const conditions = {
      exclude: (s) => s.endsWith('/tag'),
      whitelist: createTestWhitelist(),
      and: ['/system']
    }

    const matcher1 = normalizeCondition(conditions)
    expect(matcher1('/system/tag')).toBe(false)
    expect(matcher1('/system/certificate')).toBe(true)
    expect(matcher1('/monitor/platform')).toBe(false)
  })
})
