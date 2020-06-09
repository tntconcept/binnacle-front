import React from "react"
import ActivityForm from "features/ActivityForm/ActivityForm"
import {Link, useHistory, useLocation} from "react-router-dom"
import {IActivity} from "api/interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import styles from "pages/binnacle/mobile/ActivityFormScreen/ActivityFormScreen.module.css"
import {formatDayAndMonth} from "utils/DateUtils"

interface IActivityPageLocation {
  date: Date,
  activity?: IActivity,
  lastEndTime?: Date
}

const ActivityFormScreen = () => {
  const location = useLocation<IActivityPageLocation>();
  const history = useHistory();

  return (
    <div className={styles.container}>
      <Navbar date={location.state.date} />
      <ActivityForm
        date={location.state.date}
        activity={location.state.activity}
        lastEndTime={location.state.lastEndTime}
        onAfterSubmit={() => history.push("/binnacle", location.state.date)}
      />
    </div>
  );
};

function Navbar(props: { date: Date }) {
  return (
    <nav className={styles.baseNav}>
      <Link
        to={{
          pathname: "/binnacle",
          state: props.date
        }}
        className={styles.backLink}
      >
        <ArrowLeft/>
        Back
      </Link>
      <span>{formatDayAndMonth(props.date)}</span>
    </nav>
  )
}

export default ActivityFormScreen;
