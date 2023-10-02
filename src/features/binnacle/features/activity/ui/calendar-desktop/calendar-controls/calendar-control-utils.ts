export const handleKeyPressWhenBodyIsNotFocused = (
  pressedKey: string,
  controlledKey: string,
  handler: () => void
) => {
  const hasFocusInBody = document.activeElement?.tagName === 'BODY'
  if (!hasFocusInBody) return
  if (pressedKey === controlledKey) handler()
}
