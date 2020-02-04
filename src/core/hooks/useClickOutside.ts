import React, {useEffect, useRef} from "react"

const useClickOutside = (
  onClickOutside: (event: React.MouseEvent<HTMLButtonElement>) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any): void => {
      const { current } = ref;
      if (!current || current.contains(e.target as Node)) {
        return;
      }
      onClickOutside(e);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [onClickOutside]);

  return ref
};

export default useClickOutside