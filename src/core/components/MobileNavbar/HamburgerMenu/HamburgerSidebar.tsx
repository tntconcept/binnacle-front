import React from 'react'
import {motion} from "framer-motion"
import styles from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"

const sidebar = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: {
        stiffness: 1000
      }
    }
  },
  closed: {
    x: 300,
    opacity: 0,
    transition: {
      x: {
        stiffness: 1000
      }
    }
  }
};
const HamburgerSidebar: React.FC = (props) => {
  return (
    <motion.div
      className={styles.sidebar}
      variants={sidebar}
    >
      {props.children}
    </motion.div>
  )
}

export default HamburgerSidebar
