import 'reflect-metadata'
import { registerValueProviders } from 'shared/data-access/ioc-container/ioc-container'
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'
import { container } from 'tsyringe'
import { configure } from 'test-utils/app-test-utils'
import i18n from 'shared/i18n/i18n'
import { configure as mobxConfigure } from 'mobx'

let i18nTranslationSpy = jest.spyOn(i18n, 't').mockImplementation((key) => key)

// disable mobx actions restriction on tests
mobxConfigure({ enforceActions: 'never' })

beforeEach(() => {
  // we need to register again all the value providers because 'clearInstances' method, clear them too...
  // https://github.com/microsoft/tsyringe/issues/121
  registerValueProviders()
  i18nTranslationSpy = jest.spyOn(i18n, 't').mockImplementation((key) => key)
})

afterEach(() => {
  // keeps tsyringe registrations, but clears the cached instances.
  container.clearInstances()
  i18nTranslationSpy.mockClear()
})

// Disable huge error output of testing library
configure({
  defaultHidden: true
})

// jest.mock('shared/i18n/i18n', () => ({
//   t: (key: string) => key,
//   language: 'en',
//   changeLanguage: jest.fn()
// }))

// jest.mock('react-i18next', () => {
//   // Require the original module to not be mocked...
//   const originalModule = jest.requireActual('react-i18next')
//
//   return {
//     ...originalModule,
//     // mock only useTranslation hook
//     useTranslation: () => {
//       return {
//         t: (key: string, options: any) => {
//           // if there aren't options then return only the key
//           if (options === undefined) {
//             return key
//           }
//
//           // if options exists then return the key + the options parsed to string
//           return key + ' ' + JSON.stringify(options)
//         },
//         i18n: {
//           language: 'en',
//           changeLanguage: jest.fn()
//         }
//       }
//     }
//   }
// })

// Mock Worker of browser-image-compression
// https://github.com/Donaldcwl/browser-image-compression/issues/9
// class Worker {
//   constructor(stringUrl: string) {
//     // @ts-ignore
//     this.url = stringUrl
//     // @ts-ignore
//     this.onmessage = () => {}
//   }
//
//   postMessage(msg: string) {
//     // @ts-ignore
//     this.onmessage(msg)
//   }
// }

// // @ts-expect-error
// window.Worker = Worker
//
// global.URL.createObjectURL = jest.fn()
//
