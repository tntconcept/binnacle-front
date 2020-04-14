import React from "react"
import styles from "core/components/MobileNavbar/MobileNavbar.module.css"
import {motion, useCycle} from "framer-motion"
import HamburgerMenu from "core/components/MobileNavbar/HamburgerMenu"
import HamburgerButton from "core/components/MobileNavbar/HamburgerMenu/HamburgerButton"
import {cls} from "utils/helpers"

const MobileNavbar: React.FC = props => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const hasChildren = props.children !== undefined

  return (
    <motion.nav
      className={cls(styles.navbar, hasChildren && styles.navbarSpaceBetween)}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      {props.children}
      <HamburgerMenu />
      <HamburgerButton handleClick={() => toggleOpen()} />
    </motion.nav>
  );
};

export default MobileNavbar;
