import { create } from 'logua'
import { Language, Languages } from './types'

export const log = create('epic-language', 'magenta')

// TODO for validation and country specific locales.
// Intl.getCanonicalLocales("EN-US"); // ["en-US"]

export const readableLanguage: Record<Languages, { local: string; english: string; flag: string }> =
  {
    [Language.en]: { local: 'English', english: 'English', flag: '🇺🇸' },
    [Language.es]: { local: 'Idioma', english: 'Spanish', flag: '🇪🇸' },
    [Language.zh]: { local: '语言', english: 'Chinese', flag: '🇨🇳' },
    [Language.de]: { local: 'Deutsch', english: 'German', flag: '🇩🇪' },
    [Language.fr]: { local: 'Français', english: 'French', flag: '🇫🇷' },
    [Language.it]: { local: 'Italiano', english: 'Italian', flag: '🇮🇹' },
    [Language.hi]: { local: 'हिन्दी', english: 'Hindi', flag: '🇮🇳' },
    [Language.ja]: { local: '日本語', english: 'Japanese', flag: '🇯🇵' },
    [Language.ko]: { local: '한국어', english: 'Korean', flag: '🇰🇷' },
    [Language.pt]: { local: 'Português', english: 'Portuguese', flag: '🇵🇹' },
    [Language.ru]: { local: 'русский язык', english: 'Russian', flag: '🇷🇺' },
    [Language.ar]: { local: 'اَلْعَرَبِيَّةُ', english: 'Arabic', flag: '🇸🇦' },
    [Language.bn]: { local: 'বাংলা', english: 'Bengali', flag: '🇧🇩' },
    [Language.vi]: { local: 'Tiếng Việt', english: 'Vietnamese', flag: '🇻🇳' },
    [Language.tr]: { local: 'Türkçe', english: 'Turkish', flag: '🇹🇷' },
    [Language.fa]: { local: 'فارسی', english: 'Persian', flag: '🇮🇷' },
  }
