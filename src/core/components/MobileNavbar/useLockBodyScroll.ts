import {useLayoutEffect, useRef} from "react"

const useLockBodyScroll = (lockState: boolean) => {
  const originalStyle = useRef(window.getComputedStyle(document.body).overflow)

  useLayoutEffect(() => {
    if (lockState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle.current;
    }

    return () => {
      document.body.style.overflow = originalStyle.current;
    };
  }, [lockState]);
}

export default useLockBodyScroll
