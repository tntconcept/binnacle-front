import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import {format} from "date-fns"
import {es} from "date-fns/locale"
import styles from "./ActivityPage.module.css"

const formatActivityDate = (activity: IActivity | undefined) => {
  if (activity) {
    return format(activity.startDate, "dd 'de' MMMM", { locale: es });
  }

  return format(new Date(), "dd 'de' MMMM", { locale: es });
};

const ActivityPage = () => {
  const location = useLocation();

  return (
    <div>
      <nav className={styles.baseNav}>
        <Link to="/binnacle" className={styles.backLink}>
          <ArrowLeft />
          Back
        </Link>
        <span>{formatActivityDate(location.state as IActivity)}</span>
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
