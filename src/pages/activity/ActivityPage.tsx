import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useHistory, useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import styles from "./ActivityPage.module.css"
import {formatSelectedDate} from "utils/calendarUtils"
import {isDate} from "date-fns"

const calculateNavbarDate = (locationState: IActivity | Date | undefined) => {
  if (isDate(locationState)) {
    return formatSelectedDate(locationState as Date)
  }

  if (!locationState) {
    return formatSelectedDate(new Date())
  }

  return formatSelectedDate((locationState as IActivity).startDate)
};

const ActivityPage = () => {
  const location = useLocation();
  const history = useHistory();

  const activityExists = location.state
    ? isDate(location.state)
      ? undefined
      : (location.state as IActivity)
    : undefined;

  return (
    <div>
      <nav className={styles.baseNav}>
        <Link to="/binnacle" className={styles.backLink}>
          <ArrowLeft />
          Back
        </Link>
        <span>{calculateNavbarDate(location.state as IActivity | Date)}</span>
      </nav>
      <ActivityForm
        date={new Date()}
        activity={activityExists}
        lastActivityRole={undefined}
        lastEndTime={undefined}
        onAfterSubmit={() => history.push("/binnacle")}
      />
    </div>
  );
};

export default ActivityPage;
