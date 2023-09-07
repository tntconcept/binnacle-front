export const handleKeyPressWhenModalIsNotOpened = (
  pressedKey: string,
  controlledKey: string,
  handler: () => void
) => {
  const isModalOpened = document.querySelector('[id^=chakra-modal]') !== null
  if (isModalOpened) return
  if (pressedKey === controlledKey) handler()
}
