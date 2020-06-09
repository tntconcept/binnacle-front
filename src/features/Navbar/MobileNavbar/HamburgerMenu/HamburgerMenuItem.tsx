import React from 'react'
import {cls} from "utils/helpers"
import styles from "features/Navbar/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"

interface IMenuItem {
  isActive: boolean
}

const HamburgerMenuItem: React.FC<IMenuItem> = (props) => {
  return (
    <li
      className={cls(styles.menuItem, props.isActive && styles.itemActive)}
    >
      {props.children}
    </li>
  );
};

export default HamburgerMenuItem
