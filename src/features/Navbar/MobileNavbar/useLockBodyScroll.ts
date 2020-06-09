import {useLayoutEffect, useRef} from "react"

const useLockBodyScroll = (lockState: boolean) => {
  const originalStyle = useRef(window.getComputedStyle(document.body).overflow)

  useLayoutEffect(() => {
    const style = originalStyle.current
    if (lockState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = style;
    }

    return () => {
      document.body.style.overflow = style;
    };
  }, [lockState]);
}

export default useLockBodyScroll
