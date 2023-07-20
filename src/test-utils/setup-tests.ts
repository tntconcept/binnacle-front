import './di/unit-di'
import '../shared/archimedes/archimedes'
import '../shared/i18n/i18n'
import { configure } from './app-test-utils'

// Disable huge error output of testing library
configure({
  defaultHidden: true
})
