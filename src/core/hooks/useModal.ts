import {useCallback, useState} from "react"

const useModal = (initialIsOpen: boolean = false) => {
  const [modalIsOpen, setIsOpen] = useState(initialIsOpen);
  const toggleModal = useCallback(() => {
    setIsOpen(!modalIsOpen);
  }, [modalIsOpen]);

  return {
    modalIsOpen,
    toggleModal,
    setIsOpen
  };
};

export default useModal;
