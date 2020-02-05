import React from "react"
import HamburgerMenu from "assets/icons/hamburger.svg"
import {customRelativeFormat} from "utils/calendarUtils"
import styles from './BinnacleNavbarMobile.module.css'

interface IBinnacleNavbarMobile {
  selectedDate: Date;
}

const BinnacleNavbarMobile: React.FC<IBinnacleNavbarMobile> = props => {
  return (
    <nav className={styles.navbar}>
      <span className={styles.date}>{customRelativeFormat(props.selectedDate)}</span>
      <img
        src={HamburgerMenu}
        alt="Hamburger menu"
        width="20px"
        height="20px"
      />
    </nav>
  );
};

export default BinnacleNavbarMobile;
