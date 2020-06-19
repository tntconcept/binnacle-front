// https://stackoverflow.com/questions/28889826/set-focus-on-input-after-render
import React, { useRef } from 'react'

export const useFocus = <T>(): [React.MutableRefObject<T | null>, () => void] => {
  const htmlElRef = useRef<T>(null)
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any).focus()
  }

  return [htmlElRef, setFocus]
}
