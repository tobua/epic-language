import type { Language } from './types'

export enum States {
  initial = 'initial',
  loading = 'loading',
  ready = 'ready',
}

export type Listener = (state: States, language?: Language) => void

export const State = {
  languages: [] as Language[],
  loadingLanguages: [] as Language[],
  listeners: [] as Listener[],
  listen(handler: Listener) {
    State.listeners.push(handler)
    // Handler always called immediately upon registration.
    handler(State.current, State.language)
  },
  current: States.initial,
  // TODO default language, can it be changed?
  language: undefined as Language | undefined,
  ready(language: Language) {
    State.loadingLanguages.splice(State.loadingLanguages.indexOf(language), 1)
    State.languages.push(language)
    State.current = States.ready
    State.listeners.forEach((listener: Listener) => listener(State.current, language))
  },
  load(language: Language) {
    State.loadingLanguages.push(language)
    State.current = States.loading
    State.listeners.forEach((listener) => listener(State.current, language))
  },
}
