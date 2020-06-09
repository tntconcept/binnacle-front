import {useCallback, useState} from "react"

export const useLabelWidth = (initialValue: number = 0) => {
  const [labelOffsetWidth, setLabelOffsetWidth] = useState(initialValue)
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setLabelOffsetWidth(node.offsetWidth)
    }
  }, [])

  const labelWidth = labelOffsetWidth > 0 ? labelOffsetWidth * 0.75 + 8 : 0
  return [measuredRef, labelWidth]
}