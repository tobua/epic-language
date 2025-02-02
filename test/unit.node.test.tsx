import { expect, test } from 'bun:test'
import { replaceBracketsWithChildren } from '../replace'

test('Replaces brackets with text or JSX.', () => {
  expect(replaceBracketsWithChildren('one {} two', ['123']).join('')).toBe('one 123 two')
  expect(replaceBracketsWithChildren('one {} two {} three', ['123', '456']).join('')).toBe('one 123 two 456 three')

  // NOTE parsing the JSX array will crash with React 19.
  const jsxResultUnordered = replaceBracketsWithChildren('one {} two', [<p>123</p>])
  expect(jsxResultUnordered[0]).toBe('one ')
  expect(jsxResultUnordered[1]).toEqual(<p key="1">123</p>)
  expect(jsxResultUnordered[2]).toBe(' two')

  const jsxResultUnorderedMultiple = replaceBracketsWithChildren('one {} two {} three', [<p>123</p>, <span>456</span>])
  expect(jsxResultUnorderedMultiple[4]).toBe(' three')
  expect(jsxResultUnorderedMultiple[3]).toEqual(<span key="3">456</span>)
  expect(jsxResultUnorderedMultiple[2]).toBe(' two ')
})

test('Replaces ordered brackets with text or JSX.', () => {
  expect(replaceBracketsWithChildren('one {2} two {1} three', ['123', '456']).join('')).toBe('one 456 two 123 three')

  const jsxResultOrderedMultiple = replaceBracketsWithChildren('one {2} two {1} three', [<p>123</p>, <span>456</span>])
  expect(jsxResultOrderedMultiple[2]).toBe(' two ')
  expect(jsxResultOrderedMultiple[1]).toEqual(<span key="2">456</span>)
  expect(jsxResultOrderedMultiple[3]).toEqual(<p key="1">123</p>)
})
