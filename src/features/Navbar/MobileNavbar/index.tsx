import React, {useState} from "react"
import styles from "features/Navbar/MobileNavbar/MobileNavbar.module.css"
import {motion} from "framer-motion"
import HamburgerMenu from "features/Navbar/MobileNavbar/HamburgerMenu"
import HamburgerButton from "features/Navbar/MobileNavbar/HamburgerMenu/HamburgerButton"
import {cls} from "utils/helpers"
import HamburgerSidebar from "features/Navbar/MobileNavbar/HamburgerMenu/HamburgerSidebar"
import {FocusOn} from "react-focus-on"
import useLockBodyScroll from "features/Navbar/MobileNavbar/useLockBodyScroll"

const MobileNavbar: React.FC = props => {
  const [isOpen, setIsOpen] = useState(false)
  useLockBodyScroll(isOpen)

  const hasChildren = props.children !== undefined

  return (
    <motion.nav
      className={cls(styles.navbar, hasChildren && styles.navbarSpaceBetween)}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      {props.children}
      <FocusOn
        onClickOutside={() => setIsOpen(false)}
        enabled={isOpen}
      >
        <HamburgerSidebar>
          <HamburgerMenu />
        </HamburgerSidebar>
        <HamburgerButton
          isOpen={isOpen}
          handleClick={() => setIsOpen(prevState => !prevState)}
        />
      </FocusOn>
    </motion.nav>
  );
};

export default MobileNavbar;
