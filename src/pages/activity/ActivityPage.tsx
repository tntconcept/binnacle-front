import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import {css} from "linaria"

const backLink = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 5px 10px;
  text-decoration: none;
    color: black;
`;

const baseNav = css`
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
`

const ActivityPage = () => {
  const location = useLocation();

  console.log(location.state)

  return (
    <div>
      <nav className={baseNav}>
        <Link to="/binnacle" className={backLink}>
          <ArrowLeft />
          Back
        </Link>
      </nav>
      <ActivityForm
        activity={location.state as IActivity | undefined}
        initialSelectedRole={undefined}
        initialStartTime={undefined}
      />
    </div>
  );
};

export default ActivityPage;


