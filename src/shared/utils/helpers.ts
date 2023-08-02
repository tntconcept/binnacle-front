type ClassName = string | false | void | null | 0
export const cls = (...classNames: ClassName[]) => classNames.filter(Boolean).join(' ')
