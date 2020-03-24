export const rem = (pxValue: string) => {
  return (parseInt(pxValue.replace("px", "")) / 16 ) + "rem"
}

type ClassName = string | false | void | null | 0;
export const cls = (...classNames: ClassName[]) => classNames.filter(Boolean).join(' ')

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
