import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export type Sheet<T extends string | number | symbol = string> = {
  [key in T]: string
}
export type Sheets<T extends Sheet> = { [key in Language]?: Sheet<keyof T> }
export type Replacement = string | number

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export enum Language {
  en = 'en',
  es = 'es',
  zh = 'zh',
  de = 'de',
  fr = 'fr',
  it = 'it',
  hi = 'hi',
  ja = 'ja',
  ko = 'ko',
  pt = 'pt',
  ru = 'ru',
  ar = 'ar',
  bn = 'bn',
  vi = 'vi',
  tr = 'tr',
  fa = 'fa',
}

export type Languages = keyof typeof Language

export type TextProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
