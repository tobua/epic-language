import type React from 'react'

export type Sheet<T extends string | number | symbol = string> = {
  [K in T]: string
}
export type Sheets<T extends Sheet> = { [K in Language]?: Sheet<keyof T> }
export type Replacement = string | number | React.JSX.Element

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

export type TextProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export enum Model {
  omni = 'gpt-4o',
  fast = 'gpt-3.5-turbo',
}
