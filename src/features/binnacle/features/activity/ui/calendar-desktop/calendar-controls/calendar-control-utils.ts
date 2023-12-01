export const handleKeyPressWhenModalIsNotOpenedOrInputIsNotFocused = (
  pressedKey: string,
  controlledKey: string,
  handler: () => void
) => {
  const hasFocusOnInput = document.activeElement?.tagName === 'INPUT'
  const isModalOpened = document.querySelector('[id^=chakra-modal]') !== null
  if (hasFocusOnInput || isModalOpened) return
  if (pressedKey === controlledKey) handler()
}
