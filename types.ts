import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export type Sheet<T extends string | number | symbol = string> = {
  [key in T]: string
}
export type Sheets = { [key in Language]?: Sheet }
export type Replacement = string | number

export enum Language {
  en = 'en',
  es = 'es',
  zh = 'zh',
  de = 'de',
  fr = 'fr',
  it = 'it',
}

export type TextProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
