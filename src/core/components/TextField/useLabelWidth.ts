import { useEffect, useRef, useState } from 'react'

export const useLabelWidth = (initialValue: number = 0) => {
  const [labelOffsetWidth, setLabelOffsetWidth] = useState(initialValue)
  const ref = useRef<HTMLLabelElement>()
  useEffect(() => {
    if (ref.current) {
      setLabelOffsetWidth(ref.current.offsetWidth)
    }
  }, [])

  const labelWidth = labelOffsetWidth > 0 ? labelOffsetWidth * 0.75 + 8 : 0
  return [ref, labelWidth]
}
