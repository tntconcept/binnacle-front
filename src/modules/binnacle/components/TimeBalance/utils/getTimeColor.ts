export const getTimeColor = (time: number) => {
  if (time === 0) {
    return 'black'
  } else if (time > 0) {
    return 'green.600'
  }
  return 'red.600'
}
