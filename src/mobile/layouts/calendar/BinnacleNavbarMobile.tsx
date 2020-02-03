import React from "react"
import {css} from "linaria"
import HamburgerMenu from "assets/icons/hamburger.svg"
import {customRelativeFormat} from "utils/calendarUtils"

interface IBinnacleNavbarMobile {
  selectedDate: Date;
}

const navbar = css`
  height: 50px;
  padding: 16px;
  background-color: hsl(0, 0%, 100%);
  display: flex;
  justify-content: space-between;
`;

const date = css`
  font-size: 18px;
`

const BinnacleNavbarMobile: React.FC<IBinnacleNavbarMobile> = props => {
  return (
    <nav className={navbar}>
      <span className={date}>{customRelativeFormat(props.selectedDate)}</span>
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
