import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import styles from 'core/features/Navbar/HamburgerMenu.module.css'

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
}
const HamburgerSidebar = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <motion.div
      className={styles.sidebar}
      variants={sidebar}
      ref={ref}
      id="hamburger_navigation_menu"
    >
      {props.children}
    </motion.div>
  )
})

export default HamburgerSidebar
