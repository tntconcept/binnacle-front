import {useEffect, useState} from "react"

const useDelayLoading = (delayMs: number) => {
  const [showLoading, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, delayMs)
    return () => {
      clearTimeout(timeout)
    }
  }, [delayMs])

  return showLoading
}

export default useDelayLoading