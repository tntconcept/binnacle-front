import {useCallback, useState} from "react"

const useModal = (initialIsOpen: boolean = false) => {
  const [modalIsOpen, setIsOpen] = useState(initialIsOpen);
  const toggleIsOpen = useCallback(() => {
    setIsOpen(!modalIsOpen);
  }, [modalIsOpen]);

  return {
    modalIsOpen,
    toggleIsOpen,
    setIsOpen
  };
};

export default useModal;
