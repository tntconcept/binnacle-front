export const rem = (pxValue: string) => {
  return (parseInt(pxValue.replace("px", "")) / 16)+"rem"
}

export type ClassName = string | false | void | null | 0;

export const cls = (...classNames: ClassName[]) => classNames.filter(Boolean).join(' ')