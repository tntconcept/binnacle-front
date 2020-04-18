import React from 'react'
import {motion, MotionProps} from "framer-motion"
import styles from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"

const Path: React.FC<MotionProps> = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

interface IHamburgerButton {
  isOpen: boolean
  handleClick: () => void
}

const HamburgerButton: React.FC<IHamburgerButton> = ({ isOpen, handleClick }) => (
  <motion.button
    onClick={handleClick}
    className={styles.hamburgerButton}
    variants={{
      closed: {
        color: "black"
      },
      open: {
        color: "white"
      }
    }}
    aria-label='Menu'
    aria-expanded={isOpen}
    aria-controls={isOpen ? 'hamburger_navigation_menu' : undefined}
  >
    <svg width="23" height="23" viewBox="0 0 23 23" aria-hidden="true">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <Path
        // @ts-ignore
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </motion.button>
);

export default HamburgerButton
