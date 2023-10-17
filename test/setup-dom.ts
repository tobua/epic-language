import { GlobalRegistrator } from '@happy-dom/global-registrator'

const { log } = console // GlobalRegistrator breaks console.log
GlobalRegistrator.register()
console.log = log // Restore log to show up in tests during development.
