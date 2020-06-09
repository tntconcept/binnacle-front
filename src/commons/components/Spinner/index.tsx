import React, {useEffect, useState} from "react"
import "commons/components/Spinner/spinner.css"
import {cls} from "utils/helpers"

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

const Spinner: React.FC<any> = ({className, ...props}) => {
  const showLoading = useDelayLoading(300);

  return showLoading ? (
    <div
      className={cls("spinner", className)}
      data-testid="spinner"
      {...props}
    />
  ) : null;
};

export default Spinner;
