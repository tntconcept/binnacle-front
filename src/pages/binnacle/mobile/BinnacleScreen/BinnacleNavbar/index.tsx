import React from "react"
import HamburgerMenu from "assets/icons/hamburger.svg"
import {customRelativeFormat} from "utils/DateUtils"
import styles from 'pages/binnacle/mobile/BinnacleScreen/BinnacleNavbar/BinnacleNavbar.module.css'

interface IBinnacleNavbar {
  selectedDate: Date;
}

const BinnacleNavbar: React.FC<IBinnacleNavbar> = props => {
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

export default BinnacleNavbar;
