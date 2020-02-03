export const rem = (pxValue: string) => {
  return (parseInt(pxValue.replace("px", "")) / 16)+"rem"
}
