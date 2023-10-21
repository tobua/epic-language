import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export type Sheet<T extends string | number | symbol = string> = {
  [key in T]: string
}
export type Sheets<T extends Sheet> = { [key in Language]?: Sheet<keyof T> }
export type Replacement = string | number

export enum Language {
  en = 'en',
  es = 'es',
  zh = 'zh',
  de = 'de',
  fr = 'fr',
  it = 'it',
}

export type Languages = keyof typeof Language

export type TextProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
