// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactI18next = require('react-i18next')

// @ts-ignore
const hasChildren = node => node && (node.children || (node.props && node.props.children))
// @ts-ignore
const getChildren = node =>
  node && node.children ? node.children : node.props && node.props.children
// @ts-ignore
const renderNodes = reactNodes => {
  if (typeof reactNodes === 'string') {
    return reactNodes
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key]
    const isElement = React.isValidElement(child)

    if (typeof child === 'string') {
      return child
    }
    if (hasChildren(child)) {
      // @ts-ignore
      const inner = renderNodes(getChildren(child))
      return React.cloneElement(child, {...child.props, key: i}, inner)
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '')
    }

    return child
  })
}
// @ts-ignore
const useMock = [k => k, {}]
// @ts-ignore
useMock.t = k => k
// @ts-ignore
useMock.i18n = {}

module.exports = {
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  // @ts-ignore
  withTranslation: () => Component => props => <Component
    // @ts-ignore
    t={k => k}
    {...props} />,
  // @ts-ignore
  Trans: ({children}) => renderNodes(children),
  // @ts-ignore
  Translation: ({children}) => children(k => k, {i18n: {}}),
  useTranslation: () => useMock,

  // mock if needed
  I18nextProvider: reactI18next.I18nextProvider,
  initReactI18next: reactI18next.initReactI18next,
  setDefaults: reactI18next.setDefaults,
  getDefaults: reactI18next.getDefaults,
  setI18n: reactI18next.setI18n,
  getI18n: reactI18next.getI18n,
}
