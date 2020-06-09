import {useMediaQuery} from "react-responsive"

export function useIsMobile() {
  const isMobile = useMediaQuery({
    query: "(max-width: 480px)"
  });

  return isMobile
}