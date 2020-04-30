import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useHistory, useLocation} from "react-router-dom"
import {IActivity} from "api/interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import styles from "pages/binnacle/mobile/ActivityFormScreen/ActivityFormScreen.module.css"
import {formatDayAndMonth} from "utils/DateUtils"

interface IActivityPageLocation {
  /** Selected date or activity's date */
  date: Date,
  /** Activity object to edit */
  activity?: IActivity,
  /** Last registered activity's endTime*/
  lastEndTime?: Date
}

const ActivityFormScreen = () => {
  const location = useLocation<IActivityPageLocation>();
  const history = useHistory();

  return (
    <div className={styles.container}>
      <nav className={styles.baseNav}>
        <Link
          to={{
            pathname: "/binnacle",
            state: location.state.date
          }}
          className={styles.backLink}
        >
          <ArrowLeft />
          Back
        </Link>
        <span>{formatDayAndMonth(location.state.date)}</span>
      </nav>
      <ActivityForm
        date={location.state.date}
        activity={location.state.activity}
        lastEndTime={location.state.lastEndTime}
        onAfterSubmit={() => history.push("/binnacle", location.state.date)}
      />
    </div>
  );
};

export default ActivityFormScreen;
